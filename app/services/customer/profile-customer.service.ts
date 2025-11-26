import axios from "axios";
import type {
  CustomerSummary,
  CustomerListResponse,
  AutoLinkPayload,
  AutoLinkResponse,
} from "~/types/profile";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

// ===== DANH SÁCH ENDPOINT PUBLIC =====
const PUBLIC_ENDPOINTS = [
    "POST:/customer/auto-link",
];

// ===== INTERCEPTOR =====
api.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase();
    const url = config.url;
    const key = `${method}:${url}`;

    if (!PUBLIC_ENDPOINTS.includes(key)) {
        const token = localStorage.getItem("access_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================================
//      CUSTOMER SERVICE – FE
// ================================
export const CustomerService = {

    // ---- LIST ----
    async findAll() {
    return api.get<CustomerSummary[]>("/customer");
},


    // ---- DETAIL ----
    async findOne(id: number) {
        return api.get<CustomerSummary>(`/customer/${id}`);
    },

    // ---- CRUD ----
    async createProfile(data: any) {
        return api.post("/customer", data);
    },

    async updateProfile(id: number, data: any) {
        return api.put(`/customer/${id}`, data);
    },

    async deleteProfile(id: number) {
        return api.put(`/customer/delete/${id}`);
    },

    // ---- AUTO LINK ----
    async autoLinkProfile(payload: AutoLinkPayload) {
        return api.post<AutoLinkResponse>("/customer/auto-link", payload);
    },
};
