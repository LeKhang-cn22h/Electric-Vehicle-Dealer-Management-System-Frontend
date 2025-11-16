<script setup>
import { ref, computed, onMounted } from 'vue';
import SearchBar from '@/components/ProductCustomer/SearchBar.vue';
import FilterBar from '@/components/ProductCustomer/FilterBar.vue';
import ProductCard from '@/components/ProductCustomer/ProductCard.vue';
import CompareModal from '@/components/ProductCustomer/CompareModal.vue';
import { useVehicle } from '~/composables/useVehicle';

// Lấy data từ composable
const { vehicles, loading, error, fetchAll } = useVehicle();

onMounted(async () => {
  await fetchAll();
  console.log('Vehicles loaded:', vehicles.value);
});

// State tìm kiếm + lọc + so sánh
const keyword = ref('');
const filters = ref({});
const showCompare = ref(false);
const compareList = ref([]);

// Hàm nhận dữ liệu từ SearchBar
const onSearch = (val) => {
  keyword.value = val;
};

// Hàm nhận dữ liệu từ FilterBar
const onFilterChange = (val) => {
  filters.value = val;
};

// Computed filter dựa trên vehicles
const filteredCars = computed(() => {
  if (!vehicles.value?.data) return [];

  return vehicles.value.data.filter(car => {
    // Search by name
    const matchesSearch = !keyword.value || 
      car.name?.toLowerCase().includes(keyword.value.toLowerCase());

    // Filter by make (nếu có)
    const matchesMake = !filters.value.make || 
      car.make === filters.value.make;

    // Filter by model (nếu có)
    const matchesModel = !filters.value.model || 
      car.model === filters.value.model;

    return matchesSearch && matchesMake && matchesModel;
  });
});

// Add xe vào danh sách so sánh
const addToCompare = (car) => {
  if (!compareList.value.find(c => c.id === car.id)) {
    compareList.value.push(car);
  }
  showCompare.value = true;
};
</script>

<template>
  <div class="p-6">
    <!-- Search + Filter -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <SearchBar @update:search="onSearch" />
      <FilterBar @filter-change="onFilterChange" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p class="mt-4 text-gray-600">Đang tải...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="fetchAll" 
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCars.length === 0" class="text-center py-12">
      <p class="text-gray-600">Không tìm thấy xe nào</p>
    </div>

    <!-- Danh sách xe (filteredCars) -->
    <div 
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
    >
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