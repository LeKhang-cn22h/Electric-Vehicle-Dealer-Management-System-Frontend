<!-- FILE: pages/manage_testDriver/index.vue -->
<template>
  <div class="max-w-7xl mx-auto p-5">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-3xl font-bold text-blue-800">Quản lý lịch lái thử</h2>
      
      <!-- Create new slot button -->
      <button
        @click="router.push('/manage_testDriver/create')"
        class="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
      >
        + Tạo lịch mới
      </button>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-4 gap-4 mb-5">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Tổng lịch</div>
        <div class="text-2xl font-bold text-blue-800">{{ slots.length }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Đang mở</div>
        <div class="text-2xl font-bold text-green-600">{{ openSlotsCount }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Đã đầy</div>
        <div class="text-2xl font-bold text-orange-600">{{ fullSlotsCount }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Đã ẩn</div>
        <div class="text-2xl font-bold text-red-600">{{ hiddenSlotsCount }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-5">
      {{ error }}
      <button @click="loadData" class="ml-3 underline">Thử lại</button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Filter -->
      <SlotFilter
        :vehicles="vehicles"
        v-model:filterDate="filterDate"
        v-model:filterVehicle="filterVehicle"
        v-model:filterStatus="filterStatus"
        @resetFilters="resetFilters"
      />

      <!-- Table -->
      <SlotTable
        :slots="filteredSlots"
        @viewDetails="showDetails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAppointment } from '~/composables/useAppointments'
import SlotFilter from '~/components/test-drive/SlotFilter.vue'
import SlotTable from '~/components/test-drive/SlotTable.vue'

const router = useRouter()
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
// ===============================
// COMPOSABLE
// ===============================
const {
  loading,
  error,
  slots,
  fetchSlotsAdmin,
  removeSlot
} = useAppointment()

// ===============================
// STATE
// ===============================
const filterDate = ref('')
const filterVehicle = ref('')
const filterStatus = ref('')

// ===============================
// COMPUTED
// ===============================

// Stats
const openSlotsCount = computed(() => 
  slots.value.filter(s => s.status === 'open').length
)

const fullSlotsCount = computed(() => 
  slots.value.filter(s => s.booked_customers >= s.max_customers).length
)

const hiddenSlotsCount = computed(() => 
  slots.value.filter(s => s.status === 'hidden').length
)

// Extract unique vehicles
const vehicles = computed(() => {
  const uniqueVehicles = new Map()
  
  slots.value.forEach(slot => {
    const vehicle = slot.vehicle
    if (vehicle) {
      uniqueVehicles.set(vehicle.id, {
        id: vehicle.id.toString(),
        name: vehicle.name
      })
    }
  })
  
  return Array.from(uniqueVehicles.values())
})

// Filtered slots
const filteredSlots = computed(() => {
  return slots.value
    .filter(slot => {
      // Filter by date
      if (filterDate.value) {
        const slotDate = new Date(slot.slot_start).toISOString().split('T')[0]
        if (slotDate !== filterDate.value) return false
      }

      // Filter by vehicle
      if (filterVehicle.value) {
        const vehicleName = slot.vehicle?.name
        if (vehicleName !== filterVehicle.value) return false
      }

      // Filter by status
      if (filterStatus.value) {
        if (slot.status !== filterStatus.value) return false
      }

      return true
    })
    .map(slot => ({
      id: slot.id,
      vehicleName: slot.vehicle?.name || 'N/A',
      vehicleModel: slot.vehicle?.model || 'N/A',
      vehicleImage: slot.vehicle?.mainImage || slot.vehicle?.images?.[0]?.url,
      date: formatDate(slot.slot_start),
      time: `${formatTime(slot.slot_start)} - ${formatTime(slot.slot_end)}`,
      capacity: `${slot.booked_customers}/${slot.max_customers}`,
      status: slot.status,
      isPast: new Date(slot.slot_end) < new Date(),
      isFull: slot.booked_customers >= slot.max_customers,
      slotData: slot // Keep original data
    }))
})

// ===============================
// METHODS
// ===============================

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
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

const resetFilters = () => {
  filterDate.value = ''
  filterVehicle.value = ''
  filterStatus.value = ''
}

const showDetails = (slot: any) => {
  router.push(`/manage_testDriver/slot/${slot.id}`)
}

const loadData = async () => {
  await fetchSlotsAdmin()
}

// ===============================
// LIFECYCLE
// ===============================
onMounted(async () => {
  await loadData()
})
</script>