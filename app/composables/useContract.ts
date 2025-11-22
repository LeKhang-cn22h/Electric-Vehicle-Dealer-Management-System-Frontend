import { ref } from "vue";
import { ContractService } from "~/services/sales/contract";
import type { Contract, ContractDetail } from "~/types/contract";

export function useContract() {
    const contracts = ref<Contract[]>([]);
    const contract = ref<ContractDetail | null>(null);

    const loading = ref(false);
    const error = ref<string | null>(null);

    // ===============================
    // FETCH ALL
    // ===============================
    const fetchAll = async (filters?: any) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await ContractService.findAll(filters);
            contracts.value = res || [];
            return res;
        } catch (e: any) {
            error.value = e.message || "Error fetching contracts";
            console.error("[useContracts] fetchAll error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // FETCH ONE
    // ===============================
    const fetchOne = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await ContractService.findOne(id);
            contract.value = res;
            return res;
        } catch (e: any) {
            error.value = e.message || "Error fetching contract";
            console.error("[useContracts] fetchOne error:", e);
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
            const res = await ContractService.create(data);
            console.log("[useContracts] Created:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error creating contract";
            console.error("[useContracts] create error:", e);
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
            const res = await ContractService.update(id, data);
            console.log("[useContracts] Updated:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error updating contract";
            console.error("[useContracts] update error:", e);
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
            const res = await ContractService.remove(id);
            console.log("[useContracts] Removed:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error removing contract";
            console.error("[useContracts] remove error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // RESET STATE
    // ===============================
    const reset = () => {
        contracts.value = [];
        contract.value = null;
        error.value = null;
    };

    return {
        // state
        contracts,
        contract,
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
