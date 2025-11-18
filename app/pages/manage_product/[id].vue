<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Back -->
    <button @click="goBack" class="mb-4 text-blue-600 hover:underline">← Quay lại</button>

    <div v-if="loading">Đang tải...</div>
    <div v-else>
      <!-- Title -->
      <h1 class="text-3xl font-bold mb-2">{{ vehicle.name }}</h1>
      <p class="text-gray-600 mb-4">{{ vehicle.tagline }}</p>

      <!-- Main Image -->
      <div class="mb-4">
        <img
          :src="mainImage"
          class="w-full rounded-xl shadow"
          alt="Main Image"
        />
      </div>

      <!-- Thumbnail Images -->
      <div class="flex gap-3 mb-6">
        <img
          v-for="img in vehicle.images"
          :key="img.id"
          :src="img.path"
          @click="mainImage = img.path"
          class="w-24 h-20 rounded-lg cursor-pointer border hover:scale-105 transition"
        />
      </div>

      <!-- Info -->
      <div class="grid grid-cols-2 gap-6">

        <div>
          <h2 class="font-bold text-xl mb-3">Thông tin kỹ thuật</h2>

          <ul class="space-y-2">
            <li><strong>Model:</strong> {{ vehicle.model }}</li>
            <li><strong>Version:</strong> {{ vehicle.version }}</li>
            <li><strong>Năm SX:</strong> {{ vehicle.year }}</li>
            <li><strong>Quãng đường:</strong> {{ vehicle.mileage }}</li>
            <li><strong>Nhiên liệu:</strong> {{ vehicle.fuel_type }}</li>
            <li><strong>Hộp số:</strong> {{ vehicle.transmission }}</li>
            <li><strong>Động cơ:</strong> {{ vehicle.engine }}</li>
            <li><strong>Số ghế:</strong> {{ vehicle.seats }}</li>
            <li><strong>Xuất xứ:</strong> {{ vehicle.origin }}</li>
            <li><strong>Tình trạng:</strong> {{ vehicle.status }}</li>
          </ul>
        </div>

        <div>
          <h2 class="font-bold text-xl mb-3">Màu sắc</h2>
          <div class="flex gap-2">
            <div
              v-for="(c, index) in vehicle.color"
              :key="index"
              class="w-8 h-8 rounded-full border shadow"
              :style="{ background: c }"
            ></div>
          </div>

          <h2 class="font-bold text-xl mt-6 mb-3">Lợi ích</h2>
          <ul class="list-disc ml-5">
            <li v-for="benefit in vehicle.benefits" :key="benefit.id">
              {{ benefit.benefit }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Features -->
      <div class="mt-10">
        <h2 class="text-xl font-bold mb-4">Tính năng nổi bật</h2>

        <div v-for="group in groupedFeatures" :key="group.category" class="mb-6">
          <h3 class="font-semibold mb-2">{{ group.category }}</h3>
          <ul class="list-disc ml-5">
            <li v-for="item in group.items" :key="item.id">{{ item.item }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-xl font-bold mb-3">Mô tả chi tiết</h2>
        <p class="text-gray-700">{{ vehicle.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" >
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const vehicle = ref<any>(null);
const mainImage = ref("");
const loading = ref(true);

const goBack = () => router.back();

onMounted(() => {
  loadFakeData();
});

const loadFakeData = () => {
  loading.value = true;

  // Fake Data FULL FIELDS
  vehicle.value = {
    id: 1,
    name: "VinFast VF8",
    tagline: "SUV điện thông minh – An toàn – Hiện đại",
    status: "Còn hàng",
    year: 2024,
    mileage: "0 km",
    fuel_type: "Electric",
    transmission: "Auto",
    color: ["#000", "#ffffff", "#1e90ff"],
    engine: "150kW/320Nm – Dual Motor",
    seats: 5,
    origin: "Việt Nam",
    description:
      "VinFast VF8 là mẫu SUV điện 5 chỗ với khả năng vận hành mạnh mẽ, trang bị nhiều công nghệ thông minh, an toàn đạt chuẩn châu Âu.",
    model: "VF8",
    version: "Plus",

    images: [
      { id: 1, path: "https://picsum.photos/id/1011/800/450", is_main: true },
      { id: 2, path: "https://picsum.photos/id/1015/800/450" },
      { id: 3, path: "https://picsum.photos/id/1020/800/450" }
    ],

    benefits: [
      { id: 1, benefit: "Bảo hành 10 năm" },
      { id: 2, benefit: "Miễn phí cứu hộ suốt đời" }
    ],

    features: [
      { id: 1, category: "Ngoại thất", item: "Đèn LED tự động" },
      { id: 2, category: "Ngoại thất", item: "Cảm biến trước & sau" },
      { id: 3, category: "Nội thất", item: "Màn hình 15 inch" },
      { id: 4, category: "Nội thất", item: "Ghế da cao cấp" },
      { id: 5, category: "An toàn", item: "ADAS – Tự động giữ làn" },
      { id: 6, category: "An toàn", item: "Cảnh báo va chạm" }
    ]
  };

  mainImage.value = vehicle.value.images.find((i: any) => i.is_main)?.path;
  loading.value = false;
};

const groupedFeatures = computed(() => {
  if (!vehicle.value) return [];

  const map: any = {};

  for (const f of vehicle.value.features as any[]) {
    if (!map[f.category]) map[f.category] = [];
    map[f.category].push(f);
  }

  return Object.entries(map).map(([category, items]) => ({
    category,
    items: items as any[]
  }));
});

</script>
