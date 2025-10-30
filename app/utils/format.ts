export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
};

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
