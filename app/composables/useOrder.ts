import { ref } from "vue";
import type { OrderDetail } from "~/schemas";
import { OrderService } from "~/services/sales/order.service";
import type { Order, OrderTable } from "~/types";

export function useOrders() {
    const orders = ref<OrderTable[]>([]);
    const order = ref<OrderDetail | null>(null);

    const loading = ref(false);
    const error = ref<string | null>(null);

    // ===============================
    // FETCH ALL
    // ===============================
    async function fetchAll(filters?: any) {
        loading.value = true;
        error.value = null;
        try {
            const response = await OrderService.findAll(filters);
            orders.value = response || [];
            return response;
        } catch (e: any) {
            error.value = e.message || "Error fetching orders";
            console.error("[useOrders] fetchAll error:", e);
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
            const res = await OrderService.findOne(id);
            order.value = res;
            return res;
        } catch (e: any) {
            error.value = e.message || "Error fetching order";
            console.error("[useOrders] fetchOne error:", e);
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
            const res = await OrderService.create(data);
            console.log("[useOrders] Created:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error creating order";
            console.error("[useOrders] create error:", e);
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
            const res = await OrderService.update(id, data);
            console.log("[useOrders] Updated:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error updating order";
            console.error("[useOrders] update error:", e);
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
            const res = await OrderService.remove(id);
            console.log("[useOrders] Removed:", res);
            return res;
        } catch (e: any) {
            error.value = e.message || "Error removing order";
            console.error("[useOrders] remove error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ===============================
    // RESET STATE
    // ===============================
    const reset = () => {
        orders.value = [];
        order.value = null;
        error.value = null;
    };

    return {
        // state
        orders,
        order,
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
