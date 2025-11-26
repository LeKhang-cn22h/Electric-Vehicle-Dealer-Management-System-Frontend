<template>
  <div class="max-w-3xl mx-auto p-5">
    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-blue-800 mb-2">Đặt Lịch Lái Thử</h2>
        <p class="text-gray-600">Trải nghiệm trực tiếp chiếc xe bạn quan tâm</p>

        <button
          @click="goToListTest"
          class="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 mt-3"
        >
          Xem danh sách lái thử
        </button>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>
        <button @click="error = null" class="text-red-700 hover:text-red-900 font-bold">✕</button>
      </div>

      <!-- Step Content -->
      <div>
        <!-- Step 1: Chọn Slot (Xe + Thời gian) -->
        <div v-if="currentStep === 1" class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Chọn Lịch Lái Thử</h3>
          
          <div v-if="availableSlots.length === 0" class="text-center text-gray-500 py-10">
            <div class="text-4xl mb-3">📭</div>
            <div>Hiện tại không có lịch lái thử nào còn chỗ.</div>
            <div class="text-sm mt-2">Vui lòng quay lại sau!</div>
          </div>

          <div v-else class="grid gap-5">
            <div
              v-for="slot in availableSlots"
              :key="slot.id"
              @click="selectSlot(slot)"
              :class="[
                'border-2 rounded-lg p-5 cursor-pointer transition-all duration-300',
                selectedSlot?.id === slot.id
                  ? 'border-blue-800 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-800'
              ]"
            >
              <div class="flex gap-4">
                <!-- Vehicle Image -->
                <img
                  :src="getImageUrl(slot.vehicle?.mainImage)"
                  :alt="slot.vehicle?.name"
                  class="w-32 h-24 object-cover rounded"
                  @error="handleImageError"
                />

                <!-- Slot Info -->
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-800 mb-1">
                    {{ slot.vehicle?.name || 'N/A' }}
                  </h4>
                  <p class="text-sm text-gray-600 mb-2">
                    Model: {{ slot.vehicle?.model || 'N/A' }} | Năm: {{ slot.vehicle?.year || 'N/A' }}
                  </p>
                  <div class="flex items-center gap-4 text-sm">
                    <span class="text-blue-800 font-medium">
                      {{ formatDate(slot.slot_start) }}
                    </span>
                    <span class="text-blue-800 font-medium">
                       {{ formatTime(slot.slot_start) }} - {{ formatTime(slot.slot_end) }}
                    </span>
                  </div>
                  <!-- Hiển thị số chỗ còn lại -->
                  <div class="mt-2 flex items-center gap-2">
                    <span class="text-sm text-gray-600">
                      Còn {{ slot.max_customers - slot.booked_customers }}/{{ slot.max_customers }} chỗ
                    </span>
                    <!-- Badge cảnh báo nếu sắp hết -->
                    <span 
                      v-if="slot.max_customers - slot.booked_customers <= 2"
                      class="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full"
                    >
                      Sắp hết
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông tin tổng số slot -->
          <div v-if="slots.length > 0" class="mt-4 text-center text-sm text-gray-500">
            Hiển thị {{ availableSlots.length }} / {{ slots.length }} lịch còn chỗ
          </div>
        </div>

        <!-- Step 2: Xác nhận -->
        <div v-if="currentStep === 2" class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Xác Nhận Thông Tin</h3>

          <div class="bg-gray-100 rounded-lg p-5 space-y-3 mb-5">
            <div class="flex gap-4">
              <img
                :src="getImageUrl(selectedSlot?.vehicle?.mainImage)"
                :alt="selectedSlot?.vehicle?.name"
                class="w-32 h-24 object-cover rounded"
                @error="handleImageError"
              />
              <div>
                <div><strong>Xe:</strong> {{ selectedSlot?.vehicle?.name }}</div>
                <div><strong>Model:</strong> {{ selectedSlot?.vehicle?.model }}</div>
                <div><strong>Năm:</strong> {{ selectedSlot?.vehicle?.year }}</div>
                <div>
                  <strong>Thời gian:</strong> {{ formatDate(selectedSlot?.slot_start) }} 
                  ({{ formatTime(selectedSlot?.slot_start) }} - {{ formatTime(selectedSlot?.slot_end) }})
                </div>
              </div>
            </div>
          </div>

          <p class="text-gray-600 text-sm">
            Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đặt lịch.
          </p>
        </div>

        <!-- Step 3: Thành công -->
        <div v-if="currentStep === 3" class="text-center mb-8">
          <div class="text-green-500 text-6xl mb-5">✓</div>
          <h3 class="text-xl font-semibold mb-5">Đặt Lịch Thành Công!</h3>

          <div class="bg-gray-100 rounded-lg p-5 text-left space-y-3 mb-5">
            <div><strong>Mã đặt lịch:</strong> #{{ bookingConfirmation?.id }}</div>
            <div><strong>Xe:</strong> {{ bookingConfirmation?.vehicleName }}</div>
            <div>
              <strong>Thời gian:</strong> {{ bookingConfirmation?.date }} 
              ({{ bookingConfirmation?.time }})
            </div>
            <div>
              <strong>Trạng thái:</strong> 
              <span :class="getStatusClass(bookingConfirmation?.status)">
                {{ getStatusText(bookingConfirmation?.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button
            v-if="currentStep > 1 && currentStep < 3"
            @click="previousStep"
            :disabled="loading"
            class="px-6 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Quay lại
          </button>

          <button
            v-if="currentStep === 1"
            @click="nextStep"
            :disabled="!canProceed || loading"
            class="px-6 py-2 rounded bg-blue-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed ml-auto"
          >
            Tiếp tục
          </button>

          <button
            v-if="currentStep === 2"
            @click="submitBooking"
            :disabled="!canProceed || loading"
            class="px-6 py-2 rounded bg-blue-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed ml-auto"
          >
            {{ loading ? 'Đang xử lý...' : 'Đặt Lịch Ngay' }}
          </button>

          <button
            v-if="currentStep === 3"
            @click="resetBooking"
            class="px-6 py-2 rounded bg-blue-800 text-white mx-auto"
          >
            Đặt Lịch Mới
          </button>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="flex justify-between mt-10 relative">
        <div class="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
        <div
          v-for="step in steps"
          :key="step.number"
          class="flex flex-col items-center relative z-10"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-white"
            :class="
              currentStep === step.number
                ? 'bg-blue-800'
                : currentStep > step.number
                ? 'bg-green-500'
                : 'bg-gray-300'
            "
          >
            {{ step.number }}
          </div>
          <span class="text-xs text-gray-500 text-center">{{ step.label }}</span>
        </div>
      </div>
    </div>

    <!-- ✅ ERROR MODAL -->
    <div
      v-if="showErrorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeErrorModal"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ errorModalTitle }}</h3>
          <p class="text-gray-600">{{ errorModalMessage }}</p>
        </div>

        <div class="flex gap-3">
          <button
            @click="goToMyBookings"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem lịch của tôi
          </button>
          <button
            @click="closeErrorModal"
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Chọn lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAppointment } from '~/composables/useAppointments'
import type { TestDriveSlot, CreateAppointmentDto } from '~/types/appointment'

