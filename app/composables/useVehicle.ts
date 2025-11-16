import { ref } from 'vue';
import { VehicleService } from '~/services/vehicle.service';
import type { Vehicle } from '~/types/vehicle';

// Định nghĩa interface cho filters
interface SearchFilters {
  keyword?: string;
  model?: string;
  status?: string;
  cursor?: number;
  limit?: number;
}

export function useVehicle() {
    const vehicles = ref([]);
    const vehicle = ref<Vehicle | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const models = ref<string[]>([]); // Thêm state cho models

    // 🔍 FETCH ALL với filters
    const fetchAll = async (filters?: SearchFilters) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await VehicleService.findAll(filters);
            vehicles.value = response.data || [];
            return response; // Return full response để có thể dùng pagination info
        } catch (e: any) {
            error.value = e.message || 'Error fetching vehicles';
            console.error('[useVehicle] fetchAll error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // 🔍 SEARCH ALL - Tìm kiếm tổng quát
    const searchAll = async (keyword: string, cursor?: number, limit = 20) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await VehicleService.searchAll(keyword, cursor, limit);
            vehicles.value = response.data || [];
            return response;
        } catch (e: any) {
            error.value = e.message || 'Error searching vehicles';
            console.error('[useVehicle] searchAll error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // 🔍 FILTER BY MODEL - Lọc theo model
    const filterByModel = async (model: string, cursor?: number, limit = 20) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await VehicleService.filterByModel(model, cursor, limit);
            vehicles.value = response.data || [];
            return response;
        } catch (e: any) {
            error.value = e.message || 'Error filtering vehicles by model';
            console.error('[useVehicle] filterByModel error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // 📋 GET ALL MODELS - Lấy danh sách models cho dropdown
    const fetchModels = async () => {
        loading.value = true;
        error.value = null;
        try {
            models.value = await VehicleService.getAllModels();
            return models.value;
        } catch (e: any) {
            error.value = e.message || 'Error fetching models';
            console.error('[useVehicle] fetchModels error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // 👤 FETCH ONE - Lấy chi tiết xe
    const fetchOne = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            vehicle.value = await VehicleService.getOne(id) as Vehicle;
            return vehicle.value;
        } catch (e: any) {
            error.value = e.message || 'Error fetching vehicle';
            console.error('[useVehicle] fetchOne error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ➕ CREATE - Tạo xe mới
    const create = async (data: any, images: File[]) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await VehicleService.create(data, images);
            console.log('[useVehicle] Created:', result);
            return result;
        } catch (e: any) {
            error.value = e.message || 'Error creating vehicle';
            console.error('[useVehicle] create error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // ✏️ UPDATE - Cập nhật xe
    const update = async (id: number, data: any, images?: File[]) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await VehicleService.update(id, data, images);
            console.log('[useVehicle] Updated:', result);
            return result;
        } catch (e: any) {
            error.value = e.message || 'Error updating vehicle';
            console.error('[useVehicle] update error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // 🗑️ REMOVE - Xóa xe
    const remove = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await VehicleService.remove(id);
            console.log('[useVehicle] Removed:', result);
            return result;
        } catch (e: any) {
            error.value = e.message || 'Error removing vehicle';
            console.error('[useVehicle] remove error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // 🔄 RESET - Reset state
    const reset = () => {
        vehicles.value = [];
        vehicle.value = null;
        error.value = null;
        models.value = [];
    };

    return {
        // State
        vehicles,
        vehicle,
        models, // Thêm models vào return
        loading,
        error,
        
        // Methods
        fetchAll,
        searchAll,
        filterByModel,
        fetchModels,
        fetchOne,
        create,
        update,
        remove,
        reset,
    };
}