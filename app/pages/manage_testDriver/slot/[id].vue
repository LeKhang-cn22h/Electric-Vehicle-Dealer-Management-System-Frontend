<!-- FILE: pages/manage_testDriver/slot/[id].vue -->
<template>
  <div class="max-w-5xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Chi Tiết Lịch Lái Thử</h2>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="slot" class="space-y-5">
      <!-- Slot Info Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Thông tin lịch</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <!-- Vehicle Info -->
          <div class="col-span-2">
            <div class="flex items-center gap-4">
              <img 
                v-if="slot.vehicle?.mainImage"
                :src="slot.vehicle.mainImage" 
                :alt="slot.vehicle.name"
                class="w-32 h-24 object-cover rounded"
              />
              <div>
                <div class="text-xl font-bold">{{ slot.vehicle?.name || 'N/A' }}</div>
                <div class="text-gray-600">
                  {{ slot.vehicle?.model }} - {{ slot.vehicle?.version }} ({{ slot.vehicle?.year }})
                </div>
                <div class="flex gap-2 mt-2">
                </div>
              </div>
            </div>
          </div>

          <!-- Slot Details -->
          <div>
            <strong>Trạng thái:</strong>
            <span :class="getSlotStatusBadgeClass(slot.status)">
              {{ getSlotStatusText(slot.status) }}
            </span>
          </div>

          <div>
            <strong>Thời gian bắt đầu:</strong>
            {{ formatDateTime(slot.slot_start) }}
          </div>
          <div>
            <strong>Thời gian kết thúc:</strong>
            {{ formatDateTime(slot.slot_end) }}
          </div>

          <div>
            <strong>Sức chứa:</strong>
            {{ slot.booked_customers }} / {{ slot.max_customers }} người
            <span 
              v-if="slot.booked_customers >= slot.max_customers"
              class="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full"
            >
              Đầy
            </span>
          </div>

          <div>
            <strong>Còn trống:</strong>
            {{ slot.max_customers - slot.booked_customers }} chỗ
          </div>

          <div><strong>Tạo lúc:</strong> {{ formatDateTime(slot.created_at) }}</div>
          <div><strong>Cập nhật:</strong> {{ formatDateTime(slot.updated_at) }}</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-5">
          <!-- ✅ Sửa lịch -->
          <button
            @click="editSlot"
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Sửa lịch
          </button>

          <!-- ✅ Ẩn lịch (chỉ hiện khi status !== 'hidden') -->
          <button
            v-if="slot.status !== 'hidden'"
            @click="hideSlot"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ẩn lịch
          </button>

          <!-- ✅ MỞ LẠI LỊCH (chỉ hiện khi status === 'hidden') -->
          <button
            v-if="slot.status === 'hidden'"
            @click="reopenSlotHandler"
            :disabled="updatingStatus"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            {{ updatingStatus ? 'Đang xử lý...' : 'Mở lại lịch' }}
          </button>

          <!-- ✅ FIX: Quay về trang danh sách -->
          <button
            @click="goBack"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Quay lại
          </button>
        </div>
      </div>

      <!-- Appointments List -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">
            Danh sách đăng ký ({{ appointments.length }})
          </h3>
          
          <!-- Filter by status -->
          <select
            v-model="filterStatus"
            class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="confirm">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <!-- No appointments -->
        <div v-if="filteredAppointments.length === 0" class="text-center text-gray-500 py-8">
          Chưa có ai đăng ký lịch này
        </div>

        <!-- Appointments Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full border border-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">STT</th>
                <th class="px-4 py-2 text-left">Appointment ID</th>
                <th class="px-4 py-2 text-left">Customer UID</th>
                <th class="px-4 py-2 text-left">Trạng thái</th>
                <th class="px-4 py-2 text-left">Đặt lúc</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(apt, index) in filteredAppointments" 
                :key="apt.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ index + 1 }}</td>
                <td class="px-4 py-2">#{{ apt.id }}</td>
                <td class="px-4 py-2">
                  <div class="text-sm font-mono">{{ apt.customer_uid }}</div>
                  <div class="text-xs text-gray-500">
                    {{ apt.customer_uid.substring(0, 8) }}...
                  </div>
                </td>
                <td class="px-4 py-2">
                  <span :class="getAppointmentStatusBadgeClass(apt.status)">
                    {{ getAppointmentStatusText(apt.status) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm">
                  {{ formatDateTime(apt.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div v-if="appointments.length > 0" class="mt-4 grid grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded p-3">
            <div class="text-sm text-gray-600">Đã xác nhận</div>
            <div class="text-xl font-bold text-blue-800">{{ confirmedCount }}</div>
          </div>
          <div class="bg-green-50 rounded p-3">
            <div class="text-sm text-gray-600">Hoàn thành</div>
            <div class="text-xl font-bold text-green-800">{{ completedCount }}</div>
          </div>
          <div class="bg-red-50 rounded p-3">
            <div class="text-sm text-gray-600">Đã hủy</div>
            <div class="text-xl font-bold text-red-800">{{ cancelledCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointment } from '~/composables/useAppointments'
import { useVehicle } from '~/composables/useVehicle'

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
  reopenSlot,
  removeSlot
} = useAppointment()
const { fetchAll} = useVehicle()
// ===============================
// STATE
// ===============================
const filterStatus = ref('')
const updatingStatus = ref(false)

// ===============================
// COMPUTED
// ===============================

const appointments = computed(() => slot.value?.appointments || [])

const filteredAppointments = computed(() => {
  if (!filterStatus.value) return appointments.value
  return appointments.value.filter(apt => apt.status === filterStatus.value)
})

const confirmedCount = computed(() => 
  appointments.value.filter(a => a.status === 'confirm').length
)

const completedCount = computed(() => 
  appointments.value.filter(a => a.status === 'completed').length
)

const cancelledCount = computed(() => 
  appointments.value.filter(a => a.status === 'cancelled').length
)

// ===============================
// METHODS
// ===============================

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

const getSlotStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'open': 'Đang mở',
    'hidden': 'Đã ẩn',
    'cancelled': 'Đã hủy'
  }
  return labels[status] || status
}

const getSlotStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'open': 'ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
    'hidden': 'ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800',
    'cancelled': 'ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800'
  }
  return classes[status] || 'ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
}

const getAppointmentStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'confirm': 'Đã xác nhận',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return labels[status] || status
}

const getAppointmentStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'confirm': 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
    'completed': 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
    'cancelled': 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800'
  }
  return classes[status] || 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
}

const editSlot = () => {
  router.push(`/manage_testDriver/edit/${slotId}`)
}

const hideSlot = async () => {
  const confirmed = confirm('Bạn có chắc muốn ẩn lịch này?')
  if (!confirmed) return

  try {
    await removeSlot(slotId)
    alert('Đã ẩn lịch thành công!')
    // Reload để cập nhật UI
    await fetchSlot(slotId)
  } catch (err: any) {
    alert('Lỗi: ' + (err.message || 'Không thể ẩn lịch'))
  }
}

const reopenSlotHandler = async () => {
  const confirmed = confirm('Bạn có chắc muốn mở lại lịch này?')
  if (!confirmed) return

  updatingStatus.value = true

  try {
    await reopenSlot(slotId)
    
    alert('Đã mở lại lịch thành công!')
    
    // Reload để cập nhật UI
    await fetchSlot(slotId)
  } catch (err: any) {
    alert('Lỗi: ' + (err.message || 'Không thể mở lại lịch'))
  } finally {
    updatingStatus.value = false
  }
}

const viewAppointmentDetail = (appointmentId: number) => {
  router.push(`/manage_testDriver/detail/${appointmentId}`)
}

// ✅ FIX: Method quay về trang danh sách
const goBack = () => {
  router.push('/manage_testDriver')
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await fetchSlot(slotId)
})
</script>