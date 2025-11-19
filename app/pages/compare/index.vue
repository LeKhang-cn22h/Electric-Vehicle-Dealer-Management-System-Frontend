<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8 text-blue-600">So sánh xe</h1>

    <!-- Empty state -->
    <div v-if="compareStore.selectedCars.length === 0" class="text-center text-gray-500 py-10">
      <p class="text-lg mb-4">Chưa có xe nào trong danh sách so sánh.</p>
      <NuxtLink to="/product" class="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Quay lại danh sách sản phẩm
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="text-center py-10">
      <div class="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-600">Đang tải dữ liệu so sánh...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-600 py-10">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <p class="font-semibold mb-2">Có lỗi xảy ra</p>
        <p class="text-sm">{{ error }}</p>
        <button 
          @click="reload" 
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    </div>

    <!-- Compare table -->
    <div v-else-if="compareData.length > 0" class="space-y-6">
      <!-- Header info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <span class="text-blue-700 font-medium">
          Đang so sánh {{ compareData.length }} xe
        </span>
        <div class="flex gap-2">
          <button 
            @click="compareStore.clearAll()" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Xóa tất cả
          </button>
          <NuxtLink 
            to="/product" 
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Quay lại
          </NuxtLink>
        </div>
      </div>

      <!-- Comparison table -->
      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-300">
              <th class="p-4 text-left w-48 font-semibold text-gray-700">Thông số</th>
              <th 
                v-for="(car, idx) in compareData" 
                :key="car.id" 
                class="p-4 text-center min-w-[200px]"
              >
                <div class="space-y-3">
                  <img 
                    :src="car.src || 'https://via.placeholder.com/300x200?text=No+Image'" 
                    :alt="car.name"
                    class="h-32 w-full object-cover rounded-lg mb-2 shadow-sm"
                  />
                  <div class="font-semibold text-gray-800">{{ car.name }}</div>
                  <button 
                    @click="compareStore.removeCar(car.id)" 
                    class="text-xs text-red-600 hover:text-red-800 hover:underline"
                  >
                    Xóa khỏi so sánh
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(spec, key) in specs" 
              :key="key" 
              class="border-b hover:bg-gray-50 transition-colors"
            >
              <td class="p-4 font-medium bg-gray-50 text-gray-700">
                {{ spec.label }}
              </td>
              <td 
                v-for="(car, carIndex) in compareData" 
                :key="car.id" 
                class="p-4 text-center text-gray-600"
              >
                {{ car[spec.key] || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No data after loading -->
    <div v-else class="text-center text-gray-500 py-10">
      <p>Không thể tải dữ liệu so sánh.</p>
      <button 
        @click="reload" 
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Thử lại
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVehicle } from "~/composables/useVehicle"
import { useCompareStore } from '~/store/compareStore'
import { ref, onMounted, watch } from 'vue'

// Types
interface CompareVehicle {
  id: number
  name: string
  src: string
  version?: string
  model?: string
  year?: string
  engine?: string
  transmission?: string
  mileage?: string
  color?: string
  seats?: string
  origin?: string
  status?: string
  [key: string]: any
}

// Composables
const { loading, error, compareVehicles } = useVehicle()
const compareStore = useCompareStore()

// State
const compareData = ref<CompareVehicle[]>([])

// Load compare data
const loadCompareData = async () => {
  if (compareStore.selectedCars.length === 0) {
    console.warn('[Compare] No cars selected')
    compareData.value = []
    return
  }

  try {
    const ids = compareStore.selectedCars.map(c => c.id)
    console.log('[Compare] Loading data for IDs:', ids)
    
    const response = await compareVehicles(ids)
    console.log('[Compare] Backend response:', response)
    
    // ✅ FIX: Lấy vehicles từ response object
    if (response && response.vehicles) {
      compareData.value = response.vehicles
      console.log('[Compare] Loaded vehicles:', compareData.value)
    } else {
      console.error('[Compare] Invalid response format:', response)
      compareData.value = []
    }
  } catch (err) {
    console.error('[Compare] Error loading data:', err)
    compareData.value = []
  }
}

// Lifecycle
onMounted(async () => {
  console.log('[Compare] Page mounted, selected cars:', compareStore.selectedCars)
  await loadCompareData()
})

// Watch for changes in selected cars
watch(
  () => compareStore.selectedCars.length, 
  async (newLength, oldLength) => {
    console.log('[Compare] Selection changed:', { oldLength, newLength })
    await loadCompareData()
  }
)

// Reload function
const reload = async () => {
  console.log('[Compare] Manual reload triggered')
  await loadCompareData()
}

// Specs configuration
const specs = [
  { label: 'Phiên bản', key: 'version' },
  { label: 'Dòng xe', key: 'model' },
  { label: 'Năm sản xuất', key: 'year' },
  { label: 'Động cơ', key: 'engine' },
  { label: 'Hộp số', key: 'transmission' },
  { label: 'Số km đã đi', key: 'mileage' },
  { label: 'Màu sắc', key: 'color' },
  { label: 'Số chỗ ngồi', key: 'seats' },
  { label: 'Xuất xứ', key: 'origin' },
  { label: 'Tình trạng', key: 'status' },
]
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>