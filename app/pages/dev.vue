<!-- pages/dev.vue -->
<!-- file này cho phép chạy preview component trong quá trình phát triển -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Preview Component</h1>
    <!-- chổ này để preview component trong quá trình phát triển -->
   <FilterBar  @filter-change="handleFilterChange" />
  </div>
</template>

<script setup>
import FilterBar from '@/components/ProductCustomer/FilterBar.vue';
const handleFilterChange = (filters) => {
  console.log('Lọc theo:', filters)
  // Ở đây bạn gọi API hoặc lọc danh sách hiển thị
}
</script>
<!-- cách dùng npm run dev: http://localhost:3000/dev -->