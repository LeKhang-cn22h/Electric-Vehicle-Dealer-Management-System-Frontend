import type { Customer } from "./customer.schema";
import type { ProductItem } from "./product-item.schema";
import type { Promotion } from "./promotion.schema";

// types/schemas.ts
export interface OrderDetail {
    id: number;
    customer: Customer;
    items: ProductItem[];
    promotions: Promotion[];
    payment: {
        method: "cash" | "installment";
        bankPartner?: string;
        downPayment: number;
        tenor: number;
    };
    totalAmount: number;
}
