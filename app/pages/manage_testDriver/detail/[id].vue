<template>
  <div class="max-w-3xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Chi Tiết Lịch Hẹn Lái Thử</h2>

    <div v-if="booking" class="bg-white rounded-lg shadow p-5 space-y-4">
      <!-- Thông tin khách hàng -->
      <div class="grid grid-cols-2 gap-4">
        <div><strong>Mã đặt lịch:</strong> {{ booking.bookingCode }}</div>
        <div><strong>Khách hàng:</strong> {{ booking.customerName }}</div>
        <div><strong>Xe:</strong> {{ booking.vehicleName }}</div>
        <div><strong>Màu:</strong> 
          <span class="inline-block w-5 h-5 rounded-full border" :style="{ backgroundColor: booking.color }"></span>
        </div>
        <div><strong>Ngày & giờ:</strong> {{ booking.date }} {{ booking.time }}</div>
        <div><strong>Trạng thái:</strong> 
        </div>
        <div v-if="booking.phone"><strong>Điện thoại:</strong> {{ booking.phone }}</div>
        <div v-if="booking.email"><strong>Email:</strong> {{ booking.email }}</div>
        <div v-if="booking.location"><strong>Địa điểm:</strong> {{ booking.location }}</div>
        <div v-if="booking.notes"><strong>Ghi chú:</strong> {{ booking.notes }}</div>
      </div>

      <!-- Hành động duyệt / hủy -->
      <div class="flex gap-3 mt-5">
        <button
          @click="updateStatus('confirmed')"
          :disabled="booking.status === 'confirmed'"
          class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
        >
          Xác nhận
        </button>

        <button
          @click="updateStatus('completed')"
          :disabled="booking.status !== 'confirmed'"
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
        >
          Hoàn thành
        </button>

        <button
          @click="updateStatus('cancelled')"
          :disabled="booking.status === 'cancelled'"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
        >
          Hủy
        </button>

        <router-link to="/manage_testDriver" class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
          Quay lại danh sách
        </router-link>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-20">
      Không tìm thấy lịch hẹn.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Booking } from '../../../data/bookings'
import { bookings as mockBookings } from '../../../data/bookings'

// Lấy ID lịch từ route
const route = useRoute()
const router = useRouter()
const bookingId = route.params.id as string

// Dữ liệu
const booking = ref<Booking | null>(null)

onMounted(() => {
  // Thay bằng call API thực tế nếu cần
  booking.value = mockBookings.find(b => b.bookingCode === bookingId) || null
})

// Hàm cập nhật trạng thái
const updateStatus = (status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
  if (!booking.value) return
  booking.value.status = status
  // TODO: Gọi API update trạng thái ở đây nếu backend
}

// Map status thành nhãn đẹp
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Chưa xác nhận'
    case 'confirmed': return 'Đã xác nhận'
    case 'completed': return 'Hoàn thành'
    case 'cancelled': return 'Hủy'
    default: return status
  }
}

// Class màu theo trạng thái
const statusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'px-2 py-1 rounded bg-yellow-200 text-yellow-800'
    case 'confirmed': return 'px-2 py-1 rounded bg-blue-200 text-blue-800'
    case 'completed': return 'px-2 py-1 rounded bg-green-200 text-green-800'
    case 'cancelled': return 'px-2 py-1 rounded bg-red-200 text-red-800'
    default: return ''
  }
}
</script>
