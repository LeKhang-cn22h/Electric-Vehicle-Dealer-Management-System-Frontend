export interface CreateQuoteResponse {
    quoteId: string | number;
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

export interface QuotationResponse {
    id: string;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    createdBy: string;
    items: QuotationItem[];
    totalAmount: number;
    promotionCode?: string | null;
    discountAmount: number;
    note?: string;
    status: "draft" | "converted";
    createdAt: Date;
    updatedAt: Date;
}
