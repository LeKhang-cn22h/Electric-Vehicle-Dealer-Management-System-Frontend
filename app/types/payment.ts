type PaymentMethod = "cash" | "bank_transfer" | "installment";
type PaymentStatus = "unpaid" | "paid" | "partial";
export interface Payment {
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  bank: string;
  term: number;
  downPayment: number;
}
