<!-- FILE: pages/admin/vehicle-units/[id].vue -->
<template>
  <div class="max-w-5xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Chi Tiết Xe</h2>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error }}
      <button @click="loadUnit" class="ml-3 underline">Thử lại</button>
    </div>

    <!-- Content -->
    <div v-else-if="unit" class="space-y-5">
      <!-- Unit Info Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold">Thông tin xe</h3>
          
          <!-- Status Badge -->
          <span :class="getStatusBadgeClass(unit.status)">
            {{ getStatusText(unit.status) }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Vehicle Info -->
          <div class="col-span-2 pb-4 border-b">
            <h4 class="text-lg font-semibold text-gray-700 mb-3">Thông tin mẫu xe</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">Tên xe:</span>
                <p class="font-semibold">{{ unit.vehicle?.name || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">Model:</span>
                <p class="font-semibold">{{ unit.vehicle?.model || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">Phiên bản:</span>
                <p class="font-semibold">{{ unit.vehicle?.version || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">Năm sản xuất:</span>
                <p class="font-semibold">{{ unit.vehicle?.year || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Unit Details -->
          <div>
            <span class="text-sm text-gray-600">VIN:</span>
            <p class="font-mono font-bold text-lg">{{ unit.vin }}</p>
          </div>

          <div>
            <span class="text-sm text-gray-600">Màu sắc:</span>
            <p class="font-semibold">{{ unit.color }}</p>
          </div>

          <div>
            <span class="text-sm text-gray-600">Vehicle ID:</span>
            <p class="font-semibold">#{{ unit.vehicle_id }}</p>
          </div>

          <div>
            <span class="text-sm text-gray-600">Unit ID:</span>
            <p class="font-semibold">#{{ unit.id }}</p>
          </div>

          <div>
            <span class="text-sm text-gray-600">Kho:</span>
            <p class="font-semibold">
              <span v-if="unit.warehouse_id">Kho #{{ unit.warehouse_id }}</span>
              <span v-else class="text-gray-400">Chưa điều phối</span>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 mt-6 pt-6 border-t">
          <!-- Edit -->
          <button
            @click="editUnit"
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            <i class="fas fa-edit mr-2"></i>
            Sửa thông tin
          </button>

          <!-- Deploy (if not deployed) -->
          <button
            v-if="!unit.warehouse_id && unit.status === 'available'"
            @click="showDeployModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <i class="fas fa-warehouse mr-2"></i>
            Điều phối xuống kho
          </button>
          <!-- Pay (if available or deployed) -->
          <button
            v-if="['available', 'deployed'].includes(unit.status)"
            @click="handlePay"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <i class="fas fa-dollar-sign mr-2"></i>
            Thanh toán
          </button>

          <!-- Delete (if not sold) -->
          <button
            v-if="!['sold', 'paid'].includes(unit.status) && !unit.warehouse_id"
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <i class="fas fa-trash mr-2"></i>
            Xóa
          </button>

          <!-- Back -->
          <button
            @click="goBack"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 ml-auto"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Quay lại
          </button>
        </div>
      </div>

      <!-- Status History / Info Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Thông tin trạng thái</h3>
        
        <div class="space-y-3">
          <div class="flex items-center p-3 bg-gray-50 rounded">
            <div class="flex-shrink-0 w-3 h-3 rounded-full mr-3" 
                 :class="getStatusDotClass(unit.status)">
            </div>
            <div>
              <p class="font-semibold">{{ getStatusText(unit.status) }}</p>
              <p class="text-sm text-gray-600">{{ getStatusDescription(unit.status) }}</p>
            </div>
          </div>

          <!-- Deployment info -->
          <div v-if="unit.warehouse_id" class="flex items-center p-3 bg-blue-50 rounded">
            <i class="fas fa-warehouse text-blue-600 mr-3"></i>
            <div>
              <p class="font-semibold">Đã điều phối</p>
              <p class="text-sm text-gray-600">Xe đang nằm ở kho #{{ unit.warehouse_id }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Điều phối xe xuống kho</h3>
        
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Chọn kho <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model.number="selectedWarehouseId"
            placeholder="Nhập ID kho"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            min="1"
          />
          <p class="text-xs text-gray-500 mt-1">
            Nhập ID của kho muốn điều phối
          </p>
        </div>

        <div v-if="deployError" class="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {{ deployError }}
        </div>

        <div class="flex gap-3">
          <button
            @click="confirmDeploy"
            :disabled="!selectedWarehouseId || deploying"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {{ deploying ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
          <button
            @click="showDeployModal = false"
            :disabled="deploying"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicleUnit } from '~/composables/useVehicleUnit'

const route = useRoute()
const router = useRouter()
const unitId = parseInt(route.params.id as string)

// ===============================
// COMPOSABLE
// ===============================
const {
  loading,
  error,
  unit,
  fetchUnitById,
  updateUnit,
  deleteUnit,
  deploySingle,
  payVehicle,
} = useVehicleUnit()

// ===============================
// STATE
// ===============================
const showDeployModal = ref(false)
const selectedWarehouseId = ref<number | null>(null)
const deploying = ref(false)
const deployError = ref<string | null>(null)

// ===============================
// METHODS
// ===============================

const loadUnit = async () => {
  try {
    await fetchUnitById(unitId)
  } catch (err: any) {
    console.error('Error loading unit:', err)
  }
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

const getStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'available': 'Sẵn sàng',
    'deployed': 'Đã điều phối',
    'sold': 'Đã bán',
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'available': 'px-3 py-1 rounded-full text-sm bg-green-100 text-green-800',
    'reserved': 'px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800',
    'deployed': 'px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800',
    'sold': 'px-3 py-1 rounded-full text-sm bg-red-100 text-red-800',
    'paid': 'px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800',
    'maintenance': 'px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800',
  }
  return classes[status] || 'px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status: string) => {
  const classes: Record<string, string> = {
    'available': 'bg-green-500',
    'reserved': 'bg-purple-500',
    'deployed': 'bg-blue-500',
    'sold': 'bg-red-500',
    'paid': 'bg-gray-500',
    'maintenance': 'bg-yellow-500',
  }
  return classes[status] || 'bg-gray-500'
}

const getStatusDescription = (status: string) => {
  const descriptions: Record<string, string> = {
    'available': 'Xe đang sẵn sàng để bán hoặc điều phối',
    'reserved': 'Xe đã được khách hàng đặt cọc',
    'deployed': 'Xe đã được điều phối xuống kho đại lý',
    'sold': 'Xe đã được bán cho khách hàng',
  }
  return descriptions[status] || 'Không có mô tả'
}

const editUnit = () => {
  router.push(`/vehicle_unit/edit/${unitId}`)
}

const confirmDeploy = async () => {
  if (!selectedWarehouseId.value) {
    deployError.value = 'Vui lòng chọn kho'
    return
  }

  deploying.value = true
  deployError.value = null

  try {
    await deploySingle(unitId, selectedWarehouseId.value)
    
    alert('Điều phối xe thành công!')
    showDeployModal.value = false
    selectedWarehouseId.value = null
    
    // Reload unit
    await loadUnit()
  } catch (err: any) {
    deployError.value = err.message || 'Không thể điều phối xe'
  } finally {
    deploying.value = false
  }
}
const handlePay = async () => {
  if (!unit.value) return

  const confirmed = confirm(`Xác nhận thanh toán xe VIN: ${unit.value.vin}?`)
  if (!confirmed) return

  try {
    await payVehicle(unit.value.vin)
    alert('Thanh toán xe thành công!')
    await loadUnit()
  } catch (err: any) {
    alert('Lỗi: ' + (err.message || 'Không thể thanh toán xe'))
  }
}

const handleDelete = async () => {
  const confirmed = confirm('Bạn có chắc muốn xóa xe này? Hành động này không thể hoàn tác.')
  if (!confirmed) return

  try {
    await deleteUnit(unitId)
    alert('Xóa xe thành công!')
    router.push('/admin/vehicle-units')
  } catch (err: any) {
    alert('Lỗi: ' + (err.message || 'Không thể xóa xe'))
  }
}

const goBack = () => {
  router.back()
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadUnit()
})
</script>

<style scoped>
/* Optional: Add custom styles if needed */
</style>