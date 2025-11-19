import axios from "axios";
import { ofetch } from "ofetch";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

export type VehicleSummary = {
    id: number;
    name: string;
    model: string;
    version: string;
    imageUrl: string;
};
// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use((config) => {
    // Chỉ GET /vehicle mới không cần token
    const isPublicGetVehicle = config.method === "get" && config.url?.startsWith("/vehicle");

    if (!isPublicGetVehicle) {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export const VehicleService = {
    // ===============================
    // 📌 GET ALL (Public)
    // ===============================
    async findAll(filters?: any) {
        const res = await api.get("/vehicle", {
            params: filters, // keyword, model, status, minPrice, maxPrice, cursor, limit
        });
        return res.data;
    },

    // ===============================
    // 📌 SEARCH ALL (Public)
    // ===============================
    async searchAll(keyword: string, cursor?: number, limit: number = 20) {
        const res = await api.get("/vehicle/search", {
            params: { keyword, cursor, limit },
        });
        return res.data;
    },

    // ===============================
    // 📌 FILTER BY MODEL (Public)
    // ===============================
    async filterByModel(model: string, cursor?: number, limit: number = 20) {
        const res = await api.get("/vehicle/filter/model", {
            params: { model, cursor, limit },
        });
        return res.data;
    },

    // ===============================
    // 📌 GET ALL MODELS (Public)
    // ===============================
    async getAllModels() {
        const res = await api.get("/vehicle/models");
        return res.data;
    },

    // ===============================
    // 📌 GET ONE (Public)
    // ===============================
    async getOne(id: number) {
        const res = await api.get(`/vehicle/${id}`);
        return res.data;
    },

    // ===============================
    // 🔒 CREATE (Auth)
    // ===============================
    async create(vehicleData: any, images: File[]) {
        const formData = new FormData();
        formData.append("vehicle", JSON.stringify(vehicleData));
        images.forEach((file) => formData.append("images", file));

        const res = await api.post("/vehicle", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    },

    // ===============================
    // 🔒 UPDATE (Auth)
    // ===============================
    async update(id: number, vehicleData: any, images?: File[]) {
        const formData = new FormData();
        formData.append("vehicle", JSON.stringify(vehicleData));

        if (images && images.length > 0) {
            images.forEach((file) => formData.append("images", file));
        }

        const res = await api.put(`/vehicle/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    },

    // ===============================
    // 🔒 DELETE (Auth)
    // ===============================
    async remove(id: number) {
        const res = await api.delete(`/vehicle/${id}`);
        return res.data;
    },

    // ===============================
    // 📌 RECOMMEND SIMILAR (Public)
    // ===============================
    async recommendSimilar(model: string, limit: number = 6) {
        const res = await api.get("/vehicle/recommend/similar", {
            params: { model, limit },
        });
        return res.data;
    },

    // ===============================
    // 📌 RECOMMEND BY PRICE RANGE (Public)
    // ===============================
    async recommendByPrice(min: number, max: number, limit: number = 6) {
        const res = await api.get("/vehicle/recommend/price-range", {
            params: { min, max, limit },
        });
        return res.data;
    },

    // ===============================
    // 📌 COMPARE VEHICLES (Public)
    // ===============================
    async compare(ids: number[]) {
        const res = await api.post("/vehicle/compare", { vehicleIds: ids });
        return res.data;
    },

    async getNewArrivals(limit = 8): Promise<VehicleSummary[]> {
        const res = await api.get<VehicleSummary[]>("/vehicle/new-arrivals", {
            params: { limit },
        });

        return res.data;
    },

    async getSimilarVehicles(id: string, limit: number = 10) {
        const res = await api.get(`/vehicle/${id}/similar`, {
            params: { limit },
        });
        return res.data;
    },
};
