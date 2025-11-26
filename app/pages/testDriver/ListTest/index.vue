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
          <option value="confirm">Đã xác nhận</option>
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
            <th class="px-4 py-2 text-left">STT</th>
            <th class="px-4 py-2 text-left">Xe</th>
            <th class="px-4 py-2 text-left">Ngày & giờ</th>
            <th class="px-4 py-2 text-left">Trạng thái</th>
            <th class="px-4 py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, index) in filteredBookings" :key="b.bookingCode" class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ b.vehicleName }}</td>
            <td class="px-4 py-2">{{ b.date }} {{ b.time }}</td>
            <td class="px-4 py-2">
              <span :class="statusClass(b.status)">{{ getStatusLabel(b.status) }}</span>
            </td>
            <td class="px-4 py-2">
              <!-- ✅ SỬA DÒNG NÀY -->
              <router-link 
                :to="`/testDriver/${b.bookingCode}`" 
                class="px-2 py-1 bg-blue-800 text-white rounded hover:bg-blue-700"
              >
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
import { ref, computed, onMounted } from 'vue';
import { useAppointment } from '~/composables/useAppointments';
import type { TestDriveSlot, Appointment } from '~/types/appointment';

// Composable
const {
  loading,
  error,
  appointments,
  slots,
  fetchHistoryCustomer,
  fetchSlotsCustomer
} = useAppointment();

// Filter state
const filterDate = ref('');
const filterVehicle = ref('');
const filterStatus = ref('');

// Danh sách vehicle
const vehicles = computed(() => {
  const vehicleMap = new Map();
  
  appointments.value.forEach(app => {
    const vehicle = app.test_drive_slot?.vehicle;
    if (vehicle && vehicle.id && vehicle.name) {
      vehicleMap.set(vehicle.id, vehicle.name);
    }
  });

  return Array.from(vehicleMap, ([id, name]) => ({ id, name }));
});

// Fetch dữ liệu khi component mount
onMounted(async () => {
  await fetchHistoryCustomer();
  await fetchSlotsCustomer();
});

// Filtered bookings
const filteredBookings = computed(() =>
  appointments.value
    .map(app => {
      const vehicleName = app.test_drive_slot?.vehicle?.name || `Xe ${app.test_drive_slot_id}`;
      const slotDate = app.test_drive_slot?.slot_start ? new Date(app.test_drive_slot.slot_start) : null;
      const date = slotDate ? slotDate.toISOString().split('T')[0] : '-';
      const time = slotDate ? slotDate.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '-';

      return {
        bookingCode: app.id,
        vehicleName: vehicleName,
        date: date,
        time: time,
        status: app.status,
        rawAppointment: app
      };
    })
    .filter(b => {
      return (!filterDate.value || b.date === filterDate.value)
        && (!filterVehicle.value || b.vehicleName === filterVehicle.value)
        && (!filterStatus.value || b.status === filterStatus.value)
    })
);

const resetFilters = () => {
  filterDate.value = '';
  filterVehicle.value = '';
  filterStatus.value = '';
}

// Status label & class
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirm': return 'Đã xác nhận';
    case 'completed': return 'Hoàn thành';
    case 'cancelled': return 'Hủy';
    default: return status;
  }
}

const statusClass = (status: string) => {
  switch (status) {
    case 'confirm': return 'px-2 py-1 rounded bg-blue-200 text-blue-800';
    case 'completed': return 'px-2 py-1 rounded bg-green-200 text-green-800';
    case 'cancelled': return 'px-2 py-1 rounded bg-red-200 text-red-800';
    default: return '';
  }
}
</script>
