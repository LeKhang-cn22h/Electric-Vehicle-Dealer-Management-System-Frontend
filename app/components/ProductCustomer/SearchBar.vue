<template>
  <div class="flex items-center gap-2 w-full max-w-md mx-auto border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
    <!-- Icon tìm kiếm -->
    <button class="text-gray-500 hover:text-blue-500 transition">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
      </svg>
    </button>

    <!-- Ô nhập tìm kiếm -->
    <input
      v-model="keyword"
      type="text"
      placeholder="Tìm kiếm..."
      class="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
    />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const emits = defineEmits(['update:search']);
const keyword = ref('');

watch(keyword, (newVal) => {
  emits('update:search', newVal);
});
</script>
