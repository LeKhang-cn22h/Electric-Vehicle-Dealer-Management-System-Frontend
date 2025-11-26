<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Quản lý kho xe</h1>
          <p class="text-gray-600">Xem và quản lý tồn kho toàn hệ thống</p>
        </div>
      </header>

      <!-- Filters -->
      <section
        class="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-end"
      >
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">VIN</label>
          <input
            v-model="filters.vin"
            type="text"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring w-40"
            placeholder="Tìm theo VIN"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Trạng thái</label>
          <select
            v-model="filters.status"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring w-40"
          >
            <option value="">Tất cả</option>
            <option value="deployed">Đang ở kho</option>
            <option value="available">Available</option>
            <option value="reserved">Đã giữ</option>
            <option value="sold">Đã bán</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Kho</label>
          <select
            v-model="filters.warehouseId"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring w-48"
          >
            <option value="">Tất cả</option>
            <option v-for="w in warehouses" :key="w.id" :value="w.id">
              {{ w.name }}
            </option>
          </select>
        </div>

        <button
          @click="fetchStock"
          class="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          :disabled="loading"
        >
          {{ loading ? "Đang tải..." : "Lọc" }}
        </button>
      </section>

      <!-- Table -->
      <section class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-gray-600">ID</th>
              <th class="px-4 py-2 text-left text-gray-600">VIN</th>
              <th class="px-4 py-2 text-left text-gray-600">Màu</th>
              <th class="px-4 py-2 text-left text-gray-600">Trạng thái</th>
              <th class="px-4 py-2 text-left text-gray-600">Kho</th>
              <th class="px-4 py-2 text-left text-gray-600">Dealer</th>
              <th class="px-4 py-2 text-right text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="unit in stock"
              :key="unit.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ unit.id }}</td>
              <td class="px-4 py-2 font-mono text-xs">{{ unit.vin }}</td>
              <td class="px-4 py-2">{{ unit.color }}</td>
              <td class="px-4 py-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="statusBadgeClass(unit.status)"
                >
                  {{ statusLabel(unit.status) }}
                </span>
              </td>
              <td class="px-4 py-2">{{ unit.warehouse_name }}</td>
              <td class="px-4 py-2 text-xs">{{ unit.dealer_id }}</td>
              <td class="px-4 py-2 text-right space-x-2">
                <button
                  v-if="unit.status !== 'reserved'"
                  class="px-2 py-1 text-xs rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  :disabled="updatingId === unit.id"
                  @click="changeStatus(unit.id, 'reserved')"
                >
                  {{ updatingId === unit.id ? "..." : "Giữ xe" }}
                </button>
                <button
                  v-if="unit.status === 'reserved'"
                  class="px-2 py-1 text-xs rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  :disabled="updatingId === unit.id"
                  @click="changeStatus(unit.id, 'deployed')"
                >
                  {{ updatingId === unit.id ? "..." : "Bỏ giữ" }}
                </button>
                <button
                  v-if="unit.status !== 'sold'"
                  class="px-2 py-1 text-xs rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  :disabled="updatingId === unit.id"
                  @click="changeStatus(unit.id, 'sold')"
                >
                  {{ updatingId === unit.id ? "..." : "Đánh dấu bán" }}
                </button>
              </td>
            </tr>

            <tr v-if="!loading && stock.length === 0">
              <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="loading" class="p-4 text-center text-gray-500 text-sm">
          Đang tải dữ liệu...
        </div>
        <div v-if="error" class="p-4 text-center text-red-500 text-sm">
          {{ error }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRuntimeConfig, useRequestFetch } from "#imports";

definePageMeta({
  layout: "dealer-manager-layout",
});

type VehicleStatus = "deployed" | "available" | "reserved" | "sold";

interface VehicleStock {
  id: number;
  vehicle_id: number;
  vin: string;
  color: string;
  status: VehicleStatus;
  warehouse_id: number;
  warehouse_name: string;
  dealer_id: string;
}

interface Warehouse {
  id: number;
  name: string;
}

const config = useRuntimeConfig();
const apiFetch = useRequestFetch();

const stock = ref<VehicleStock[]>([]);
const warehouses = ref<Warehouse[]>([]);
const loading = ref(false);
const updatingId = ref<number | null>(null);
const error = ref<string | null>(null);

// Lấy dealerId từ localStorage (client-side only)
const dealerId = ref<string | null>(null);

const filters = ref<{
  vin: string;
  status: VehicleStatus | "";
  warehouseId: string | number | "";
}>({
  vin: "",
  status: "",
  warehouseId: "",
});

const apiBase = (config.public.apiBase as string) || "http://localhost:4000";

const statusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    deployed: "Đang ở kho",
    available: "Available",
    reserved: "Đã giữ",
    sold: "Đã bán",
  };
  return labels[status] || status;
};

const statusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    deployed: "bg-blue-100 text-blue-700",
    available: "bg-green-100 text-green-700",
    reserved: "bg-yellow-100 text-yellow-700",
    sold: "bg-gray-200 text-gray-700",
  };
  return classes[status] || "bg-gray-100 text-gray-700";
};

const fetchWarehouses = async (): Promise<void> => {
  try {
    const params: Record<string, any> = {};
    if (dealerId.value) {
      params.dealerId = dealerId.value;
    }

    const res = await apiFetch<Warehouse[]>(`${apiBase}/inventory/warehouses`, {
      method: "GET",
      credentials: "include",
      params,
    });

    warehouses.value = res || [];
  } catch (e: any) {
    console.error("[inventory] Lỗi tải danh sách kho:", e);
    error.value = e?.message || "Lỗi tải danh sách kho";
  }
};

const fetchStock = async (): Promise<void> => {
  if (!dealerId.value) {
    console.warn("[inventory] Không có dealerId, bỏ qua fetchStock");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const params: Record<string, any> = {
      dealerId: dealerId.value,
    };

    if (filters.value.vin) params.vin = filters.value.vin;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.warehouseId)
      params.warehouseId = filters.value.warehouseId;

    const res = await apiFetch<VehicleStock[]>(
      `${apiBase}/inventory/dealer/stock`,
      {
        method: "GET",
        credentials: "include",
        params,
      }
    );

    stock.value = res || [];
  } catch (e: any) {
    console.error("[inventory] Lỗi tải dữ liệu kho:", e);
    error.value = e?.message || "Lỗi tải dữ liệu kho";
    stock.value = [];
  } finally {
    loading.value = false;
  }
};

const changeStatus = async (
  id: number,
  status: VehicleStatus
): Promise<void> => {
  updatingId.value = id;
  error.value = null;

  try {
    await apiFetch(`${apiBase}/inventory/vehicle-units/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      body: { status },
    });

    // Refresh danh sách sau khi cập nhật thành công
    await fetchStock();
  } catch (e: any) {
    console.error("[inventory] Lỗi cập nhật trạng thái xe:", e);
    error.value = e?.message || "Lỗi cập nhật trạng thái xe";
  } finally {
    updatingId.value = null;
  }
};

onMounted(async () => {
  // Chỉ chạy trên client mới có localStorage
  if (process.client) {
    dealerId.value = localStorage.getItem("dealer_id");
  }

  if (!dealerId.value) {
    error.value = "Không tìm thấy dealer_id. Vui lòng đăng nhập lại.";
    console.warn("[inventory] dealer_id không có trong localStorage");
    return;
  }

  await fetchWarehouses();
  await fetchStock();
});
</script>
