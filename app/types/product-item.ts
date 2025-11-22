import type { VehicleImage } from "./vehicle";

export interface ProductItemDetail {
    id: number;
    name: string;
    status?: string;
    year?: number;
    quantity?: number;
    mileage?: string;
    transmission?: string;
    model?: string;
    images?: VehicleImage[];
    price?: number;
}

export interface ProductItem {
    id: number;
    quotation_id: string;
    quantity?: number;
    unit_price: number;
    create_at: string;
    product_id: number;
}
