import { z } from "zod";

// Schema cho việc tạo customer mới (không có id)
export const CreateCustomerSchema = z.object({
    name: z.string().min(1, "Họ tên bắt buộc").max(30, "Họ tên tối đa 30 ký tự"),
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải 10 số"),
    email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    adress: z.string().optional(),
    birth_day: z.string(),
    gender: z.string(),
});

// Schema cho customer từ database (có id)
export const CustomerSchema = CreateCustomerSchema.extend({
    id: z.union([z.string(), z.number()]),
    createdAt: z.date().optional(), // Nếu có
    updatedAt: z.date().optional(), // Nếu có
});

// Types
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
