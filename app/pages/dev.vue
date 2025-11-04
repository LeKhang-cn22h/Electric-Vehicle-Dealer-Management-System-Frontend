<!-- pages/dev.vue -->
<!-- file này cho phép chạy preview component trong quá trình phát triển -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Preview Component</h1>
    <!-- chổ này để preview component trong quá trình phát triển -->
    <ProductCard
      :car="{
        id: 1,
        name: 'Ducati Monster 937',
        price: '450.000.000₫',
        src: '/images/ducati.jpg',
        inStock: true
      }"
    />
  </div>
</template>

<script setup>
import ProductCard from '@/components/ProductCard.vue'
</script>
<!-- cách dùng npm run dev: http://localhost:3000/dev -->