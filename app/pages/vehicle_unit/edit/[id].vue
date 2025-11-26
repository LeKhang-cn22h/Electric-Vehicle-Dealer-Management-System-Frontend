<!-- FILE: pages/vehicle_unit/edit/[id].vue -->
<template>
  <div class="max-w-3xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Chỉnh Sửa Thông Tin Xe</h2>

    <!-- Loading -->
    <div v-if="loading || loadingUnit" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error || unitError" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error || unitError }}
      <button @click="loadUnit" class="ml-3 underline">Thử lại</button>
    </div>

    <!-- Form -->
    <div v-else-if="unit" class="bg-white rounded-lg shadow p-6">
      <!-- Current Info Display -->
      <div class="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
        <h3 class="font-semibold text-lg mb-3">Thông tin hiện tại</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Xe:</span>
            <p class="font-semibold">{{ unit.vehicle?.name || 'N/A' }}</p>
          </div>
          <div>
            <span class="text-gray-600">Model:</span>
            <p class="font-semibold">{{ unit.vehicle?.model || 'N/A' }}</p>
          </div>
          <div>
            <span class="text-gray-600">Phiên bản:</span>
            <p class="font-semibold">{{ unit.vehicle?.version || 'N/A' }}</p>
          </div>
          <div>
            <span class="text-gray-600">Năm:</span>
            <p class="font-semibold">{{ unit.vehicle?.year || 'N/A' }}</p>
          </div>
          <div>
            <span class="text-gray-600">VIN hiện tại:</span>
            <p class="font-mono font-bold">{{ unit.vin }}</p>
          </div>
          <div>
            <span class="text-gray-600">Màu hiện tại:</span>
            <p class="font-semibold">{{ unit.color }}</p>
          </div>
          <div>
            <span class="text-gray-600">Trạng thái:</span>
            <span :class="getStatusBadgeClass(unit.status)">
              {{ getStatusText(unit.status) }}
            </span>
          </div>
          <div>
            <span class="text-gray-600">Kho:</span>
            <p class="font-semibold">
              {{ unit.warehouse_id ? `Kho #${unit.warehouse_id}` : 'Chưa điều phối' }}
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- VIN Input -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Mã VIN <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="form.vin"
            required
            placeholder="VD: 1HGBH41JXMN109186"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
            maxlength="17"
          />
          <p class="text-xs text-gray-500 mt-1">
            VIN phải là mã duy nhất, thường có 17 ký tự
          </p>
        </div>

        <!-- Color Input -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Màu Xe <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="form.color"
            required
            placeholder="VD: Đỏ, Xanh, Trắng..."
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          />
          <p class="text-xs text-gray-500 mt-1">
            Nhập màu sắc cụ thể của xe này
          </p>
        </div>

        <!-- Status Select -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Trạng Thái <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting || isStatusLocked"
          >
            <option value="available">Sẵn sàng</option>
            <option value="reserved">Đã đặt cọc</option>
            <option value="deployed">Đã điều phối</option>
            <option value="sold">Đã bán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="maintenance">Bảo trì</option>
          </select>
          <p v-if="isStatusLocked" class="text-xs text-red-500 mt-1">
            <i class="fas fa-lock mr-1"></i>
            Không thể thay đổi trạng thái của xe đã bán hoặc đã thanh toán
          </p>
          <p v-else class="text-xs text-gray-500 mt-1">
            Chọn trạng thái phù hợp với tình trạng hiện tại của xe
          </p>
        </div>

        <!-- Warehouse ID Input -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            ID Kho
          </label>
          <input
            type="number"
            v-model.number="warehouseInput"
            placeholder="Nhập ID kho (để trống nếu chưa điều phối)"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
            min="1"
          />
          <p class="text-xs text-gray-500 mt-1">
            Để trống nếu xe chưa được điều phối xuống kho
          </p>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="mb-5 p-4 bg-red-50 border border-red-200 rounded">
          <p class="text-red-700 font-semibold mb-2">
            <i class="fas fa-exclamation-triangle mr-2"></i>Lỗi:
          </p>
          <ul class="list-disc list-inside text-red-600 text-sm">
            <li v-for="(err, index) in validationErrors" :key="index">{{ err }}</li>
          </ul>
        </div>

        <!-- Info Box -->
        <div class="mb-5 p-4 bg-blue-50 border border-blue-200 rounded">
          <p class="text-sm text-blue-800">
            <strong>Lưu ý:</strong>
          </p>
          <ul class="list-disc list-inside text-sm text-blue-700 mt-2">
            <li>Mã VIN phải là duy nhất trong hệ thống</li>
            <li>Không thể thay đổi trạng thái của xe đã bán</li>
            <li>Khi thay đổi kho, cần đảm bảo kho tồn tại trong hệ thống</li>
            <li>Các thay đổi sẽ được ghi lại trong lịch sử</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="submitting || !isFormValid || !hasChanges"
            class="flex-1 px-6 py-3 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <i v-if="submitting" class="fas fa-spinner fa-spin mr-2"></i>
            {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
          <button
            type="button"
            @click="goBack"
            :disabled="submitting"
            class="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Hủy
          </button>
        </div>

        <!-- No changes warning -->
        <div v-if="!hasChanges && !submitting" class="mt-3 text-center text-sm text-gray-500">
          <i class="fas fa-info-circle mr-1"></i>
          Chưa có thay đổi nào
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicleUnit } from '~/composables/useVehicleUnit'
import type { UpdateVehicleUnitDto, VehicleUnit } from '~/types/vehicle_unit'

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
} = useVehicleUnit()

