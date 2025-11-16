<template>
  <div class="bg-white p-4 rounded-lg border">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-medium text-gray-700">Khoảng giá</h3>
      <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {{ formatPrice(minPrice) }} - {{ formatPrice(maxPrice) }}
      </span>
    </div>

    <!-- Double Slider -->
    <div class="relative py-4">
      <!-- Track -->
      <div class="absolute w-full h-2 bg-gray-200 rounded-full"></div>
      
      <!-- Active Range -->
      <div 
        class="absolute h-2 bg-blue-500 rounded-full"
        :style="{
          left: `${((minPrice - defaultMinPrice) / (defaultMaxPrice - defaultMinPrice)) * 100}%`,
          right: `${100 - ((maxPrice - defaultMinPrice) / (defaultMaxPrice - defaultMinPrice)) * 100}%`
        }"
      ></div>

      <!-- Min Price Thumb -->
      <input
        type="range"
        :min="defaultMinPrice"
        :max="defaultMaxPrice"
        :step="priceStep"
        v-model.number="minPrice"
        @input="onPriceChange"
        class="absolute w-full h-2 appearance-none pointer-events-none opacity-0 z-20"
      />
      <div
        class="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg transform -translate-y-1 -translate-x-2 cursor-pointer z-10"
        :style="{ left: `${((minPrice - defaultMinPrice) / (defaultMaxPrice - defaultMinPrice)) * 100}%` }"
        @mousedown="startDragging('min')"
      ></div>

      <!-- Max Price Thumb -->
      <input
        type="range"
        :min="defaultMinPrice"
        :max="defaultMaxPrice"
        :step="priceStep"
        v-model.number="maxPrice"
        @input="onPriceChange"
        class="absolute w-full h-2 appearance-none pointer-events-none opacity-0 z-20"
      />
      <div
        class="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg transform -translate-y-1 -translate-x-2 cursor-pointer z-10"
        :style="{ left: `${((maxPrice - defaultMinPrice) / (defaultMaxPrice - defaultMinPrice)) * 100}%` }"
        @mousedown="startDragging('max')"
      ></div>
    </div>

    <!-- Price Labels -->
    <div class="flex justify-between text-sm text-gray-500 mt-2">
      <span>{{ formatPrice(defaultMinPrice) }}</span>
      <span>{{ formatPrice(defaultMaxPrice) }}</span>
    </div>

    <button
      v-if="hasActiveFilters"
      @click="resetFilters"
      class="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition"
    >
      ✕ Xóa lọc giá
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emits = defineEmits(['filter-change']);

// Price range configuration
const defaultMinPrice = 0;
const defaultMaxPrice = 2000000000; // 2 tỷ
const priceStep = 1000000; // 1 triệu

const minPrice = ref(defaultMinPrice);
const maxPrice = ref(defaultMaxPrice);
const dragging = ref(null);

const hasActiveFilters = computed(() => {
  return minPrice.value !== defaultMinPrice || maxPrice.value !== defaultMaxPrice;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

const onPriceChange = () => {
  if (minPrice.value > maxPrice.value) {
    if (dragging.value === 'min') {
      minPrice.value = maxPrice.value;
    } else {
      maxPrice.value = minPrice.value;
    }
  }
  emitFilters();
};

const startDragging = (type) => {
  dragging.value = type;
  
  const handleMouseMove = (e) => {
    if (!dragging.value) return;
    
    const slider = e.target.closest('.relative');
    const rect = slider.getBoundingClientRect();
    const percentage = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const price = Math.round(defaultMinPrice + percentage * (defaultMaxPrice - defaultMinPrice));
    
    const roundedPrice = Math.round(price / priceStep) * priceStep;
    
    if (dragging.value === 'min') {
      minPrice.value = Math.min(roundedPrice, maxPrice.value);
    } else {
      maxPrice.value = Math.max(roundedPrice, minPrice.value);
    }
    
    emitFilters();
  };
  
  const handleMouseUp = () => {
    dragging.value = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const emitFilters = () => {
  emits('filter-change', {
    minPrice: minPrice.value !== defaultMinPrice ? minPrice.value : undefined,
    maxPrice: maxPrice.value !== defaultMaxPrice ? maxPrice.value : undefined,
  });
};

const resetFilters = () => {
  minPrice.value = defaultMinPrice;
  maxPrice.value = defaultMaxPrice;
  emits('filter-change', {});
};
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}
</style>