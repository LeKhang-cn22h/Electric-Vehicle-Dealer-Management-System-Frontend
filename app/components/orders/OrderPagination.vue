<template>
    <div class="flex justify-center gap-2 mt-6">
        <!-- Previous Button -->
        <button
            :disabled="currentPage === 1"
            :class="{
                'opacity-50 cursor-not-allowed': currentPage === 1,
                'hover:bg-gray-50': currentPage > 1,
            }"
            class="px-3 py-2 border border-gray-300 rounded flex items-center gap-1 transition-colors"
            @click="handlePageChange(currentPage - 1)"
        >
            ←
            <span class="hidden sm:inline">Trước</span>
        </button>

        <!-- Page Numbers -->
        <button
            v-for="page in visiblePages"
            :key="page"
            :class="{
                'bg-black text-white border-black': currentPage === page,
                'border-gray-300 hover:bg-gray-50': currentPage !== page,
            }"
            class="px-3 py-2 border rounded transition-colors min-w-[40px]"
            @click="handlePageChange(page)"
        >
            {{ page }}
        </button>

        <!-- Next Button -->
        <button
            :disabled="currentPage === totalPages"
            :class="{
                'opacity-50 cursor-not-allowed': currentPage === totalPages,
                'hover:bg-gray-50': currentPage < totalPages,
            }"
            class="px-3 py-2 border border-gray-300 rounded flex items-center gap-1 transition-colors"
            @click="handlePageChange(currentPage + 1)"
        >
            <span class="hidden sm:inline">Sau</span>
            →
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
        default: 1,
    },
    totalPages: {
        type: Number,
        required: true,
        default: 1,
    },
    maxVisiblePages: {
        type: Number,
        default: 5,
    },
});

const emit = defineEmits(["pageChange"]);

// Tính toán các trang hiển thị (ví dụ: 1,2,3,4,5)
const visiblePages = computed(() => {
    const half = Math.floor(props.maxVisiblePages / 2);
    let start = Math.max(1, props.currentPage - half);
    const end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);

    // Điều chỉnh start nếu end đạt tối đa
    start = Math.max(1, end - props.maxVisiblePages + 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const handlePageChange = (page) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit("pageChange", page);
    }
};
</script>
