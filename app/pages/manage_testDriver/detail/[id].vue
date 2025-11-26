<!-- FILE: pages/manage_testDriver/detail/[id].vue -->
<template>
  <div class="max-w-3xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Chi Tiết Lịch Hẹn Lái Thử</h2>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="appointment" class="bg-white rounded-lg shadow p-5 space-y-4">
      <!-- Thông tin appointment -->
      <div class="grid grid-cols-2 gap-4">
        <div><strong>Mã đặt lịch:</strong> #{{ appointment.id }}</div>
        <div><strong>Khách hàng UID:</strong> {{ appointment.customer_uid }}</div>
        
        <!-- Vehicle info -->
        <div><strong>Xe:</strong> {{ appointment.test_drive_slot?.vehicle?.name || 'N/A' }}</div>
        <div>
          <strong>Model:</strong> {{ appointment.test_drive_slot?.vehicle?.model || 'N/A' }}
        </div>
        <div>
          <strong>Năm:</strong> {{ appointment.test_drive_slot?.vehicle?.year || 'N/A' }}
        </div>
        <div>
          <strong>Màu:</strong>
          <span 
            v-for="color in appointment.test_drive_slot?.vehicle?.color" 
            :key="color"
            class="inline-block w-5 h-5 rounded-full border ml-1"
            :style="{ backgroundColor: color }"
          ></span>
        </div>

        <!-- Slot info -->
        <div>
          <strong>Ngày & giờ:</strong> 
          {{ formatDate(appointment.test_drive_slot?.slot_start) }}
          {{ formatTime(appointment.test_drive_slot?.slot_start) }} - 
          {{ formatTime(appointment.test_drive_slot?.slot_end) }}
        </div>
        
        <!-- Status -->
        <div>
          <strong>Trạng thái:</strong>
          <span :class="statusClass(appointment.status)">
            {{ getStatusLabel(appointment.status) }}
          </span>
        </div>

        <!-- Slot capacity -->
        <div>
          <strong>Slot:</strong>
          {{ appointment.test_drive_slot?.booked_customers || 0 }} / 
          {{ appointment.test_drive_slot?.max_customers || 0 }} người
        </div>

        <!-- Timestamps -->
        <div><strong>Đặt lúc:</strong> {{ formatDateTime(appointment.created_at) }}</div>
        <div><strong>Cập nhật:</strong> {{ formatDateTime(appointment.updated_at) }}</div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3 mt-5">
        <button
          v-if="appointment.status === 'confirm'"
          @click="updateStatus('completed')"
          :disabled="updating"
          class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
        >
          {{ updating ? 'Đang xử lý...' : 'Đánh dấu hoàn thành' }}
        </button>

        <button
          v-if="appointment.status !== 'cancelled'"
          @click="updateStatus('cancelled')"
          :disabled="updating"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
        >
          {{ updating ? 'Đang xử lý...' : 'Hủy lịch' }}
        </button>

        <button
          @click="router.back()"
          class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Quay lại
        </button>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center text-gray-500 mt-20">
      Không tìm thấy lịch hẹn.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointment } from '~/composables/useAppointments'
import type { UpdateAppointmentDto } from '~/types/appointment'

const route = useRoute()
const router = useRouter()
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
const appointmentId = parseInt(route.params.id as string)

// ===============================
// COMPOSABLE
// ===============================
const {
  loading,
  error,
  appointment,
  fetchAppointment,
  updateAppointment
} = useAppointment()

// ===============================
// STATE
// ===============================
const updating = ref(false)

// ===============================
// METHODS
// ===============================

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN')}`
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'confirm': 'Đã xác nhận',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return labels[status] || status
}

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    'confirm': 'px-2 py-1 rounded bg-blue-200 text-blue-800',
    'completed': 'px-2 py-1 rounded bg-green-200 text-green-800',
    'cancelled': 'px-2 py-1 rounded bg-red-200 text-red-800'
  }
  return classes[status] || 'px-2 py-1 rounded bg-gray-200 text-gray-800'
}

const updateStatus = async (status: 'completed' | 'cancelled') => {
  if (!appointment.value) return

  const confirmed = confirm(`Bạn có chắc muốn ${status === 'cancelled' ? 'hủy' : 'hoàn thành'} lịch hẹn này?`)
  if (!confirmed) return

  updating.value = true

  try {
    const payload: UpdateAppointmentDto = { status }
    await updateAppointment(appointmentId, payload)
    
    // Reload data
    await fetchAppointment(appointmentId)
    
    alert('Cập nhật thành công!')
  } catch (err: any) {
    alert('Lỗi: ' + (err.message || 'Không thể cập nhật'))
  } finally {
    updating.value = false
  }
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await fetchAppointment(appointmentId)
})
</script>