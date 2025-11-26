<!-- app/components/compare/CompareBar.vue -->
<template>
    <div
        v-if="compareStore?.selectedCars?.length > 0 && !isComparePage"
        class="fixed bottom-4 -translate-x bg-white shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-4xl w-[90%] border border-gray-200 z-50 animate-fade-in"
    >
        <div class="flex gap-4 overflow-x-auto flex-1">
            <div
                v-for="car in compareStore.selectedCars"
                :key="car.id"
                class="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-2 shrink-0"
            >
                <span class="font-medium text-sm truncate max-w-[100px]">{{ car.name }}</span>
                <button @click="compareStore.removeCar(car.id)" class="text-red-400 hover:text-red-700">X</button>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <button @click="compareStore.clearAll" class="text-gray-700 text-sm hover:text-red-600">Xóa hết</button>
            <NuxtLink to="/compare" class="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition"
                >So sánh ngay</NuxtLink
            >
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCompareStore } from "~/store/compareStore";

const route = useRoute();

// Khởi tạo store với error handling
let compareStore;
try {
    compareStore = useCompareStore();
} catch (error) {
    console.error("Failed to initialize compare store:", error);
    compareStore = null;
}

// Kiểm tra xem đang ở trang compare hay không
const isComparePage = computed(() => route.path === "/compare");
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in {
    animation: fade-in 0.4s ease-out forwards;
}
</style>
