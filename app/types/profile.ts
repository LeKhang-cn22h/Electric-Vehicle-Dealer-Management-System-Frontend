// =========================
// TYPES / PROFILE.TS – FE
// =========================
export interface Profile {
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
}

// ==== PROFILE / CUSTOMER SUMMARY ====
export interface CustomerSummary {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

// ==== FULL CUSTOMER ====
export interface Customer {
  id: number; // int8 PK
  name: string;
  email?: string;
  phone?: string;

  // Thông tin phụ
  dob?: string; // 👈 bạn đang dùng dob ở đây, cứ để vậy
  gender?: string;
  address?: string;

  // Liên kết Supabase Auth
  account_uid?: string | null;

  created_at?: string;
  updated_at?: string;
}

// 👇 THÊM ĐOẠN NÀY
export interface CreateCustomer {
  name: string;
  email?: string;
  phone: string;
  birth_day?: string;
  gender?: string;
  address?: string;
}

// ==== DANH SÁCH KHÁCH HÀNG ====
export interface CustomerListResponse {
  data: CustomerSummary[];
  nextCursor: number | null;
}

// ==== DANH SÁCH KHÁCH HÀNG ====
export interface CustomerListResponse {
  data: CustomerSummary[];
  nextCursor: number | null;
}

// ==== CUSTOMER SEARCH RESPONSE ====
export interface CustomerSearchResponse {
  customer: Customer | null;
  message: string;
}

// ==== AUTO LINK HỒ SƠ ====
export interface AutoLinkPayload {
  email?: string | null;
  phone?: string | null;
  uid: string; // Supabase Auth UID
}

export interface AutoLinkResponse {
  success: boolean;
  customer?: CustomerSummary | null;
  message: string;
}

// ==== FEEDBACK ====
// Feedback của khách hàng
export interface Feedback {
  id: number;
  customer_uid: string; // liên kết với account_uid
  content: string;
  status?: string; // ví dụ: pending / replied / closed
  reply?: string; // phản hồi từ admin
  created_at?: string;
  updated_at?: string;
}

// Danh sách feedback
export interface FeedbackListResponse {
  data: Feedback[];
  nextCursor: number | null;
}
