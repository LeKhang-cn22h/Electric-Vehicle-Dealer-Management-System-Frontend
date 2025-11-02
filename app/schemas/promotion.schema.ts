import { z } from "zod";

const dateSchema = z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date());

export const PromotionSchema = z.object({
    promo_id: z.union([z.string(), z.number()]), // chấp nhận cả string hoặc number
    name: z.string().min(1, "Tên mã gg là bắt buộc"),
    promo_type: z.string().min(1, "Kiểu mã gg là bắt buộc"),
    conditions: z.string().min(1, "Điều kiện áp dụng là bắt buộc"),
    // Giá phải là số dương
    discountAmount: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
    valid_from: dateSchema,
    valid_to: dateSchema,
});

// Types
export type Promotion = z.infer<typeof PromotionSchema>;
