<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-blue-600">
      Danh sách phản hồi của mình
    </h1>
    
    <button 
      @click="createFeedback" 
      class="mb-4 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
    >
      Tạo phản hồi mới
    </button>
    
    <FeedbackTable 
      :feedbacks="feedbacks"
      :keyword="keyword"
      @view-detail="viewFeedbackDetail"
      @update:keyword="keyword = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'
import { useFeedback } from '@/composables/useFeedback'
import FeedbackTable from '@/components/feedback/FeedbackTable.vue'

const router = useRouter()

// Lấy composable
const { feedbacks, loading, error, fetchAllUser } = useFeedback()

// Local state cho keyword
const keyword = ref('')

// Fetch data khi component mount
onMounted(async () => {
  try {
    await fetchAllUser() // Lấy feedbacks của user hiện tại
  } catch (e) {
    console.error('Lỗi khi tải feedbacks:', e)
  }
})

function viewFeedbackDetail(id: number) {
  console.log('Click xem chi tiết id:', id)
  router.push(`/Customer/Feedback/${id}`)
}

function createFeedback() {
  router.push(`/Customer/Feedback/Sendfeedback`)
}
</script>