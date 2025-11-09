<template>
  <div class="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
    <div class="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 class="text-3xl font-bold text-center text-gray-800">Chi tiết phản hồi</h2>

      <!-- Thông tin feedback - Thiết kế mới -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Người dùng -->
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 font-medium mb-1">Người dùng</span>
            <div class="text-gray-800 font-semibold text-lg">{{ getUserName(feedback.userId) }}</div>
          </div>

          <!-- Tiêu đề -->
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 font-medium mb-1">Tiêu đề</span>
            <div class="text-gray-800 font-semibold text-lg truncate" :title="feedback.title">
              {{ feedback.title }}
            </div>
          </div>

          <!-- Ngày gửi & Trạng thái -->
          <div class="flex flex-col space-y-2">
            <div class="flex flex-col">
              <span class="text-sm text-gray-500 font-medium mb-1">Ngày gửi</span>
              <div class="text-gray-800 font-semibold">{{ formatDate(feedback.createdAt) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 font-medium">Trạng thái:</span>
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  feedback.status 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                ]"
              >
                {{ feedback.status ? "Đã phản hồi" : "Chưa phản hồi" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nội dung message -->
      <div>
        <h3 class="text-lg font-semibold text-gray-700 mb-3">Nội dung:</h3>
        <div class="bg-gray-100 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto text-gray-800 whitespace-pre-wrap leading-relaxed">
          {{ feedback.message }}
        </div>
      </div>

      <!-- Phản hồi hiện tại -->
      <div v-if="feedback.reply">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-700">Phản hồi:</h3>
          <span class="text-sm text-green-600 font-medium">✓ Đã trả lời</span>
        </div>
        <div class="bg-green-50 p-4 rounded-lg border border-green-200 max-h-48 overflow-y-auto text-gray-800 whitespace-pre-wrap leading-relaxed">
          {{ feedback.reply }}
        </div>
      </div>

      <!-- Form trả lời -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700">Viết phản hồi:</h3>
        </div>
        <textarea
          v-model="replyText"
          class="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 transition-all duration-200 resize-none"
          rows="5"
          placeholder="Nhập phản hồi tại đây..."
        ></textarea>
        <div class="flex justify-end">
          <button
            @click="sendReply"
            class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            
            Gửi phản hồi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Feedback } from '~/data/feedback'
import { ref } from 'vue'
import { formatDate } from '~/utils/format'
import { useNotification } from '@/composables/useNotification.js'

const { showNotification } = useNotification()

// mapping userId -> userName (ví dụ dữ liệu giả)
const userMap: Record<number, string> = {
  101: "Nguyen Van A",
  102: "Tran Thi B",
  103: "Le Van C",
  // ... thêm các user khác
}

function getUserName(id: number) {
  return userMap[id] ?? `Người dùng #${id}`
}

const props = defineProps<{
  feedback: Feedback
}>()

const emit = defineEmits<{
  (e: 'update-reply', reply: string): void
}>()

const replyText = ref('')

function sendReply() {
  if (!replyText.value.trim()) {
    alert("Vui lòng nhập phản hồi!")
    return
  }
  showNotification('Phản hồi của bạn đã được gửi thành công!', 'success')
  emit('update-reply', replyText.value)
  replyText.value = ''
}
</script>