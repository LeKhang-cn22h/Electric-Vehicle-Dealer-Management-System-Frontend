import { ref } from "vue";
import { QuotationService } from "~/services/sales/quotation.service";
import type { QuotationResponse, QuotationTableResponse } from "~/types";

export function useQuotations() {
    const quotations = ref<QuotationResponse[]>([]);
    const quotation = ref<QuotationResponse | null>(null);
    const quotationsByCreator = ref<QuotationTableResponse[]>([]);

    const loading = ref(false);
    const error = ref<string | null>(null);

    // ===============================
    // FETCH ALL
    // ===============================
    async function fetchAll(query: any = {}) {
        loading.value = true;
        error.value = null;

        try {
            const response = await QuotationService.findAll(query);
            quotations.value = response || [];
            return response;
        } catch (e: any) {
            error.value = e?.message || "Error fetching quotations";
            console.error("[useQuotations] fetchAll error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // FETCH ONE
    // ===============================
    async function fetchOne(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const res = await QuotationService.findOne(id);
            quotation.value = res;
            return res;
        } catch (e: any) {
            error.value = e?.message || "Error fetching quotation";
            console.error("[useQuotations] fetchOne error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // FETCH ALL BY CREATOR
    // ===============================
    async function fetchAllByCreator(query: any = {}) {
        loading.value = true;
        error.value = null;

        try {
            const response = await QuotationService.findAllByCreator(query);
            quotations.value = response || [];
            return response;
        } catch (e: any) {
            error.value = e?.message || "Error fetching quotations";
            console.error("[useQuotations] fetchAll error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // CREATE
    // ===============================
    async function create(data: any) {
        loading.value = true;
        error.value = null;

        try {
            const res = await QuotationService.create(data);
            return res;
        } catch (e: any) {
            error.value = e?.message || "Error creating quotation";
            console.error("[useQuotations] create error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // UPDATE
    // ===============================
    async function update(id: string, data: any) {
        loading.value = true;
        error.value = null;

        try {
            const res = await QuotationService.update(id, data);
            return res;
        } catch (e: any) {
            error.value = e?.message || "Error updating quotation";
            console.error("[useQuotations] update error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // REMOVE
    // ===============================
    async function remove(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const res = await QuotationService.remove(id);
            return res;
        } catch (e: any) {
            error.value = e?.message || "Error deleting quotation";
            console.error("[useQuotations] remove error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // RESET STATE
    // ===============================
    function reset() {
        quotations.value = [];
        quotation.value = null;
        error.value = null;
    }

    return {
        // state
        quotations,
        quotation,
        loading,
        error,

        // methods
        fetchAll,
        fetchOne,
        create,
        update,
        remove,
        reset,
    };
}
