import type { ProductItem, ProductItemDetail } from "~/types/product-item";
import type { Customer } from "./customer.schema";
import type { Promotion } from "~/types/promotion";

// types/schemas.ts
export interface OrderDetail {
  id: number;
  customer: Customer;
  items: ProductItem[];
  vehicles: ProductItemDetail[];
  promotions: Promotion[];
  payment_method: "cash" | "bank_transfer";
  payment_status: "unpaid" | "paid" | "partial";
  payment_amount: number;
  bank?: string;
  term?: number;
  down_payment: number;
  total_amount: number;
  status: "pending" | "confirmed" | "delivering" | "completed" | "cancelled";
}
