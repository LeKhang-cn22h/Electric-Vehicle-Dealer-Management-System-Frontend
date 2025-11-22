export interface CreateQuoteResponse {
    quoteId: string | number;
}

export interface QuotationItemDto {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
}

export interface CreateQuotationDto {
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    createdBy: string;
    items: QuotationItemDto[];
    vatRate?: number; // mặc định 0.1 (10%)
    note?: string;
    promotionCode?: string;
}

export interface QuotationItem extends QuotationItemDto {
    id: string;
}

export interface QuotationResponse {
    id: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    createdBy: string;
    items: QuotationItem[];
    totalAmount: number;
    promotionCode?: string | null;
    discountAmount: number;
    vatRate?: number;
    note?: string;
    status: "draft" | "converted";
    createdAt: Date;
    updatedAt: Date;
}

export interface QuotationTableResponse {
    id: string;
    customerId?: string;
    customerName?: string;
    createdBy: string;
    totalAmount: number;
    status: "draft" | "converted";
    createdAt: Date;
}
