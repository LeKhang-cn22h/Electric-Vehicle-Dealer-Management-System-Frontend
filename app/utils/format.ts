import type { CatalogProduct, ProductItem } from "@/schemas";
import { useNotification } from "@/composables/useNotification";

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("vi-VN");
}


export function toProductItem(product: CatalogProduct): ProductItem {
    return {
        id: product.id,
        productName: product.name,
        skuCode: product.sku,
        color: product.colors[0] ?? "Không xác định màu",
        unitPrice: product.price,
        quantity: 1,
    };
}

export function notiSuccess(message: string): void {
    const { showNotification } = useNotification();
    showNotification(message, "success");
}

export function notiFail(message: string): void {
    const { showNotification } = useNotification();
    showNotification(message, "fail");
}
