<!-- FILE: pages/manage_testDriver/create.vue -->
<template>
  <div class="max-w-3xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Tạo Lịch Lái Thử Mới</h2>

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
            Xe <span class="text-red-500">*</span>
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
            Tổng {{ vehiclesList.length }} xe có sẵn
          </p>
        </div>

        <!-- Slot Start -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Thời gian bắt đầu <span class="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            v-model="form.slot_start"
            required
            :min="minDateTime"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          />
          <p class="text-xs text-gray-500 mt-1">
            Lịch phải được tạo ít nhất 30 phút trước thời gian bắt đầu
          </p>
        </div>

        <!-- Slot End -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Thời gian kết thúc <span class="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            v-model="form.slot_end"
            required
            :min="form.slot_start"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          />
          <p v-if="durationText" class="text-sm text-gray-600 mt-1">
            Thời lượng: {{ durationText }}
          </p>
        </div>

        <!-- Max Customers -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Số lượng khách tối đa <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model.number="form.max_customers"
            required
            min="1"
            max="20"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          />
          <p class="text-xs text-gray-500 mt-1">
            Khuyến nghị: 3-5 khách mỗi lịch lái thử
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
            <li>Thời gian kết thúc phải sau thời gian bắt đầu</li>
            <li>Không thể tạo lịch trùng thời gian với lịch khác của cùng xe</li>
            <li>Lịch sẽ tự động được đặt trạng thái "Đang mở"</li>
            <li>Khách hàng sẽ có thể đặt lịch ngay sau khi tạo</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Đang tạo...' : 'Tạo lịch' }}
          </button>
          <button
            type="button"
            @click="router.push('/manage_testDriver')"
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
import { useAppointment } from '~/composables/useAppointments'
import { useVehicle } from '~/composables/useVehicle'
import type { CreateTestDriveSlotDto } from '~/types/appointment'
import type { Vehicle } from '~/types/vehicle'

const router = useRouter()

// ===============================
// COMPOSABLES
// ===============================
const { createSlot } = useAppointment()
const { vehicles, loading, error, fetchAll } = useVehicle()

// ===============================
// STATE
// ===============================
const submitting = ref(false)
const validationErrors = ref<string[]>([])
const loadingVehicles = ref(false)
const vehiclesError = ref<string | null>(null)

const form = ref<CreateTestDriveSlotDto>({
  vehicle_id: 0,
  slot_start: '',
  slot_end: '',
  max_customers: 5,
  status: 'open'
})

// ===============================
// COMPUTED
// ===============================

// ✅ Map vehicles từ useVehicle thành list hiển thị
const vehiclesList = computed(() => {
  return (vehicles.value as Vehicle[]).map(v => ({
    id: v.id,
    name: v.name,
    model: v.model || 'N/A',
    year: v.year
  }))
})

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30)
  return now.toISOString().slice(0, 16)
})

const durationText = computed(() => {
  if (!form.value.slot_start || !form.value.slot_end) return ''
  
  const start = new Date(form.value.slot_start)
  const end = new Date(form.value.slot_end)
  const diff = end.getTime() - start.getTime()
  
  if (diff <= 0) return 'Thời gian không hợp lệ'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
})

const isFormValid = computed(() => {
  return (
    form.value.vehicle_id > 0 &&
    form.value.slot_start &&
    form.value.slot_end &&
    form.value.max_customers != null &&
    form.value.max_customers >= 1 &&
    new Date(form.value.slot_end) > new Date(form.value.slot_start)
  )
})

// ===============================
// METHODS
// ===============================

// ✅ Load vehicles using useVehicle composable
const loadVehicles = async () => {
  loadingVehicles.value = true
  vehiclesError.value = null

  try {
    await fetchAll()
    
    if (vehiclesList.value.length === 0) {
      vehiclesError.value = 'Không có xe nào trong hệ thống. Vui lòng thêm xe trước khi tạo lịch.'
    }
  } catch (err: any) {
    console.error('Error fetching vehicles:', err)
    vehiclesError.value = error.value || 'Không thể tải danh sách xe. Vui lòng thử lại.'
  } finally {
    loadingVehicles.value = false
  }
}

const validate = (): boolean => {
  validationErrors.value = []

  if (!form.value.vehicle_id || form.value.vehicle_id === 0) {
    validationErrors.value.push('Vui lòng chọn xe')
  }

  if (!form.value.slot_start) {
    validationErrors.value.push('Vui lòng chọn thời gian bắt đầu')
  }

  if (!form.value.slot_end) {
    validationErrors.value.push('Vui lòng chọn thời gian kết thúc')
  }

  if (form.value.slot_start && form.value.slot_end) {
    const start = new Date(form.value.slot_start)
    const end = new Date(form.value.slot_end)
    
    if (end <= start) {
      validationErrors.value.push('Thời gian kết thúc phải sau thời gian bắt đầu')
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60)
    if (duration < 30) {
      validationErrors.value.push('Thời lượng lái thử phải ít nhất 30 phút')
    }

    const now = new Date()
    const minStart = new Date(now.getTime() + 30 * 60 * 1000)
    if (start < minStart) {
      validationErrors.value.push('Thời gian bắt đầu phải ít nhất 30 phút kể từ bây giờ')
    }
  }

  if (!form.value.max_customers || form.value.max_customers < 1) {
    validationErrors.value.push('Số lượng khách tối đa phải lớn hơn 0')
  }

  if (form.value.max_customers != null && form.value.max_customers > 20) {
    validationErrors.value.push('Số lượng khách tối đa không được vượt quá 20')
  }

  return validationErrors.value.length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  validationErrors.value = []

  try {
    const payload: CreateTestDriveSlotDto = {
      vehicle_id: form.value.vehicle_id,
      slot_start: new Date(form.value.slot_start).toISOString(),
      slot_end: new Date(form.value.slot_end).toISOString(),
      max_customers: form.value.max_customers,
      status: 'open'
    }

    const result = await createSlot(payload)
    
    alert('Tạo lịch lái thử thành công!')
    router.push(`/manage_testDriver/slot/${result.id}`)
  } catch (err: any) {
    console.error('Error creating slot:', err)
    
    const errorMessage = err.message || 'Không thể tạo lịch'
    
    if (errorMessage.includes('overlapping') || errorMessage.includes('trùng')) {
      validationErrors.value.push('Xe này đã có lịch trùng thời gian. Vui lòng chọn thời gian khác.')
    } else if (errorMessage.includes('slot_end must be greater')) {
      validationErrors.value.push('Thời gian kết thúc phải sau thời gian bắt đầu')
    } else {
      validationErrors.value.push(errorMessage)
    }
  } finally {
    submitting.value = false
  }
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadVehicles()
})
</script>