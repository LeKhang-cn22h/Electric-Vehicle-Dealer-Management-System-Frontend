import type { CatalogProduct, ProductItem } from "@/schemas";
import { useNotification } from "@/composables/useNotification";

export function formatCurrency(value: number = 0): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
}

export function formatDate(date: Date | string | null | undefined): string {
    console.log(date);
    if (!date) return "Không xác định";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Không xác định"; // kiểm tra xem có phải date hợp lệ không

    const day = d.getUTCDate().toString().padStart(2, "0");
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = d.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

export function toDateOnly(dateStr: string) {
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function notiSuccess(message: string): void {
    const { showNotification } = useNotification();
    showNotification(message, "success");
}

export function notiFail(message: string): void {
    const { showNotification } = useNotification();
    showNotification(message, "fail");
}
