<template>
    <NuxtLink
        :to="`/user/quotations/create/${productId}`"
        class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-md"
    >
        <CirclePlus :size="20" />
        <span>Báo giá</span>
    </NuxtLink>
</template>

<script setup>
import { CirclePlus } from "lucide-vue-next";

defineProps({
    productId: {
        type: [String, Number],
        required: true,
    },
});
</script>
