<template>
  <div class="flex flex-wrap gap-4 mb-5 items-end">
    <div>
      <label class="block text-gray-700 mb-1">Ngày:</label>
      <input
        type="date"
        v-model="localDate"
        class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800"
      />
    </div>

    <div>
      <label class="block text-gray-700 mb-1">Xe:</label>
      <select
        v-model="localVehicle"
        class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800"
      >
        <option value="">Tất cả</option>
        <option v-for="v in vehicles" :key="v.id" :value="v.name">{{ v.name }}</option>
      </select>
    </div>

    <div>
      <label class="block text-gray-700 mb-1">Trạng thái:</label>
      <select
        v-model="localStatus"
        class="px-3 py-2 border rounded focus:outline-none focus:border-blue-800"
      >
        <option value="">Tất cả</option>
        <option value="pending">Chưa xác nhận</option>
        <option value="confirmed">Đã xác nhận</option>
        <option value="completed">Hoàn thành</option>
        <option value="cancelled">Hủy</option>
      </select>
    </div>

    <button
      @click="$emit('resetFilters')"
      class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      Đặt lại
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  vehicles: { id: string; name: string }[]
  filterDate: string
  filterVehicle: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:filterDate', value: string): void
  (e: 'update:filterVehicle', value: string): void
  (e: 'update:filterStatus', value: string): void
  (e: 'resetFilters'): void
}>()

// Local reactive variables
const localDate = ref(props.filterDate)
const localVehicle = ref(props.filterVehicle)
const localStatus = ref(props.filterStatus)

// Watch local variables and emit changes to parent
watch(localDate, (val) => emit('update:filterDate', val))
watch(localVehicle, (val) => emit('update:filterVehicle', val))
watch(localStatus, (val) => emit('update:filterStatus', val))
</script>
