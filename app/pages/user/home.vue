<script setup lang="ts">
import { ref } from "vue";

definePageMeta({ alias: ["/use/home"] });
type User = { id: number; firstName: string; lastName: string; age: number };

const {
  data: usersRes,
  pending,
  error,
} = await useFetch<User[]>("http://localhost:4000/users");

// luôn trả về mảng (không null) để template không bị never
const users = computed<User[]>(() => usersRes.value ?? []);
const stats = [
  { number: "2+", label: "Năm Kinh Nghiệm" },
  { number: "100+", label: "Khách Hàng Hài Lòng" },
  { number: "10+", label: "Mẫu Xe Đa Dạng" },
  { number: "24/7", label: "Hỗ Trợ Khách Hàng" },
];

const features = [
  {
    icon: "🚗",
    title: "Đa Dạng Dòng Xe",
    desc: "Hơn 100+ mẫu xe cao cấp từ các thương hiệu hàng đầu thế giới",
  },
  {
    icon: "✨",
    title: "Chất Lượng Đảm Bảo",
    desc: "100% xe chính hãng, bảo hành toàn diện và hỗ trợ trọn đời",
  },
  {
    icon: "💰",
    title: "Giá Tốt Nhất",
    desc: "Cam kết giá cạnh tranh với chính sách trả góp 0% lãi suất",
  },
  {
    icon: "🔧",
    title: "Bảo Dưỡng Miễn Phí",
    desc: "Dịch vụ bảo dưỡng định kỳ miễn phí trong 3 năm đầu",
  },
];

// Services
const services = [
  {
    title: "Tư Vấn Chuyên Nghiệp",
    desc: "Đội ngũ chuyên viên tư vấn giàu kinh nghiệm, tận tâm",
    image: "/contact.png",
  },
  {
    title: "Lái Thử Miễn Phí",
    desc: "Trải nghiệm xe trước khi quyết định mua",
    image: "/drive.png",
  },
  {
    title: "Hỗ Trợ Vay Vốn",
    desc: "Hỗ trợ thủ tục vay ngân hàng nhanh chóng",
    image: "/loans.png",
  },
];

