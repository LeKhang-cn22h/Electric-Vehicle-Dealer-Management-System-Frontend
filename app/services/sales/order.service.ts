import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
});

// Gắn token cho mọi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const OrderService = {
    // ===============================
    // GET ALL ORDERS
    // ===============================
    async findAll(filters?: any) {
        const res = await api.post("/sales/orders", filters);
        console.log(res.data);
        return res.data;
    },

    // ===============================
    // GET ONE ORDER
    // ===============================
    async findOne(id: string) {
        const res = await api.get(`/sales/orders/${id}`);
        return res.data;
    },

    // ===============================
    // CREATE ORDER
    // ===============================
    async create(data: any) {
        const res = await api.post("/sales/orders/create", data);
        return res.data;
    },

    // ===============================
    // UPDATE ORDER
    // ===============================
    async update(id: string, data: any) {
        const res = await api.patch(`/sales/orders/${id}`, data);
        return res.data;
    },

    // ===============================
    // DELETE ORDER
    // ===============================
    async remove(id: string) {
        const res = await api.delete(`/sales/orders/${id}`);
        return res.data;
    },
};
