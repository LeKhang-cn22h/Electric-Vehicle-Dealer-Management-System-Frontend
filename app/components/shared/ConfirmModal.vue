<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-lg font-bold mb-3">{{ title }}</h2>
            <p class="mb-4" v-html="message"></p>

            <div class="flex justify-end gap-3">
                <button @click="cancel" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                    {{ cancelText }}
                </button>
                <button @click="confirm" class="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    show: { type: Boolean, required: true },
    title: { type: String, default: "Xác nhận" },
    message: { type: String, default: "Bạn có chắc chắn muốn thực hiện hành động này?" },
    confirmText: { type: String, default: "Xác nhận" },
    cancelText: { type: String, default: "Hủy" },
});

const emit = defineEmits(["update:show", "confirm"]);

const cancel = () => emit("update:show", false);
const confirm = () => emit("confirm");
</script>
