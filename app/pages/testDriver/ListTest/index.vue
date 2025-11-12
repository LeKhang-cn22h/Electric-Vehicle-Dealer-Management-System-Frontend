<template>
  <div class="max-w-5xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Lịch hẹn lái thử của tôi</h2>

    <div class="flex flex-wrap gap-4 mb-5 items-end">
      <div>
        <label class="block text-gray-700 mb-1">Ngày:</label>
        <input type="date" v-model="filterDate" class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800"/>
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Xe:</label>
        <select v-model="filterVehicle" class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800">
          <option value="">Tất cả</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.name">{{ v.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Trạng thái:</label>
        <select v-model="filterStatus" class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800">
          <option value="">Tất cả</option>
          <option value="pending">Chưa xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Hủy</option>
        </select>
      </div>

      <button @click="resetFilters" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Đặt lại</button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded">
        <thead class="bg-blue-800 text-white">
          <tr>
            <th class="px-4 py-2 text-left">Mã đặt lịch</th>
            <th class="px-4 py-2 text-left">Xe</th>
            <th class="px-4 py-2 text-left">Ngày & giờ</th>
            <th class="px-4 py-2 text-left">Trạng thái</th>
            <th class="px-4 py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in filteredBookings" :key="b.bookingCode" class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{{ b.bookingCode }}</td>
            <td class="px-4 py-2">{{ b.vehicleName }}</td>
            <td class="px-4 py-2">{{ b.date }} {{ b.time }}</td>
            <td class="px-4 py-2">
              <span :class="statusClass(b.status)">{{ getStatusLabel(b.status) }}</span>
            </td>
            <td class="px-4 py-2">
              <router-link :to="`/customer/bookings/${b.bookingCode}`" class="px-2 py-1 bg-blue-800 text-white rounded hover:bg-blue-700">
                Xem chi tiết
              </router-link>
            </td>
          </tr>
          <tr v-if="filteredBookings.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-500">Không có lịch hẹn nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Booking } from '~/data/bookings'
import { bookings as mockBookings } from '~/data/bookings'

const vehicles = [
  { id: '1', name: 'VinFast VF e34' },
  { id: '2', name: 'VinFast VF 8' },
  { id: '3', name: 'VinFast VF 9' }
]

const filterDate = ref('')
const filterVehicle = ref('')
const filterStatus = ref('')

// Giả sử user hiện tại
const currentUser = 'Nguyen Van A'

// Lọc booking của user hiện tại
const customerBookings = computed(() => 
  mockBookings.filter(b => b.customerName === currentUser)
)

const filteredBookings = computed(() =>
  customerBookings.value.filter(b => {
    return (!filterDate.value || b.date === filterDate.value)
      && (!filterVehicle.value || b.vehicleName === filterVehicle.value)
      && (!filterStatus.value || b.status === filterStatus.value)
  })
)

const resetFilters = () => {
  filterDate.value = ''
  filterVehicle.value = ''
  filterStatus.value = ''
}

// Label trạng thái
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Chưa xác nhận'
    case 'confirmed': return 'Đã xác nhận'
    case 'completed': return 'Hoàn thành'
    case 'cancelled': return 'Hủy'
    default: return status
  }
}

// Class màu trạng thái
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
