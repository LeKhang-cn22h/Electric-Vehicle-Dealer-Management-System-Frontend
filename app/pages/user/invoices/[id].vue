<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-start gap-4">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              Hóa đơn #{{ invoice?.inv_number || invoice?.id || invoiceId }}
            </h1>
            <p class="text-gray-600 mt-1">
              Chi tiết hóa đơn cho đơn hàng
              <span class="font-medium">
                {{ invoice?.meta?.order_id || "-" }}
              </span>
            </p>
          </div>

          <div class="flex flex-col items-end gap-2">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              :class="statusBadgeClass"
            >
              {{ statusLabel }}
            </span>

            <div class="flex gap-2">
              <button
                @click="handlePrint"
                class="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                In / Xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div
          class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"
        ></div>
      </div>

      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
      >
        {{ error }}
      </div>

      <!-- Nội dung hóa đơn -->
      <div
        v-else-if="invoice"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8"
      >
        <!-- Thông tin chung -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-3">
              Thông tin hóa đơn
            </h2>
            <p>
              <strong>Số hóa đơn:</strong>
              {{ invoice.inv_number || invoice.id }}
            </p>
            <p>
              <strong>Ngày phát hành:</strong>
              {{ formatDate(invoice.issued_at || invoice.issue_date) }}
            </p>
            <p v-if="invoice.due_date">
              <strong>Hạn thanh toán:</strong>
              {{ formatDate(invoice.due_date) }}
            </p>
            <p><strong>Tiền tệ:</strong> {{ invoice.currency || "VND" }}</p>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-3">
              Thông tin thanh toán
            </h2>
            <p>
              <strong>Đơn hàng:</strong>
              {{ invoice.meta?.order_id || "-" }}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>
              {{
                invoice.meta?.payment_method === "online_vnpay"
                  ? "Thanh toán VNPay"
                  : invoice.meta?.payment_method === "cash"
                  ? "Tiền mặt"
                  : invoice.meta?.payment_method || "Không rõ"
              }}
            </p>
            <p>
              <strong>Trạng thái thanh toán:</strong>
              {{ statusLabel }}
            </p>
          </div>
        </section>

        <!-- Khách hàng & Dealer -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h2>
            <p><strong>Tên:</strong> {{ customerInfo.name || "-" }}</p>
            <p><strong>SĐT:</strong> {{ customerInfo.phone || "-" }}</p>
            <p><strong>Email:</strong> {{ customerInfo.email || "-" }}</p>
            <p><strong>Địa chỉ:</strong> {{ customerInfo.address || "-" }}</p>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-3">
              Đại lý (Dealer)
            </h2>
            <p>
              <strong>Mã dealer:</strong>
              {{ dealerInfo.code || invoice.dealer_id || "-" }}
            </p>
            <p><strong>Tên dealer:</strong> {{ dealerInfo.name || "-" }}</p>
            <p><strong>Địa chỉ:</strong> {{ dealerInfo.address || "-" }}</p>
          </div>
        </section>

        <!-- Danh sách dòng hàng -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-3">
            Chi tiết sản phẩm / dịch vụ
          </h2>

          <div class="overflow-x-auto">
            <table class="w-full border border-gray-200 rounded-lg text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left px-4 py-2">Mã SP</th>
                  <th class="text-left px-4 py-2">Mô tả</th>
                  <th class="text-right px-4 py-2">Số lượng</th>
                  <th class="text-right px-4 py-2">Đơn giá</th>
                  <th class="text-right px-4 py-2">Thuế (VND)</th>
                  <th class="text-right px-4 py-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in lineItems"
                  :key="item.id || item.product_code"
                  class="border-t"
                >
                  <td class="px-4 py-2">
                    {{ item.product_code || "-" }}
                  </td>
                  <td class="px-4 py-2">
                    {{ item.description || "—" }}
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ item.qty || 0 }}
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ formatCurrency(fromCents(item.unit_price_cents)) }}
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ formatCurrency(fromCents(item.line_tax_cents || 0)) }}
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{
                      formatCurrency(
                        fromCents(
                          (item.unit_price_cents || 0) * (item.qty || 0) +
                            (item.line_tax_cents || 0)
                        )
                      )
                    }}
                  </td>
                </tr>

                <tr v-if="!lineItems.length">
                  <td class="px-4 py-4 text-center text-gray-500" colspan="6">
                    Không có dòng hóa đơn nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Tổng tiền -->
        <section class="flex flex-col items-end gap-1">
          <div class="flex justify-between w-full max-w-sm">
            <span class="text-gray-600">Tạm tính:</span>
            <span class="font-medium">
              {{ formatCurrency(fromCents(invoice.subtotal_cents || 0)) }}
            </span>
          </div>
          <div class="flex justify-between w-full max-w-sm">
            <span class="text-gray-600">Thuế:</span>
            <span class="font-medium">
              {{ formatCurrency(fromCents(invoice.tax_cents || 0)) }}
            </span>
          </div>
          <div class="flex justify-between w-full max-w-sm border-t pt-2 mt-2">
            <span class="text-gray-800 font-semibold">Tổng cộng:</span>
            <span class="text-xl font-bold text-blue-600">
              {{ formatCurrency(fromCents(invoice.total_cents || 0)) }}
            </span>
          </div>
        </section>
      </div>

      <!-- Không có dữ liệu -->
      <div v-else class="text-center py-16 text-gray-500">
        Không tìm thấy hóa đơn 📭
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "#imports";
import { formatCurrency, formatDate } from "@/utils/format";
import { useBilling } from "~/composables/useBilling";

