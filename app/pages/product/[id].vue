<script setup lang="ts">
import { ref, computed } from "vue"
import { useRoute, useRuntimeConfig } from "#imports"
import {formatCurrency} from "../../utils/format"
import { mockCars, type Car} from "@/data/mockCars"

const route = useRoute()
const config = useRuntimeConfig()
const id = computed(() => String(route.params.id))
const formattedPrice = computed(() => {
  if (!car.value?.price) return formatCurrency(0)
  
  const rawPrice = typeof car.value.price === "string" 
    ? parseInt(car.value.price, 10) 
    : car.value.price
  
  return formatCurrency(rawPrice)
})

// --- Fetch xe từ API hoặc mock ---
const { data: carRes } = await useFetch<Car | null>(
  () => `${config.public.apiBase ?? ""}/cars/${id.value}`,
  { server: false, default: () => null }
)

const car = computed<Car | null>(() => {
  return carRes.value ?? mockCars.find((c) => c.id === Number(id.value)) ?? null
})


const selectedImage = ref(0)

// --- Định nghĩa tab ---
const tabs = ['specs', 'features', 'description'] as const
type TabType = typeof tabs[number]
const activeTab = ref<TabType>('specs')

// --- Danh sách xe liên quan ---
const relatedCars = ref([
  {
    id: 2,
    name: "BMW 7 Series",
    image: "/showcase/xe2.jpg",
    price: "4800000000",
    tagline: "Phong cách doanh nhân",
  },
  {
    id: 3,
    name: "Lexus LX 600",
    image: "/showcase/xe3.jpg",
    price: "8500000000",
    tagline: "SUV đẳng cấp",
  },
  {
    id: 4,
    name: "Porsche Cayenne",
    image: "/showcase/xe4.jpg",
    price: "6200000000",
    tagline: "Hiệu năng vượt trội",
  },
])

const selectImage = (i: number) => (selectedImage.value = i)

// const formattedPrice = computed(() => {
//   const raw =
//     typeof car.value?.price === "string"
//       ? parseInt(car.value.price || "0", 10)
//       : car.value?.price ?? 0
//   return new Intl.NumberFormat("vi-VN").format(raw)
// })
</script>


