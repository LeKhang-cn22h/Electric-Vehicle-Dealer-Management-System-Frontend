<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8 text-blue-600">So sánh xe</h1>

    <div v-if="compareStore.selectedCars.length === 0" class="text-center text-gray-500 py-10">
      <p>Chưa có xe nào trong danh sách so sánh.</p>
      <NuxtLink to="/product" class="text-blue-600 underline">Quay lại danh sách sản phẩm</NuxtLink>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left w-48">Thông số</th>
            <th v-for="car in compareStore.selectedCars" :key="car.id" class="p-3 text-center">
              <img :src="car.src" class="h-24 mx-auto rounded-lg mb-2" />
              <div class="font-semibold">{{ car.name }}</div>
              <div class="text-blue-600 font-bold">{{ car.price }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(spec, key) in specs" :key="key" class="border-t">
            <td class="p-3 font-medium bg-gray-50">{{ spec.label }}</td>
            <td v-for="car in compareStore.selectedCars" :key="car.id" class="p-3 text-center">
              {{ car[spec.key] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useCompareStore } from '@/store/compareStore'
const compareStore = useCompareStore()

const specs = [
  { label: 'Hãng xe', key: 'make' },
  { label: 'Dòng xe', key: 'model' },
  { label: 'Năm sản xuất', key: 'year' },
  { label: 'Động cơ', key: 'engine' },
  { label: 'Công suất (HP)', key: 'power' },
  { label: 'Mức tiêu thụ nhiên liệu', key: 'fuel' },
  { label: 'Giá bán', key: 'price' }
]
</script>
