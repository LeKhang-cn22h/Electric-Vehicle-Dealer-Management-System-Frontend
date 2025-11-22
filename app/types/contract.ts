import type { Order, OrderDetailnotId } from "./order";

export interface Contract {
    id: string;
    contractNumber: string;
    orderId: string;
    dealerId: string;
    description?: string;
    contractValue: number;
    startDate: Date;
    endDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ContractDetail extends OrderDetailnotId {
    id: string;
    order: Order;
    createdBy: string;
    startDate: Date;
    endDate?: Date | null;
}
