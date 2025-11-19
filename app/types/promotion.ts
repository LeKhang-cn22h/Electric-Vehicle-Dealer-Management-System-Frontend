export interface Promotion {
    id: string;
    code: string;
    description?: string;

    discount_type: "percent" | "amount";
    discount_value: number;

    min_order_value?: number;
    min_quantity?: number;

    start_date: Date;
    end_date: Date | null;

    is_active: boolean;

    created_at: Date;
    updated_at: Date;
}
