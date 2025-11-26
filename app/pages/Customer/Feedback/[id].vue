<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Back button -->
    <button 
      @click="goBack" 
      class="mb-4 text-blue-600 hover:underline flex items-center gap-2"
    >
      ← Quay lại
    </button>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Đang tải...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button 
        @click="loadFeedback" 
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>

    <!-- Feedback detail -->
    <div v-else class="bg-white rounded-xl shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-blue-600">Chi tiết phản hồi</h1>

      <div class="space-y-4 mb-6">
        <!-- Tiêu đề -->
        <div>
          <p class="font-semibold text-gray-700">Tiêu đề:</p>
          <p class="text-gray-900">{{ feedback.title }}</p>
        </div>

        <!-- Ngày gửi -->
        <div>
          <p class="font-semibold text-gray-700">Ngày gửi:</p>
          <p class="text-gray-900">{{ formatDate(feedback.created_at) }}</p>
        </div>

        <!-- Trạng thái -->
        <div>
          <p class="font-semibold text-gray-700">Trạng thái:</p>
          <span 
            :class="getStatusClass(feedback.status)"
            class="inline-block px-3 py-1 rounded text-sm font-medium"
          >
            {{ getStatusText(feedback.status) }}
          </span>
        </div>

        <!-- Nội dung -->
        <div>
          <p class="font-semibold text-gray-700">Nội dung:</p>
          <div class="border p-4 rounded-xl bg-gray-50 mt-2 whitespace-pre-wrap">
            {{ feedback.content }}
          </div>
        </div>
      </div>

      <!-- Admin Response -->
      <AdminResponse :response="feedback.reply" :status="feedback.status" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { useFeedback } from '@/composables/useFeedback'
import AdminResponse from '@/components/feedback/AdminResponse.vue'

const route = useRoute()
const router = useRouter()

// Composable
const { feedback, loading, error, fetchOne } = useFeedback()

// Load feedback detail
onMounted(async () => {
  await loadFeedback()
})

async function loadFeedback() {
  const id = route.params.id as string
  if (id) {
    try {
      await fetchOne(id)
      console.log('✅ Đã tải feedback:', feedback.value)
    } catch (e) {
      console.error('❌ Lỗi khi tải feedback:', e)
    }
  }
}

function goBack() {
  router.back()
}

// Helper functions
function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
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