<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div
      class="bg-white max-w-md w-full rounded-xl shadow-sm border border-gray-200 p-6 space-y-4"
    >
      <div class="flex items-center gap-3">
        <div
          v-if="isSuccess"
          class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
        >
          <span class="text-green-600 text-2xl">✔</span>
        </div>
        <div
          v-else
          class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center"
        >
          <span class="text-red-600 text-2xl">!</span>
        </div>

        <div>
          <h1 class="text-lg font-semibold">
            {{ titleText }}
          </h1>
          <p v-if="subtitleText" class="text-sm text-gray-600">
            {{ subtitleText }}
          </p>
        </div>
      </div>

      <div v-if="verifying" class="flex justify-center py-4">
        <div
          class="h-8 w-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
        ></div>
      </div>

      <div v-else class="text-sm space-y-1">
        <p>
          <span class="font-medium">Mã giao dịch:</span>
          {{ txnRef || "-" }}
        </p>
        <p>
          <span class="font-medium">Mã phản hồi (vnp_ResponseCode):</span>
          {{ respCode || "-" }}
        </p>
        <p v-if="txnStatus">
          <span class="font-medium"
            >Trạng thái giao dịch (vnp_TransactionStatus):</span
          >
          {{ txnStatus }}
        </p>
        <p v-if="invoiceId">
          <span class="font-medium">Mã hóa đơn:</span>
          {{ invoiceId }}
        </p>
        <p v-if="amountVnd !== null">
          <span class="font-medium">Số tiền:</span>
          {{ formattedAmount }}
        </p>
      </div>

      <p v-if="verifyError" class="text-xs text-red-500">
        {{ verifyError }}
      </p>

      <div class="flex justify-between items-center pt-2">
        <button
          type="button"
          class="text-sm text-gray-600 hover:underline"
          @click="goBack"
        >
          ← Quay lại
        </button>

        <div class="flex gap-2">
          <button
            v-if="invoiceId"
            type="button"
            class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
            @click="goToInvoice"
          >
            Xem hóa đơn
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
            @click="goHome"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter, useRuntimeConfig } from "#imports";
import { formatCurrency } from "@/utils/format";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const respCode = computed(
  () => (route.query["vnp_ResponseCode"] as string) || null
);
const txnStatus = computed(
  () => (route.query["vnp_TransactionStatus"] as string) || null
);
const txnRef = computed(() => (route.query["vnp_TxnRef"] as string) || null);
const rawAmount = computed(() => (route.query["vnp_Amount"] as string) || null);

// vnp_Amount theo doc = số tiền * 100
const amountVnd = computed<number | null>(() => {
  if (!rawAmount.value) return null;
  const num = Number(rawAmount.value);
  if (Number.isNaN(num)) return null;
  return num / 100;
});

const invoiceId = computed<string | null>(() => {
  if (!txnRef.value) return null;
  const part = txnRef.value.toString().split("INV_")[1]?.split("_")[0];
  return part || null;
});

// Thành công nếu vnp_ResponseCode === '00'
const isSuccess = computed(() => respCode.value === "00");

const titleText = computed(() =>
  isSuccess.value ? "Thanh toán thành công" : "Thanh toán không thành công"
);

const subtitleText = computed(() =>
  isSuccess.value
    ? "Cảm ơn bạn đã thanh toán. Thông tin giao dịch như bên dưới."
    : "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
);

const formattedAmount = computed(() =>
  amountVnd.value === null ? "-" : formatCurrency(amountVnd.value)
);

// Verify với BE (gọi /payments/vnpay/return)
const verifying = ref(true);
const verifyError = ref<string | null>(null);

onMounted(async () => {
  try {
    console.log("Browser URL:", window.location.href);
    console.log("Vue Route Query:", route.query);
    const queryObj = { ...route.query };
    const searchParams = new URLSearchParams(queryObj as any);
    const queryString = searchParams.toString();

    console.log("Query String sẽ gửi:", queryString);
    if (!queryString) {
      console.error("LỖI: URL trình duyệt không có tham số VNPay nào cả!");
      verifyError.value = "URL trình duyệt thiếu tham số thanh toán.";
      verifying.value = false;
      return;
    }
    const baseApi = "http://localhost:4000";

    const url = `${baseApi}/payments/vnpay/return?${queryString}`;
    console.log("Fetching URL:", url);

    const res = await fetch(url);

    if (!res.ok) {
      verifyError.value = "Không xác thực được giao dịch với máy chủ.";
      return;
    }

    const data = await res.json();

    if (!data.success) {
      verifyError.value =
        "Máy chủ báo giao dịch không thành công (code: " +
        (data.code ?? "N/A") +
        ").";
    }
  } catch (err) {
    verifyError.value = "Có lỗi xảy ra khi xác thực giao dịch.";
  } finally {
    verifying.value = false;
  }
});

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};
const goToInvoice = () => {
  if (!invoiceId.value) {
    alert("Không tìm thấy mã hóa đơn");
    return;
  }
  router.push(`/user/invoices/${invoiceId.value}`);
};
</script>
