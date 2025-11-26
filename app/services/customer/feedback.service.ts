import axios from "axios";
import type {
  Feedback,
  FeedbackSummary,
  FeedbackListResponse,
} from "~/types/feedback";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

// ===== DANH SÁCH ENDPOINT PUBLIC =====
const PUBLIC_ENDPOINTS: string[] = [
    // Thêm các endpoint public nếu cần
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
//      FEEDBACK SERVICE – FE
// ================================
export const FeedbackService = {

    // ---- LIST ALL (Admin) ----
    // GET /customer/feedback/all?status=...&customer_uid=...
    async findAll(params?: { status?: string; customer_uid?: string }) {
        return api.get<FeedbackSummary[]>("/customer/feedback/all", { params });
    },

    // ---- LIST USER (Customer) ----
    // GET /customer/feedback/allU
    async findAllUser() {
        return api.get<FeedbackSummary[]>("/customer/feedback/allU");
    },

    // ---- DETAIL ----
    // GET /customer/feedback/:id
    async findOne(id: number) {
        return api.get<Feedback>(`/customer/feedback/${id}`);
    },

    // ---- GET BY CUSTOMER UID ----
    // GET /customer/customer/:customer_uid/feedbacks
    async getFeedbacksByCustomer(uid: string) {
        return api.get<FeedbackSummary[]>(`/customer/customer/${uid}/feedbacks`);
    },

    // ---- CREATE ----
    // POST /customer/feedback
    async createFeedback(data: any) {
        return api.post<Feedback>("/customer/feedback", data);
    },

    // ---- UPDATE ----
    // PUT /customer/feedback/:id (nếu backend có endpoint này)
    // Hoặc có thể dùng reply endpoint để update
    async updateFeedback(id: number, data: any) {
        return api.put<Feedback>(`/customer/feedback/${id}`, data);
    },

    // ---- REPLY ----
    // PUT /customer/feedback/:id/reply
    async replyFeedback(id: number, data: any) {
        return api.put<Feedback>(`/customer/feedback/${id}/reply`, data);
    },

    // ---- DELETE (Soft Delete) ----
    // PUT /customer/deletefeedback/:id
    async deleteFeedback(id: number) {
        return api.put<Feedback>(`/customer/deletefeedback/${id}`);
    },
};