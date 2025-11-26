<template>
  <div
    class="block bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl"
  >
    <NuxtLink :to="`/product/${car.id}`" class="block">
      <!-- Ảnh sản phẩm -->
      <div class="relative w-full h-40 overflow-hidden bg-gray-100 flex justify-center items-center transition-all duration-500">
        <img
          :src="car.imageUrl"
          :alt="car.name"
          draggable="false"
          class="w-full h-full object-cover transition-transform duration-500"
          @error="handleImageError"
        />
        <div
          v-if="car.status"
          class="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full shadow-sm backdrop-blur-md bg-white/70"
          :class="getStatusClass(car.status)"
        >
          {{ getStatusText(car.status) }}
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="flex flex-col justify-between px-2 h-28 transition-all duration-500">
        <div>
          <h3 class="text-lg text-gray-800 truncate">{{ car.name }}</h3>
          
          <!-- Giá bán -->
          <div class="mt-2">
            <div class="text-xl font-bold text-blue-600">
              {{ formatCurrency(price) }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Nút So sánh -->
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

<script setup lang="ts">
import { useCompareStore } from '~/store/compareStore';
import type { CompareCar } from '~/types/vehicle';

const props = defineProps({
  car: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
    default: 0
  }
});

const compareStore = useCompareStore();

// Format tiền VNĐ
const formatCurrency = (value: number): string => {
  if (!value || value === 0) return 'Liên hệ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

// Thêm vào so sánh
const addToCompare = () => {
  const carWithPrice: CompareCar = {
    id: props.car.id,
    name: props.car.name || 'Unknown',
    src: props.car.imageUrl || props.car.image_url || '/images/placeholder.png',
    model: props.car.model,
    price: props.price,
    year: props.car.year,
  };
  
  compareStore.addCar(carWithPrice);
  console.log('Added to compare:', carWithPrice);
};

// Handle image error
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/placeholder.png';
};

// Status helpers
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'available':
    case 'Còn hàng':
      return 'text-green-700';
    case 'sold':
    case 'Hết hàng':
      return 'text-red-600';
    case 'reserved':
    case 'Đã đặt cọc':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'available':
      return 'Còn hàng';
    case 'sold':
      return 'Hết hàng';
    case 'reserved':
      return 'Đã đặt cọc';
    default:
      return status;
  }
};
</script>

<style scoped>
:deep(a:hover img) {
  transform: scale(1.07);
  filter: brightness(1.05);
}

:deep(a:hover h3),
:deep(a:hover .text-xl),
:deep(a:hover button) {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>