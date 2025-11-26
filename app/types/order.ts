import type { Detail } from "~/schemas";

export interface Order {
  id: string;
  quotationId?: string;
  createdBy: string;

  totalAmount: number;
  total_amount: number;

  paymentMethod: "cash" | "bank_transfer" | "installment";
  paymentStatus: "unpaid" | "paid";
  paymentAmount: number;

  bank: string;
  term: number;
  downPayment: number;
  down_payment: number;

  status: "pending" | "confirmed" | "delivering" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  invoice_id?: string;
}

export interface OrderTable {
  id: string;
  createdBy: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "delivering" | "completed" | "cancelled";
  paymentAmount: number;
  downPayment: number;
  paymentStatus: "unpaid" | "paid" | "partial";
  createdAt: Date;
  invoice_id?: string | null;
}

export interface OrderDetailnotId extends Detail {
  createdBy: string;

  paymentMethod: "cash" | "bank_transfer" | "installment";
  paymentStatus: "unpaid" | "paid" | "partial";
  paymentAmount: number;

  bank: string;
  term: number;
  downPayment: number;

  status: "pending" | "confirmed" | "delivering" | "completed" | "cancelled";
  invoice_id?: string | null;
}
export interface OrderDetail extends OrderDetailnotId {
  id: string;
  invoice_id?: string | null;
}
