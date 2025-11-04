<script setup lang="ts">
import { ref, computed } from "vue";

const route = useRoute();
const config = useRuntimeConfig();
const id = computed(() => String(route.params.id));

type Car = {
  id: number;
  name: string;
  tagline: string;
  price: number | string;
  priceNote: string;
  status: string;
  year: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  color: string;
  engine: string;
  seats: number;
  origin: string;
  images: string[];
  description: string;
  features: { category: string; items: string[] }[];
  benefits: string[];
};

const { data: carRes } = await useFetch<Car | null>(
  () => `${config.public.apiBase ?? "http://localhost:4000"}/cars/${id.value}`,
  { server: false, default: () => null }
);

const mockById: Record<string, Car> = {
  "1": {
    id: 1,
    name: "Vinfast e34",
    tagline: "Siêu sang · Full Option",
    price: "5500000000",
    priceNote: "VNĐ (Có thể thương lượng)",
    status: "Có sẵn",
    year: 2024,
    mileage: "5,000 km",
    fuelType: "Xăng",
    transmission: "Tự động",
    color: "Đen Obsidian",
    engine: "3.0L V6 Turbo",
    seats: 5,
    origin: "Đức",
    images: [
      "/showcase/xe1.jpg",
      "/showcase/xe2.jpg",
      "/showcase/xe3.jpg",
      "/showcase/xe4.jpg",
      "/showcase/xe5.jpg",
    ],
    description:
      "Mercedes-Benz S-Class 2024 là biểu tượng của sự sang trọng...",
    features: [
      {
        category: "Ngoại thất",
        items: [
          "Đèn LED thông minh MULTIBEAM",
          "La-zăng AMG 20 inch",
          "Cửa sổ trời Panorama",
          "Gương chiếu hậu điện tự động gập",
        ],
      },
      {
        category: "Nội thất",
        items: [
          "Ghế da Nappa cao cấp",
          "Âm thanh Burmester 3D",
          'MBUX 12.8"',
          "Điều hòa 4 vùng",
        ],
      },
      {
        category: "An toàn",
        items: ["PRE-SAFE", "9 túi khí", "Cảnh báo điểm mù", "Camera 360"],
      },
      {
        category: "Công nghệ",
        items: [
          "Treo khí nén AIRMATIC",
          "Keyless",
          "Sạc không dây",
          "Lái chủ động",
        ],
      },
    ],
    benefits: [
      "Bảo hành 3 năm",
      "Bảo dưỡng 4 lần",
      "Vay đến 80%",
      "Tặng phụ kiện",
      "Hỗ trợ đăng ký",
      "Giao xe tận nơi",
    ],
  },
};

const car = computed<Car | null>(
  () => carRes.value ?? mockById[id.value] ?? null
);

const selectedImage = ref(0);
const activeTab = ref<"specs" | "features" | "description">("specs");

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
]);

const selectImage = (i: number) => (selectedImage.value = i);

const formattedPrice = computed(() => {
  const raw =
    typeof car.value?.price === "string"
      ? parseInt(car.value.price || "0", 10)
      : car.value?.price ?? 0;
  return new Intl.NumberFormat("vi-VN").format(raw);
});
</script>

