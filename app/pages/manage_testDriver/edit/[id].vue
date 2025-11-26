<!-- FILE: pages/manage_testDriver/edit/[id].vue -->
<template>
  <div class="max-w-3xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Chỉnh Sửa Lịch Lái Thử</h2>

    <!-- Loading -->
    <div v-if="loading || loadingVehicles" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error }}
      <button @click="loadData" class="ml-3 underline">Thử lại</button>
    </div>

    <!-- Form -->
    <div v-else-if="slot" class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleSubmit">
        <!-- Current Vehicle Info (Read-only display) -->
        <div v-if="slot.vehicle" class="mb-5 p-4 bg-gray-50 rounded border">
          <label class="block text-gray-700 font-semibold mb-2">Xe hiện tại:</label>
          <div class="flex items-center gap-3">
            <!-- ✅ FIX: Thêm optional chaining -->
            <img 
              v-if="slot.vehicle?.mainImage"
              :src="slot.vehicle.mainImage"
              :alt="slot.vehicle.name"
              class="w-20 h-16 object-cover rounded"
            />
            <div v-else class="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
              <span class="text-gray-400 text-xs">No image</span>
            </div>
            <div>
              <div class="font-semibold">{{ slot.vehicle?.name || 'N/A' }}</div>
              <div class="text-sm text-gray-600">
                {{ slot.vehicle?.model || '' }} {{ slot.vehicle?.version ? `- ${slot.vehicle.version}` : '' }}
              </div>
            </div>
          </div>
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
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          />
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
          <p class="text-sm text-gray-600 mt-1">
            Hiện tại đã có {{ slot?.booked_customers ?? 0 }} người đăng ký
          </p>
        </div>

        <!-- Status -->
        <div class="mb-5">
          <label class="block text-gray-700 font-semibold mb-2">
            Trạng thái <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-800"
            :disabled="submitting"
          >
            <option value="open">Đang mở</option>
            <option value="hidden">Đã ẩn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
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
            <li>Số lượng khách tối đa không được nhỏ hơn số người đã đăng ký ({{ slot?.booked_customers ?? 0 }})</li>
            <li>Nếu thay đổi xe, hệ thống sẽ kiểm tra xem có slot nào trùng thời gian không</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
          <button
            type="button"
            @click="router.back()"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointment } from '~/composables/useAppointments'
import type { UpdateTestDriveSlotDto } from '~/types/appointment'

const route = useRoute()
const router = useRouter()
const slotId = parseInt(route.params.id as string)

// ===============================
// COMPOSABLE
// ===============================
const {
  loading,
  error,
  slot,
  fetchSlot,
  updateSlot
} = useAppointment()

// ===============================
// STATE
// ===============================
const submitting = ref(false)
const validationErrors = ref<string[]>([])
const loadingVehicles = ref(false)
const vehiclesError = ref<string | null>(null)
const vehicles = ref<any[]>([])

const form = ref<UpdateTestDriveSlotDto>({
  vehicle_id: undefined,
  slot_start: '',
  slot_end: '',
  max_customers: 1,
  status: 'open'
})

// ===============================
// COMPUTED
// ===============================

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
    form.value.vehicle_id &&
    form.value.slot_start &&
    form.value.slot_end &&
    (form.value.max_customers ?? 0) >= (slot.value?.booked_customers ?? 0) &&
    new Date(form.value.slot_end) > new Date(form.value.slot_start)
  )
})

// ===============================
// METHODS
// ===============================

const formatDateTimeLocal = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// ✅ FIX: Fetch vehicles from API
const fetchVehicles = async () => {
  loadingVehicles.value = true
  vehiclesError.value = null

  try {
    const response = await $fetch('/api/vehicle')
    vehicles.value = response as any[]
  } catch (err: any) {
    console.error('Error fetching vehicles:', err)
    vehiclesError.value = err.message || 'Không thể tải danh sách xe'
    // Không block form - user vẫn có thể giữ nguyên xe hiện tại
  } finally {
    loadingVehicles.value = false
  }
}

const loadSlot = async () => {
  try {
    await fetchSlot(slotId)
    
    // ✅ FIX: Kiểm tra slot.value tồn tại trước khi access
    if (slot.value) {
      form.value = {
        vehicle_id: slot.value.vehicle_id,
        slot_start: formatDateTimeLocal(slot.value.slot_start),
        slot_end: formatDateTimeLocal(slot.value.slot_end),
        max_customers: slot.value.max_customers,
        status: slot.value.status as any
      }
    }
  } catch (err: any) {
    console.error('Error loading slot:', err)
    // Error đã được set bởi composable
  }
}

const loadData = async () => {
  // ✅ FIX: Load slot trước, sau đó mới load vehicles
  await loadSlot()
  await fetchVehicles()
}

const validate = (): boolean => {
  validationErrors.value = []

  if (!form.value.vehicle_id) {
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

    const now = new Date()
    if (end < now) {
      validationErrors.value.push('Không thể tạo slot đã kết thúc trong quá khứ')
    }
  }

  const maxCustomers = form.value.max_customers ?? 0
  
  if (maxCustomers < 1) {
    validationErrors.value.push('Số lượng khách tối đa phải lớn hơn 0')
  }

  const bookedCustomers = slot.value?.booked_customers ?? 0
  if (maxCustomers < bookedCustomers) {
    validationErrors.value.push(
      `Số lượng khách tối đa không được nhỏ hơn số người đã đăng ký (${bookedCustomers})`
    )
  }

  return validationErrors.value.length === 0
}

const handleSubmit = async () => {
  if (!validate()) {
    return
  }

  submitting.value = true
  validationErrors.value = []

  try {
    const payload: UpdateTestDriveSlotDto = {
      ...form.value,
      slot_start: new Date(form.value.slot_start!).toISOString(),
      slot_end: new Date(form.value.slot_end!).toISOString(),
    }

    await updateSlot(slotId, payload)
    
    alert('Cập nhật lịch lái thử thành công!')
    router.push(`/manage_testDriver/slot/${slotId}`)
  } catch (err: any) {
    console.error('Error updating slot:', err)
    
    const errorMessage = err.message || 'Không thể cập nhật lịch'
    
    if (errorMessage.includes('overlapping')) {
      validationErrors.value.push('Xe này đã có lịch trùng thời gian')
    } else {
      validationErrors.value.push(errorMessage)
    }
  } finally {
    submitting.value = false
  }
}

// ===============================
// WATCHERS
// ===============================

watch([
  () => form.value.slot_start,
  () => form.value.slot_end,
  () => form.value.max_customers,
], () => {
  if (validationErrors.value.length > 0) {
    validate()
  }
})

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadData()
})
</script>