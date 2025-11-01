<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4 text-blue-600">Danh sách phản hồi</h1>
        <button @click="createFeedback" class="mb-4 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600">
            Tạo phản hồi mới
        </button>
        <FeedbackTable :feedbacks="feedbacks"
        :keyword="keyword"
        @view-detail="viewFeedbackDetail"
        />

    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { routes } from '@/router/index.ts'  
import {useFeedback}  from '@/composables/useFeedback.js'
import FeedbackTable from '@/components/feedback/FeedbackTable.vue'

const router = useRouter();
const { feedbacks, keyword, fetchFeedbacks } = useFeedback();
onMounted(fetchFeedbacks)
function viewFeedbackDetail(id){
    router.push(routes.FeedbackDetail.replace(':id', id));
}
function createFeedback(){
    router.push(routes.CreateFB)
}
</script>

<style scoped>

</style>