<template>
    <div class="relative flex-1 min-w-[300px]">
        <input
            :value="modelValue"
            type="text"
            :placeholder="placeholder"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            @input="handleInput"
        />
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Search class="w-5 h-5" /></div>
    </div>
</template>

<script setup>
import { Search } from "lucide-vue-next";
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "Tìm kiếm...",
    },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
    emit("update:modelValue", event.target.value);
};
</script>
