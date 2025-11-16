// types/vehicle.ts
export interface VehicleImage {
    id: number;
    car_id: number;
    path: string;
    is_main: boolean;
    imageUrl: string;
}

export interface VehicleBenefit {
    id: number;
    car_id: number;
    benefit: string;
}

export interface VehicleFeature {
    id: number;
    car_id: number;
    category: string;
    item: string;
}

export interface Vehicle {
    id: number;
    name: string;
    status?: string;
    tagline?: string;
    year?: number;
    mileage?: string;
    fuel_type?: string;
    transmission?: string;
    color?: string[];
    engine?: string;
    seats?: number;
    origin?: string;
    description?: string;
    model?: string;
    version?: string;
    images?: VehicleImage[];
    benefits?: VehicleBenefit[];
    features?: VehicleFeature[];
    created_at?: string;
    updated_at?: string;
}

export interface VehicleListResponse {
    data: Array<{
        id: number;
        name: string;
        status: string;
        imageUrl: string;
    }>;
    nextCursor: number | null;
}