<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 text-4xl mb-3">⚠️</div>
        <h3 class="text-lg font-semibold text-red-900 mb-2">Có lỗi xảy ra</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadAppointment" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Thử lại
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="appointment" class="space-y-6">
        <!-- Header Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold mb-2">Chi Tiết Lịch Hẹn</h1>
                <p class="text-blue-100">Mã: #{{ appointment.id }}</p>
              </div>
              <div class="text-right">
                <span
                  class="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                  :class="getStatusBadgeClass(appointment.status)"
                >
                  {{ getStatusText(appointment.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="px-6 py-4 bg-gray-50 border-b">
            <div class="flex items-center justify-between max-w-2xl mx-auto">
              <div
                v-for="(step, index) in statusSteps"
                :key="step.status"
                class="flex items-center"
                :class="{ 'flex-1': index < statusSteps.length - 1 }"
              >
                <!-- Step Circle -->
                <div class="flex flex-col items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                    :class="getStepClass(step.status, appointment.status)"
                  >
                    <span v-if="isStepCompleted(step.status, appointment.status)" class="text-white">✓</span>
                    <span v-else class="text-sm font-semibold">{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs mt-2 text-gray-600">{{ step.label }}</span>
                </div>

                <!-- Connecting Line -->
                <div
                  v-if="index < statusSteps.length - 1"
                  class="flex-1 h-0.5 mx-2"
                  :class="isStepCompleted(step.status, appointment.status) ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle & Slot Info -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Vehicle Card -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Thông Tin Xe
            </h2>

            <div v-if="appointment.test_drive_slot?.vehicle" class="space-y-4">
              <!-- Vehicle Image -->
              <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="getVehicleImage(appointment.test_drive_slot.vehicle)"
                  :src="getVehicleImage(appointment.test_drive_slot.vehicle)"
                  :alt="appointment.test_drive_slot.vehicle.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Vehicle Details -->
              <div class="space-y-3">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ appointment.test_drive_slot.vehicle.name }}
                  </h3>
                </div>

                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="text-gray-500">Model:</span>
                    <span class="ml-2 font-medium text-gray-900">
                      {{ appointment.test_drive_slot.vehicle.model || 'N/A' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500">Phiên bản:</span>
                    <span class="ml-2 font-medium text-gray-900">
                      {{ appointment.test_drive_slot.vehicle.version || 'N/A' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500">Năm:</span>
                    <span class="ml-2 font-medium text-gray-900">
                      {{ appointment.test_drive_slot.vehicle.year || 'N/A' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500">Màu sắc:</span>
                    <span class="ml-2 font-medium text-gray-900">
                      {{ appointment.test_drive_slot.vehicle.color?.join(', ') || 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500 py-8">
              Không có thông tin xe
            </div>
          </div>

          <!-- Schedule Card -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Lịch Trình
            </h2>

            <div v-if="appointment.test_drive_slot" class="space-y-4">
              <!-- Date -->
              <div class="flex items-start">
                <div class="flex-shrink-0 w-24 text-sm text-gray-500">Ngày:</div>
                <div class="flex-1 font-medium text-gray-900">
                  {{ formatDate(appointment.test_drive_slot.slot_start) }}
                </div>
              </div>

              <!-- Time -->
              <div class="flex items-start">
                <div class="flex-shrink-0 w-24 text-sm text-gray-500">Giờ:</div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ formatTime(appointment.test_drive_slot.slot_start) }} - 
                    {{ formatTime(appointment.test_drive_slot.slot_end) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Thời lượng: {{ calculateDuration(appointment.test_drive_slot.slot_start, appointment.test_drive_slot.slot_end) }}
                  </div>
                </div>
              </div>

              <!-- Capacity -->
              <div class="flex items-start">
                <div class="flex-shrink-0 w-24 text-sm text-gray-500">Số chỗ:</div>
                <div class="flex-1 font-medium text-gray-900">
                  {{ appointment.test_drive_slot.booked_customers }}/{{ appointment.test_drive_slot.max_customers }} người
                </div>
              </div>

              <!-- Slot Status -->
              <div class="flex items-start">
  <div class="flex-shrink-0 w-24 text-sm text-gray-500">Trạng thái slot:</div>
  <div class="flex-1">
    <!-- ✅ FIX: Dùng >= để so sánh, không phải - (trừ) -->
    <span
      v-if="appointment.test_drive_slot.booked_customers >= appointment.test_drive_slot.max_customers"
      class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
    >
      Hết chỗ
    </span>
    
    <span
      v-else
      class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
    >
      Còn {{ appointment.test_drive_slot.max_customers - appointment.test_drive_slot.booked_customers }} chỗ
    </span>
  </div>
</div>
            </div>

            <div v-else class="text-center text-gray-500 py-8">
              Không có thông tin lịch trình
            </div>
          </div>
        </div>

        <!-- Booking Info Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thông Tin Đặt Lịch
          </h2>

          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0 w-32 text-gray-500">Mã đặt lịch:</div>
              <div class="flex-1 font-medium text-gray-900">#{{ appointment.id }}</div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-32 text-gray-500">Ngày tạo:</div>
              <div class="flex-1 font-medium text-gray-900">
                {{ formatDateTime(appointment.created_at) }}
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-32 text-gray-500">Cập nhật:</div>
              <div class="flex-1 font-medium text-gray-900">
                {{ formatDateTime(appointment.updated_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex flex-wrap gap-4 justify-center">
            <!-- Cancel Button -->
            <button
              v-if="canCancel(appointment.status)"
              @click="showCancelModal = true"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy lịch hẹn
            </button>          
          </div>
        </div>

        <!-- Notes Card -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lưu ý quan trọng
          </h3>
          <ul class="text-sm text-blue-800 space-y-2">
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Vui lòng đến trước 15 phút để làm thủ tục</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Mang theo CCCD/CMND và bằng lái xe hợp lệ</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">•</span>
              <span>Nếu cần hủy, vui lòng thông báo trước ít nhất 3 giờ</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showCancelModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Xác nhận hủy lịch</h3>
          <p class="text-gray-600">
            Bạn có chắc chắn muốn hủy lịch hẹn lái thử này không? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showCancelModal = false"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Không, giữ lại
          </button>
          <button
            @click="confirmCancel"
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Đang xử lý...' : 'Có, hủy lịch' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from '#app'
import { useAppointment } from '~/composables/useAppointments'
import type { Appointment } from '~/types/appointment'

const router = useRouter()
const route = useRoute()

const {
  loading,
  error,
  appointment,
  fetchAppointment,
  updateAppointment,
  deleteAppointment
} = useAppointment()

const showCancelModal = ref(false)

// Status Steps
const statusSteps = [
  { status: 'confirm', label: 'Đã đặt' },
  { status: 'completed', label: 'Hoàn thành' }
]

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  const id = parseInt(route.params.id as string)
  if (!id || isNaN(id)) {
    error.value = 'ID không hợp lệ'
    return
  }
  await loadAppointment()
})

const loadAppointment = async () => {
  const id = parseInt(route.params.id as string)
  await fetchAppointment(id)
}

// ===============================
// IMAGE HELPERS
// ===============================
const getVehicleImage = (vehicle: any): string => {
  // Try different image fields
  if (vehicle.mainImage) return vehicle.mainImage
  if (vehicle.image_url) return vehicle.image_url
  if (vehicle.images && vehicle.images.length > 0) {
    const mainImg = vehicle.images.find((img: any) => img.is_main)
    if (mainImg?.url) return mainImg.url
    if (vehicle.images[0]?.url) return vehicle.images[0].url
  }
  return ''
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// ===============================
// STATUS HELPERS
// ===============================
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'confirm': 'Xác nhận',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    'confirm': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getSlotStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'open': 'Còn chỗ',
    'full': 'Đã đầy',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status] || status
}

const getSlotStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    'open': 'bg-green-100 text-green-800',
    'full': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getStepClass = (stepStatus: string, currentStatus: string): string => {
  if (isStepCompleted(stepStatus, currentStatus)) {
    return 'bg-green-500 border-green-500 text-white'
  }
  if (stepStatus === currentStatus) {
    return 'bg-blue-500 border-blue-500 text-white'
  }
  return 'bg-white border-gray-300 text-gray-400'
}

const isStepCompleted = (stepStatus: string, currentStatus: string): boolean => {
  const order = ['confirm', 'completed', 'cancelled']
  const stepIndex = order.indexOf(stepStatus)
  const currentIndex = order.indexOf(currentStatus)
  return currentIndex > stepIndex
}

// ===============================
// DATE/TIME FORMATTERS
// ===============================
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculateDuration = (start?: string, end?: string): string => {
  if (!start || !end) return 'N/A'
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = Math.abs(endDate.getTime() - startDate.getTime())
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

// ===============================
// ACTIONS
// ===============================
const canCancel = (status: string): boolean => {
  return status === 'confirm'
}

const canReschedule = (status: string): boolean => {
  return status === 'confirm'
}

const confirmCancel = async () => {
  if (!appointment.value) return

  try {
    await updateAppointment(appointment.value.id, { status: 'cancelled' })
    showCancelModal.value = false
    
    // Reload appointment
    await loadAppointment()
    
    // Show success message
    alert('Đã hủy lịch hẹn thành công')
  } catch (err: any) {
    console.error('Error cancelling appointment:', err)
    alert(err.message || 'Không thể hủy lịch hẹn')
  }
}

const goBack = () => {
  router.push('/testDriver/ListTest')
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>