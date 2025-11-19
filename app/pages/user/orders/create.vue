<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              Tạo đơn hàng mới
            </h1>
            <p class="text-gray-600 mt-1">Tạo đơn hàng cho khách hàng</p>
          </div>
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </header>

      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Customer Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <OrderCustomerForm
            v-model:customer="orderData.customer"
            @customer-type="orderData.customerType = $event"
            @form-valid="handleFormValid"
          />
        </div>

        <!-- Products Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
          <OrderProductSelect v-model:items="orderData.items" />
        </div>

        <!-- Promotions Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Khuyến mãi áp dụng
          </h2>
          <OrderPromotionSelect
            v-model:promotions="orderData.appliedPromotions"
            :items="orderData.items"
          />
        </div>

        <!-- Payment Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Khuyến mãi áp dụng
          </h2>
          <OrderPaymentMethod
            v-model:payment="orderData.payment"
            :total="orderTotal"
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
                v-model.number="orderData.validDays"
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
                v-model.number="orderData.discountPercent"
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
              v-model="orderData.notes"
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
      </div>

      <!-- Step 2: Xác nhận -->
      <div v-else>
        <OrderSummary
          :order-data="orderData"
          :order-total="total"
          @back="currentStep = 1"
          @submit="createOrder"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderCustomerForm from "@/components/orders/OrderCustomerForm.vue";
import OrderProductSelect from "@/components/orders/OrderProductSelect.vue";
import OrderPromotionSelect from "@/components/orders/OrderPromotionSelect.vue";
import OrderPaymentMethod from "@/components/orders/OrderPaymentMethod.vue";
import OrderSummary from "@/components/orders/OrderSummary.vue";
import type { Customer, ProductItem, Promotion } from "@/schemas";
import type { ApiResponse, CreateOrderResponse } from "@/types/";
definePageMeta({
  layout: "dealer-manager-layout",
});

// State
const currentStep = ref(1);
const isCustomerFormValid = ref(false);

const orderData = reactive({
  customer: null as Customer | null,
  customerType: null as "existing" | "new" | null,
  items: [] as ProductItem[],
  appliedPromotions: [] as Promotion[],
  discountPercent: 0,
  validDays: 30,
  payment: {
    method: "cash",
    bankPartner: null,
    downPayment: 0,
    tenor: 12,
  },
  notes: "",
});

// --- Computed totals ---
const subtotal = computed(() =>
  orderData.items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  )
);
const promoDiscount = computed(() =>
  orderData.appliedPromotions.reduce(
    (sum, promo) => sum + promo.discountAmount,
    0
  )
);
const percentDiscount = computed(
  () => (subtotal.value * (orderData.discountPercent || 0)) / 100
);
const total = computed(
  () => subtotal.value - promoDiscount.value - percentDiscount.value
);

const handleFormValid = (val: boolean) => {
  isCustomerFormValid.value = val;
};

// Computed
const orderTotal = computed(() => {
  const itemsTotal = orderData.items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  const discountTotal = orderData.appliedPromotions.reduce((sum, promo) => {
    return sum + promo.discountAmount;
  }, 0);

  return itemsTotal - discountTotal;
});

const goToSummary = () => {
  currentStep.value = 2;
};

// Gọi API tạo đơn hàng
const createOrder = async () => {
  try {
    // TODO: Gọi API tạo đơn hàng
    const response = await $fetch<ApiResponse<CreateOrderResponse>>(
      "/api/orders",
      {
        method: "POST",
        body: {
          customerId: orderData.customer?.id,
          items: orderData.items,
          promotions: orderData.appliedPromotions,
          payment: orderData.payment,
          totalAmount: orderTotal.value,
        },
      }
    );

    // Chuyển hướng đến trang chi tiết đơn hàng
    await navigateTo(`/orders/${response.data.orderId}`);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    // TODO: Hiển thị thông báo lỗi
  }
};

const router = useRouter();

function goBack() {
  router.back();
}
</script>
