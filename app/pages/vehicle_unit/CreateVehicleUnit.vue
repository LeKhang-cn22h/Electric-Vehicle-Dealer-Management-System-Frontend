<!-- FILE: pages/admin/vehicle-units/create.vue -->
<template>
  <div class="max-w-3xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Tạo Xe Cụ Thể Mới</h2>

    <!-- Loading -->
    <div v-if="loadingVehicles || loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error loading vehicles -->
    <div v-else-if="vehiclesError" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ vehiclesError }}
      <button @click="loadVehicles" class="ml-3 underline">Thử lại</button>
    </div>

    <!-- Form -->
    <div v-else class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleSubmit">
        <!-- Vehicle Selection -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Chọn Mẫu Xe <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.vehicle_id"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          >
            <option :value="0">-- Chọn xe --</option>
            <option v-for="vehicle in vehiclesList" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.name }} - {{ vehicle.model }} ({{ vehicle.year || 'N/A' }})
            </option>
          </select>
          <p v-if="vehiclesList.length === 0" class="text-sm text-gray-500 mt-1">
            Không có xe nào trong hệ thống
          </p>
          <p v-else class="text-sm text-gray-500 mt-1">
            Tổng {{ vehiclesList.length }} mẫu xe có sẵn
          </p>
        </div>

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

        <!-- Status Display (Read-only) -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Trạng Thái
          </label>
          <div class="px-4 py-2 bg-gray-50 border rounded text-gray-700">
            <span class="inline-flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Available (Sẵn sàng)
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Xe mới tạo sẽ tự động ở trạng thái "Available"
          </p>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="mb-5 p-4 bg-red-50 border border-red-200 rounded">
          <p class="text-red-700 font-semibold mb-2">Lỗi:</p>
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
            <li>Xe sẽ được tạo với trạng thái "Available" mặc định</li>
            <li>Bạn có thể điều phối xe xuống kho sau khi tạo</li>
            <li>Xe chỉ có thể được bán khi ở trạng thái "Available" hoặc "Deployed"</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Đang tạo...' : 'Tạo xe' }}
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
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicle } from '~/composables/useVehicle'
import { useVehicleUnit } from '~/composables/useVehicleUnit'
import type { CreateVehicleUnitDto } from '~/types/vehicle_unit'
import type { Vehicle } from '~/types/vehicle'
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
const router = useRouter()

// ===============================
// COMPOSABLES
// ===============================
const { loading, error, vehicles, fetchAll } = useVehicle()
const { createUnit } = useVehicleUnit()

// ===============================
// STATE
// ===============================
const vehiclesError = ref<string | null>(null)
const loadingVehicles = ref(false)
const submitting = ref(false)
const validationErrors = ref<string[]>([])

// ✅ Form với status mặc định là 'available'
const form = ref<CreateVehicleUnitDto>({
  vehicle_id: 0,
  vin: '',
  color: '',
  status: 'available', // ✅ Mặc định
})

// ===============================
// COMPUTED
// ===============================

// ✅ Map vehicles từ useVehicle
const vehiclesList = computed(() => {
  return (vehicles.value as Vehicle[]).map(v => ({
    id: v.id,
    name: v.name,
    model: v.model || 'N/A',
    year: v.year
  }))
})

// ✅ Validate form
const isFormValid = computed(() => {
  return (
    form.value.vehicle_id > 0 &&
    form.value.vin.trim().length > 0 &&
    form.value.color.trim().length > 0
  )
})

// ===============================
// METHODS
// ===============================

// ✅ Load vehicles from API
const loadVehicles = async () => {
  loadingVehicles.value = true
  vehiclesError.value = null

  try {
    await fetchAll()
    
    if (vehiclesList.value.length === 0) {
      vehiclesError.value = 'Không có xe nào trong hệ thống. Vui lòng thêm xe trước khi tạo vehicle unit.'
    }
  } catch (err: any) {
    console.error('Error fetching vehicles:', err)
    vehiclesError.value = error.value || 'Không thể tải danh sách xe. Vui lòng thử lại.'
  } finally {
    loadingVehicles.value = false
  }
}

// ✅ Validate form
const validate = (): boolean => {
  validationErrors.value = []

  if (!form.value.vehicle_id || form.value.vehicle_id === 0) {
    validationErrors.value.push('Vui lòng chọn mẫu xe')
  }

  if (!form.value.vin.trim()) {
    validationErrors.value.push('Vui lòng nhập mã VIN')
  } else if (form.value.vin.trim().length < 10) {
    validationErrors.value.push('Mã VIN phải có ít nhất 10 ký tự')
  }

  if (!form.value.color.trim()) {
    validationErrors.value.push('Vui lòng nhập màu xe')
  }

  return validationErrors.value.length === 0
}

// ✅ Submit handler
const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  validationErrors.value = []

  try {
    const payload: CreateVehicleUnitDto = {
      vehicle_id: form.value.vehicle_id,
      vin: form.value.vin.trim().toUpperCase(), // Uppercase VIN
      color: form.value.color.trim(),
      status: 'available', // ✅ Luôn là available
    }

    console.log('[CreateVehicleUnit] Submitting:', payload)

    const result = await createUnit(payload)
    
    console.log('[CreateVehicleUnit] Success:', result)
    
    alert('Tạo xe thành công!')
    
    router.push(`/vehicle_unit`)
  } catch (err: any) {
    console.error('Error creating vehicle unit:', err)
    
    const errorMessage = err.message || 'Không thể tạo xe'
    
    // Handle specific errors
    if (errorMessage.includes('VIN') && errorMessage.includes('tồn tại')) {
      validationErrors.value.push('Mã VIN này đã tồn tại trong hệ thống')
    } else if (errorMessage.includes('Vehicle không tồn tại')) {
      validationErrors.value.push('Mẫu xe không tồn tại')
    } else {
      validationErrors.value.push(errorMessage)
    }
  } finally {
    submitting.value = false
  }
}

// ✅ Go back
const goBack = () => {
  router.push('/admin/vehicle-units')
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadVehicles()
})
</script>