<template>
  <div class="container" v-if="!car" style="padding: 32px">
    <p>Đang tải hoặc không tìm thấy xe (id: {{ id }})…</p>
  </div>

  <div class="min-h-screen bg-gray-50 font-sans pb-20" v-else>
    <div class="bg-white border-b border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-6">
        <nav class="flex items-center gap-3 text-sm">
          <NuxtLink to="/" class="text-gray-500 hover:text-indigo-500 transition-colors">Trang chủ</NuxtLink>
          <span class="text-gray-300">›</span>
          <NuxtLink to="/#cars" class="text-gray-500 hover:text-indigo-500 transition-colors">Sản phẩm</NuxtLink>
          <span class="text-gray-300">›</span>
          <span class="text-gray-800 font-semibold">{{ car.name }}</span>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8 mb-16">
        <div class="sticky top-6 h-fit">
          <div class="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl mb-4">
            <img :src="car.images[selectedImage]" :alt="car.name" class="w-full h-full object-cover" />
            <div class="absolute top-5 left-5 bg-emerald-500/95 text-white px-4 py-2 rounded-full font-semibold text-sm backdrop-blur-lg">
              {{ car.status }}
            </div>
          </div>
          <div class="grid grid-cols-5 gap-3">
            <button
              v-for="(img, i) in car.images"
              :key="i"
              :class="[
                'aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 cursor-pointer transition-all border-2',
                selectedImage === i ? 'border-indigo-500 shadow-indigo-500/10 ring-4 ring-indigo-500/10' : 'border-transparent hover:border-gray-300'
              ]"
              @click="selectImage(i)"
            >
              <img :src="img" :alt="`${car.name} ${i + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-8">
          <div class="pb-6 border-b-2 border-gray-200">
            <h1 class="text-3xl font-extrabold text-gray-800 mb-2">{{ car.name }}</h1>
            <p class="text-gray-500 font-medium">{{ car.tagline }}</p>
          </div>

          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
            <div class="text-4xl font-extrabold mb-1">{{ formattedPrice }} VNĐ</div>
            <div class="text-sm opacity-90">{{ car.priceNote }}</div>
          </div>

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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <NuxtLink
              to="/#contact"
              class="col-span-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              Liên hệ tư vấn
            </NuxtLink>
            <a
              href="tel:1900xxxx"
              class="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-sm text-white bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all"
            >
              Gọi ngay
            </a>
            <button class="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-sm text-gray-600 bg-white border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-500 transition-all">
              Lưu xe
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
        <div class="flex border-b-2 border-gray-100 overflow-x-auto scrollbar-hide">
          <button
            :class="[
              'flex-1 py-5 px-6 text-base font-semibold transition-all relative',
              activeTab === 'specs'
                ? 'text-indigo-500 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-50'
            ]"
            @click="activeTab = 'specs'"
          >
            Thông số
          </button>
          <button
            :class="[
              'flex-1 py-5 px-6 text-base font-semibold transition-all relative',
              activeTab === 'features'
                ? 'text-indigo-500 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-50'
            ]"
            @click="activeTab = 'features'"
          >
            Trang bị
          </button>
          <button
            :class="[
              'flex-1 py-5 px-6 text-base font-semibold transition-all relative',
              activeTab === 'description'
                ? 'text-indigo-500 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-50'
            ]"
            @click="activeTab = 'description'"
          >
            Mô tả
          </button>
        </div>

        <div class="p-8">
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

          <div v-show="activeTab === 'features'" class="animate-fade-in">
            <div class="grid md:grid-cols-2 gap-8">
              <div
                v-for="f in car.features"
                :key="f.category"
                class="bg-gray-50 p-6 rounded-xl"
              >
                <h3 class="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-200">
                  {{ f.category }}
                </h3>
                <ul class="grid gap-3">
                  <li v-for="it in f.items" :key="it" class="flex items-center gap-3 text-gray-600 text-sm">
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

          <div v-show="activeTab === 'description'" class="animate-fade-in">
            <div class="text-base leading-relaxed text-gray-600">
              <p>{{ car.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <h2 class="text-2xl font-extrabold text-gray-800 mb-8 text-center">Xe liên quan</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="r in relatedCars"
            :key="r.id"
            :to="`/product/${r.id}`"
            class="bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
          >
            <div class="aspect-[16/10] overflow-hidden bg-gray-900">
              <img :src="r.image" :alt="r.name" class="w-full h-full object-cover transition-transform hover:scale-110" />
            </div>
            <div class="p-5">
              <h3 class="text-base font-bold text-gray-800 mb-1">{{ r.name }}</h3>
              <p class="text-sm text-gray-500 mb-3">{{ r.tagline }}</p>
              <div class="text-lg font-bold text-indigo-500">
                {{ new Intl.NumberFormat("vi-VN").format(parseInt(r.price)) }}
                VNĐ
              </div>
            </div>
          </NuxtLink>
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
