<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              Chi tiết báo giá #{{ quoteId }}
            </h1>
            <p class="text-gray-600 mt-1">Thông tin chi tiết của báo giá</p>
          </div>

          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Quay lại
          </button>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="pending" class="flex justify-center py-20">
        <div
          class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"
        ></div>
      </div>

      <!-- Nội dung chi tiết -->
      <div
        v-else-if="quotation"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8"
      >
        <!-- Thông tin khách hàng -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h2>
          <p>
            <strong>Tên:</strong> {{ quotation?.customer.name || "Không có" }}
          </p>
          <p>
            <strong>Số điện thoại:</strong>
            {{ quotation?.customer.phone || "Không có" }}
          </p>
          <p>
            <strong>Email:</strong>
            {{ quotation?.customer.email || "Không có" }}
          </p>
          <p>
            <strong>Ngày sinh:</strong>
            {{ quotation?.customer.birth_day || "Không có" }}
          </p>
          <p>
            <strong>Địa chỉ:</strong>
            {{ quotation?.customer.adress || "Không có" }}
          </p>
        </section>

        <!-- Sản phẩm -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Sản phẩm</h2>
          <table class="w-full border border-gray-200 rounded-lg">
            <thead class="bg-gray-100">
              <tr>
                <th class="text-left px-4 py-2">Tên sản phẩm</th>
                <th class="text-left px-4 py-2">Số lượng</th>
                <th class="text-left px-4 py-2">Đơn giá</th>
                <th class="text-left px-4 py-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in quotation?.vehicles"
                :key="item.id"
                class="border-t"
              >
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2">
                  {{
                    quotation.items.find((i) => i.product_id === item.id)
                      ?.quantity || 0
                  }}
                </td>
                <td v-if="item.price" class="px-4 py-2">
                  {{ formatCurrency(item.price) }}
                </td>
                <td
                  v-if="
                    item.price &&
                    quotation.items.find((i) => i.product_id === item.id)
                      ?.quantity
                  "
                  class="px-4 py-2"
                >
                  {{
                    formatCurrency(
                      (quotation.items.find((i) => i.product_id === item.id)
                        ?.quantity || 0) * item.price
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Khuyến mãi -->
        <section v-if="quotation?.promotions?.length">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Khuyến mãi</h2>
          <ul class="list-disc list-inside text-gray-700">
            <li v-for="promo in quotation.promotions" :key="promo.id">
              {{ promo.code }} — Giảm
              {{
                promo.discountType === "amount"
                  ? formatCurrency(promo.discountValue)
                  : promo.discountValue + "%"
              }}
            </li>
          </ul>
        </section>

        <!-- Thanh toán -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-3">Phương thức thanh toán</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Phương thức thanh toán -->
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Chọn phương thức</label
              >
              <select
                v-model="payment.paymentMethod"
                class="w-full border rounded px-3 py-2"
              >
                <option value="cash">Trả thẳng</option>
                <option value="bank_transfer">Chuyển khoản</option>
              </select>
            </div>

            <!-- Số tiền thanh toán -->
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Số tiền thanh toán</label
              >
              <input
                type="number"
                min="0"
                v-model.number="payment.paymentAmount"
                placeholder="Nhập số tiền"
                class="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <!-- Tổng kết cuối cùng -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Tổng kết đơn hàng
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Tổng tiền hàng:</span>
              <span class="font-medium">{{ formatCurrency(itemsTotal) }}</span>
            </div>

            <div
              v-if="quotation.discountAmount > 0"
              class="flex justify-between"
            >
              <span class="text-gray-600">Giảm giá:</span>
              <span class="text-green-600 font-medium"
                >-{{ formatCurrency(quotation.discountAmount) }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Thuế VAT (10%):</span>
              <span class="text-green-600 font-medium"
                >+{{ formatCurrency(itemsTotal ? itemsTotal * 0.1 : 0) }}</span
              >
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-3">
              <span>Tổng thanh toán:</span>
              <span class="text-blue-600">{{
                formatCurrency(quotation.totalAmount)
              }}</span>
            </div>

            <div
              v-if="payment.paymentMethod === 'bank_transfer'"
              class="text-sm text-gray-600"
            >
              * Trả trước: {{ formatCurrency(0) }}
            </div>
          </div>
        </div>

        <!-- Ghi chú đơn hàng -->
        <!-- <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                    <textarea
                        v-model="orderNote"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Thêm ghi chú cho đơn hàng này..."
                    ></textarea>
                </div> -->
      </div>

      <!-- Không có dữ liệu -->
      <div v-else class="text-center py-16 text-gray-500">
        Không tìm thấy báo giá nào 📭
      </div>
      <div class="flex justify-end mt-6">
        <button
          @click="handleSubmit"
          :disabled="isSubmit"
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          Tạo mới
        </button>
      </div>
      <ConfirmModal
        v-model:show="showModal"
        title="Xác nhận tạo báo giá"
        message="Bạn có chắc chắn muốn <b>tạo</b> báo giá mới này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        @confirm="handleConfirm"
      />
      <StatusModal
        :visible="visible"
        :loading="loading"
        :error="error"
        @update:visible="(val: boolean) => (visible = val)"
        @update:loading="(val: boolean) => (loading = val)"
        @update:error="(val: string | null) => (error = val)"
        @close="goToListQuote"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/utils/format";
import type { QuoteDetail } from "@/schemas"; // bạn có thể định nghĩa kiểu này theo project
import type { Payment } from "~/types/payment";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import StatusModal from "~/components/shared/StatusModal.vue";

definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

const route = useRoute();
const router = useRouter();
const quoteId = route.params.id as string;

const payment = reactive<Payment>({
  paymentMethod: "cash", // "cash" hoặc "bank_transfer"
  paymentStatus: "unpaid",
  paymentAmount: 0, // Số tiền thanh toán
  bank: "", // Tên ngân hàng nếu trả góp
  term: 0, // Kỳ hạn trả góp
  downPayment: 0, // Số tiền trả trước
});

// Trạng thái
const pending = ref(true);

const { error: errorQuote, fetchOne, quotation } = useQuotations();
const { loading, error, create } = useOrders();
watch(
  () => quotation.value,
  (val) => {
    payment.paymentAmount = val?.totalAmount ? val.totalAmount : 0;
  }
);
// Computed
const itemsTotal = computed(() => {
  return quotation.value?.items.reduce(
    (sum, item) => sum + (item.quantity ? item.quantity : 0) * item.unit_price,
    0
  );
});

const isSubmit = computed(() => {
  if (
    payment.paymentMethod === "cash" ||
    payment.paymentMethod === "bank_transfer"
  )
    return false;
  else {
    return !(payment.term > 0 && payment.bank != "");
  }
});

const createOrder = async () => {
  const createBy = localStorage.getItem("user_id");
  try {
    const body: any = {
      ...payment,
      quotationId: quoteId,
      createdBy: createBy,
    };
    console.log("body", body);
    await create(body);
    console.log("Tạo thành công");
  } catch (err) {
    console.error("Lỗi khi tạo báo giá:", err);
    alert("Có lỗi xảy ra khi tạo báo giá, vui lòng thử lại!");
  }
};

// Lấy dữ liệu từ API
onMounted(async () => {
  try {
    await fetchOne(quoteId);
    console.log("quotation", toRaw(quotation));
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error);
  } finally {
    pending.value = false;
  }
  pending.value = false;
});
function goToListQuote() {
  router.push("/user/orders");
}
function goBack() {
  router.back();
}
const showModal = ref(false);

const handleSubmit = () => {
  showModal.value = true;
};

const handleConfirm = () => {
  console.log("Người dùng xác nhận hành động!");
  // Gọi API hoặc thực hiện action ở đây
  showModal.value = false; // đóng modal sau khi xác nhận
  createOrder();
};

// State của modal
const visible = ref(false);

watch(loading, () => {
  if (loading.value) visible.value = true;
});
</script>