// ===============================
// STATE
// ===============================
const submitting = ref(false)
const validationErrors = ref<string[]>([])
const loadingUnit = ref(false)
const unitError = ref<string | null>(null)

// ✅ Form state theo UpdateVehicleUnitDto
const form = ref<{
  vin?: string;
  color?: string;
  status?: string;
  warehouse_id?: number | null;
}>({
  vin: undefined,
  color: undefined,
  status: undefined,
  warehouse_id: undefined,
})

// ✅ Warehouse input riêng để handle empty string
const warehouseInput = ref<number | null>(null)

// ✅ Original data để so sánh changes
const originalData = ref<{
  vin: string;
  color: string;
  status: string;
  warehouse_id: number | null;
}>({
  vin: '',
  color: '',
  status: '',
  warehouse_id: null,
})

// ===============================
// COMPUTED
// ===============================

const isFormValid = computed(() => {
  return (
    form.value.vin &&
    form.value.vin.trim().length > 0 &&
    form.value.color &&
    form.value.color.trim().length > 0 &&
    form.value.status
  )
})

// ✅ Check if form has changes
const hasChanges = computed(() => {
  if (!unit.value) return false
  
  return (
    form.value.vin !== originalData.value.vin ||
    form.value.color !== originalData.value.color ||
    form.value.status !== originalData.value.status ||
    warehouseInput.value !== originalData.value.warehouse_id
  )
})

// ✅ Lock status if sold/paid
const isStatusLocked = computed<boolean>(() => {
  return !!(unit.value && ['sold', 'paid'].includes(unit.value.status))
})

// ===============================
// WATCH
// ===============================

// ✅ Watch warehouseInput to sync with form
watch(warehouseInput, (newVal) => {
  if (newVal === null || newVal === 0) {
    form.value.warehouse_id = null
  } else {
    form.value.warehouse_id = newVal
  }
})

// ===============================
// METHODS
// ===============================

const loadUnit = async () => {
  loadingUnit.value = true
  unitError.value = null

  try {
    await fetchUnitById(unitId)
    
    if (unit.value) {
      // ✅ Populate form với data từ VehicleUnit
      form.value = {
        vin: unit.value.vin,
        color: unit.value.color,
        status: unit.value.status,
        warehouse_id: unit.value.warehouse_id ?? null,
      }

      warehouseInput.value = unit.value.warehouse_id ?? null

      // ✅ Save original data
      originalData.value = {
        vin: unit.value.vin,
        color: unit.value.color,
        status: unit.value.status,
        warehouse_id: unit.value.warehouse_id ?? null,
      }
    }
  } catch (err: any) {
    console.error('Error loading unit:', err)
    unitError.value = err.message || 'Không thể tải thông tin xe'
  } finally {
    loadingUnit.value = false
  }
}

const getStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'available': 'Sẵn sàng',
    'reserved': 'Đã đặt cọc',
    'deployed': 'Đã điều phối',
    'sold': 'Đã bán',
    'paid': 'Đã thanh toán',
    'maintenance': 'Bảo trì',
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'available': 'ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
    'reserved': 'ml-2 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800',
    'deployed': 'ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
    'sold': 'ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800',
    'paid': 'ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800',
    'maintenance': 'ml-2 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800',
  }
  return classes[status] || 'ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
}

