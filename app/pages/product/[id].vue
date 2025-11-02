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

  <div class="detail-page" v-else>
    <div class="breadcrumb-section">
      <div class="container">
        <nav class="breadcrumb">
          <NuxtLink to="/">Trang chủ</NuxtLink>
          <span class="separator">›</span>
          <NuxtLink to="/#cars">Sản phẩm</NuxtLink>
          <span class="separator">›</span>
          <span class="current">{{ car.name }}</span>
        </nav>
      </div>
    </div>

    <div class="container">
      <div class="detail-content">
        <div class="images-section">
          <div class="main-image">
            <img :src="car.images[selectedImage]" :alt="car.name" />
            <div class="image-badge">{{ car.status }}</div>
          </div>
          <div class="thumbnail-list">
            <button
              v-for="(img, i) in car.images"
              :key="i"
              :class="['thumbnail', { active: selectedImage === i }]"
              @click="selectImage(i)"
            >
              <img :src="img" :alt="`${car.name} ${i + 1}`" />
            </button>
          </div>
        </div>
        <div class="info-section">
          <div class="car-header">
            <h1 class="car-title">{{ car.name }}</h1>
            <p class="car-tagline">{{ car.tagline }}</p>
          </div>

          <div class="price-section">
            <div class="price-main">{{ formattedPrice }} VNĐ</div>
            <div class="price-note">{{ car.priceNote }}</div>
          </div>

          <div class="quick-specs">
            <div class="spec-item">
              <span class="spec-icon">📅</span>
              <div class="spec-content">
                <span class="spec-label">Năm</span
                ><span class="spec-value">{{ car.year }}</span>
              </div>
            </div>
            <div class="spec-item">
              <span class="spec-icon">🛣️</span>
              <div class="spec-content">
                <span class="spec-label">Km</span
                ><span class="spec-value">{{ car.mileage }}</span>
              </div>
            </div>
            <div class="spec-item">
              <span class="spec-icon">⚙️</span>
              <div class="spec-content">
                <span class="spec-label">Hộp số</span
                ><span class="spec-value">{{ car.transmission }}</span>
              </div>
            </div>
            <div class="spec-item">
              <span class="spec-icon">⛽</span>
              <div class="spec-content">
                <span class="spec-label">Nhiên liệu</span
                ><span class="spec-value">{{ car.fuelType }}</span>
              </div>
            </div>
          </div>

          <div class="benefits-section">
            <h3 class="benefits-title">Ưu đãi</h3>
            <ul class="benefits-list">
              <li v-for="b in car.benefits" :key="b">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

          <div class="cta-buttons">
            <NuxtLink to="/#contact" class="btn btn-primary"
              >Liên hệ tư vấn</NuxtLink
            >
            <a href="tel:1900xxxx" class="btn btn-secondary">Gọi ngay</a>
            <button class="btn btn-outline">Lưu xe</button>
          </div>
        </div>
      </div>
      <div class="tabs-section">
        <div class="tabs-header">
          <button
            :class="['tab-btn', { active: activeTab === 'specs' }]"
            @click="activeTab = 'specs'"
          >
            Thông số
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'features' }]"
            @click="activeTab = 'features'"
          >
            Trang bị
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'description' }]"
            @click="activeTab = 'description'"
          >
            Mô tả
          </button>
        </div>

        <div class="tabs-content">
          <div v-show="activeTab === 'specs'" class="tab-panel">
            <div class="specs-grid">
              <div class="spec-row">
                <span class="spec-label">Xuất xứ</span
                ><span class="spec-value">{{ car.origin }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-label">Số chỗ</span
                ><span class="spec-value">{{ car.seats }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-label">Động cơ</span
                ><span class="spec-value">{{ car.engine }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-label">Màu</span
                ><span class="spec-value">{{ car.color }}</span>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'features'" class="tab-panel">
            <div class="features-grid">
              <div
                v-for="f in car.features"
                :key="f.category"
                class="feature-category"
              >
                <h3 class="category-title">{{ f.category }}</h3>
                <ul class="feature-list">
                  <li v-for="it in f.items" :key="it">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

          <div v-show="activeTab === 'description'" class="tab-panel">
            <div class="description-content">
              <p>{{ car.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="related-section">
        <h2 class="section-title">Xe liên quan</h2>
        <div class="related-grid">
          <NuxtLink
            v-for="r in relatedCars"
            :key="r.id"
            :to="`/product/${r.id}`"
            class="related-card"
          >
            <div class="related-image">
              <img :src="r.image" :alt="r.name" />
            </div>
            <div class="related-info">
              <h3 class="related-name">{{ r.name }}</h3>
              <p class="related-tagline">{{ r.tagline }}</p>
              <div class="related-price">
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

<style scoped></style>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.detail-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.breadcrumb-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #667eea;
}

.breadcrumb .separator {
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #1e293b;
  font-weight: 600;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-top: 32px;
  margin-bottom: 60px;
}

.images-section {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 20px;
  overflow: hidden;
  background: #0f172a;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(16, 185, 129, 0.95);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.thumbnail-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.thumbnail {
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  background: #0f172a;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail.active {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.thumbnail:hover:not(.active) {
  border-color: #cbd5e1;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.car-header {
  padding-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.car-title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.2;
}

.car-tagline {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

.price-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 16px;
  color: white;
}

.price-main {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 4px;
}

.price-note {
  font-size: 14px;
  opacity: 0.9;
}

.quick-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.spec-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.spec-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.spec-content {
  flex: 1;
}

.spec-label {
  font-size: 13px;
  color: #64748b;
  display: block;
  margin-bottom: 2px;
}

.spec-value {
  font-size: 15px;
  color: #1e293b;
  font-weight: 600;
}

.benefits-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.benefits-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.benefits-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #475569;
}

.benefits-list svg {
  color: #10b981;
  flex-shrink: 0;
}

.cta-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  grid-column: 1 / -1;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: #10b981;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-secondary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-outline {
  background: white;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Tabs Section */
.tabs-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 60px;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid #f1f5f9;
}

.tab-btn {
  flex: 1;
  padding: 20px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  font-family: inherit;
}

.tab-btn:hover {
  color: #667eea;
  background: #f8f9fa;
}

.tab-btn.active {
  color: #667eea;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.tabs-content {
  padding: 32px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-out;
}

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

.specs-grid {
  display: grid;
  gap: 1px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
}

.spec-row .spec-label {
  color: #64748b;
  font-size: 15px;
}

.spec-row .spec-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 15px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.feature-category {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.feature-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #475569;
}

.feature-list svg {
  color: #667eea;
  flex-shrink: 0;
}

.description-content {
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
}

/* Related Section */
.related-section {
  margin-top: 60px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.related-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.related-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.related-image {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #0f172a;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.related-card:hover .related-image img {
  transform: scale(1.1);
}

.related-info {
  padding: 20px;
}

.related-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.related-tagline {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.related-price {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

/* Responsive */
@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .images-section {
    position: static;
  }

  .thumbnail-list {
    grid-template-columns: repeat(4, 1fr);
  }

  .quick-specs {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    grid-column: 1;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }

  .detail-content {
    margin-top: 20px;
    gap: 24px;
  }

  .car-title {
    font-size: 24px;
  }

  .price-main {
    font-size: 28px;
  }

  .tabs-header {
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs-header::-webkit-scrollbar {
    display: none;
  }
}
</style>