// Cars showcase
const carShowcase = ref([
  {
    id: 1,
    src: "/showcase/xe1.jpg",
    name: "Mercedes-Benz S-Class",
    tagline: "Siêu sang · Full Option",
    price: "Giá tốt • Liên hệ",
  },
  {
    id: 2,
    src: "/showcase/xe2.jpg",
    name: "BMW 7 Series",
    tagline: "Phong cách doanh nhân",
    price: "Trả góp 0% lãi suất",
  },
  {
    id: 3,
    src: "/showcase/xe3.jpg",
    name: "Lexus LX 600",
    tagline: "SUV đẳng cấp hạng sang",
    price: "Giao xe ngay",
  },
  {
    id: 4,
    src: "/showcase/xe4.jpg",
    name: "Porsche Cayenne",
    tagline: "Hiệu năng & sang trọng",
    price: "Có xe trưng bày",
  },
  {
    id: 5,
    src: "/showcase/xe5.jpg",
    name: "Range Rover Vogue",
    tagline: "Biểu tượng quyền lực",
    price: "Hotline: 1900 xxxx",
  },
]);
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1 class="hero-title">
          Showroom Xe Hơi<br />
          <span class="highlight">Cao Cấp & Sang Trọng</span>
        </h1>

        <p class="hero-subtitle">
          Khám phá bộ sưu tập xe sang trọng với giá tốt nhất thị trường
        </p>

        <div class="hero-buttons">
          <a href="#cars" class="btn btn-primary">Xem Bộ Sưu Tập</a>
          <a href="#contact" class="btn btn-secondary">Liên Hệ Ngay</a>
          <a href="/EVM_staff" class="btn btn-primary">Trang EVM_staff</a>
        </div>
      </div>

      <div class="scroll-indicator">
        <span>Scroll Down</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14m0 0l7-7m-7 7l-7-7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </section>
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="carousel-section" id="cars">
      <div class="container">
        <div class="cars-header">
          <div class="cars-headline">
            <h2 class="cars-title">Bộ Sưu Tập Xe Nổi Bật</h2>
            <p class="cars-subtitle">
              Xe sang – tình trạng mới, giấy tờ rõ ràng, hỗ trợ vay và giao tận
              nơi
            </p>
            <ul v-if="users">
              <li v-for="u in users" :key="u.id">
                {{ u.firstName }} {{ u.lastName }} ({{ u.age }})
              </li>
            </ul>
          </div>
        </div>

        <div class="cars-grid">
          <NuxtLink
            v-for="car in carShowcase"
            :key="car.id"
            :to="`/product/${car.id}`"
            class="car-card"
          >
            <div class="car-image">
              <img :src="car.src" :alt="car.name" draggable="false" />
              <span class="quick-view">Xem Chi Tiết</span>
            </div>
            <div class="car-info">
              <div class="car-top-row">
                <div class="car-name">{{ car.name }}</div>
                <div class="badge-status">Có sẵn</div>
              </div>
              <div class="car-tagline">{{ car.tagline }}</div>
              <div class="car-bottom-row">
                <div class="car-price">{{ car.price }}</div>
                <span class="car-action">Tư vấn</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="services-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Dịch Vụ Của Chúng Tôi</h2>
          <p class="section-subtitle">
            Trải nghiệm mua xe cao cấp với đầy đủ tiện ích
          </p>
        </div>

        <div class="services-grid">
          <div
            v-for="service in services"
            :key="service.title"
            class="service-card"
          >
            <div class="service-image-wrapper">
              <img
                :src="service.image"
                :alt="service.title"
                class="service-image-img"
                draggable="false"
              />
            </div>

            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-desc">{{ service.desc }}</p>

            <a href="#contact" class="service-link">
              Tìm hiểu thêm
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m0 0l-7-7m7 7l-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
    <section class="contact-section" id="contact">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2 class="contact-title">Liên Hệ Với Chúng Tôi</h2>
            <p class="contact-desc">
              Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn 24/7
            </p>

            <div class="contact-details">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div>
                  <strong>Địa chỉ</strong>
                  <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>

              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div>
                  <strong>Hotline</strong>
                  <p>1900 xxxx (Miễn phí)</p>
                </div>
              </div>

              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>contact@showroom.vn</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-buttons">
            <a href="https://zalo.me" class="contact-btn zalo-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2C6.477 2 2 6.145 2 11.243c0 2.85 1.34 5.392 3.448 7.128l-.88 3.23a.5.5 0 00.72.576l3.58-1.87C9.87 20.752 10.918 21 12 21c5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2z"
                />
              </svg>
              <span>Chat Zalo</span>
            </a>

            <a href="https://m.me" class="contact-btn messenger-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2C6.477 2 2 6.145 2 11.486c0 2.965 1.482 5.607 3.796 7.323v3.691a.5.5 0 00.771.42l3.692-2.308A10.945 10.945 0 0012 21c5.523 0 10-4.477 10-9.514C22 6.145 17.523 2 12 2z"
                />
              </svg>
              <span>Messenger</span>
            </a>

            <a href="tel:1900xxxx" class="contact-btn phone-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span>Gọi Ngay</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.home-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow-x: hidden;
  color: #1e293b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.hero-title {
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.highlight {
  background: linear-gradient(120deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(16px, 2.5vw, 20px);
  margin-bottom: 40px;
  opacity: 0.95;
  font-weight: 500;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-4px);
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  opacity: 0.8;
  animation: bounce 2s infinite;
  font-size: 14px;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

.stats-section {
  padding: 80px 0;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-card {
  text-align: center;
  padding: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.stat-number {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
}

.carousel-section {
  position: relative;
  padding: 80px 0 100px;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(102, 126, 234, 0.12) 0%,
      rgba(118, 75, 162, 0) 70%
    ),
    radial-gradient(
      circle at 80% 30%,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0) 60%
    ),
    linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.cars-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out;
}

.cars-headline {
  max-width: 700px;
  text-align: center;
}

.cars-title {
  font-size: clamp(24px, 2vw, 32px);
  font-weight: 800;
  line-height: 1.2;
  position: relative;
  background: linear-gradient(
    270deg,
    #ff0000,
    #00ff1e,
    #006eff,
    #7c00a6,
    #ff0000
  );
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientText 6s linear infinite;
  margin: 0 0 12px;
  letter-spacing: 0.4px;
  align-self: center;
}

.cars-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #00ffff, #0080ff);
  animation: titleUnderline 2s ease-out forwards;
}

.cars-subtitle {
  font-size: 15px;
  line-height: 1.5;
  color: #64748b;
  max-width: 520px;
  font-weight: 500;
}

.cars-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1e293b;
  color: #fff;
  border-radius: 999px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  line-height: 1;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s;
}

.cars-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 28px 48px rgba(0, 0, 0, 0.6);
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 28px;
  max-width: 1100px;
  margin: 0 auto;
}

