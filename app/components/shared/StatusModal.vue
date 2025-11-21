<script setup>
const props = defineProps({
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },

    // error có thể = null
    error: { type: [String, null], default: null },

    loadingMessage: { type: String, default: "Đang xử lý..." },
    successMessage: { type: String, default: "Thành công!" },
    errorMessage: { type: String, default: "Lỗi xảy ra!" },
});

const emits = defineEmits(["update:visible", "update:loading", "update:error"]);

function closeModal() {
    emits("update:visible", false);
    emits("update:loading", false);
    emits("update:error", null);
}
</script>

<template>
    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-80 flex flex-col items-center gap-4">
            <!-- LOADING -->
            <svg v-if="loading" class="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>

            <!-- SUCCESS -->
            <svg v-else-if="!error" class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>

            <!-- ERROR -->
            <svg v-else class="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <p class="text-gray-700 text-center">
                {{ loading ? loadingMessage : error ? errorMessage : successMessage }}
            </p>

            <button v-if="!loading" @click="closeModal" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Đóng</button>
        </div>
    </div>
</template>
