<template>
  <div>
    <div class="flex gap-3 mb-5">
      <input
        :value="keyword"
        @input="updateKeyword"
        type="text"
        placeholder="Tìm kiếm theo tiêu đề..."
        class="border px-4 py-2 rounded-xl w-full"
      />
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <table v-else class="w-full bg-white shadow rounded-xl border-collapse">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-4 py-2">STT</th>
          <th class="px-4 py-2">Tiêu đề</th>
          <th class="px-4 py-2">Ngày gửi</th>
          <th class="px-4 py-2">Trạng thái</th>
          <th class="px-4 py-2 text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="filteredFeedbacks.length === 0"
          class="border-t"
        >
          <td colspan="5" class="px-4 py-8 text-center text-gray-500">
            Không có phản hồi nào
          </td>
        </tr>
        <tr
          v-for="(fb, idx) in filteredFeedbacks"
          :key="fb.id"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2">{{ idx + 1 }}</td>
          <td class="px-4 py-2">{{ fb.title }}</td>
          <td class="px-4 py-2">{{ formatDate(fb.created_at) }}</td>
          <td class="px-4 py-2">
            <span 
              :class="getStatusClass(fb.status)"
              class="px-2 py-1 rounded text-sm"
            >
              {{ getStatusText(fb.status) }}
            </span>
          </td>
          <td class="px-4 py-2 text-center">
            <button
              @click="$emit('view-detail', fb.id)"
              class="text-blue-600 hover:underline"
            >
              Xem chi tiết
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FeedbackSummary } from '@/types/feedback'

// Props
const props = defineProps<{
  feedbacks: FeedbackSummary[]
  keyword?: string
  loading?: boolean
  error?: string | null
}>()

// Emits
const emit = defineEmits<{
  'view-detail': [id: number]
  'update:keyword': [value: string]
}>()

// Computed: Filter feedbacks theo keyword
const filteredFeedbacks = computed(() => {
  if (!props.keyword?.trim()) {
    return props.feedbacks
  }
  
  const lowerKeyword = props.keyword.toLowerCase()
  return props.feedbacks.filter(fb => 
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
      year: 'numeric'
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