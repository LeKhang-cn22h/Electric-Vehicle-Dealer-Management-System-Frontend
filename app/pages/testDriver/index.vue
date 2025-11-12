<template>
  <div class="max-w-3xl mx-auto p-5">
    <!-- Header -->
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-blue-800 mb-2">Đặt Lịch Lái Thử</h2>
      <p class="text-gray-600">Trải nghiệm trực tiếp chiếc xe bạn quan tâm</p>
        <button
    @click="goToListTest"
    class="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
  >
    Xem danh sách lái thử
  </button>
    </div>

    <!-- Step Content -->
    <div>
      <!-- Step 1: Chọn Xe -->
      <div v-if="currentStep === 1" class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Chọn Xe</h3>
        <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="vehicle in availableVehicles"
            :key="vehicle.id"
            @click="selectVehicle(vehicle)"
            :class="[ 
              'border-2 rounded-lg p-4 cursor-pointer transition-all duration-300',
              selectedVehicle?.id === vehicle.id
                ? 'border-blue-800 bg-blue-50'
                : 'border-gray-200 hover:border-blue-800'
            ]"
          >
            <img :src="vehicle.image" :alt="vehicle.name" class="w-full h-32 object-cover rounded mb-3" />
            <div>
              <h4 class="text-gray-800 font-semibold mb-1">{{ vehicle.name }}</h4>
              <p class="text-gray-500 mb-2">{{ vehicle.model }}</p>
            </div>
          </div>
        </div>

        <!-- Color selection -->
        <div v-if="selectedVehicle" class="mt-4">
          <h5 class="font-medium text-gray-700 mb-2">Chọn màu</h5>
          <div class="flex gap-3">
            <div 
              v-for="color in selectedVehicle.colors" 
              :key="color"
              @click="selectedColor = color"
              :class="[
                'w-8 h-8 rounded-full border-2 cursor-pointer transition-all',
                selectedColor === color ? 'border-black scale-110' : 'border-gray-300'
              ]"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step 2: Chọn ngày & giờ -->
      <div v-if="currentStep === 2" class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Chọn Thời Gian</h3>
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Date Picker -->
          <div class="md:col-span-1">
            <label class="block mb-2 font-medium text-gray-700">Ngày lái thử</label>
            <input
              type="date"
              v-model="selectedDate"
              :min="minDate"
              @change="loadAvailableSlots"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            />
          </div>

          <!-- Time Slots -->
          <div class="md:col-span-2">
            <label class="block mb-2 font-medium text-gray-700">Khung giờ có sẵn</label>
            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4">
              <button
                v-for="slot in availableSlots"
                :key="slot.time"
                @click="selectTime(slot.time)"
                :disabled="!slot.available"
                :class="[
                  'px-3 py-2 border rounded transition-colors duration-200',
                  slot.available
                    ? selectedTime === slot.time
                      ? 'bg-blue-800 text-white border-blue-800'
                      : 'bg-white border-gray-300 hover:border-blue-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                ]"
              >
                {{ slot.time }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Thông tin cá nhân -->
      <div v-if="currentStep === 3" class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h3>
        <form @submit.prevent="submitBooking" class="space-y-5">
          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="block mb-2 font-medium text-gray-700">Họ và tên *</label>
              <input
                type="text"
                v-model="formData.fullName"
                required
                placeholder="Nhập họ và tên"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
              />
            </div>
            <div>
              <label class="block mb-2 font-medium text-gray-700">Số điện thoại *</label>
              <input
                type="tel"
                v-model="formData.phone"
                required
                placeholder="Nhập số điện thoại"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
              />
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700">Email *</label>
            <input
              type="email"
              v-model="formData.email"
              required
              placeholder="Nhập email"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700">Ghi chú thêm (tuỳ chọn)</label>
            <textarea
              v-model="formData.notes"
              placeholder="Yêu cầu đặc biệt hoặc câu hỏi thêm..."
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="formData.agreeTerms" required class="w-4 h-4" />
            <label class="text-gray-700">
              Tôi đồng ý với <a href="#" class="text-blue-800 underline">điều khoản và điều kiện</a> lái thử
            </label>
          </div>
        </form>
      </div>

      <!-- Step 4: Xác nhận -->
      <div v-if="currentStep === 4" class="text-center mb-8">
        <div class="text-green-500 text-6xl mb-5">✓</div>
        <h3 class="text-xl font-semibold mb-5">Đặt Lịch Thành Công!</h3>
        <div class="bg-gray-100 rounded-lg p-5 text-left space-y-3 mb-5">
          <div><strong>Mã đặt lịch:</strong> {{ bookingConfirmation?.bookingCode ?? 'N/A' }}</div>
          <div><strong>Xe:</strong> {{ bookingConfirmation?.vehicleName ?? 'N/A' }}</div>
          <div><strong>Màu xe:</strong> {{ bookingConfirmation?.color ?? 'N/A' }}</div>
          <div><strong>Thời gian:</strong> {{ bookingConfirmation?.date ?? 'N/A' }} lúc {{ bookingConfirmation?.time ?? 'N/A' }}</div>
          <div><strong>Địa điểm:</strong> {{ bookingConfirmation?.location ?? 'N/A' }}</div>
          <div><strong>Người đặt:</strong> {{ bookingConfirmation?.customerName ?? 'N/A' }}</div>
        </div>
        <p class="text-gray-600">Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận chi tiết.</p>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        <button
          v-if="currentStep > 1 && currentStep < 4"
          @click="previousStep"
          class="px-6 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Quay lại
        </button>
        <button
          v-if="currentStep < 3"
          @click="nextStep"
          :disabled="!canProceed"
          class="px-6 py-2 rounded bg-blue-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Tiếp tục
        </button>
        <button
          v-if="currentStep === 3"
          @click="submitBooking"
          :disabled="!formValid"
          class="px-6 py-2 rounded bg-blue-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Đặt Lịch Ngay
        </button>
        <button
          v-if="currentStep === 4"
          @click="resetBooking"
          class="px-6 py-2 rounded bg-blue-800 text-white"
        >
          Đặt Lịch Mới
        </button>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div class="flex justify-between mt-10 relative">
      <div class="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
      <div
        v-for="step in steps"
        :key="step.number"
        class="flex flex-col items-center relative z-10"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-white"
          :class="currentStep === step.number
            ? 'bg-blue-800'
            : currentStep > step.number
            ? 'bg-green-500'
            : 'bg-gray-300'"
        >
          {{ step.number }}
        </div>
        <span class="text-xs text-gray-500 text-center">{{ step.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from '#app'
const router= useRouter()
const goToListTest = () => {
  router.push('/testDriver/ListTest')
}
interface Vehicle {
  id: string
  name: string
  model: string
  image: string
  colors: string[]
}

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingForm {
  fullName: string
  phone: string
  email: string
  notes: string
  agreeTerms: boolean
}

interface BookingConfirmation {
  bookingCode: string
  vehicleName: string
  color: string
  date: string
  time: string
  location: string
  customerName: string
}

const currentStep = ref(1)
const selectedVehicle = ref<Vehicle | null>(null)
const selectedColor = ref<string | null>(null)
const selectedDate = ref('')
const selectedTime = ref('')
const availableSlots = ref<TimeSlot[]>([])

const formData = ref<BookingForm>({
  fullName: '',
  phone: '',
  email: '',
  notes: '',
  agreeTerms: false
})

const bookingConfirmation = ref<BookingConfirmation | null>(null)

const steps = [
  { number: 1, label: 'Chọn Xe' },
  { number: 2, label: 'Thời Gian' },
  { number: 3, label: 'Thông Tin' },
  { number: 4, label: 'Xác Nhận' }
]

const availableVehicles = ref<Vehicle[]>([
  { id: '1', name: 'VinFast VF e34', model: 'SUV Điện', image: '/images/xeototrang.jpg', colors: ['white','blue','gray'] },
  { id: '2', name: 'VinFast VF 8', model: 'SUV Điện', image: '/images/xeototim.jpg', colors: ['purple','black','red'] },
  { id: '3', name: 'VinFast VF 9', model: 'SUV Điện', image: '/images/xeotoxanh.jpg', colors: ['green','silver','blue'] },
])

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const canProceed = computed(() => {
  switch(currentStep.value) {
    case 1: return selectedVehicle.value !== null && selectedColor.value !== null
    case 2: return selectedDate.value !== '' && selectedTime.value !== ''
    default: return true
  }
})

const formValid = computed(() => {
  const f = formData.value
  return f.fullName && f.phone && f.email && f.agreeTerms
})

const selectVehicle = (v: Vehicle) => {
  selectedVehicle.value = v
  selectedColor.value = null // reset màu khi chọn xe mới
}

const loadAvailableSlots = async () => {
  availableSlots.value = [
    { time: '08:00', available: true },
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
    { time: '16:00', available: true }
  ]
}

const selectTime = (t: string) => selectedTime.value = t

const nextStep = () => { if(currentStep.value<4) currentStep.value++ }
const previousStep = () => { if(currentStep.value>1) currentStep.value-- }

const submitBooking = async () => {
  try {
    await new Promise(r => setTimeout(r, 1000))
    bookingConfirmation.value = {
      bookingCode: 'TD'+Date.now().toString().slice(-6),
      vehicleName: selectedVehicle.value?.name || '',
      color: selectedColor.value || '',
      date: selectedDate.value,
      time: selectedTime.value,
      location: 'Showroom VinFast - 123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      customerName: formData.value.fullName
    }
    currentStep.value = 4
  } catch(err) {
    console.error(err)
  }
}

const resetBooking = () => {
  currentStep.value=1
  selectedVehicle.value=null
  selectedColor.value=null
  selectedDate.value=''
  selectedTime.value=''
  formData.value={fullName:'', phone:'', email:'', notes:'', agreeTerms:false}
  bookingConfirmation.value=null
}

watch(selectedDate, loadAvailableSlots)
</script>
