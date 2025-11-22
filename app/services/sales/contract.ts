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

export const ContractService = {
    // ===============================
    // GET ALL CONTRACTS
    // ===============================
    async findAll(filters?: any) {
        const res = await api.get("/sales/contracts", { params: filters });
        return res.data;
    },

    // ===============================
    // GET ONE CONTRACT
    // ===============================
    async findOne(id: string) {
        const res = await api.get(`/sales/contracts/${id}`);
        return res.data;
    },

    // ===============================
    // CREATE CONTRACT
    // ===============================
    async create(data: any) {
        const res = await api.post("/sales/contracts", data);
        return res.data;
    },

    // ===============================
    // UPDATE CONTRACT
    // ===============================
    async update(id: string, data: any) {
        const res = await api.patch(`/sales/contracts/${id}`, data);
        return res.data;
    },

    // ===============================
    // DELETE CONTRACT
    // ===============================
    async remove(id: string) {
        const res = await api.delete(`/sales/contracts/${id}`);
        return res.data;
    },
};