<template>
  <div class="container" v-if="!car" style="padding: 32px">
    <p>Đang tải hoặc không tìm thấy xe (id: {{ id }})…</p>
  </div>

  <div class="min-h-screen bg-gray-50 font-sans pb-20" v-else>
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-6">
        <nav class="flex items-center gap-3 text-sm">
          <NuxtLink to="/user/home" class="text-gray-500 hover:text-indigo-500 transition-colors">Trang chủ</NuxtLink>
          <span class="text-gray-300">›</span>
          <NuxtLink to="/product" class="text-gray-500 hover:text-indigo-500 transition-colors">Sản phẩm</NuxtLink>
          <span class="text-gray-300">›</span>
          <span class="text-gray-800 font-semibold">{{ car.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8 mb-16">
        <!-- Image gallery -->
        <div class="sticky top-6 h-fit">
          <div class="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl mb-4">
            <img :src="car.images[selectedImage]" :alt="car.name" class="w-full h-full object-cover" />
            <div
              class="absolute top-5 left-5 bg-emerald-500/95 text-white px-4 py-2 rounded-full font-semibold text-sm backdrop-blur-lg"
            >
              {{ car.status }}
            </div>
          </div>
          <div class="grid grid-cols-5 gap-3">
            <button
              v-for="(img, i) in car.images"
              :key="i"
              :class="[
                'aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 cursor-pointer transition-all border-2',
                selectedImage === i
                  ? 'border-indigo-500 shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                  : 'border-transparent hover:border-gray-300',
              ]"
              @click="selectImage(i)"
            >
              <img :src="img" :alt="`${car.name} ${i + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-8">
          <div class="pb-6 border-b-2 border-gray-200">
            <h1 class="text-3xl font-extrabold text-gray-800 mb-2">{{ car.name }}</h1>
            <p class="text-gray-500 font-medium">{{ car.tagline }}</p>
          </div>

          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
            <div class="text-4xl font-extrabold mb-1">{{ formattedPrice }}</div>
            <div class="text-sm opacity-90">{{ car.priceNote }}</div>
          </div>

          <!-- Specs summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-lg">
            <div class="flex gap-3 items-center">
              <span class="text-2xl">📅</span>
              <div>
                <span class="text-xs text-gray-500 block mb-0.5">Năm</span>
                <span class="text-sm text-gray-800 font-semibold">{{ car.year }}</span>
              </div>
            </div>
            <div class="flex gap-3 items-center">
              <span class="text-2xl">🛣️</span>
              <div>
                <span class="text-xs text-gray-500 block mb-0.5">Km</span>
                <span class="text-sm text-gray-800 font-semibold">{{ car.mileage }}</span>
              </div>
            </div>
            <div class="flex gap-3 items-center">
              <span class="text-2xl">⚙️</span>
              <div>
                <span class="text-xs text-gray-500 block mb-0.5">Hộp số</span>
                <span class="text-sm text-gray-800 font-semibold">{{ car.transmission }}</span>
              </div>
            </div>
            <div class="flex gap-3 items-center">
              <span class="text-2xl">⛽</span>
              <div>
                <span class="text-xs text-gray-500 block mb-0.5">Nhiên liệu</span>
                <span class="text-sm text-gray-800 font-semibold">{{ car.fuelType }}</span>
              </div>
            </div>
          </div>

          <!-- Benefits -->
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Ưu đãi</h3>
            <ul class="grid gap-3">
              <li v-for="b in car.benefits" :key="b" class="flex items-center gap-3 text-gray-600 text-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-emerald-500 flex-shrink-0">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ b }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
        <div class="flex border-b-2 border-gray-100 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in ['specs', 'features', 'description']"
            :key="tab"
            :class="[
              'flex-1 py-5 px-6 text-base font-semibold transition-all relative',
              activeTab === tab
                ? 'text-indigo-500 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-50',
            ]"
            @click="activeTab = tab as TabType"
          >
            {{ tab === "specs" ? "Thông số" : tab === "features" ? "Trang bị" : "Mô tả" }}
          </button>
        </div>

        <div class="p-8">
          <!-- Specs -->
          <div v-show="activeTab === 'specs'" class="animate-fade-in">
            <div class="divide-y divide-gray-200 rounded-xl overflow-hidden">
              <div class="flex justify-between py-4 px-6 bg-gray-50">
                <span class="text-gray-500 text-sm">Xuất xứ</span>
                <span class="text-gray-800 font-semibold text-sm">{{ car.origin }}</span>
              </div>
              <div class="flex justify-between py-4 px-6 bg-gray-50">
                <span class="text-gray-500 text-sm">Số chỗ</span>
                <span class="text-gray-800 font-semibold text-sm">{{ car.seats }}</span>
              </div>
              <div class="flex justify-between py-4 px-6 bg-gray-50">
                <span class="text-gray-500 text-sm">Động cơ</span>
                <span class="text-gray-800 font-semibold text-sm">{{ car.engine }}</span>
              </div>
              <div class="flex justify-between py-4 px-6 bg-gray-50">
                <span class="text-gray-500 text-sm">Màu</span>
                <span class="text-gray-800 font-semibold text-sm">{{ car.color }}</span>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div v-show="activeTab === 'features'" class="animate-fade-in">
            <div class="grid md:grid-cols-2 gap-8">
              <div v-for="f in car.features" :key="f.category" class="bg-gray-50 p-6 rounded-xl">
                <h3 class="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-200">{{ f.category }}</h3>
                <ul class="grid gap-3">
                  <li
                    v-for="it in f.items"
                    :key="it"
                    class="flex items-center gap-3 text-gray-600 text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-indigo-500 flex-shrink-0">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    {{ it }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-show="activeTab === 'description'" class="animate-fade-in">
            <div class="text-base leading-relaxed text-gray-600">
              <p>{{ car.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Related Cars -->
<div class="max-w-7xl mx-auto px-6 mb-20">
  <h2 class="text-2xl font-bold text-gray-800 mb-6">Sản phẩm gợi ý</h2>
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <div
      v-for="car in relatedCars"
      :key="car.id"
      class="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <NuxtLink :to="`/product/${car.id}`">
        <img :src="car.image" :alt="car.name" class="w-full aspect-video object-cover" />
        <div class="p-4">
          <h3 class="font-bold text-gray-800 mb-1">{{ car.name }}</h3>
          <p class="text-sm text-gray-500 mb-2">{{ car.tagline }}</p>
          <div class="text-indigo-600 font-semibold">
            {{ formatCurrency(Number(car.price)) }} 
            
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
