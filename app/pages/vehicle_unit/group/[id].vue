<!-- FILE: pages/admin/vehicle-units/group/[id].vue -->
<template>
  <div class="max-w-7xl mx-auto p-5">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-blue-800">Danh Sách Xe Theo Nhóm</h2>
          <p v-if="groupData" class="text-gray-600 mt-2">
            Mẫu xe ID: #{{ vehicleId }} - Tổng {{ groupData.total }} xe
          </p>
        </div>
        <button
          @click="goBack"
          class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Quay lại
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="groupData" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tổng số xe</p>
            <p class="text-2xl font-bold text-blue-800">{{ groupData.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-car text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Sẵn sàng</p>
            <p class="text-2xl font-bold text-green-600">{{ availableCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Đã điều phối</p>
            <p class="text-2xl font-bold text-blue-600">{{ deployedCount }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-warehouse text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Đã bán</p>
            <p class="text-2xl font-bold text-red-600">{{ soldCount }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class="fas fa-dollar-sign text-red-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error }}
      <button @click="loadData" class="ml-3 underline">Thử lại</button>
    </div>

    <!-- Filters & Actions -->
    <div v-else class="bg-white rounded-lg shadow mb-5">
      <div class="p-4 border-b">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Status Filter -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Lọc theo trạng thái
            </label>
            <select
              v-model="filterStatus"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="available">Sẵn sàng</option>
              <option value="reserved">Đã đặt cọc</option>
              <option value="deployed">Đã điều phối</option>
              <option value="sold">Đã bán</option>
            </select>
          </div>

          <!-- Warehouse Filter -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Lọc theo kho
            </label>
            <select
              v-model="filterWarehouse"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            >
              <option value="">Tất cả kho</option>
              <option value="null">Chưa điều phối</option>
              <option v-for="wh in warehousesList" :key="wh" :value="wh">
                Kho {{ wh }}
              </option>
            </select>
          </div>

          <!-- Search VIN -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tìm theo VIN
            </label>
            <input
              v-model="searchVIN"
              type="text"
              placeholder="Nhập VIN..."
              class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 bg-gray-50 flex flex-wrap gap-3">
        <!-- ✅ Điều phối nhiều xe -->
        <button
          @click="showBulkDeployModal = true"
          :disabled="selectedUnits.length === 0"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <i class="fas fa-warehouse mr-2"></i>
          Điều phối hàng loạt ({{ selectedUnits.length }})
        </button>

        <!-- ✅ Điều phối nhiều xe theo số lượng -->
        <button
          @click="showMultipleDeployModal = true"
          :disabled="availableCount === 0"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          <i class="fas fa-list-ol mr-2"></i>
          Điều phối theo số lượng
        </button>

        <button
          @click="loadData"
          class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <i class="fas fa-sync mr-2"></i>
          Làm mới
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden">
      <!-- No data -->
      <div v-if="filteredUnits.length === 0" class="p-8 text-center text-gray-500">
        <i class="fas fa-inbox text-4xl mb-4"></i>
        <p class="text-lg">Không có xe nào</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <!-- ✅ Checkbox column -->
              <th class="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="isAllSelected"
                  class="rounded"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VIN
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Màu sắc
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kho
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(unit, index) in filteredUnits"
              :key="unit.id"
              class="hover:bg-gray-50"
            >
              <!-- ✅ Checkbox -->
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  :value="unit.id"
                  v-model="selectedUnits"
                  :disabled="unit.warehouse_id !== null || unit.status !== 'available'"
                  class="rounded"
                />
              </td>
              <td class="px-4 py-3 text-sm">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3">
                <div class="text-sm font-mono font-bold">{{ unit.vin }}</div>
                <div class="text-xs text-gray-500">ID: {{ unit.id }}</div>
              </td>
              <td class="px-4 py-3 text-sm">
                {{ unit.color }}
              </td>
              <td class="px-4 py-3">
                <span :class="getStatusBadgeClass(unit.status)">
                  {{ getStatusText(unit.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <span v-if="unit.warehouse_id" class="font-semibold">
                  Kho {{ unit.warehouse_id }}
                </span>
                <span v-else class="text-gray-400 italic">Chưa điều phối</span>
              </td>
              <td class="px-4 py-3">
  <div class="flex gap-2">
    <!-- ✅ Button Xem chi tiết - LUÔN HIỂN THỊ -->
    <button
      @click="viewDetail(unit.id)"
      class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      title="Xem chi tiết"
    >
      <i class="fas fa-eye">Chi tiết</i>
    </button>    
  </div>
</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ✅ MODAL ĐIỀU PHỐI HÀNG LOẠT (Batch Deploy) -->
    <div v-if="showBulkDeployModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Điều phối hàng loạt</h3>
        
        <p class="text-gray-600 mb-4">
          Bạn đang điều phối <strong>{{ selectedUnits.length }}</strong> xe
        </p>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Chọn kho <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model.number="bulkWarehouseId"
            placeholder="Nhập ID kho"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            min="1"
          />
        </div>

        <div v-if="bulkDeployError" class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {{ bulkDeployError }}
        </div>

        <div class="flex gap-3">
          <button
            @click="confirmBulkDeploy"
            :disabled="!bulkWarehouseId || bulkDeploying"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            {{ bulkDeploying ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
          <button
            @click="closeBulkDeployModal"
            :disabled="bulkDeploying"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL ĐIỀU PHỐI NHIỀU XE THEO SỐ LƯỢNG (Deploy Multiple) -->
    <div v-if="showMultipleDeployModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Điều phối theo số lượng</h3>
        
        <p class="text-gray-600 mb-4">
          Có <strong>{{ availableCount }}</strong> xe sẵn sàng điều phối
        </p>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Số lượng xe <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model.number="multipleQuantity"
            placeholder="Nhập số lượng"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            min="1"
            :max="availableCount"
          />
          <p class="text-xs text-gray-500 mt-1">
            Tối đa {{ availableCount }} xe
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            ID Kho <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model.number="multipleWarehouseId"
            placeholder="Nhập ID kho"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            min="1"
          />
        </div>

        <div v-if="multipleDeployError" class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {{ multipleDeployError }}
        </div>

        <div class="flex gap-3">
          <button
            @click="confirmMultipleDeploy"
            :disabled="!multipleQuantity || !multipleWarehouseId || multipleDeploying"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {{ multipleDeploying ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
          <button
            @click="closeMultipleDeployModal"
            :disabled="multipleDeploying"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicleUnit } from '~/composables/useVehicleUnit'
import type { DeployToWarehouseDto, DeployMultipleUnitsDto } from '~/types/vehicle_unit'

const route = useRoute()
const router = useRouter()
const vehicleId = parseInt(route.params.id as string)

// ===============================
// COMPOSABLE
// ===============================
const {
  loading,
  error,
  fetchGroupUnits,
  deploySingle,
  deployBatch,
  deployMultiple,
} = useVehicleUnit()

// ===============================
// STATE
// ===============================
const groupData = ref<any>(null)
const filterStatus = ref('')
const filterWarehouse = ref('')
const searchVIN = ref('')

// ✅ Selected units for batch deploy
const selectedUnits = ref<number[]>([])

// ✅ Bulk deploy modal state
const showBulkDeployModal = ref(false)
const bulkWarehouseId = ref<number | null>(null)
const bulkDeploying = ref(false)
const bulkDeployError = ref<string | null>(null)

// ✅ Multiple deploy modal state
const showMultipleDeployModal = ref(false)
const multipleQuantity = ref<number | null>(null)
const multipleWarehouseId = ref<number | null>(null)
const multipleDeploying = ref(false)
const multipleDeployError = ref<string | null>(null)
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
// ===============================
// COMPUTED
// ===============================

const units = computed(() => groupData.value?.units || [])

const filteredUnits = computed(() => {
  let result = [...units.value]

  if (filterStatus.value) {
    result = result.filter(u => u.status === filterStatus.value)
  }

  if (filterWarehouse.value) {
    if (filterWarehouse.value === 'null') {
      result = result.filter(u => !u.warehouse_id)
    } else {
      result = result.filter(u => u.warehouse_id === parseInt(filterWarehouse.value))
    }
  }

  if (searchVIN.value.trim()) {
    const search = searchVIN.value.toLowerCase()
    result = result.filter(u => u.vin.toLowerCase().includes(search))
  }

  return result
})

const availableCount = computed(() => 
  units.value.filter((u: any) => u.status === 'available' && !u.warehouse_id).length
)

const deployedCount = computed(() => 
  units.value.filter((u: any) => u.status === 'deployed').length
)

const soldCount = computed(() => 
  units.value.filter((u: any) => ['sold', 'paid'].includes(u.status)).length
)

const warehousesList = computed(() => {
  const warehouses = new Set<number>()
  units.value.forEach((u: any) => {
    if (u.warehouse_id) warehouses.add(u.warehouse_id)
  })
  return Array.from(warehouses).sort((a, b) => a - b)
})

// ✅ Check if all (available) units are selected
const isAllSelected = computed(() => {
  const availableUnits = filteredUnits.value.filter(
    (u: any) => u.status === 'available' && !u.warehouse_id
  )
  return availableUnits.length > 0 && 
         selectedUnits.value.length === availableUnits.length
})

// ===============================
// METHODS
// ===============================

const loadData = async () => {
  try {
    const result = await fetchGroupUnits(vehicleId)
    groupData.value = result
    selectedUnits.value = [] // Reset selection
  } catch (err: any) {
    console.error('Error loading group units:', err)
  }
}

const getStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'available': 'Sẵn sàng',
    'reserved': 'Đã đặt cọc',
    'deployed': 'Đã điều phối',
    'sold': 'Đã bán',
    'paid': 'Đã thanh toán',
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'available': 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
    'reserved': 'px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800',
    'deployed': 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
    'sold': 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800',
    'paid': 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800',
  }
  return classes[status] || 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
}

// ✅ Toggle select all
const toggleSelectAll = () => {
  const availableUnits = filteredUnits.value.filter(
    (u: any) => u.status === 'available' && !u.warehouse_id
  )
  
  if (isAllSelected.value) {
    selectedUnits.value = []
  } else {
    selectedUnits.value = availableUnits.map((u: any) => u.id)
  }
}

const viewDetail = (unitId: number) => {
  router.push(`/vehicle_unit/detail/${unitId}`)
}

// ✅ ĐIỀU PHỐI 1 XE NHANH
const quickDeploy = async (unitId: number) => {
  const warehouseId = prompt('Nhập ID kho để điều phối:')
  if (!warehouseId) return

  const warehouseNum = parseInt(warehouseId)
  if (isNaN(warehouseNum) || warehouseNum < 1) {
    alert('ID kho không hợp lệ')
    return
  }

  try {
    await deploySingle(unitId, warehouseNum)
    alert('Điều phối thành công!')
    await loadData()
  } catch (err: any) {
    alert('Lỗi: ' + (err.message || 'Không thể điều phối'))
  }
}

// ✅ ĐIỀU PHỐI HÀNG LOẠT (BATCH)
const confirmBulkDeploy = async () => {
  if (!bulkWarehouseId.value) {
    bulkDeployError.value = 'Vui lòng nhập ID kho'
    return
  }

  bulkDeploying.value = true
  bulkDeployError.value = null

  try {
    const payload: DeployToWarehouseDto = {
      vehicle_unit_ids: selectedUnits.value,
      warehouse_id: bulkWarehouseId.value,
    }

    await deployBatch(payload)

    alert(`Điều phối ${selectedUnits.value.length} xe thành công!`)
    closeBulkDeployModal()
    await loadData()
  } catch (err: any) {
    bulkDeployError.value = err.message || 'Không thể điều phối'
  } finally {
    bulkDeploying.value = false
  }
}

const closeBulkDeployModal = () => {
  showBulkDeployModal.value = false
  bulkWarehouseId.value = null
  bulkDeployError.value = null
}

// ✅ ĐIỀU PHỐI NHIỀU XE THEO SỐ LƯỢNG
const confirmMultipleDeploy = async () => {
  if (!multipleQuantity.value || multipleQuantity.value < 1) {
    multipleDeployError.value = 'Vui lòng nhập số lượng hợp lệ'
    return
  }

  if (!multipleWarehouseId.value) {
    multipleDeployError.value = 'Vui lòng nhập ID kho'
    return
  }

  if (multipleQuantity.value > availableCount.value) {
    multipleDeployError.value = `Chỉ có ${availableCount.value} xe sẵn sàng`
    return
  }

  multipleDeploying.value = true
  multipleDeployError.value = null

  try {
    const payload: DeployMultipleUnitsDto = {
      vehicle_id: vehicleId,
      warehouse_id: multipleWarehouseId.value,
      quantity: multipleQuantity.value,
    }

    await deployMultiple(payload)

    alert(`Điều phối ${multipleQuantity.value} xe thành công!`)
    closeMultipleDeployModal()
    await loadData()
  } catch (err: any) {
    multipleDeployError.value = err.message || 'Không thể điều phối'
  } finally {
    multipleDeploying.value = false
  }
}

const closeMultipleDeployModal = () => {
  showMultipleDeployModal.value = false
  multipleQuantity.value = null
  multipleWarehouseId.value = null
  multipleDeployError.value = null
}

const goBack = () => {
  router.back()
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadData()
})
</script>