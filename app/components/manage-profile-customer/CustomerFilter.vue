<template>
  <div class="flex items-center gap-2 mb-4 w-full max-w-lg">
    <!-- Input tìm kiếm -->
    <input
      v-model="searchText"
      @input="applyFilter"
      type="text"
      placeholder="Tìm kiếm theo tên hoặc email"
      class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Nút tìm kiếm với icon -->
    <button @click="applyFilter" class="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition">
      <Search class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  onFilter: (filters: any) => void
}>()

const searchText = ref('')

// Gọi callback khi input thay đổi hoặc nhấn nút
const applyFilter = () => {
  props.onFilter({ search: searchText.value })
}
</script>

<style scoped>
/* Nếu muốn có hiệu ứng focus đẹp hơn */
</style>
