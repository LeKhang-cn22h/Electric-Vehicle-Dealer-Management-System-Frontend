export interface VehicleUnit {
  id: number;
  vehicle_id: number;
  vin: string;
  color: string;
  status: string;
  warehouse_id?: number | null;
  vehicle?: {
    id: number;
    name: string;
    model: string;
    version?: string;
    year?: number;
  };
}
export interface VehicleGroupUnits {
  vehicleUnit_id: number;
  vin: string;
  color: string;
  status: string;
  warehouse_id?: number | null;
}

export interface CreateVehicleUnitDto {
  vehicle_id: number;
  vin: string;
  color: string;
  status?: string;
}

export interface UpdateVehicleUnitDto {
  vin?: string;
  color?: string;
  status?: string;
  warehouse_id?: number | null;
}

export interface DeployToWarehouseDto {
  vehicle_unit_ids: number[];
  warehouse_id: number;
}

export interface DeployMultipleUnitsDto {
  vehicle_id: number;
  warehouse_id: number;
  quantity: number;
}

export interface FilterVehicleUnitsParams {
  vehicle_id?: number;
  status?: string;
  warehouse_id?: number;
}