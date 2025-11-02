<template>
    <div class="min-h-screen flex flex-col p-6 bg-white min-h-screen items-center">
        <h1 class="text-3xl text-blue-600 font-bold">Gửi phản hồi/ Khiếu nại</h1>
        <feedbackform @submitted="handleSubmit"></feedbackform>
    </div>
</template>

<script setup>
    import feedbackform from "@/components/feedback/FeedbackForm.vue";
    import { useNotification } from '@/composables/useNotification.js';
    const { showNotification } = useNotification()
    function handleSubmit() {
        // sau khi gửi form thành công
        showNotification('Phản hồi của bạn đã được gửi thành công!', 'success')
        }
</script>

<style lang="scss" scoped>

</style>