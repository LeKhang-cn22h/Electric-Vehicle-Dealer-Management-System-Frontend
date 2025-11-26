<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Xe</th>
          <th class="px-4 py-2 text-left">Ngày & Giờ</th>
          <th class="px-4 py-2 text-left">Sức chứa</th>
          <th class="px-4 py-2 text-left">Trạng thái</th>
          <th class="px-4 py-2 text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="slot in slots" 
          :key="slot.id" 
          class="border-b hover:bg-gray-50"
          :class="{
            'bg-gray-100': slot.isPast,
            'bg-orange-50': slot.isFull
          }"
        >
          <td class="px-4 py-2">#{{ slot.id }}</td>
          
          <td class="px-4 py-2">
            <div class="flex items-center gap-3">
              <img 
                v-if="slot.vehicleImage"
                :src="slot.vehicleImage" 
                :alt="slot.vehicleName"
                class="w-16 h-12 object-cover rounded"
              />
              <div>
                <div class="font-medium">{{ slot.vehicleName }}</div>
                <div class="text-xs text-gray-500">{{ slot.vehicleModel }}</div>
              </div>
            </div>
          </td>

          <td class="px-4 py-2">
            <div>{{ slot.date }}</div>
            <div class="text-sm text-gray-500">{{ slot.time }}</div>
            <div v-if="slot.isPast" class="text-xs text-red-500 mt-1">Đã qua</div>
          </td>

          <td class="px-4 py-2">
            <div class="flex items-center gap-2">
              <span>{{ slot.capacity }}</span>
              <span 
                v-if="slot.isFull"
                class="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full"
              >
                Đầy
              </span>
            </div>
          </td>

          <td class="px-4 py-2">
            <span :class="getStatusBadgeClass(slot.status)">
              {{ getStatusText(slot.status) }}
            </span>
          </td>

          <td class="px-4 py-2">
            <div class="flex gap-2">
              <button 
                @click="$emit('viewDetails', slot)" 
                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Chi tiết
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="slots.length === 0">
          <td colspan="6" class="px-4 py-8 text-center text-gray-500">
            Không có lịch lái thử nào
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ 
  slots: Array<{
    id: number
    vehicleName: string
    vehicleModel: string
    vehicleImage?: string
    date: string
    time: string
    capacity: string
    status: string
    isPast: boolean
    isFull: boolean
  }>
}>()

defineEmits<{
  (e: 'viewDetails', slot: any): void
  (e: 'editSlot', slot: any): void
  (e: 'deleteSlot', slot: any): void
}>()

const getStatusText = (status: string) => {
  const labels: Record<string, string> = {
    'open': 'Đang mở',
    'hidden': 'Đã ẩn',
    'cancelled': 'Đã hủy'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'open': 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800',
    'hidden': 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800',
    'cancelled': 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800'
  }
  return classes[status] || 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
}
</script>