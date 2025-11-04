<template>
  <div class="p-6">
    <!-- Thanh tìm kiếm + lọc -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <SearchBar @update:search="onSearch" />
      <FilterBar @filter-change="onFilterChange" />
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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

<script setup>
import { ref, computed } from 'vue'
import SearchBar from '@/components/ProductCustomer/SearchBar.vue'
import FilterBar from '@/components/ProductCustomer/FilterBar.vue'
import ProductCard from '@/components/ProductCustomer/ProductCard.vue'
import CompareModal from '@/components/ProductCustomer/CompareModal.vue'

const cars = ref([
  {
    id: 1,
    name: 'Toyota Camry',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    engine: '2.5L I4',
    power: 203,
    fuel: '7.8L/100km',
    price: '1,200,000,000₫',
    inStock: true,
    src: '/showcase/xe1.jpg'
  },
  {
    id: 2,
    name: 'Honda Civic',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    engine: '1.5L Turbo',
    power: 176,
    fuel: '6.5L/100km',
    price: '950,000,000₫',
    inStock: true,
    src: '/showcase/xe2.jpg'
  },
  {
    id: 3,
    name: 'Mazda CX-5',
    make: 'Mazda',
    model: 'CX-5',
    year: 2023,
    engine: '2.0L SkyActiv',
    power: 154,
    fuel: '7.0L/100km',
    price: '870,000,000₫',
    inStock: false,
    src: '/showcase/xe3.jpg'
  },
    {
        id: 4,
        name: 'Ford Ranger',
        make: 'Ford',
        model: 'Ranger',
        year: 2022,
        engine: '2.0L Bi-Turbo',
        power: 210,
        fuel: '8.5L/100km',
        price: '1,050,000,000₫',
        inStock: true,
        src: '/showcase/xe4.jpg'
    },
    {
        id: 5,
        name: 'Hyundai Accent',
        make: 'Hyundai',
        model: 'Accent',
        year: 2023,
        engine: '1.4L I4',
        power: 100,
        fuel: '6.0L/100km',
        price: '600,000,000₫',
        inStock: true,
        src: '/showcase/xe5.jpg'
    }
])

const keyword = ref('')
const filters = ref({})
const showCompare = ref(false)
const compareList = ref([])

const onSearch = (val) => (keyword.value = val)
const onFilterChange = (val) => (filters.value = val)

const filteredCars = computed(() => {
  return cars.value.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(keyword.value.toLowerCase())
    const matchesMake = !filters.value.make || car.make === filters.value.make
    const matchesModel = !filters.value.model || car.model === filters.value.model
    return matchesSearch && matchesMake && matchesModel
  })
})

const addToCompare = (car) => {
  if (!compareList.value.find(c => c.id === car.id)) {
    compareList.value.push(car)
  }
  showCompare.value = true
}
</script>
