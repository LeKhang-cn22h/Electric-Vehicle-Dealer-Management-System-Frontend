<template>
  <div class="max-w-5xl mx-auto p-5">
    <h2 class="text-3xl font-bold text-blue-800 mb-5">Quản lý lịch hẹn lái thử</h2>

    <BookingFilter
      :vehicles="vehicles"
      v-model:filterDate="filterDate"
      v-model:filterVehicle="filterVehicle"
      v-model:filterStatus="filterStatus"
      @resetFilters="resetFilters"
    />

    <BookingTable
      :bookings="filteredBookings"
      @viewDetails="showDetails"
    />

  
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BookingFilter from '~/components/test-drive/BookingFilter.vue'
import BookingTable from '~/components/test-drive/BookingTable.vue'
import { bookings as mockBookings } from '../../data/bookings'
import type { Booking } from '../../data/bookings'

const vehicles = [
  { id: '1', name: 'VinFast VF e34' },
  { id: '2', name: 'VinFast VF 8' },
  { id: '3', name: 'VinFast VF 9' }
]

const filterDate = ref('')
const filterVehicle = ref('')
const filterStatus = ref('')

const selectedBooking = ref<Booking | null>(null)

const filteredBookings = computed(() => {
  return mockBookings.filter(b => {
    return (!filterDate.value || b.date === filterDate.value)
      && (!filterVehicle.value || b.vehicleName === filterVehicle.value)
      && (!filterStatus.value || b.status === filterStatus.value)
  })
})

const resetFilters = () => {
  filterDate.value = ''
  filterVehicle.value = ''
  filterStatus.value = ''
}
import { useRouter } from '#app'
const router= useRouter()
const showDetails = (booking: Booking) => {
  router.push(`/manage_testDriver/detail/${booking.bookingCode}`)
}
</script>
