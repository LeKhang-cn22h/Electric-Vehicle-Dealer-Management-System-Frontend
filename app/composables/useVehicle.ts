import { ref } from 'vue';
import { VehicleService } from '~/services/vehicle.service';

export function useVehicle() {
    const vehicles = ref([]);
    const vehicle = ref(null); 
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAll = async () => {
        loading.value = true;
        error.value = null; // Reset error
        try {
            vehicles.value = await VehicleService.getAll();
        } catch (e: any) {
            error.value = e.message || 'Error fetching vehicles';
            console.error('[useVehicle] fetchAll error:', e);
        } finally {
            loading.value = false;
        }
    };

    const fetchOne = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            vehicle.value = await VehicleService.getOne(id); // lưu vào vehicle, không phải vehicles
        } catch (e: any) {
            error.value = e.message || 'Error fetching vehicle';
            console.error('[useVehicle] fetchOne error:', e);
        } finally {
            loading.value = false;
        }
    };

    // 🔄 CREATE - Thêm tham số images
    const create = async (data: any, images: File[]) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await VehicleService.create(data, images);
            console.log('[useVehicle] Created:', result);
            await fetchAll(); // Làm mới danh sách
            return result; // Return result để component có thể dùng
        } catch (e: any) {
            error.value = e.message || 'Error creating vehicle';
            console.error('[useVehicle] create error:', e);
            throw e; // Re-throw để component handle
        } finally {
            loading.value = false;
        }
    };

    //  UPDATE - Thêm tham số images (optional)
    const update = async (id: number, data: any, images?: File[]) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await VehicleService.update(id, data, images);
            console.log('[useVehicle] Updated:', result);
            await fetchAll(); // Làm mới danh sách
            return result;
        } catch (e: any) {
            error.value = e.message || 'Error updating vehicle';
            console.error('[useVehicle] update error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const remove = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await VehicleService.remove(id);
            console.log('[useVehicle] Removed:', result);
            await fetchAll(); // Làm mới danh sách
            return result;
        } catch (e: any) {
            error.value = e.message || 'Error removing vehicle';
            console.error('[useVehicle] remove error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        vehicles,
        vehicle, 
        loading,
        error,
        
        // Methods
        fetchAll,
        fetchOne,
        create,
        update,
        remove,
    };
}