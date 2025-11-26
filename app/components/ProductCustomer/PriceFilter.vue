<template>
  <div class="bg-white p-2 rounded-lg border">
    <div class="grid grid-cols-4 gap-2 mb-4">
      <button
        v-for="preset in pricePresets"
        :key="preset.label"
        @click="selectPreset(preset)"
        :class="[
          'px-2 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap',
          isPresetActive(preset)
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Custom Range Inputs - HÀNG NGANG -->
    <div class="flex gap-3 mb-3">
      <div class="flex-1">
        <label class="block text-xs text-gray-600 mb-1">Giá tối thiểu</label>
        <div class="relative">
          <input
            type="text"
            v-model="minPriceDisplay"
            @blur="updateMinPrice"
            @keyup.enter="updateMinPrice"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <span class="absolute right-3 top-2 text-gray-500 text-xs">₫</span>
        </div>
      </div>

      <div class="flex-1">
        <label class="block text-xs text-gray-600 mb-1">Giá tối đa</label>
        <div class="relative">
          <input
            type="text"
            v-model="maxPriceDisplay"
            @blur="updateMaxPrice"
            @keyup.enter="updateMaxPrice"
            placeholder="2,000,000,000"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <span class="absolute right-3 top-2 text-gray-500 text-xs">₫</span>
        </div>
      </div>
    </div>

    <!-- Active Filter Display -->
    <div v-if="hasActiveFilters" class="mb-3 p-2 bg-blue-50 rounded-lg">
      <div class="flex items-center justify-between text-sm">
        <span class="text-blue-700 text-xs">
          {{ formatPrice(minPrice) }} - {{ formatPrice(maxPrice) }}
        </span>
        <button
          @click="resetFilters"
          class="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Reset Button -->
    <button
      v-if="hasActiveFilters"
      @click="resetFilters"
      class="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium text-sm transition"
    >
      Xóa lọc giá
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const emits = defineEmits(['price-change']);

// Price range configuration
const defaultMinPrice = 0;
const defaultMaxPrice = 2000000000; // 2 tỷ

const minPrice = ref(defaultMinPrice);
const maxPrice = ref(defaultMaxPrice);
const minPriceDisplay = ref('');
const maxPriceDisplay = ref('');


const hasActiveFilters = computed(() => {
  return minPrice.value !== defaultMinPrice || maxPrice.value !== defaultMaxPrice;
});

const isPresetActive = (preset) => {
  return minPrice.value === preset.min && maxPrice.value === preset.max;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

const formatPriceInput = (price) => {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN').format(price);
};

const parsePriceInput = (input) => {
  if (!input) return 0;
  // Remove all non-numeric characters
  const numeric = input.replace(/[^\d]/g, '');
  return parseInt(numeric) || 0;
};

// Watch giá để update display
watch([minPrice, maxPrice], ([newMin, newMax]) => {
  minPriceDisplay.value = formatPriceInput(newMin);
  maxPriceDisplay.value = formatPriceInput(newMax);
}, { immediate: true });

const selectPreset = (preset) => {
  minPrice.value = preset.min;
  maxPrice.value = preset.max;
  emitFilters();
};

const updateMinPrice = () => {
  const parsed = parsePriceInput(minPriceDisplay.value);
  minPrice.value = Math.min(parsed, maxPrice.value);
  minPriceDisplay.value = formatPriceInput(minPrice.value);
  emitFilters();
};

const updateMaxPrice = () => {
  const parsed = parsePriceInput(maxPriceDisplay.value);
  maxPrice.value = Math.max(parsed, minPrice.value);
  maxPriceDisplay.value = formatPriceInput(maxPrice.value);
  emitFilters();
};

const emitFilters = () => {
  emits('price-change', {
    min: minPrice.value !== defaultMinPrice ? minPrice.value : undefined,
    max: maxPrice.value !== defaultMaxPrice ? maxPrice.value : undefined,
  });
};

const resetFilters = () => {
  minPrice.value = defaultMinPrice;
  maxPrice.value = defaultMaxPrice;
  minPriceDisplay.value = '';
  maxPriceDisplay.value = '';
  emits('price-change', {});
};
</script>

<style scoped>
input[type="text"]:focus {
  outline: none;
}
</style>