const router = useRouter()

// ===============================
// COMPOSABLE
// ===============================
const {
  loading,
  error,
  slots,
  fetchSlotsCustomer,
  createAppointment
} = useAppointment()

// ===============================
// STATE
// ===============================
const currentStep = ref(1)
const selectedSlot = ref<TestDriveSlot | null>(null)
const bookingConfirmation = ref<{
  id: number
  vehicleName: string
  date: string
  time: string
  status: string
} | null>(null)

// ✅ ERROR MODAL STATE
const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalMessage = ref('')

const steps = [
  { number: 1, label: 'Chọn Lịch' },
  { number: 2, label: 'Xác Nhận' },
  { number: 3, label: 'Hoàn Tất' }
]

// ===============================
// COMPUTED
// ===============================

const availableSlots = computed(() => {
  return slots.value.filter(slot => {
    const hasAvailableSpots = slot.booked_customers < slot.max_customers
    const hasValidMaxCustomers = slot.max_customers > 0
    return hasAvailableSpots && hasValidMaxCustomers
  })
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedSlot.value !== null
    case 2:
      return true
    default:
      return true
  }
})

// ===============================
// HELPER FUNCTIONS
// ===============================

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="240"%3E%3Crect width="320" height="240" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
  }
  
  if (imagePath.startsWith('http')) return imagePath
  return `/images/${imagePath}`
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  const originalSrc = target.src
  
  if (originalSrc.startsWith('data:image/svg')) return
  
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="240"%3E%3Crect width="320" height="240" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status?: string) => {
  const statusMap: Record<string, string> = {
    'confirm': 'Đã xác nhận',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status || 'pending'] || 'Chờ xác nhận'
}

