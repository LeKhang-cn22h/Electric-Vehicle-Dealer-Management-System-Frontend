<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue';
import SearchBar from '@/components/ProductCustomer/SearchBar.vue';
import ModelFilter from '@/components/ProductCustomer/ModelFilter.vue';
import ProductCard from '@/components/ProductCustomer/ProductCard.vue';
import CompareModal from '@/components/ProductCustomer/CompareModal.vue';
import { useVehicle } from '~/composables/useVehicle';
import { useCompareStore } from '~/store/compareStore';
import PriceFilter from '~/components/ProductCustomer/PriceFilter.vue';
import { useRouter } from 'vue-router'

// Import types thông thường thay vì import type
import type { CompareCar, Vehicle } from '~/types/vehicle';
const router = useRouter()

// Stores và composables
const compareStore = useCompareStore();
const { vehicles, loading, error, fetchAll, searchAll, filterByModel } = useVehicle();

// Interfaces cho filters
interface Filters {
  model?: string;
  price?: {
    min?: number;
    max?: number;
  };
}

// State với TypeScript types
const keyword = ref<string>('');
const filters = ref<Filters>({});
const showCompare = ref<boolean>(false);

// Computed properties với types
const compareList = computed<CompareCar[]>(() => compareStore.selectedCars);
const filteredCars = computed<Vehicle[]>(() => {
  const list = vehicles.value;
  if (!Array.isArray(list)) return [];

  return list.filter((car: Vehicle) => {
    const matchesSearch =
      !keyword.value ||
      car.name?.toLowerCase().includes(keyword.value.toLowerCase());

    const matchesModel =
      !filters.value.model ||
      car.model?.toLowerCase().includes(filters.value.model.toLowerCase());

    return matchesSearch && matchesModel;
  });
});

// Load tất cả xe
onMounted(async (): Promise<void> => {
  await fetchAll();
});

// Watch keyword + filters
watch([keyword, filters], async ([newKeyword, newFilters]: [string, Filters]) => {
  await applyFilters(newKeyword, newFilters);
}, { deep: true });

// Áp dụng bộ lọc
const applyFilters = async (searchKeyword: string, appliedFilters: Filters): Promise<void> => {
  const hasKeyword = searchKeyword && searchKeyword.length > 0;
  const hasModelFilter = appliedFilters.model && appliedFilters.model.length > 0;

  // Nếu chỉ search
  if (hasKeyword && !hasModelFilter) {
    await searchAll(searchKeyword);
  }
  // Chỉ filter theo model
  else if (hasModelFilter && !hasKeyword) {
    await filterByModel(appliedFilters.model ?? "");
  }
  // Kết hợp
  else {
    const apiFilters = {
      keyword: searchKeyword || undefined,
      model: appliedFilters.model || undefined,
    };
    await fetchAll(apiFilters);
  }
};

// Event handlers
const onSearch = (val: string): void => {
  keyword.value = val;
};

interface ModelFilterData {
  model?: string;
}

const onModelFilterChange = (filterData: ModelFilterData): void => {
  filters.value = {
    ...filters.value,
    model: filterData.model
  };
};

const resetAllFilters = (): void => {
  keyword.value = '';
  filters.value = {};
  fetchAll();
};

const addToCompare = (car: CompareCar): void => {
  compareStore.addCar(car)
if (router.currentRoute.value.path !== '/compare') {
  router.push('/compare');
}}

const closeCompareModal = (): void => {
  showCompare.value = false;
};
</script>

<template>
  <div class="p-6">
    <!-- Search + Model Filter -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="flex flex-col gap-4">
        <SearchBar @update:search="onSearch" />
        <ModelFilter @filter-change="onModelFilterChange" />
      </div>
      <PriceFilter />
    </div>

    <!-- Badge so sánh -->
    <div v-if="compareList.length > 0" class="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
      <span class="text-blue-700 font-medium">
        Đã chọn {{ compareList.length }} xe để so sánh
      </span>
      
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin h-12 w-12 border-b-2 border-gray-900 rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-600">Đang tải...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="() => fetchAll()"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredCars.length === 0" class="text-center py-12">
      <p class="text-gray-600">Không tìm thấy xe nào</p>
      <button 
        @click="resetAllFilters"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Xóa bộ lọc
      </button>
    </div>

    <!-- Danh sách xe -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="car in filteredCars"
        :key="car.id"
        :car="car"
        :is-in-compare="compareStore.selectedCars.some((c: CompareCar) => c.id === car.id)"
        @compare="addToCompare"
      />
    </div>

    <!-- Modal so sánh -->
    <CompareModal
      :visible="showCompare"
      :cars="compareList"
      @close="closeCompareModal"
    />
  </div>
</template>