import type { ProductItem, ProductItemDetail } from "~/types/product-item";
import type { Customer } from "./customer.schema";
import type { Promotion } from "~/types/promotion";
// import type { ProductItem } from "./product-item.schema";
// import type { Promotion } from "./promotion.schema";

// types/schemas.ts

export interface Detail {
    customer: Customer;
    vehicles: ProductItemDetail[];
    items: ProductItem[];
    promotions: Promotion[];
    totalAmount: number;

    discountAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface QuoteDetail extends Detail {
    id: string;
    createdBy: string;
    note: string;
    status: "draft" | "converted";
}
