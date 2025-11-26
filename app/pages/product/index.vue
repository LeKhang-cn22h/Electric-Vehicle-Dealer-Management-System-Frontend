<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import SearchBar from '@/components/ProductCustomer/SearchBar.vue';
import ModelFilter from '@/components/ProductCustomer/ModelFilter.vue';
import ProductCard from '@/components/ProductCustomer/ProductCard.vue';
import { useVehicle } from '~/composables/useVehicle';
import { useCompareStore } from '~/store/compareStore';
import PriceFilter from '~/components/ProductCustomer/PriceFilter.vue';
import { useRouter } from 'vue-router';
import type { CompareCar, Vehicle } from '~/types/vehicle';

const router = useRouter();

// Stores và composables
const compareStore = useCompareStore();
const { vehicles, loading, error, fetchAll, searchAll, filterByModel, getListVehiclePrice } = useVehicle();

// Interfaces
interface Filters {
  model?: string;
  price?: {
    min?: number;
    max?: number;
  };
}

interface PriceFilterData {
  min?: number;
  max?: number;
}

// State
const keyword = ref<string>('');
const filters = ref<Filters>({});
const showCompare = ref<boolean>(false);

// ========== STATE CHO GIÁ ==========
const vehiclePrices = ref<Map<number, number>>(new Map());
const priceLoading = ref<boolean>(false);

// Computed properties
const compareList = computed<CompareCar[]>(() => compareStore.selectedCars);

// ✅ LỌC GIÁ - CLIENT SIDE
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

    // ✅ Lọc theo giá - CLIENT SIDE
    const matchesPrice = checkPriceFilter(car);

    return matchesSearch && matchesModel && matchesPrice;
  });
});

// ✅ Kiểm tra price filter
const checkPriceFilter = (car: Vehicle): boolean => {
  if (!filters.value.price) return true;
  
  const carPrice = vehiclePrices.value.get(car.id) || 0;
  const { min, max } = filters.value.price;
  
  if (min === undefined && max === undefined) return true;
  
  if (min !== undefined && carPrice < min) return false;
  if (max !== undefined && carPrice > max) return false;
  
  return true;
};

// ========== LOAD GIÁ ==========
const loadAllPrices = async () => {
  if (vehicles.value.length === 0) return;

  try {
    priceLoading.value = true;
    const vehicleIds = vehicles.value.map((v: Vehicle) => v.id);
    
    console.log('[ProductIndex] Loading prices for', vehicleIds.length, 'vehicles');
    
    const priceData = await getListVehiclePrice(vehicleIds);
    
    if (priceData?.data && Array.isArray(priceData.data)) {
      const newPrices = new Map<number, number>();
      
      priceData.data.forEach((item: any) => {
        const price = item.selling_price ?? item.price ?? 0;
        newPrices.set(item.id, price);
      });
      
      vehiclePrices.value = newPrices;
      console.log('[ProductIndex] Loaded', newPrices.size, 'prices');
    }
  } catch (err) {
    console.error('[ProductIndex] Error loading prices:', err);
  } finally {
    priceLoading.value = false;
  }
};

// Load xe và giá khi mount
onMounted(async (): Promise<void> => {
  await fetchAll();
  await loadAllPrices();
});

// Watch vehicles để reload giá
watch(vehicles, async (newVehicles) => {
  if (newVehicles && newVehicles.length > 0) {
    await loadAllPrices();
  }
}, { deep: true });

// ✅ CHỈ WATCH keyword + model (KHÔNG watch price)
watch([keyword, () => filters.value.model], async ([newKeyword, newModel]: [string, string | undefined]) => {
  const hasKeyword = newKeyword && newKeyword.length > 0;
  const hasModelFilter = newModel && newModel.length > 0;

  if (hasKeyword && !hasModelFilter) {
    await searchAll(newKeyword);
  } else if (hasModelFilter && !hasKeyword) {
    await filterByModel(newModel);
  } else if (hasKeyword || hasModelFilter) {
    const apiFilters = {
      keyword: newKeyword || undefined,
      model: newModel || undefined,
    };
    await fetchAll(apiFilters);
  } else {
    await fetchAll();
  }
  
  await loadAllPrices();
});

// ✅ Event handlers
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

// ✅ Price filter - CHỈ CẬP NHẬT filters, KHÔNG GỌI API
const onPriceFilterChange = (priceData: PriceFilterData): void => {
  filters.value = {
    ...filters.value,
    price: {
      min: priceData.min,
      max: priceData.max
    }
  };
  // Không cần gọi API, filteredCars sẽ tự động update
};

const resetAllFilters = async (): Promise<void> => {
  keyword.value = '';
  filters.value = {};
  await fetchAll();
  await loadAllPrices();
};

const addToCompare = (car: CompareCar): void => {
  compareStore.addCar(car);
  if (router.currentRoute.value.path !== '/compare') {
    router.push('/compare');
  }
};

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
      <PriceFilter @price-change="onPriceFilterChange" />
    </div>

    <!-- Badge so sánh -->
    <div v-if="compareList.length > 0" class="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
      <span class="text-blue-700 font-medium">
        Đã chọn {{ compareList.length }} xe để so sánh
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading || priceLoading" class="text-center py-12">
      <div class="animate-spin h-12 w-12 border-b-2 border-gray-900 rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ priceLoading ? 'Đang tải giá...' : 'Đang tải...' }}</p>
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
        :price="vehiclePrices.get(car.id) || 0"
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