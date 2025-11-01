<template>
  <div class="test-drive-booking">
    <div class="booking-header">
      <h2>Đặt Lịch Lái Thử</h2>
      <p>Trải nghiệm trực tiếp chiếc xe bạn quan tâm</p>
    </div>

    <div class="booking-content">
      <!-- Bước 1: Chọn xe -->
      <div v-if="currentStep === 1" class="step-content">
        <h3>Chọn Xe</h3>
        <div class="vehicle-grid">
          <div 
            v-for="vehicle in availableVehicles" 
            :key="vehicle.id"
            class="vehicle-card"
            :class="{ 'selected': selectedVehicle?.id === vehicle.id }"
            @click="selectVehicle(vehicle)"
          >
            <img :src="vehicle.image" :alt="vehicle.name" class="vehicle-image">
            <div class="vehicle-info">
              <h4>{{ vehicle.name }}</h4>
              <p>{{ vehicle.model }}</p>
              <span class="price">{{ vehicle.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bước 2: Chọn ngày & giờ -->
      <div v-if="currentStep === 2" class="step-content">
        <h3>Chọn Thời Gian</h3>
        <div class="datetime-selection">
          <div class="date-picker">
            <label>Ngày lái thử</label>
            <input 
              type="date" 
              v-model="selectedDate"
              :min="minDate"
              @change="loadAvailableSlots"
            >
          </div>
          
          <div class="time-slots">
            <label>Khung giờ có sẵn</label>
            <div class="slots-grid">
              <button
                v-for="slot in availableSlots"
                :key="slot.time"
                class="time-slot"
                :class="{ 
                  'selected': selectedTime === slot.time,
                  'unavailable': !slot.available
                }"
                :disabled="!slot.available"
                @click="selectTime(slot.time)"
              >
                {{ slot.time }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bước 3: Thông tin cá nhân -->
      <div v-if="currentStep === 3" class="step-content">
        <h3>Thông Tin Cá Nhân</h3>
        <form @submit.prevent="submitBooking" class="personal-info-form">
          <div class="form-row">
            <div class="form-group">
              <label>Họ và tên *</label>
              <input 
                type="text" 
                v-model="formData.fullName"
                required
                placeholder="Nhập họ và tên"
              >
            </div>
            <div class="form-group">
              <label>Số điện thoại *</label>
              <input 
                type="tel" 
                v-model="formData.phone"
                required
                placeholder="Nhập số điện thoại"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              v-model="formData.email"
              required
              placeholder="Nhập email"
            >
          </div>

          <div class="form-group">
            <label>Ghi chú thêm (tuỳ chọn)</label>
            <textarea 
              v-model="formData.notes"
              placeholder="Yêu cầu đặc biệt hoặc câu hỏi thêm..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              v-model="formData.agreeTerms"
              required
            >
            <label>Tôi đồng ý với <a href="#">điều khoản và điều kiện</a> lái thử</label>
          </div>
        </form>
      </div>

      <!-- Bước 4: Xác nhận -->
      <div v-if="currentStep === 4" class="step-content confirmation">
        <div class="success-icon">✓</div>
        <h3>Đặt Lịch Thành Công!</h3>
        <div class="booking-summary">
        <div class="summary-item">
                <strong>Mã đặt lịch:</strong> {{ bookingConfirmation?.bookingCode ?? 'N/A' }}
            </div>
            <div class="summary-item">
                <strong>Xe:</strong> {{ bookingConfirmation?.vehicleName ?? 'N/A' }}
            </div>
            <div class="summary-item">
                <strong>Thời gian:</strong> {{ bookingConfirmation?.date ?? 'N/A' }} lúc {{ bookingConfirmation?.time ?? 'N/A' }}
            </div>
            <div class="summary-item">
                <strong>Địa điểm:</strong> {{ bookingConfirmation?.location ?? 'N/A' }}
            </div>
            <div class="summary-item">
                <strong>Người đặt:</strong> {{ bookingConfirmation?.customerName ?? 'N/A' }}
            </div>
            </div>
            <p class="confirmation-note">
            Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận chi tiết.
            </p>
        <p class="confirmation-note">
          Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận chi tiết.
        </p>
      </div>

      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <button 
          v-if="currentStep > 1 && currentStep < 4"
          @click="previousStep"
          class="btn-secondary"
        >
          Quay lại
        </button>
        <button 
          v-if="currentStep < 3"
          @click="nextStep"
          :disabled="!canProceed"
          class="btn-primary"
        >
          Tiếp tục
        </button>
        <button 
          v-if="currentStep === 3"
          @click="submitBooking"
          :disabled="!formValid"
          class="btn-primary"
        >
          Đặt Lịch Ngay
        </button>
        <button 
          v-if="currentStep === 4"
          @click="resetBooking"
          class="btn-primary"
        >
          Đặt Lịch Mới
        </button>
      </div>
    </div>

    <!-- Progress indicator -->
    <div class="progress-indicator">
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="step-indicator"
        :class="{
          'active': currentStep === step.number,
          'completed': currentStep > step.number
        }"
      >
        <span class="step-number">{{ step.number }}</span>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Vehicle {
  id: string
  name: string
  model: string
  image: string
  price: string
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
  date: string
  time: string
  location: string
  customerName: string
}

// Reactive data
const currentStep = ref(1)
const selectedVehicle = ref<Vehicle | null>(null)
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

// Steps configuration
const steps = [
  { number: 1, label: 'Chọn Xe' },
  { number: 2, label: 'Thời Gian' },
  { number: 3, label: 'Thông Tin' },
  { number: 4, label: 'Xác Nhận' }
]

// Mock data - thay thế bằng API call thực tế
const availableVehicles = ref<Vehicle[]>([
  {
    id: '1',
    name: 'VinFast VF e34',
    model: 'SUV Điện',
    image: '/images/xeototrang.jpg',
    price: '690 triệu VND'
  },
  {
    id: '2',
    name: 'VinFast VF 8',
    model: 'SUV Điện',
    // image: 'D:/XDPMOOP/FE/Electric-Vehicle-Dealer-Management-System-Frontend/public/images/xeototim.jpg',
    image: '/images/xeototim.jpg',
    price: '1,2 tỷ VND'
  },
  {
    id: '3',
    name: 'VinFast VF 9',
    model: 'SUV Điện',
    image: '/images/xeotoxanh.jpg',
    price: '1,8 tỷ VND'
  }
])

// Computed properties
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return selectedVehicle.value !== null
    case 2: return selectedDate.value !== '' && selectedTime.value !== ''
    default: return true
  }
})

