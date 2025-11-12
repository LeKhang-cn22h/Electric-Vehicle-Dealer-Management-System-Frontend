<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th class="px-4 py-2 text-left">Mã đặt lịch</th>
          <th class="px-4 py-2 text-left">Khách hàng</th>
          <th class="px-4 py-2 text-left">Xe</th>
          <th class="px-4 py-2 text-left">Màu</th>
          <th class="px-4 py-2 text-left">Ngày & giờ</th>
          <th class="px-4 py-2 text-left">Trạng thái</th>
          <th class="px-4 py-2 text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.bookingCode" class="border-b hover:bg-gray-50">
          <td class="px-4 py-2">{{ booking.bookingCode }}</td>
          <td class="px-4 py-2">{{ booking.customerName }}</td>
          <td class="px-4 py-2">{{ booking.vehicleName }}</td>
          <td class="px-4 py-2">
            <span class="inline-block w-5 h-5 rounded-full border" :style="{ backgroundColor: booking.color }"></span>
          </td>
          <td class="px-4 py-2">{{ booking.date }} {{ booking.time }}</td>
          <td class="px-4 py-2 capitalize">{{ booking.status }}</td>
          <td class="px-4 py-2 flex gap-2">
<button @click="$emit('viewDetails', booking)" class="px-2 py-1 bg-blue-800 text-white rounded hover:bg-blue-700">
  Chi tiết
</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Booking } from '../../data/bookings'

const props = defineProps<{ bookings: Booking[] }>()


</script>
