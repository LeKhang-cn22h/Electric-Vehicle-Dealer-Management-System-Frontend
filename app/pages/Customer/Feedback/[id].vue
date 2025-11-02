<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-blue-600">Chi tiết phản hồi</h1>

    <div class="mb-6">
      <p><strong>Tiêu đề:</strong> {{ feedback.tieuDe }}</p>
      <p><strong>Ngày gửi:</strong> {{ feedback.ngayGui }}</p>
      <p><strong>Nội dung:</strong></p>
      <p class="border p-4 rounded-xl bg-gray-50">{{ feedback.noidung }}</p>
    </div>

    <AdminResponse :response="feedback.phanHoiAdmin" />

    <button @click="goBack" class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
      Quay lại
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFeedback } from '~/composables/useFeedback.js'
import AdminResponse from '~/components/feedback/AdminResponse.vue'

const route = useRoute()
const router = useRouter()
const { feedbacks, fetchFeedbacks } = useFeedback()

const feedback = ref({ id: 0, tieuDe: '', ngayGui: '', noiDung: '', trangThai: '', phanHoiAdmin: '' })

onMounted(async () => {
  await fetchFeedbacks()
  const id = Number(route.params.id)
  const fb = feedbacks.value.find(f => f.id === id)
  if (fb) feedback.value = fb
})

function goBack() {
  router.back();
}
</script>