const formValid = computed(() => {
  const form = formData.value
  return form.fullName !== '' && 
         form.phone !== '' && 
         form.email !== '' && 
         form.agreeTerms
})

// Methods
const selectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
}

const loadAvailableSlots = async () => {
  // Mock API call - thay thế bằng API thực tế
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

const selectTime = (time: string) => {
  selectedTime.value = time
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitBooking = async () => {
  try {
    // Mock API call - thay thế bằng API thực tế
    const bookingData = {
      vehicleId: selectedVehicle.value?.id,
      date: selectedDate.value,
      time: selectedTime.value,
      ...formData.value
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock confirmation data
    bookingConfirmation.value = {
      bookingCode: 'TD' + Date.now().toString().slice(-6),
      vehicleName: selectedVehicle.value?.name || '',
      date: selectedDate.value,
      time: selectedTime.value,
      location: 'Showroom VinFast - 123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      customerName: formData.value.fullName
    }

    currentStep.value = 4
  } catch (error) {
    console.error('Booking error:', error)
    // Xử lý lỗi ở đây
  }
}

const resetBooking = () => {
  currentStep.value = 1
  selectedVehicle.value = null
  selectedDate.value = ''
  selectedTime.value = ''
  formData.value = {
    fullName: '',
    phone: '',
    email: '',
    notes: '',
    agreeTerms: false
  }
  bookingConfirmation.value = null
}

// Load available slots when date changes
watch(selectedDate, loadAvailableSlots)
</script>

<style scoped>
.test-drive-booking {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.booking-header {
  text-align: center;
  margin-bottom: 40px;
}

.booking-header h2 {
  color: #2c5aa0;
  margin-bottom: 8px;
}

.step-content {
  margin-bottom: 30px;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.vehicle-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vehicle-card:hover {
  border-color: #2c5aa0;
}

.vehicle-card.selected {
  border-color: #2c5aa0;
  background-color: #f0f7ff;
}

.vehicle-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
}

.vehicle-info h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.vehicle-info p {
  margin: 0 0 8px 0;
  color: #666;
}

.price {
  font-weight: bold;
  color: #2c5aa0;
}

.datetime-selection {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #2c5aa0;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.time-slot {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-slot:hover:not(.unavailable) {
  border-color: #2c5aa0;
}

.time-slot.selected {
  background-color: #2c5aa0;
  color: white;
  border-color: #2c5aa0;
}

.time-slot.unavailable {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.btn-primary {
  background-color: #2c5aa0;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  padding: 12px 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.progress-indicator {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  position: relative;
}

.progress-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: white;
}

.step-indicator.active .step-number {
  background-color: #2c5aa0;
}

.step-indicator.completed .step-number {
  background-color: #4caf50;
}

.step-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.confirmation {
  text-align: center;
}

.success-icon {
  font-size: 60px;
  color: #4caf50;
  margin-bottom: 20px;
}

.booking-summary {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: left;
}

.summary-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

@media (max-width: 768px) {
  .datetime-selection {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .slots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .vehicle-grid {
    grid-template-columns: 1fr;
  }
}
</style>