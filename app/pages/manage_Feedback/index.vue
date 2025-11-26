<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">Quản lý phản hồi</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Đang tải dữ liệu...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button 
        @click="fetchFeedbacks" 
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Thử lại
      </button>
    </div>

    <!-- Table -->
    <ManageFeedbackTable
      v-else
      :items="feedbacks"
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
import ManageFeedbackTable from '~/components/feedback/Manage_FeedbackTable.vue'

const router = useRouter();
const { me } = useMe();
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
// Composable
const { feedbacks, loading, error, fetchAll } = useFeedback()

// Local state
const keyword = ref('')

// Fetch data khi component mount
onMounted(async () => {
  await fetchFeedbacks()
})

async function fetchFeedbacks() {
  try {
    // Có thể thêm filters nếu cần
    await fetchAll()
    console.log('✅ Đã tải danh sách feedbacks:', feedbacks.value)
  } catch (e) {
    console.error('❌ Lỗi khi tải feedbacks:', e)
  }
}

function viewFeedbackDetail(id: number) {
  console.log('Click xem chi tiết id:', id)
  router.push(`/manage_Feedback/${id}`)
}
</script>