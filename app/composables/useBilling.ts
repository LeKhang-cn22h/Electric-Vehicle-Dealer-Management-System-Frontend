import { ref } from "vue";
import type { Ref } from "vue";

export interface BillItemPayload {
  product_code: string;
  description: string;
  qty: number;
  unit_price_cents: number;
  tax_rate_code: string;
}

export interface CreateBillPayload {
  customer_id: number;
  dealer_id: string;
  currency?: string;
  items: BillItemPayload[];
  meta?: Record<string, any>;
  issue_now?: boolean;
}

export interface Bill {
  id: string;
  dealer_id: string;
  customer_id: number;
  currency: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  status: string;
  created_at?: string;
  issued_at?: string | null;
  paid_at?: string | null;
  meta?: Record<string, any>;
  [key: string]: any;
}

export interface CreateBillResponse {
  message: string;
  id: string;
}

export function useBilling() {
  const config = useRuntimeConfig();
  const apiBase = (config.public.apiBase as string) || "http://localhost:4000";

  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const createBill = async (
    payload: CreateBillPayload,
    idempotencyKey?: string
  ): Promise<CreateBillResponse> => {
    loading.value = true;
    error.value = null;

    try {
      console.log(" Payload gửi BE ", JSON.stringify(payload, null, 2));

      const res = await $fetch<CreateBillResponse>(`${apiBase}/billing/bills`, {
        method: "POST",
        credentials: "include",
        body: payload,
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      });
      return res;
    } catch (err: any) {
      console.error("Billing /billing/bills error raw:", err);
      const data = err?.data || err?.response?._data;
      console.error("Billing /billing/bills error data:", data);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const listBills = async (
    query: Record<string, any> = {}
  ): Promise<Bill[]> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<Bill[]>(`${apiBase}/billing/bills`, {
        method: "GET",
        credentials: "include",
        query,
      });
      return res;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi lấy danh sách hóa đơn";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getBill = async (id: string): Promise<Bill> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<Bill>(`${apiBase}/billing/bills/${id}`, {
        method: "GET",
        credentials: "include",
      });
      return res;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi lấy chi tiết hóa đơn";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const markBillPaid = async (id: string): Promise<any> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<any>(`${apiBase}/billing/bills/${id}/paid`, {
        method: "PATCH",
        credentials: "include",
      });
      return res;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi đánh dấu đã thanh toán";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const voidBill = async (id: string): Promise<any> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<any>(`${apiBase}/billing/bills/${id}/void`, {
        method: "PATCH",
        credentials: "include",
      });
      return res;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.message || "Có lỗi xảy ra khi hủy hóa đơn";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const ensureInstallmentSchedule = async (invoiceId: string) => {
    return await $fetch(
      `${apiBase}/billing/bills/${invoiceId}/installments/ensure`,
      {
        method: "POST",
        credentials: "include",
      }
    );
  };

  const markInstallmentPaid = async (invoiceId: string, sequence: number) => {
    return await $fetch(`${apiBase}/billing/installments/pay`, {
      method: "POST",
      body: {
        invoiceId,
        sequence,
      },
    });
  };

  return {
    loading,
    error,
    createBill,
    listBills,
    getBill,
    markBillPaid,
    voidBill,
    markInstallmentPaid,
    ensureInstallmentSchedule,
  };
}
