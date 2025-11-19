import { ref } from "vue";
import { PromotionService } from "~/services/sales/pricing-promotion.service";
import type { Promotion } from "~/types/promotion";

export function usePromotions() {
    const promotions = ref<Promotion[]>([]);
    const promotion = ref<Promotion | null>(null);

    const loading = ref(false);
    const error = ref<string | null>(null);

    // ===============================
    // FETCH ALL
    // ===============================
    async function fetchAll() {
        loading.value = true;
        error.value = null;
        try {
            const response = await PromotionService.findAll();
            console.log("fetch all1", response);
            promotions.value = response || [];
            console.log("fetch all2", JSON.parse(JSON.stringify(promotions.value)));
            return response;
        } catch (e: any) {
            error.value = e.message || "Error fetching promotions";
            console.error("[usePromotions] fetchAll error:", e);
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
            const res = await PromotionService.findOne(id);
            promotion.value = res;
            return res;
        } catch (e: any) {
            error.value = e.message || "Error fetching promotion";
            console.error("[usePromotions] fetchOne error:", e);
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
            const res = await PromotionService.create(data);
            console.log("[usePromotions] Created:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error creating promotion";
            console.error("[usePromotions] create error:", e);
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
            const res = await PromotionService.update(id, data);
            console.log("[usePromotions] Updated:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error updating promotion";
            console.error("[usePromotions] update error:", e);
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
            const res = await PromotionService.remove(id);
            console.log("[usePromotions] Removed:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error removing promotion";
            console.error("[usePromotions] remove error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // RESET STATE
    // ===============================
    const reset = () => {
        promotions.value = [];
        promotion.value = null;
        error.value = null;
    };

    return {
        // state
        promotions,
        promotion,
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
