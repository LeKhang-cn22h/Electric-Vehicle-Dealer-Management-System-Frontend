type PaymentMethod = "cash" | "bank_transfer";
type PaymentStatus = "unpaid" | "paid" | "partial";
export interface Payment {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentAmount: number;
    bank: string;
    term: number;
    downPayment: number;
}
