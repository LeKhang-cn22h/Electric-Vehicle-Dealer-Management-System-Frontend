<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-4">
      <button 
        @click="router.back()" 
        class="text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Quay lại
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Đang tải...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Feedback Detail -->
    <div v-else class="bg-white rounded-xl shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-blue-600">Chi tiết phản hồi</h1>

      <div class="space-y-4">
        <div>
          <label class="font-semibold text-gray-700">Tiêu đề:</label>
          <p class="text-gray-900">{{ feedback.title }}</p>
        </div>

        <div>
          <label class="font-semibold text-gray-700">Nội dung:</label>
          <p class="text-gray-900 whitespace-pre-wrap">{{ feedback.content }}</p>
        </div>

        <div>
          <label class="font-semibold text-gray-700">Trạng thái:</label>
          <span 
            :class="getStatusClass(feedback.status)"
            class="px-3 py-1 rounded text-sm font-medium ml-2"
          >
            {{ getStatusText(feedback.status) }}
          </span>
        </div>

        <div>
          <label class="font-semibold text-gray-700">Ngày gửi:</label>
          <p class="text-gray-900">{{ formatDate(feedback.created_at) }}</p>
        </div>

        <div v-if="feedback.reply">
          <label class="font-semibold text-gray-700">Phản hồi từ Admin:</label>
          <p class="text-gray-900 bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
            {{ feedback.reply }}
          </p>
        </div>
      </div>

      <!-- Reply Form (nếu chưa phản hồi và chưa bị ẩn) -->
      <div v-if="feedback.status === 'pending'" class="mt-6 border-t pt-6">
        <h2 class="text-xl font-semibold mb-4">Gửi phản hồi</h2>
        
        <textarea
          v-model="replyText"
          placeholder="Nhập nội dung phản hồi..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="validationErrors.reply ? 'border-red-500' : ''"
        />
        <p v-if="validationErrors.reply" class="text-red-500 text-sm mt-1">
          {{ validationErrors.reply }}
        </p>

        <button
          @click="submitReply"
          :disabled="loading || !replyText.trim()"
          class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Đang gửi...' : 'Gửi phản hồi' }}
        </button>
      </div>

      <!-- Button Ẩn phản hồi (nếu chưa bị ẩn) -->
      <div v-if="feedback.status !== 'Hidden'" class="mt-4">
        <button
          @click="hideFeedback"
          :disabled="loading"
          class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Đang ẩn...' : 'Ẩn phản hồi' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from '#app'
import { useFeedback } from '@/composables/useFeedback'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const route = useRoute()
const { showNotification } = useNotification()

// Composable
const { 
  feedback, 
  loading, 
  error, 
  validationErrors,
  fetchOne, 
  reply,
  remove,
  clearValidationErrors 
} = useFeedback()

// Local state
const replyText = ref('')

// Fetch feedback detail
onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await fetchOne(id)
  }
})

// Submit reply
async function submitReply() {
  try {
    clearValidationErrors()
    
    await reply(feedback.value.id, {
      reply: replyText.value,
      status: 'resolved'
    })

    showNotification('Đã gửi phản hồi thành công!', 'success')
    replyText.value = ''
    
    // Refresh data
    await fetchOne(feedback.value.id)
  } catch (e) {
    console.error('❌ Lỗi khi gửi phản hồi:', e)
    showNotification('Có lỗi xảy ra khi gửi phản hồi', 'error')
  }
}

// Hide feedback
async function hideFeedback() {
  try {
    clearValidationErrors()
    await remove(feedback.value.id)
    showNotification('Phản hồi đã được ẩn thành công!', 'success')
    
    // Refresh data
    await fetchOne(feedback.value.id)
  } catch (e) {
    console.error('❌ Lỗi khi ẩn phản hồi:', e)
    showNotification('Có lỗi xảy ra khi ẩn phản hồi', 'error')
  }
}

// Helper functions
function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
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
