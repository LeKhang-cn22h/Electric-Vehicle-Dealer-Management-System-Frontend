<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Quản lý phản hồi</h1>

    <ManageFeedbackTable
      :items="filteredItems"
      :keyword="keyword"
      @view-detail="viewFeedbackDetail"
      @update:keyword="keyword = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from '#app'
import ManageFeedbackTable from '~/components/feedback/Manage_FeedbackTable.vue'
import { feedbackList } from '~/data/feedback'

const router = useRouter()

const keyword = ref("")

const filteredItems = computed(() => {
  if (!keyword.value.trim()) return feedbackList
  return feedbackList.filter(fb =>
    fb.title.toLowerCase().includes(keyword.value.toLowerCase())
  )
})

function viewFeedbackDetail(id: number) {
  console.log("Click xem chi tiết id:", id)
  router.push(`/manage_Feedback/${id}`)
}
</script>