const getStatusClass = (status?: string) => {
  const statusClassMap: Record<string, string> = {
    'pending': 'text-yellow-600 font-semibold',
    'confirmed': 'text-green-600 font-semibold',
    'completed': 'text-blue-600 font-semibold',
    'cancelled': 'text-red-600 font-semibold'
  }
  return statusClassMap[status || 'pending'] || 'text-gray-600'
}

// ===============================
// ACTIONS
// ===============================

const selectSlot = (slot: TestDriveSlot) => {
  selectedSlot.value = slot
}

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}

const previousStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitBooking = async () => {
  if (!selectedSlot.value) return

  try {
    // ✅ Clear error trước khi submit
    error.value = null

    const payload: CreateAppointmentDto = {
      test_drive_slot_id: selectedSlot.value.id,
      status: 'confirm'
    }

    const result = await createAppointment(payload)

    bookingConfirmation.value = {
      id: result.id,
      vehicleName: selectedSlot.value.vehicle?.name || 'N/A',
      date: formatDate(selectedSlot.value.slot_start),
      time: `${formatTime(selectedSlot.value.slot_start)} - ${formatTime(selectedSlot.value.slot_end)}`,
      status: result.status
    }

    currentStep.value = 3
    console.log('✅ Booking created:', result)
  } catch (err: any) {
    console.error('❌ Error creating booking:', err)
    
    // ✅ NGAY LẬP TỨC CLEAR ERROR TỪ COMPOSABLE
    error.value = null
    
    // ✅ EXTRACT ERROR MESSAGE
    const errorMessage = err.response?.data?.message || err.message || 'Không thể tạo lịch hẹn'
    const statusCode = err.response?.status
    
    console.log('📊 Error details:', { statusCode, errorMessage })
    
    // ✅ PHÂN LOẠI ERROR VÀ CHỈ HIỂN THỊ MODAL
    if (
      errorMessage.includes('đã đặt lịch') || 
      errorMessage.includes('already') ||
      errorMessage.includes('Duplicate') ||
      statusCode === 409
    ) {
      // Lỗi trùng lặp
      errorModalTitle.value = 'Đã có lịch hẹn'
      errorModalMessage.value = errorMessage
      showErrorModal.value = true
      
      // ✅ QUAY VỀ STEP 1 SAU 3 GIÂY
      setTimeout(() => {
        if (showErrorModal.value) {
          currentStep.value = 1
          selectedSlot.value = null
        }
      }, 3000)
    } else if (
      errorMessage.includes('full') || 
      errorMessage.includes('đầy') || 
      errorMessage.includes('hết chỗ') ||
      statusCode === 400
    ) {
      // Slot đã hết chỗ
      errorModalTitle.value = 'Slot đã hết chỗ'
      errorModalMessage.value = 'Lịch lái thử này đã đầy. Vui lòng chọn thời gian khác.'
      showErrorModal.value = true
      
      // ✅ QUAY VỀ STEP 1 SAU 2 GIÂY
      setTimeout(() => {
        if (showErrorModal.value) {
          currentStep.value = 1
          selectedSlot.value = null
        }
      }, 2000)
    } else if (statusCode === 404) {
      // Slot không tồn tại
      errorModalTitle.value = 'Không tìm thấy'
      errorModalMessage.value = 'Lịch lái thử này không còn tồn tại.'
      showErrorModal.value = true
      
      setTimeout(() => {
        if (showErrorModal.value) {
          currentStep.value = 1
          selectedSlot.value = null
        }
      }, 2000)
    } else {
      // Lỗi khác - Hiển thị modal thay vì banner
      errorModalTitle.value = 'Có lỗi xảy ra'
      errorModalMessage.value = errorMessage
      showErrorModal.value = true
      
      // Quay về step 1
      setTimeout(() => {
        if (showErrorModal.value) {
          currentStep.value = 1
        }
      }, 2000)
    }
  }
}

const resetBooking = async () => {
  currentStep.value = 1
  selectedSlot.value = null
  bookingConfirmation.value = null
  error.value = null
  
  await fetchSlotsCustomer()
}

const goToListTest = () => {
  router.push('/testDriver/ListTest')
}

// ✅ ERROR MODAL ACTIONS
const closeErrorModal = () => {
  showErrorModal.value = false
  errorModalTitle.value = ''
  errorModalMessage.value = ''
  
  // Quay về step 1
  currentStep.value = 1
  selectedSlot.value = null
}

const goToMyBookings = () => {
  closeErrorModal()
  router.push('/testDriver/ListTest')
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await fetchSlotsCustomer()
})
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>