// FILE: composables/useVehicleUnit.ts

import { ref } from "vue";
import {
  VehicleUnitService
} from "~/services/vehicles/vehicle-unit.service";
import type {VehicleUnit, CreateVehicleUnitDto, UpdateVehicleUnitDto, DeployMultipleUnitsDto, DeployToWarehouseDto, FilterVehicleUnitsParams} from "~/types/vehicle_unit";
export function useVehicleUnit() {
  // ======= STATE =======
  const loading = ref(false);
  const error = ref<string | null>(null);

  const units = ref<VehicleUnit[]>([]);
  const unit = ref<VehicleUnit | null>(null);

  // ===============================
  // CREATE UNIT
  // ===============================
  async function createUnit(dto: CreateVehicleUnitDto) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.create(dto);
      console.log("[useVehicleUnit] Created:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể tạo vehicle unit";
      console.error("[useVehicleUnit] create error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // GET ALL UNITS
  // ===============================
  async function fetchAllUnits(filters?: FilterVehicleUnitsParams) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.getAll(filters);
      units.value = result.data || [];
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể tải danh sách units";
      console.error("[useVehicleUnit] fetchAll error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
// lấy vehicle unit theo nhóm vehicle_id
  async function fetchGroupUnits(id:number){
    loading.value = true;
    error.value = null;
    try {
      const result = await VehicleUnitService.getGroupUnits(id);
      console.log('[useVehicleUnit] Raw result:', result);
        console.log('[useVehicleUnit] Result type:', typeof result);
      return result;
    }
    catch (err: any) {
      error.value = err.message || "Không thể tải danh sách units";
      console.error("[useVehicleUnit] fetchGroupUnits error:", err);
      throw err;    
  }
  finally {

        loading.value = false;
    }
  }
  // ===============================
  // GET ONE UNIT BY ID
  // ===============================
  async function fetchUnitById(id: number) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.getById(id);
      unit.value = result.data;
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể tải unit";
      console.error("[useVehicleUnit] fetchById error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // GET ONE UNIT BY VIN
  // ===============================
  async function fetchUnitByVIN(vin: string) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.getByVIN(vin);
      unit.value = result.data;
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể tải unit";
      console.error("[useVehicleUnit] fetchByVIN error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // UPDATE UNIT
  // ===============================
  async function updateUnit(id: number, dto: UpdateVehicleUnitDto) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.update(id, dto);
      console.log("[useVehicleUnit] Updated:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể cập nhật unit";
      console.error("[useVehicleUnit] update error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // DELETE UNIT
  // ===============================
  async function deleteUnit(id: number) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.delete(id);
      console.log("[useVehicleUnit] Deleted:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể xóa unit";
      console.error("[useVehicleUnit] delete error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // COUNT UNDEPLOYED
  // ===============================
  async function countUndeployed(vehicleId: number) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.countUndeployed(vehicleId);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể đếm xe chưa điều phối";
      console.error("[useVehicleUnit] countUndeployed error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // COUNT UNALLOCATED
  // ===============================
  async function countUnallocated(vehicleId: number) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.countUnallocated(vehicleId);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể đếm xe chưa phân kho";
      console.error("[useVehicleUnit] countUnallocated error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // DEPLOY SINGLE
  // ===============================
  async function deploySingle(unitId: number, warehouseId: number) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.deploySingle(unitId, warehouseId);
      console.log("[useVehicleUnit] Deployed single:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể điều phối xe";
      console.error("[useVehicleUnit] deploySingle error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // DEPLOY MULTIPLE
  // ===============================
  async function deployMultiple(dto: DeployMultipleUnitsDto) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.deployMultiple(dto);
      console.log("[useVehicleUnit] Deployed multiple:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể điều phối nhiều xe";
      console.error("[useVehicleUnit] deployMultiple error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // DEPLOY BATCH
  // ===============================
  async function deployBatch(dto: DeployToWarehouseDto) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.deployBatch(dto);
      console.log("[useVehicleUnit] Deployed batch:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể điều phối batch xe";
      console.error("[useVehicleUnit] deployBatch error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // PAY VEHICLE
  // ===============================
  async function payVehicle(vin: string) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.pay(vin);
      console.log("[useVehicleUnit] Paid vehicle:", result);
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể thanh toán xe";
      console.error("[useVehicleUnit] pay error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // GET AVAILABLE UNITS
  // ===============================
  async function fetchAvailableUnits(vehicleId: number, warehouseId?: number) {
    loading.value = true;
    error.value = null;

    try {
      const result = await VehicleUnitService.getAvailableUnits(vehicleId, warehouseId);
      units.value = result.data || [];
      return result;
    } catch (err: any) {
      error.value = err.message || "Không thể tải xe available";
      console.error("[useVehicleUnit] fetchAvailable error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // RESET STATE
  // ===============================
  function reset() {
    units.value = [];
    unit.value = null;
    error.value = null;
  }

  return {
    // State
    loading,
    error,
    units,
    unit,

    // Methods
    createUnit,
    fetchGroupUnits,
    fetchAllUnits,
    fetchUnitById,
    fetchUnitByVIN,
    updateUnit,
    deleteUnit,
    countUndeployed,
    countUnallocated,
    deploySingle,
    deployMultiple,
    deployBatch,
    payVehicle,
    fetchAvailableUnits,
    reset,
  };
}