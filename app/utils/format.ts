export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
};