definePageMeta({
  layout: false,
});

// Layout theo role nếu cần
const { layoutName, applyLayout } = useRoleBasedLayout?.() ?? {};
applyLayout && applyLayout();

const route = useRoute();
const router = useRouter();
const invoiceId = route.params.id as string;

const { getBill } = useBilling();

const invoice = ref<any | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Helper cents -> VND
const fromCents = (cents?: number | null) => {
  if (!cents) return 0;
  return cents / 100;
};

// map từ billing_invoice_items(*) của Supabase
const lineItems = computed(() => {
  if (!invoice.value) return [];
  return invoice.value.billing_invoice_items || invoice.value.items || [];
});

const customerInfo = computed(() => {
  const c = invoice.value?.meta?.customer || invoice.value?.customer;
  return {
    name: c?.name || "",
    phone: c?.phone || "",
    email: c?.email || "",
    address: c?.address || c?.adress || "",
  };
});

const dealerInfo = computed(() => {
  const d = invoice.value?.dealer || invoice.value?.meta?.dealer;
  return {
    code: invoice.value?.dealer_id || "",
    name: d?.name || "",
    address: d?.address || "",
  };
});

const statusLabel = computed(() => {
  const s = invoice.value?.status;
  switch (s) {
    case "paid":
      return "Đã thanh toán";
    case "unpaid":
      return "Chưa thanh toán";
    case "cancelled":
      return "Đã hủy";
    case "draft":
      return "Nháp";
    case "issued":
      return "Đã phát hành";
    default:
      return s || "Không rõ";
  }
});

const statusBadgeClass = computed(() => {
  const s = invoice.value?.status;
  if (s === "paid") return "bg-green-50 text-green-700 border border-green-200";
  if (s === "unpaid")
    return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  if (s === "cancelled") return "bg-red-50 text-red-700 border border-red-200";
  if (s === "issued") return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-gray-50 text-gray-700 border border-gray-200";
});

const handlePrint = () => {
  window.print();
};

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await getBill(invoiceId);
    invoice.value = res;
    console.log("[InvoiceDetail] invoice:", res);
  } catch (e: any) {
    console.error("[InvoiceDetail] getBill error:", e);
    error.value = e?.message || "Không tải được hóa đơn";
  } finally {
    loading.value = false;
  }
});
</script>
