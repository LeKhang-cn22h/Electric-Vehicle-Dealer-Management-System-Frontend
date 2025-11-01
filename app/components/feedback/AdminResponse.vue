<template>
    <div>
        <h3 class="font-semibold mb-1 text-green-600">Phản hồi từ Admin:</h3>
        <p v-if="response">{{ response }}</p>
        <p v-else class="italic text-gray-500">Chưa có phản hồi từ Admin.</p>
    </div>
</template>
<script setup>
const props=defineProps({
    response:String
});
</script>