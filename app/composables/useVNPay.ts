import { ref } from "vue";
import type { Ref } from "vue";

export interface CreateVnpayPaymentBody {
  inv_id: string;
}

export interface CreateVnpayPaymentResponse {
  payUrl: string;
  intent_id?: string;
  txnRef?: string;
  alreadyPaid?: boolean;
}

export interface QueryVnpayBody {
  txnRef: string;
}

export function useVNPay() {
  const config = useRuntimeConfig();
  const apiBase = (config.public.apiBase as string) || "http://localhost:4000";

  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  // Tạo giao dịch VNPay -> nhận payUrl
  const createPayment = async (
    body: CreateVnpayPaymentBody
  ): Promise<CreateVnpayPaymentResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<CreateVnpayPaymentResponse>(
        `${apiBase}/payments/vnpay/create`,
        {
          method: "POST",
          credentials: "include",
          body,
        }
      );
      return res;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi tạo giao dịch VNPay";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Query trạng thái giao dịch
  const queryPayment = async (body: QueryVnpayBody): Promise<any> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<any>(`${apiBase}/payments/vnpay/query`, {
        method: "POST",
        credentials: "include",
        body,
      });
      return res;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi truy vấn giao dịch VNPay";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    createPayment,
    queryPayment,
  };
}