.car-card {
  background: #0f172a;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.28s;
  min-height: 320px;
  animation: fadeInUp 0.6s ease-out;
}

.car-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7);
}

.car-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: radial-gradient(circle at 50% 20%, #1e293b 0%, #000 70%);
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s;
}

.car-card:hover .car-image img {
  transform: scale(1.07);
}

.quick-view {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s;
}

.quick-view:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.car-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 20px;
  color: #fff;
  background: radial-gradient(
      circle at 0% 0%,
      rgba(30, 41, 59, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 70%
    ),
    rgba(0, 0, 0, 0.4);
}

.car-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.car-name {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: #fff;
  letter-spacing: 0.2px;
}

.badge-status {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.car-tagline {
  font-size: 13px;
  line-height: 1.4;
  color: #94a3b8;
  font-weight: 500;
  min-height: 2.8em;
  margin-bottom: 12px;
}

.car-bottom-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 10px;
}

.car-price {
  font-size: 13px;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 8px;
  padding: 6px 10px;
  line-height: 1.3;
}

.car-action {
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(124, 58, 237, 0.4);
  transition: all 0.25s;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.car-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(124, 58, 237, 0.6);
}

@keyframes gradientText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes titleUnderline {
  0% {
    width: 0;
  }
  100% {
    width: 160px;
  }
}

.features-section {
  padding: 100px 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.feature-card {
  text-align: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  transition: all 0.3s;
  animation: fadeInUp 0.6s ease-out;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 56px;
  margin-bottom: 20px;
  display: inline-block;
  transition: transform 0.3s;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(5deg);
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
}

.services-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease-out;
}

.section-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  position: relative;
  font-style: oblique;
  letter-spacing: 0.6px;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, #00ffff, #0080ff);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 18px;
  color: #e2e8f0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.service-card {
  background: white;
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  transition: all 0.3s;
  animation: fadeInUp 0.6s ease-out;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
}

.service-image-wrapper {
  width: 50%;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
  margin: 0 auto 24px auto;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
}

.service-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.service-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.service-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 14px;
}

.service-link:hover {
  gap: 12px;
  color: #764ba2;
}

.contact-section {
  padding: 100px 0;
  background: white;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.contact-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px;
}

.contact-desc {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 40px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.contact-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.contact-item strong {
  display: block;
  color: #1e293b;
  font-size: 16px;
  margin-bottom: 4px;
}

.contact-item p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

.contact-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 32px;
  border-radius: 50px;
  background: white;
  border: 2px solid #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.contact-btn svg {
  width: 24px;
  height: 24px;
}

.zalo-btn {
  color: #0068ff;
}

.zalo-btn:hover {
  background: #0068ff;
  color: white;
  border-color: #0068ff;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 104, 255, 0.3);
}

.messenger-btn {
  color: #0084ff;
}

.messenger-btn:hover {
  background: linear-gradient(135deg, #0084ff, #00c6ff);
  color: white;
  border-color: #0084ff;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 132, 255, 0.3);
}

.phone-btn {
  color: #10b981;
}

.phone-btn:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 500px;
    padding: 80px 0;
  }

  .scroll-indicator {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .stat-number {
    font-size: 36px;
  }

  .carousel-section {
    padding: 60px 0 80px;
  }

  .cars-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cars-cta {
    font-size: 13px;
    padding: 10px 14px;
  }

  .cars-grid {
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .car-card {
    min-height: 300px;
    border-radius: 14px;
  }

  .car-info {
    padding: 14px 14px 18px;
  }

  .car-name {
    font-size: 14px;
  }

  .badge-status {
    font-size: 10px;
    padding: 5px 6px;
    border-radius: 5px;
  }

  .car-tagline {
    font-size: 12px;
    min-height: 2.6em;
  }

  .car-price {
    font-size: 12px;
    padding: 5px 8px;
    border-radius: 6px;
  }

  .car-action {
    font-size: 12px;
    padding: 7px 10px;
    border-radius: 6px;
  }

  .features-section,
  .services-section,
  .contact-section {
    padding: 60px 0;
  }

  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .cars-title {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
    text-align: center;
  }

  .cars-subtitle {
    font-size: 14px;
    max-width: 100%;
  }

  .cars-grid {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .car-card {
    min-height: 260px;
  }

  .car-image {
    aspect-ratio: 4 / 3;
  }

  .contact-title {
    font-size: 24px;
  }

  .contact-desc {
    font-size: 14px;
  }

  .contact-icon {
    font-size: 24px;
  }
}
</style>
