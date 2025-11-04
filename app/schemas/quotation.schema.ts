import type { Customer } from "./customer.schema";
import type { ProductItem } from "./product-item.schema";
import type { Promotion } from "./promotion.schema";

// types/schemas.ts
export interface QuoteDetail {
    id: number;
    customer: Customer;
    items: ProductItem[];
    promotions: Promotion[];
    totalAmount: number;
}
