<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <button @click="goBack" class="mb-4 text-blue-600 hover:underline">← Quay lại</button>
    <FeedbackDetailView
      v-if="feedback"
      :feedback="feedback"
      @update-reply="handleUpdateReply"
    />
    <p v-else>Feedback không tồn tại!</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import FeedbackDetailView from '~/components/feedback/Manage_FeedbackDetailView.vue'
import type { Feedback } from '~/data/feedback'
import { feedbackList } from '~/data/feedback'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

// Tìm feedback theo id
const feedback = ref<Feedback | undefined>(
  feedbackList.find(f => f.id === id)
)

function goBack() {
  router.back()
}

// Xử lý cập nhật reply
function handleUpdateReply(reply: string) {
  if (!feedback.value) return
  feedback.value.reply = reply
  feedback.value.status = true

  // Thông báo mock
  alert('Phản hồi đã được gửi!')
}
</script>
