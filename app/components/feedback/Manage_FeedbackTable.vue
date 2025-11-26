<template>
  <div class="p-4 bg-gray-50 rounded-lg shadow-md">
    <!-- Input tìm kiếm -->
    <input
      :value="keyword"
      @input="updateKeyword"
      type="text"
      placeholder="Tìm kiếm theo tiêu đề..."
      class="border border-gray-300 px-4 py-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <!-- Empty state -->
    <div v-if="filteredItems.length === 0" class="text-center py-8">
      <p class="text-gray-500">
        {{ keyword ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có phản hồi nào' }}
      </p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg border border-gray-200">
        <thead class="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th class="px-4 py-3 text-left">STT</th>
            <th class="px-4 py-3 text-left">Tiêu đề</th>
            <th class="px-4 py-3 text-left">Ngày gửi</th>
            <th class="px-4 py-3 text-left">Trạng thái</th>
            <th class="px-4 py-3 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody class="text-gray-700">
          <tr
            v-for="(fb, idx) in filteredItems"
            :key="fb.id"
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3">{{ idx + 1 }}</td>
            <td class="px-4 py-3">{{ fb.title }}</td>
            <td class="px-4 py-3">{{ formatDate(fb.created_at) }}</td>
            <td class="px-4 py-3">
              <span 
                :class="getStatusClass(fb.status)"
                class="px-2 py-1 rounded text-sm font-medium"
              >
                {{ getStatusText(fb.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                @click="$emit('view-detail', fb.id)"
                class="text-blue-600 hover:underline font-medium"
              >
                Xem chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FeedbackSummary } from '@/types/feedback'

// Props
const props = defineProps<{
  items: FeedbackSummary[]
  keyword?: string
}>()

// Emits
const emit = defineEmits<{
  'view-detail': [id: number]
  'update:keyword': [value: string]
}>()

// Computed: Filter items theo keyword
const filteredItems = computed(() => {
  if (!props.keyword?.trim()) {
    return props.items
  }
  
  const lowerKeyword = props.keyword.toLowerCase()
  return props.items.filter(fb => 
    fb.title.toLowerCase().includes(lowerKeyword) 
  )
})

// Methods
function updateKeyword(e: Event) {
  emit('update:keyword', (e.target as HTMLInputElement).value)
}

function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '-'
  }
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Chờ phản hồi',
    'resolved': 'Đã phản hồi',
    'Hidden': 'Đã ẩn'
  }
  return statusMap[status] || status
}

function getStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800',
    'Hidden': 'bg-gray-100 text-gray-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}
</script>