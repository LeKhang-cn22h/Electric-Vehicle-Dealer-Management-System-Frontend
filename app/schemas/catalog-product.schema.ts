import { z } from "zod";
// Schema cho việc tạo customer mới (không có id)
export const CatalogProductSchema = z.object({
    id: z.union([z.string(), z.number()]), // chấp nhận cả string hoặc number
    name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
    sku: z.string().min(1, "Mã SKU là bắt buộc"),
    brand: z.string().min(1, "Thương hiệu là bắt buộc"),
    category: z.string().min(1, "Danh mục là bắt buộc"),

    // Mảng màu hợp lệ (ít nhất 1 phần tử, mỗi phần tử là string)
    colors: z.array(z.string().min(1)).nonempty("Phải có ít nhất một màu"),

    // Giá phải là số dương
    price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),

    // Còn hàng hay không
    inStock: z.boolean(),
});

// Types
export type CatalogProduct = z.infer<typeof CatalogProductSchema>;
