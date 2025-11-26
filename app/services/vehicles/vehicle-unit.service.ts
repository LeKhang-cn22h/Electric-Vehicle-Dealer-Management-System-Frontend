import axios from "axios";
import type { VehicleUnit, CreateVehicleUnitDto, UpdateVehicleUnitDto, DeployMultipleUnitsDto, DeployToWarehouseDto, FilterVehicleUnitsParams } from "~/types/vehicle_unit";
const api = axios.create({
  baseURL: "http://localhost:4000/api/vehicle",
});

// Interceptor để tự động thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// VEHICLE UNIT SERVICE
// ============================================

export const VehicleUnitService = {
  // ===============================
  //  CREATE VEHICLE UNIT
  // ===============================
  async create(dto: CreateVehicleUnitDto) {
    const res = await api.post("/units", dto);
    return res.data;
  },

  // ===============================
  //  GET ALL UNITS (with filters)
  // ===============================
  async getAll(filters?: FilterVehicleUnitsParams) {
    const params = new URLSearchParams();
    
    if (filters?.vehicle_id) {
      params.append("vehicle_id", filters.vehicle_id.toString());
    }
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.warehouse_id !== undefined) {
      params.append("warehouse_id", filters.warehouse_id.toString());
    }

    const queryString = params.toString();
    const url = `/units${queryString ? "?" + queryString : ""}`;
    
    const res = await api.get(url);
    return res.data;
  },

  // ===============================
  //  GET ONE UNIT BY ID
  // ===============================
  async getById(id: number) {
    const res = await api.get(`/units/${id}`);
    return res.data;
  },

  async getGroupUnits(id: number) {
    const res = await api.get(`/units/group/${id}`);
    return res.data;
  },

  // ===============================
  //  GET ONE UNIT BY VIN
  // ===============================
  async getByVIN(vin: string) {
    const res = await api.get(`/units/vin/${vin}`);
    return res.data;
  },

  // ===============================
  //  UPDATE UNIT
  // ===============================
  async update(id: number, dto: UpdateVehicleUnitDto) {
    const res = await api.put(`/units/${id}`, dto);
    return res.data;
  },

  // ===============================
  //  DELETE UNIT
  // ===============================
  async delete(id: number) {
    const res = await api.delete(`/units/${id}`);
    return res.data;
  },

  // ===============================
  //  COUNT UNDEPLOYED UNITS
  // ===============================
  async countUndeployed(vehicleId: number) {
    const res = await api.get(`/units/count/undeployed/${vehicleId}`);
    return res.data;
  },

  // ===============================
  //  COUNT UNALLOCATED UNITS
  // ===============================
  async countUnallocated(vehicleId: number) {
    const res = await api.get(`/units/count/unallocated/${vehicleId}`);
    return res.data;
  },

  // ===============================
  //  DEPLOY SINGLE UNIT
  // ===============================
  async deploySingle(unitId: number, warehouseId: number) {
    const res = await api.patch("/units/deploy/single", {
      unit_id: unitId,
      warehouse_id: warehouseId,
    });
    return res.data;
  },

  // ===============================
  //  DEPLOY MULTIPLE UNITS
  // ===============================
  async deployMultiple(dto: DeployMultipleUnitsDto) {
    const res = await api.patch("/units/deploy/multiple", dto);
    return res.data;
  },

  // ===============================
  //  DEPLOY BATCH UNITS
  // ===============================
  async deployBatch(dto: DeployToWarehouseDto) {
    const res = await api.patch("/units/deploy/batch", dto);
    return res.data;
  },

  // ===============================
  //  PAY VEHICLE
  // ===============================
  async pay(vin: string) {
    const res = await api.patch("/units/pay", { vin });
    return res.data;
  },

  // ===============================
  //  RESERVE VEHICLE
  // ===============================
  async reserve(unitId: number) {
    const res = await api.post("/units/reserve", { unit_id: unitId });
    return res.data;
  },

  // ===============================
  //  CANCEL RESERVATION
  // ===============================
  async cancelReservation(unitId: number) {
    const res = await api.post(`/units/${unitId}/cancel-reservation`);
    return res.data;
  },

  // ===============================
  //  GET AVAILABLE UNITS
  // ===============================
  async getAvailableUnits(vehicleId: number, warehouseId?: number) {
    const url = warehouseId
      ? `/units/available/${vehicleId}?warehouse_id=${warehouseId}`
      : `/units/available/${vehicleId}`;
    
    const res = await api.get(url);
    return res.data;
  },
};