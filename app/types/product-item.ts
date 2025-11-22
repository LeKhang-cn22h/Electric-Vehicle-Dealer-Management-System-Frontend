import type { VehicleImage } from "./vehicle";

export interface ProductItem {
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
