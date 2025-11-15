<script setup>
import { ref, computed, onMounted } from 'vue'
import SearchBar from '@/components/ProductCustomer/SearchBar.vue'
import FilterBar from '@/components/ProductCustomer/FilterBar.vue'
import ProductCard from '@/components/ProductCustomer/ProductCard.vue'
import CompareModal from '@/components/ProductCustomer/CompareModal.vue'
import { useVehicle } from '~/composables/useVehicle'

// Lấy data từ composable
const { vehicles, loading, error, fetchAll } = useVehicle()

onMounted(() => {
  fetchAll()
})

// State tìm kiếm + lọc + so sánh
const keyword = ref('')
const filters = ref({})
const showCompare = ref(false)
const compareList = ref([])

// Hàm nhận dữ liệu từ SearchBar
const onSearch = (val) => {
  keyword.value = val
}

// Hàm nhận dữ liệu từ FilterBar
const onFilterChange = (val) => {
  filters.value = val
}

// Computed filter dựa trên vehicles
const filteredCars = computed(() => {
  return vehicles.value.filter(car => {
    const matchesSearch =
      car.name?.toLowerCase().includes(keyword.value.toLowerCase())

    const matchesMake =
      !filters.value.make || car.make === filters.value.make

    const matchesModel =
      !filters.value.model || car.model === filters.value.model

    return matchesSearch && matchesMake && matchesModel
  })
})

// Add xe vào danh sách so sánh
const addToCompare = (car) => {
  if (!compareList.value.find(c => c.id === car.id)) {
    compareList.value.push(car)
  }
  showCompare.value = true
}
</script>

<template>
  <div class="p-6">
    <!-- Search + Filter -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <SearchBar @update:search="onSearch" />
      <FilterBar @filter-change="onFilterChange" />
    </div>

    <!-- Danh sách xe (filteredCars) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="item in filteredCars"
        :key="item.id"
        :item="item"
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
