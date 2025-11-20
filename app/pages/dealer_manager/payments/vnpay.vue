<script setup lang="ts">
import { computed, ref } from "vue";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const apiBase = (config.public.apiBase as string) || "http://localhost:4000";
const order = ref({
  customer_name: "Nguyễn Văn Test",
  customer_phone: "0901 234 567",
  customer_email: "nguyenvantest@example.com",
  notes: "Đơn hàng demo để test VNPay",
  items: [
    {
      product_name: "Tesla Model 3 RWD",
      product_code: "TM3-RWD",
      qty: 1,
      unit_price_vnd: 90_000_000,
      tax_rate_code: "VAT10",
    },
    {
      product_name: "Gói phụ kiện Premium",
      product_code: "PK-PREMIUM",
      qty: 1,
      unit_price_vnd: 20_000_000,
      tax_rate_code: "VAT10",
    },
  ],
});

const hardDealerId = "00000000-0000-0000-0000-000000000001";

const loading = ref(false);
const errorMsg = ref("");
const lastInvoiceId = ref<string | null>(null);

// ====== TÍNH TỔNG DEMO Ở FE ======
const subtotal = computed(() =>
  order.value.items.reduce(
    (sum, it) => sum + (it.qty || 0) * (it.unit_price_vnd || 0),
    0
  )
);

const taxDemo = computed(() => Math.round(subtotal.value * 0.1));
const totalDemo = computed(() => subtotal.value + taxDemo.value);

const formatVnd = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const subtotalFormatted = computed(() => formatVnd(subtotal.value));
const taxFormatted = computed(() => formatVnd(taxDemo.value));
const totalFormatted = computed(() => formatVnd(totalDemo.value));
const customerId = "927668fa-33d2-4548-818f-f36e3e1c3029";
// ====== HÀM TEST THANH TOÁN VNPay ======
const testVnpay = async () => {
  loading.value = true;
  errorMsg.value = "";
  lastInvoiceId.value = null;

  try {
    // 1) Gọi Billing qua Gateway để tạo HÓA ĐƠN DEMO
    const payload = {
      dealer_id: hardDealerId,
      customer_id: customerId,
      currency: "VND",
      issue_now: true,
      meta: {
        demo: true,
        customer_name: order.value.customer_name,
        customer_phone: order.value.customer_phone,
        customer_email: order.value.customer_email,
        notes: order.value.notes,
        source: "vnpay_demo_page",
      },
      items: order.value.items.map((it) => ({
        product_code: it.product_code,
        description: it.product_name,
        qty: it.qty,
        // VND -> cents (nếu total_cents trong DB là cents)
        unit_price_cents: it.unit_price_vnd * 100,
        tax_rate_code: it.tax_rate_code,
      })),
    };

    const invRes: any = await $fetch(`${apiBase}/billing/bills`, {
      method: "POST",
      body: payload,
    });

    const invId = invRes?.id;
    if (!invId) {
      throw new Error("Không nhận được id hóa đơn từ Billing (/billing/bills)");
    }

    lastInvoiceId.value = invId;

    // 2) Gọi Gateway → AR Service → VNPay
    const payRes: any = await $fetch(`${apiBase}/payments/vnpay/create`, {
      method: "POST",
      body: { inv_id: invId }, // GatewayARController nhận body và forward sang AR
    });

    if (payRes.alreadyPaid) {
      errorMsg.value = "Hóa đơn này đã thanh toán rồi";
      return;
    }

    if (!payRes.payUrl) {
      throw new Error("Không nhận được payUrl từ /payments/vnpay/create");
    }

    // 3) Redirect sang VNPay
    window.location.href = payRes.payUrl;
  } catch (err: any) {
    console.error(err);
    errorMsg.value =
      err?.data?.message ||
      err?.message ||
      "Có lỗi xảy ra khi test thanh toán VNPay";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      Test thanh toán VNPay (dữ liệu cứng từ FE)
    </h1>
    <p class="text-gray-600 mb-6">
      Trang này tạo một hóa đơn demo qua Billing Service, sau đó gọi AR Service
      để tạo link VNPay.
    </p>

    <!-- THÔNG TIN KHÁCH HÀNG DEMO -->
    <div class="bg-white rounded-xl shadow p-5 mb-5">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">
        Thông tin khách hàng (demo)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Họ tên</p>
          <p class="font-medium text-gray-800">{{ order.customer_name }}</p>
        </div>
        <div>
          <p class="text-gray-500">Số điện thoại</p>
          <p class="font-medium text-gray-800">{{ order.customer_phone }}</p>
        </div>
        <div>
          <p class="text-gray-500">Email</p>
          <p class="font-medium text-gray-800">{{ order.customer_email }}</p>
        </div>
        <div>
          <p class="text-gray-500">Ghi chú</p>
          <p class="font-medium text-gray-800">
            {{ order.notes }}
          </p>
        </div>
      </div>
    </div>

    <!-- DANH SÁCH SẢN PHẨM DEMO -->
    <div class="bg-white rounded-xl shadow p-5 mb-5">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">
        Chi tiết đơn hàng (demo)
      </h2>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600">
              <th class="px-4 py-2">Sản phẩm</th>
              <th class="px-4 py-2">Mã</th>
              <th class="px-4 py-2">Số lượng</th>
              <th class="px-4 py-2">Đơn giá (VND)</th>
              <th class="px-4 py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in order.items"
              :key="item.product_code"
              class="border-t"
            >
              <td class="px-4 py-2">{{ item.product_name }}</td>
              <td class="px-4 py-2">{{ item.product_code }}</td>
              <td class="px-4 py-2">{{ item.qty }}</td>
              <td class="px-4 py-2">
                {{ formatVnd(item.unit_price_vnd) }}
              </td>
              <td class="px-4 py-2">
                {{ formatVnd(item.unit_price_vnd * item.qty) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TỔNG KẾT -->
      <div class="mt-4 flex justify-end">
        <div class="text-right text-sm">
          <p>
            Tạm tính:
            <span class="font-semibold">{{ subtotalFormatted }}</span>
          </p>
          <p>
            Thuế (demo 10%):
            <span class="font-semibold">{{ taxFormatted }}</span>
          </p>
          <p class="text-lg">
            Tổng thanh toán (ước tính):
            <span class="font-bold text-blue-600">
              {{ totalFormatted }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- ACTION -->
    <div class="flex items-center gap-3">
      <button
        :disabled="loading"
        @click="testVnpay"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {{
          loading
            ? "Đang tạo hóa đơn & link VNPay..."
            : "Thanh toán VNPay (test)"
        }}
      </button>

      <div v-if="lastInvoiceId" class="text-sm text-gray-600">
        Đã tạo hóa đơn demo với ID:
        <span class="font-mono font-semibold">{{ lastInvoiceId }}</span>
      </div>
    </div>

    <p v-if="errorMsg" class="mt-3 text-sm text-red-600">
      {{ errorMsg }}
    </p>
  </div>
</template>
sẽ cần những thông tin gì để gửi tạo đơn hàng đến vnpay
