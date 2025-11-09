<!-- pages/dev.vue -->
<!-- file này cho phép chạy preview component trong quá trình phát triển -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Preview Component</h1>
    <!-- chổ này để preview component trong quá trình phát triển -->
    <manage_Feedback @filter-change="handleFilterChange" />
  </div>
</template>

<script setup>
import manage_Feedback from '~/pages/manage_Feedback/index.vue'
const handleFilterChange = (filters) => {
  console.log('Lọc theo:', filters)
  // Ở đây bạn gọi API hoặc lọc danh sách hiển thị
}
</script>
<!-- cách dùng npm run dev: http://localhost:3000/dev -->