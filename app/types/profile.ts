import { z } from 'zod';

// ===== EXISTING TYPES =====
export interface Profile {
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
}

export interface CustomerSummary {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  birth_day?: string;
  gender?: string;
  adress?: string;
  status?: boolean;
  uid?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ===== ZOD SCHEMAS =====

// Schema cho Create Customer
export const CreateCustomerSchema = z.object({
  name: z.string()
    .min(1, "Tên không được để trống")
    .max(100, "Tên không được quá 100 ký tự")
    .trim(),
  
  email: z.string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không được quá 11 số"),
  
  birth_day: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD")
    .optional()
    .or(z.literal('')),
  
  // ✅ SỬA: Dùng z.enum với message đơn giản
  gender: z.enum(['Nam', 'Nữ', 'Khác'], {
    message: "Giới tính phải là Nam, Nữ hoặc Khác"
  }).optional(),
  
  adress: z.string()
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .optional()
    .or(z.literal('')),
});

// Schema cho Update Customer (tất cả field đều optional)
export const UpdateCustomerSchema = z.object({
  name: z.string()
    .min(1, "Tên không được để trống")
    .max(100, "Tên không được quá 100 ký tự")
    .trim()
    .optional(),
  
  email: z.string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .optional()
    .or(z.literal('')),
  
  birth_day: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD")
    .optional()
    .or(z.literal('')),
  
  // ✅ SỬA: Dùng z.enum với message đơn giản
  gender: z.enum(['Nam', 'Nữ', 'Khác'], {
    message: "Giới tính phải là Nam, Nữ hoặc Khác"
  }).optional(),
  
  adress: z.string()
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .optional()
    .or(z.literal('')),
  
  status: z.boolean().optional(),
});

// ✅ SỬA: Schema cho toggle status
export const ToggleStatusSchema = z.object({
  status: z.boolean({
    message: "Trạng thái phải là true hoặc false"
  })
});

// Export inferred types
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
export type ToggleStatusInput = z.infer<typeof ToggleStatusSchema>;

// ... existing types
export interface CustomerListResponse {
  data: CustomerSummary[];
  nextCursor: number | null;
}

export interface CustomerSearchResponse {
  customer: Customer | null;
  message: string;
}

export interface AutoLinkPayload {
  email?: string | null;
  phone?: string | null;
  uid: string;
}

export interface AutoLinkResponse {
  [x: string]: any;
  success: boolean;
  customer?: CustomerSummary | null;
  message: string;
}

export interface Feedback {
  id: number;
  customer_uid: string;
  content: string;
  status?: string;
  reply?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeedbackListResponse {
  data: Feedback[];
  nextCursor: number | null;
}