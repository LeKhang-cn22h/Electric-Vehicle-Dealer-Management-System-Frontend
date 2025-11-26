<template>
  <div class="min-h-screen flex flex-col p-6 bg-gray-50 items-center">
    <h1 class="text-3xl text-blue-600 font-bold mb-6">
      Gửi phản hồi / Khiếu nại
    </h1>
    
    <FeedbackForm @submitted="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#app'
import FeedbackForm from '@/components/feedback/FeedbackForm.vue'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { showNotification } = useNotification()

function handleSubmit(feedback: any) {
  console.log('✅ Feedback đã được tạo:', feedback)
  
  // Hiển thị thông báo thành công
  showNotification('Phản hồi của bạn đã được gửi thành công!', 'success')
  
  // Redirect về danh sách sau 1.5s
  setTimeout(() => {
    router.push('/Customer/Feedback')
  }, 1500)
}
</script>