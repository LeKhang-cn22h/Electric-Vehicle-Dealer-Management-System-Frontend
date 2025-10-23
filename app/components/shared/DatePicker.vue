<template>
    <div class="relative">
        <input
            :value="modelValue"
            type="date"
            :placeholder="placeholder"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            @input="handleInput"
        />
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"><CalendarDays class="w-5 h-5" /></div>
    </div>
</template>

<script setup>
import { CalendarDays } from "lucide-vue-next";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "Chọn ngày",
    },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
    emit("update:modelValue", event.target.value);
};
</script>
