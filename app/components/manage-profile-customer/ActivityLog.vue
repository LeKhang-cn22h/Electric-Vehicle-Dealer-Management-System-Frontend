<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Nhật ký hoạt động</h2>

    <div v-if="logs.length === 0" class="text-gray-500">Chưa có hoạt động nào.</div>

    <div v-else class="space-y-6">
      <div 
        v-for="(log, index) in logs" 
        :key="index" 
        class="flex items-start gap-4"
      >
        <!-- Dấu chấm -->
        <div class="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>

        <!-- Nội dung -->
        <div>
          <p class="font-medium">
            {{ log.action }}
          </p>
          <p class="text-sm text-gray-600">
            bởi <span class="font-semibold">{{ log.user }}</span> — 
            {{ formatDate(log.time) }}
          </p>

          <p v-if="log.description" class="text-gray-700 text-sm mt-1">
            {{ log.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  logs: {
    type: Array as () => Array<{
      action: string
      user: string
      time: string
      description?: string
    }>,
    default: () => []
  }
})

// Format ngày
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString("vi-VN")
}
</script>