const validate = (): boolean => {
  validationErrors.value = []

  if (!form.value.vin || !form.value.vin.trim()) {
    validationErrors.value.push('Vui lòng nhập mã VIN')
  } else if (form.value.vin.trim().length < 10) {
    validationErrors.value.push('Mã VIN phải có ít nhất 10 ký tự')
  }

  if (!form.value.color || !form.value.color.trim()) {
    validationErrors.value.push('Vui lòng nhập màu xe')
  }

  if (!form.value.status) {
    validationErrors.value.push('Vui lòng chọn trạng thái')
  }

  // ✅ Check if trying to change status from sold/paid
  if (unit.value && ['sold', 'paid'].includes(unit.value.status)) {
    if (form.value.status !== unit.value.status) {
      validationErrors.value.push('Không thể thay đổi trạng thái của xe đã bán hoặc đã thanh toán')
    }
  }

  return validationErrors.value.length === 0
}

// ✅ Helper function để parse error message
const parseErrorMessage = (error: any): string => {
  let errorMessage = ''

  // Try to extract message from various error formats
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  } else if (error.message) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    errorMessage = 'Không thể cập nhật xe'
  }

  return errorMessage
}

const handleSubmit = async () => {
  if (!validate()) return

  if (!hasChanges.value) {
    alert('Không có thay đổi nào để lưu')
    return
  }

  submitting.value = true
  validationErrors.value = []

  try {
    // ✅ Build payload theo UpdateVehicleUnitDto - chỉ gửi fields đã thay đổi
    const payload: UpdateVehicleUnitDto = {}

    if (form.value.vin !== originalData.value.vin) {
      payload.vin = form.value.vin?.trim().toUpperCase()
    }

    if (form.value.color !== originalData.value.color) {
      payload.color = form.value.color?.trim()
    }

    if (form.value.status !== originalData.value.status) {
      payload.status = form.value.status
    }

    if (warehouseInput.value !== originalData.value.warehouse_id) {
      payload.warehouse_id = warehouseInput.value
    }

    console.log('[EditVehicleUnit] Submitting payload:', payload)

    const result = await updateUnit(unitId, payload)
    
    console.log('[EditVehicleUnit] Update result:', result)
    
    alert('Cập nhật xe thành công!')
    
    // Redirect to detail page
    router.push(`/vehicle_unit/detail/${unitId}`)
  } catch (err: any) {
    console.error('Error updating vehicle unit:', err)
    
    const errorMessage = parseErrorMessage(err)
    
    console.log('[EditVehicleUnit] Parsed error message:', errorMessage)
    
    // ✅ Handle specific error cases
    
    // Foreign key constraint - Warehouse không tồn tại
    if (errorMessage.includes('foreign key constraint') || 
        errorMessage.includes('fk_warehouse') ||
        errorMessage.includes('violates foreign key')) {
      validationErrors.value.push('ID kho không hợp lệ. Vui lòng nhập đúng ID kho tồn tại trong hệ thống.')
      // Clear warehouse input để user nhập lại
      warehouseInput.value = originalData.value.warehouse_id
      form.value.warehouse_id = originalData.value.warehouse_id
    }
    // VIN duplicate
    else if (errorMessage.includes('VIN') && 
             (errorMessage.includes('tồn tại') || 
              errorMessage.includes('duplicate') || 
              errorMessage.includes('unique'))) {
      validationErrors.value.push('Mã VIN này đã tồn tại trong hệ thống. Vui lòng nhập VIN khác.')
    }
    // Vehicle unit không tồn tại
    else if (errorMessage.includes('không tồn tại') || 
             errorMessage.includes('not found')) {
      validationErrors.value.push('Xe không tồn tại trong hệ thống.')
    }
    // Generic error
    else {
      validationErrors.value.push(errorMessage || 'Không thể cập nhật xe. Vui lòng thử lại.')
    }

    // Scroll to error
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  if (hasChanges.value) {
    const confirmed = confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?')
    if (!confirmed) return
  }
  
  router.push(`/vehicle_unit/detail/${unitId}`)
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadUnit()
})
</script>