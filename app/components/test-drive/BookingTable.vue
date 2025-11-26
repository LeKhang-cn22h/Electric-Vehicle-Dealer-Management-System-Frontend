<!-- FILE: components/test-drive/BookingTable.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th class="px-4 py-2 text-left">Mã đặt lịch</th>
          <th class="px-4 py-2 text-left">Khách hàng</th>
          <th class="px-4 py-2 text-left">Xe</th>
          <th class="px-4 py-2 text-left">Ngày & giờ</th>
          <th class="px-4 py-2 text-left">Trạng thái</th>
          <th class="px-4 py-2 text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="booking in bookings" 
          :key="booking.bookingCode" 
          class="border-b hover:bg-gray-50"
        >
          <td class="px-4 py-2">#{{ booking.bookingCode }}</td>
          <td class="px-4 py-2">{{ booking.customerName }}</td>
          <td class="px-4 py-2">{{ booking.vehicleName }}</td>
          <td class="px-4 py-2">
            {{ booking.date }}<br>
            <span class="text-sm text-gray-500">{{ booking.time }}</span>
          </td>
          <td class="px-4 py-2">
            <span :class="getStatusBadgeClass(booking.status)">
              {{ getStatusText(booking.status) }}
            </span>
          </td>
          <td class="px-4 py-2">
            <button 
              @click="$emit('viewDetails', booking)" 
              class="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 text-sm"
            >
              Chi tiết
            </button>
          </td>
        </tr>

        <tr v-if="bookings.length === 0">
          <td colspan="6" class="px-4 py-8 text-center text-gray-500">
            Không có lịch hẹn nào
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ 
  bookings: Array<{
    bookingCode: string
    customerName: string
    vehicleName: string
    date: string
    time: string
    status: string
  }>
}>()

defineEmits<{
  (e: 'viewDetails', booking: any): void
}>()

const getStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'confirm': 'Đã xác nhận',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'confirm': 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
    'completed': 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
    'cancelled': 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800'
  }
  return classes[status] || 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
}
</script>