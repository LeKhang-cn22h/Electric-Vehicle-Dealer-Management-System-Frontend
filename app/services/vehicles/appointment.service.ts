import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/vehicle",
});

// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use((config) => {
  const publicUrls = [
    "/appointments/test-drive-slots/customer"
  ];

  const isPublic = publicUrls.some(url => config.url?.startsWith(url));

  if (!isPublic) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});


export const appointmentsService = {
  // ===============================
  // ADMIN — GET ALL
  // ===============================
  async findAllAC() {
    const res = await api.get("/appointments/all");
    return res.data;
  },

  // ===============================
  // CUSTOMER — GET HISTORY
  // ===============================
  async findHistoryCustomer() {
    const res = await api.get("/appointments/history/customer");
    return res.data;
  },

  // ===============================
  // GET ONE APPOINTMENT
  // ===============================
  async findOneAC(id: number) {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  // ===============================
  // CREATE APPOINTMENT (JSON)
  // ===============================
  async createAC(data: any) {
    const res = await api.post("/appointments", data);
    return res.data;
  },

  // ===============================
  // UPDATE APPOINTMENT
  // ===============================
  async update(id: number, data:any ) {
    const res = await api.put(`/appointments/${id}`, data);
    return res.data;
  },

  // ===============================
  // DELETE
  // ===============================
  async remove(id: number) {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  },  

  // ===============================
  // TEST DRIVE SLOTS
  // ===============================

  // khách xem slot
  async getSlotsCustomer() {
    const res = await api.get("/appointments/test-drive-slots/customer");
    return res.data;
  },

  // admin xem tất cả slot
  async getSlotsAdmin() {
    const res = await api.get("/test-drive-slots/admin");
    return res.data;
  },

  // admin tạo slot
  async createSlot(data: any) {
    const res = await api.post("/test-drive-slots", data);
    return res.data;
  },

  // xem chi tiết 1 slot
  async getSlot(id: number) {
    const res = await api.get(`/test-drive-slots/${id}`);
    return res.data;
  },

  // cập nhật slot
  async updateSlot(id: number, data:any) {
    const res = await api.put(`/test-drive-slots/${id}`, data);
    return res.data;
  },

  //mở lại slot
  async reopenSlot(id:number) {
    const res = await api.patch(`/test-drive-slots/${id}/reopen`);
    return res.data;
  },

  // xóa slot
  async removeSlot(id:number) {
    const res = await api.delete(`/test-drive-slots/${id}`);
    return res.data;
  },
};
