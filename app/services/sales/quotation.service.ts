import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

let token: string | null = null;

if (process.client) {
  token = localStorage.getItem("access_token");
}

// Interceptor: tự động gắn token cho mọi request
api.interceptors.request.use((config) => {
  if (process.client) {
    const token = localStorage.getItem("access_token");
    if (token) {
      // đảm bảo headers luôn tồn tại
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const QuotationService = {
  // ===============================
  // GET ALL QUOTATIONS
  // ===============================
  async findAll(filters?: any) {
    const res = await api.get("/sales/quotations", {
      params: filters, // page, limit, sort, filter
    });
    return res.data;
  },

  async findAllByCreator(id: string) {
    const res = await api.get(`/sales/quotations/creator/${id}`);
    return res.data;
  },

  // ===============================
  // GET ONE QUOTATION
  // ===============================
  async findOne(id: string) {
    const res = await api.get(`/sales/quotations/${id}`);
    return res.data;
  },

  // ===============================
  // CREATE QUOTATION
  // ===============================
  async create(data: any) {
    const res = await api.post("/sales/quotations", data);
    return res.data;
  },

  // ===============================
  // UPDATE QUOTATION
  // ===============================
  async update(id: string, data: any) {
    const res = await api.patch(`/sales/quotations/${id}`, data);
    return res.data;
  },

  // ===============================
  // DELETE QUOTATION
  // ===============================
  async remove(id: string) {
    const res = await api.delete(`/sales/quotations/${id}`);
    return res.data;
  },
};
