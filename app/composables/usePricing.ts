import { ref } from "vue";
import { PricingService } from "~/services/sales/pricing.service";
import type { Pricing } from "~/types/pricing";

export function usePricing() {
    const pricings = ref<Pricing[]>([]);
    const pricing = ref<Pricing | null>(null);

    const loading = ref(false);
    const error = ref<string | null>(null);

    // ===============================
    // FETCH ALL
    // ===============================
    async function fetchAll() {
        loading.value = true;
        error.value = null;
        try {
            const response = await PricingService.findAll();
            pricings.value = response || [];
            return response;
        } catch (e: any) {
            error.value = e.message || "Error fetching pricings";
            console.error("[usePricings] fetchAll error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    // ===============================
    // FETCH ONE
    // ===============================
    const fetchOne = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await PricingService.findOne(id);
            pricing.value = res;
            return res;
        } catch (e: any) {
            error.value = e.message || "Error fetching pricing";
            console.error("[usePricings] fetchOne error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // CREATE
    // ===============================
    const create = async (data: any) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await PricingService.create(data);
            console.log("[usePricings] Created:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error creating pricing";
            console.error("[usePricings] create error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // UPDATE
    // ===============================
    const update = async (id: string, data: any) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await PricingService.update(id, data);
            console.log("[usePricings] Updated:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error updating pricing";
            console.error("[usePricings] update error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // REMOVE
    // ===============================
    const remove = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await PricingService.remove(id);
            console.log("[usePricings] Removed:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error removing pricing";
            console.error("[usePricings] remove error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // RESET STATE
    // ===============================
    const reset = () => {
        pricings.value = [];
        pricing.value = null;
        error.value = null;
    };

    return {
        // state
        pricings,
        pricing,
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
