<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ currentStep === 1 ? "Tạo báo giá mới" : "Xác nhận báo giá" }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{
                currentStep === 1
                  ? "Nhập thông tin báo giá cho khách hàng tiềm năng"
                  : "Kiểm tra lại toàn bộ thông tin trước khi gửi"
              }}
            </p>
          </div>
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </header>

      <!-- Step 1: Nhập thông tin -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Customer Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <OrderCustomerForm
            v-model:customer="quoteData.customer"
            @customer-type="quoteData.customerType = $event"
            @form-valid="handleFormValid"
          />
        </div>

        <!-- Products Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
          <OrderProductSelect v-model:items="quoteData.items" />
        </div>

        <!-- Promotions Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Khuyến mãi áp dụng
          </h2>
          <OrderPromotionSelect
            v-model:promotions="quoteData.appliedPromotions"
            :items="quoteData.items"
          />
        </div>

        <!-- Notes Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Ghi chú và thời hạn
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Thời hạn báo giá (ngày)</label
              >
              <input
                v-model.number="quoteData.validDays"
                type="number"
                min="1"
                placeholder="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Giảm giá thêm (%)</label
              >
              <input
                v-model.number="quoteData.discountPercent"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Ghi chú</label
            >
            <textarea
              v-model="quoteData.notes"
              rows="3"
              placeholder="Nhập ghi chú thêm (nếu có)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Next Button -->
        <div class="flex justify-end">
          <button
            @click="goToSummary"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tiếp tục
          </button>
        </div>
        <NuxtLink to="/dealer_manager/payments/vnpay" class="nav-item">
          Test thanh toán VNPay
        </NuxtLink>
      </div>

      <!-- Step 2: Xác nhận -->
      <div v-else>
        <OrderSummary
          :order-data="quoteData"
          :order-total="total"
          @back="currentStep = 1"
          @submit="createQuote"
          :is-payment="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import OrderCustomerForm from "@/components/orders/OrderCustomerForm.vue";
import OrderProductSelect from "@/components/orders/OrderProductSelect.vue";
import OrderPromotionSelect from "@/components/orders/OrderPromotionSelect.vue";
import OrderSummary from "@/components/orders/OrderSummary.vue";
import type {
  CreateCustomer,
  Customer,
  ProductItem,
  Promotion,
} from "@/schemas";
import type { ApiResponse, CreateQuoteResponse } from "@/types/";
import { notiFail, notiSuccess } from "@/utils/format";
definePageMeta({
  layout: false,
});
const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

const router = useRouter();
const isSubmitting = ref(false);
const currentStep = ref(1);
const isCustomerFormValid = ref(false);

const quoteData = reactive({
  customer: null as Customer | CreateCustomer | null,
  customerType: null as "existing" | "new" | null,
  items: [] as ProductItem[],
  appliedPromotions: [] as Promotion[],
  discountPercent: 0,
  validDays: 30,
  notes: "",
});

// --- Computed totals ---
const subtotal = computed(() =>
  quoteData.items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  )
);
const promoDiscount = computed(() =>
  quoteData.appliedPromotions.reduce(
    (sum, promo) => sum + promo.discountAmount,
    0
  )
);
const percentDiscount = computed(
  () => (subtotal.value * (quoteData.discountPercent || 0)) / 100
);
const total = computed(
  () => subtotal.value - promoDiscount.value - percentDiscount.value
);

const handleFormValid = (val: boolean) => {
  isCustomerFormValid.value = val;
};

// --- Validation ---
const validateQuote = () => {
  console.log(quoteData.customer);

  if (!quoteData.customer || !isCustomerFormValid.value) {
    notiFail("Vui lòng kiểm tra thông tin khách hàng");
    return false;
  }
  if (quoteData.items.length === 0) {
    notiFail("Vui lòng thêm ít nhất một sản phẩm");
    return false;
  }
  const invalidItem = quoteData.items.some(
    (i) => !i.productName || i.quantity <= 0 || i.unitPrice < 0
  );
  if (invalidItem) {
    notiFail("Vui lòng điền đầy đủ thông tin sản phẩm");
    return false;
  }
  return true;
};

// --- Step Control ---
const goToSummary = () => {
  if (!validateQuote()) return;
  currentStep.value = 2;
};

// --- Submit ---
const createQuote = async () => {
  if (!validateQuote()) return;
  isSubmitting.value = true;

  try {
    const body: any = {
      items: quoteData.items,
      promotions: quoteData.appliedPromotions,
      discountPercent: quoteData.discountPercent,
      promoDiscount: promoDiscount.value,
      discountAmount: percentDiscount.value,
      subtotal: subtotal.value,
      total: total.value,
      validDays: quoteData.validDays,
      notes: quoteData.notes,
    };

    if ("id" in (quoteData.customer || {})) {
      // Khách hàng đã có trong hệ thống
      body.customerId = (quoteData.customer as Customer).id;
    } else {
      // Khách hàng mới
      body.customerInfo = quoteData.customer as CreateCustomer;
    }

    const response = await $fetch<ApiResponse<CreateQuoteResponse>>(
      "/api/quotes",
      {
        method: "POST",
        body,
      }
    );

    await router.push(`/quotes/${response.data.quoteId}`);
  } catch (err) {
    console.error("Lỗi khi tạo báo giá:", err);
    alert("Có lỗi xảy ra khi tạo báo giá, vui lòng thử lại!");
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  if (confirm("Bạn có chắc muốn hủy? Dữ liệu sẽ không được lưu.")) {
    router.back();
  }
};
</script>
