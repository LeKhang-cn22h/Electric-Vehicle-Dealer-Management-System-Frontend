<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import SearchBar from '@/components/ProductCustomer/SearchBar.vue';
import ModelFilter from '@/components/ProductCustomer/ModelFilter.vue';
import ProductCard from '@/components/ProductCustomer/ProductCard.vue';
import CompareModal from '@/components/ProductCustomer/CompareModal.vue';
import { useVehicle } from '~/composables/useVehicle';
import PriceFilter from '~/components/ProductCustomer/PriceFilter.vue';
// Lấy data từ composable
const { vehicles, loading, error, fetchAll, searchAll, filterByModel } = useVehicle();

// State tìm kiếm + lọc + so sánh
const keyword = ref('');
const filters = ref({});
const showCompare = ref(false);
const compareList = ref([]);

// Load tất cả xe
onMounted(async () => {
  await fetchAll();
});

// Watch keyword + filters
watch([keyword, filters], async ([newKeyword, newFilters]) => {
  await applyFilters(newKeyword, newFilters);
}, { deep: true });

// Áp dụng bộ lọc
const applyFilters = async (searchKeyword, appliedFilters) => {
  const hasKeyword = searchKeyword && searchKeyword.length > 0;
  const hasModelFilter = appliedFilters.model && appliedFilters.model.length > 0;

  // Nếu chỉ search
  if (hasKeyword && !hasModelFilter) {
    await searchAll(searchKeyword);
  }
  // Chỉ filter theo model
  else if (hasModelFilter && !hasKeyword) {
    await filterByModel(appliedFilters.model);
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

// Từ SearchBar
const onSearch = (val) => {
  keyword.value = val;
};

// Từ ModelFilter
const onModelFilterChange = (filterData) => {
  filters.value = {
    ...filters.value,
    model: filterData.model
  };
};

// Reset filters
const resetAllFilters = () => {
  keyword.value = '';
  filters.value = {};
  fetchAll();
};

// Lọc ở FE
const filteredCars = computed(() => {
  const list = vehicles.value;
  if (!Array.isArray(list)) return [];

  return list.filter(car => {
    const matchesSearch =
      !keyword.value ||
      car.name?.toLowerCase().includes(keyword.value.toLowerCase());

    const matchesModel =
      !filters.value.model ||
      car.model?.toLowerCase().includes(filters.value.model.toLowerCase());

    return matchesSearch && matchesModel;
  });
});


// Add so sánh
const addToCompare = (car) => {
  if (!compareList.value.find(c => c.id === car.id)) {
    compareList.value.push(car);
  }
  showCompare.value = true;
};
</script>

<template>
  <div class="p-6">

    <!-- Search + Model Filter -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col gap-14">
        <SearchBar @update:search="onSearch" />
        <ModelFilter @filter-change="onModelFilterChange" />
      </div>
              <PriceFilter/>

      <!-- ❌ ĐÃ XOÁ PriceFilter -->
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin h-12 w-12 border-b-2 border-gray-900 rounded-full"></div>
      <p class="mt-4 text-gray-600">Đang tải...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="fetchAll"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >Thử lại</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredCars.length === 0" class="text-center py-12">
      <p class="text-gray-600">Không tìm thấy xe nào</p>
      <button 
        @click="resetAllFilters"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >Xóa bộ lọc</button>
    </div>

    <!-- Danh sách xe -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="car in filteredCars"
        :key="car.id"
        :car="car"
        @compare="addToCompare"
      />
    </div>

    <!-- Modal so sánh -->
    <CompareModal
      :visible="showCompare"
      :cars="compareList"
      @close="showCompare = false"
    />
    
  </div>
</template>
