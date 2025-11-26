<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              Chi tiết hợp đồng #{{ contractId }}
            </h1>
            <p class="text-gray-600 mt-1">Thông tin chi tiết của hợp đồng</p>
          </div>

          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Quay lại danh sách
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
        v-else-if="contract"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8"
      >
        <!-- Thông tin khách hàng -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h2>
          <p><strong>Tên:</strong> {{ contract.customer.name }}</p>
          <p><strong>Số điện thoại:</strong> {{ contract.customer.phone }}</p>
          <p><strong>Email:</strong> {{ contract.customer.email }}</p>
          <p><strong>Địa chỉ:</strong> {{ contract.customer.adress }}</p>
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
                v-for="item in contract.vehicles"
                :key="item.id"
                class="border-t"
              >
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2">
                  {{
                    contract.items.find((i) => i.product_id === item.id)
                      ?.quantity || 0
                  }}
                </td>
                <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                <td class="px-4 py-2">
                  {{
                    formatCurrency(
                      (contract.items.find((i) => i.product_id === item.id)
                        ?.quantity || 0) * (item.price ? item.price : 0)
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Khuyến mãi -->
        <section v-if="contract.promotions?.length">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Khuyến mãi</h2>
          <ul class="list-disc list-inside text-gray-700">
            <li v-for="promo in contract.promotions" :key="promo.id">
              {{ promo.code }} — Giảm
              {{
                promo.discountType === "amount"
                  ? formatCurrency(promo.discountValue)
                  : promo.discountValue + "%"
              }}
            </li>
          </ul>
        </section>

        <!-- Thuế VAT -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Thuế VAT</h2>
          <ul class="list-disc list-inside text-gray-700">
            <li>10%</li>
          </ul>
        </section>

        <!-- Thanh toán -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Thanh toán</h2>
          <p>
            <strong>Phương thức:</strong>
            {{
              contract.paymentMethod === "cash"
                ? "Tiền mặt"
                : contract.paymentMethod === "bank_transfer"
                ? "Chuyển khoản"
                : "Trả góp"
            }}
          </p>

          <p v-if="contract.paymentMethod === 'bank_transfer'">
            <strong>Đối tác ngân hàng:</strong> {{ contract.order.bank }}
          </p>
          <p>
            <strong>Trả trước:</strong>
            {{ formatCurrency(contract.order.down_payment) }}
          </p>
          <p><strong>Kỳ hạn:</strong> {{ contract.order.term }} tháng</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">
            Thời hạn hợp đồng
          </h2>
          <p>
            Từ <strong>{{ formatDate(contract.startDate) }}</strong> đến
            <strong>{{ formatDate(contract.endDate) }}</strong>
          </p>
        </section>

        <!-- Tổng kết -->
        <section class="border-t pt-4">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-700">Tổng tiền:</span>
            <span class="text-2xl font-bold text-blue-600">{{
              formatCurrency(contract.order.total_amount)
            }}</span>
          </div>
        </section>
      </div>

      <!-- Không có dữ liệu -->
      <div v-else class="text-center py-16 text-gray-500">
        Không tìm thấy đơn hàng nào 📭
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/utils/format";

definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

const route = useRoute();
const router = useRouter();
const contractId = route.params.id as string;
const userRole = useCookie<string>("role");
// Trạng thái
const { loading, error, fetchOne, contract } = useContract();
const pending = ref(true);
watch(
  () => contract.value,
  () => {
    console.log("contract", contract.value);
  }
);

// Lấy dữ liệu từ API
onMounted(async () => {
  try {
    await fetchOne(contractId);
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error);
  } finally {
    pending.value = false;
  }
});

function goBack() {
  router.back();
}
</script>
