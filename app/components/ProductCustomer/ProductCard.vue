<template>
  <div
    class="block bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl"
  >
    <!-- Phần link -->
    <NuxtLink
      :to="`/product/${car.id}`"
      class="block"
    >
      <!-- Ảnh sản phẩm -->
      <div class="relative w-full h-40 overflow-hidden bg-gray-100 flex justify-center items-center transition-all duration-500">
        <img
          :src="car.imageUrl"
          :alt="car.name"
          draggable="false"
          class="w-full h-full object-cover transition-transform duration-500"
        />
        <!-- Badge trạng thái -->
        <div
          class="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full shadow-sm backdrop-blur-md bg-white/70 transition-all duration-500"
          :class="car.inStock ? 'text-green-700' : 'text-red-600'"
        >
          {{ car.inStock ? 'Còn hàng' : 'Hết hàng' }}
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="flex flex-col justify-between px-2 h-24 transition-all duration-500">
        <div>
          <h3 class="text-lg text-gray-800 truncate">{{ car.name }}</h3>
          <div class="text-xl font-bold mt-3">{{ car.price }}</div>
        </div>
      </div>
    </NuxtLink>

    <!-- Nút So sánh tách riêng -->
    <div class="p-2 pt-0">
      <button
        class="w-2/4 mt-1 py-1 border border-black rounded-2xl hover:bg-gray-200 transition-colors duration-300 font-bold"
        @click="addToCompare"
      >
        + So sánh
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCompareStore } from '~/store/compareStore';
const props = defineProps({
  car: {
    type: Object,
    required: true
  }
});
const compareStore = useCompareStore()
const addToCompare = () => {
  compareStore.addCar(props.car)
  console.log('Current compare list:', compareStore.selectedCars);
}


</script>


<style scoped>
/* Hiệu ứng hover cho toàn bộ card */
NuxtLink:hover img {
  transform: scale(1.07);
  filter: brightness(1.05);
}

NuxtLink:hover h3,
NuxtLink:hover .text-xl,
NuxtLink:hover button {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>
