import { z } from "zod";

export const ProductItemSchema = z.object({
    id: z.union([z.string(), z.number()]), // chấp nhận cả string hoặc number
    name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
    skuCode: z.string().min(1, "Mã SKU là bắt buộc"),
    // Mảng màu hợp lệ (ít nhất 1 phần tử, mỗi phần tử là string)
    color: z.string().min(1, "Phải có ít nhất một màu"),
    // Giá phải là số dương
    unitPrice: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
    quantity: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
});

// Types
export type ProductItem = z.infer<typeof ProductItemSchema>;
