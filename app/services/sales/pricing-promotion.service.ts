import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
});

// Interceptor: tự động gắn token cho mọi request
api.interceptors.request.use((config) => {
    // Chỉ GET /vehicle mới không cần token
    const isPublicGetVehicle = config.method === "get";

    if (!isPublicGetVehicle) {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export const PromotionService = {
    // ===============================
    // GET ALL PROMOTIONS
    // ===============================
    async findAll() {
        const res = await api.get("/sales/promotions");
        console.log(res.data);
        return res.data;
    },

    // ===============================
    // GET ONE PROMOTION
    // ===============================
    async findOne(id: string) {
        const res = await api.get(`/sales/promotions/${id}`);
        return res.data;
    },

    async findAllApplied(minOrderValue = 0, minQuantity = 0) {
        const res = await api.get("/sales/promotions/aplied", {
            params: {
                minOrderValue,
                minQuantity,
            },
        });

        return res.data;
    },

    // ===============================
    // CREATE PROMOTION
    // ===============================
    async create(data: any) {
        const res = await api.post("/sales/promotions", data);
        return res.data;
    },

    // ===============================
    // UPDATE PROMOTION
    // ===============================
    async update(id: string, data: any) {
        const res = await api.patch(`/sales/promotions/${id}`, data);
        return res.data;
    },

    // ===============================
    // DELETE PROMOTION
    // ===============================
    async remove(id: string) {
        const res = await api.delete(`/sales/promotions/${id}`);
        return res.data;
    },
};
