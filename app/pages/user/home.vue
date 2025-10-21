<script setup>
definePageMeta({
  alias: ["/"], // map URL "/" vào trang này
});

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useBook, showApiAddress } from "~/composable/user/book";

const { book, loading, load } = useBook();
const apiAddress = showApiAddress();

// Tự động tải khi vào page
onMounted(() => {
  load();
});

// Tự động tải ảnh từ thư mục showcase
const images = ref([]);
const mainIdx = ref(2); // index của box chính (main), mặc định là ảnh giữa
const autoSlideInterval = ref(null);
const isHovering = ref(false);

// Tải danh sách ảnh từ showcase
onMounted(async () => {
  // Danh sách các file có thể có trong showcase
  const showcaseFiles = [
    "/showcase/demo1.gif",
    "/showcase/demo2.gif",
    "/showcase/demo3.webp",
    "/showcase/demo4.gif",
    "/showcase/demo5.webp",
    "/showcase/app1.png",
    "/showcase/app2.png",
    "/showcase/web1.gif",
    "/showcase/web2.gif",
    "/showcase/mobile1.webp",
  ];

  const loadedImages = [];

  // Kiểm tra file nào tồn tại
  for (const imagePath of showcaseFiles) {
    try {
      const response = await fetch(imagePath, { method: "HEAD" });
      if (response.ok) {
        loadedImages.push(imagePath);
      }
    } catch (error) {
      // File không tồn tại, bỏ qua
    }
  }

  // Nếu không có ảnh nào trong showcase, dùng ảnh mặc định
  if (loadedImages.length === 0) {
    images.value = ["/a1.png", "/a2.png", "/a3.png", "/a4.png", "/a5.png"];
  } else {
    images.value = loadedImages;
  }

  // Bắt đầu auto slide
  startAutoSlide();
});

// Dọn dẹp khi component bị hủy
onUnmounted(() => {
  stopAutoSlide();
});

const visibleImages = computed(() => {
  const res = [];
  const len = images.value.length;
  for (let k = -2; k <= 2; k++) {
    const idx = (mainIdx.value + k + len) % len;
    res.push(images.value[idx]);
  }
  return res;
});

// Khi bấm vào box trái/phải
function onBoxClick(idx) {
  if (idx === 2) return; // bấm vào box chính thì không làm gì
  // idx: 0 1 2 3 4
  // mainIdx dịch sang trái/phải tương ứng
  const delta = idx - 2;
  mainIdx.value =
    (mainIdx.value + delta + images.value.length) % images.value.length;
}

// Auto slide functions
function startAutoSlide() {
  if (autoSlideInterval.value || isHovering.value) return;

  autoSlideInterval.value = setInterval(() => {
    if (!isHovering.value && images.value.length > 0) {
      mainIdx.value = (mainIdx.value + 1) % images.value.length;
    }
  }, 3000); // Chuyển ảnh mỗi 3 giây
}

function stopAutoSlide() {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
    autoSlideInterval.value = null;
  }
}

// Hover events
function onMouseEnter() {
  isHovering.value = true;
  stopAutoSlide();
}

function onMouseLeave() {
  isHovering.value = false;
  startAutoSlide();
}
</script>

<template>
  <!-- Banner -->
  <section class="banner">
    <h1>EzLife</h1>
    <h2>Cung cấp giải pháp phần mềm</h2>
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 10%;
      "
    >
      <div
        class="banner-slider"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <div
          v-for="(img, idx) in visibleImages"
          :key="idx + '-' + img"
          :class="[
            'box',
            { main: idx === 2 },
            { boxside: idx === 0 || idx === 4 },
          ]"
          @click="onBoxClick(idx)"
          style="cursor: pointer"
        >
          <img :src="img" alt="" />
        </div>
      </div>
    </div>
    <div class="contact-btns">
      <a href="#" class="zalo-btn"></a>
      <a href="#" class="messenger-btn"></a>
    </div>
  </section>

  <div>
    <h1>Danh sách sách</h1>

    <button @click="load" :disabled="loading">
      {{ loading ? "Đang tải..." : "Tải sách" }}
    </button>

    <!-- Hiển thị địa chỉ API -->
    <p>API: {{ apiAddress }}</p>

    <!-- Hiển thị danh sách book -->
    <ul>
      <li v-for="(item, index) in book" :key="index">
        {{ item.title }}
      </li>
    </ul>
  </div>

  <!-- Lý do chọn -->
  <section class="why">
    <h3>Vì sao bạn nên chọn <span>EzLife</span>?</h3>
    <p>
      Sau đây là những lý do bạn nên sử dụng dịch vụ thiết kế Web App tại Ezlife
    </p>

    <div class="rowwhy">
      <ul class="reasons">
        <li><b>01</b> Giá thành tốt nhất thị trường</li>
        <li><b>02</b> Cam kết chất lượng, chăm sóc khách hàng</li>
        <li><b>03</b> Nhân sự tư duy tốt và thẩm mỹ cao</li>
      </ul>
      <div class="cards-stack">
        <DemoCard class="card card--left" />
        <DemoCard class="card card--right" />
      </div>
    </div>
  </section>

  <!-- Lợi ích -->
  <section class="benefits">
    <h3>LỢI ÍCH CỦA <span>WEB/APP CHUYÊN NGHIỆP</span></h3>

    <div class="benefit-list">
      <article class="benefit-card card--seo">
        <img src="/seologo.png" class="benefit-icon" alt="SEO" />
        <h4>Chuẩn SEO</h4>
        <p>
          WebApp được tối ưu SEO với từ khóa, thẻ meta, URL thân thiện và tối ưu
          nội dung chất lượng, giúp đạt thứ hạng cao trên công cụ tìm kiếm.
        </p>
      </article>

      <article class="benefit-card card--speed">
        <img src="/tocdologo.png" class="benefit-icon" alt="Speed" />
        <h4>Tốc độ</h4>
        <p>
          Tốc độ load nhanh, cải thiện trải nghiệm người dùng và thứ hạng của
          WebApp.
        </p>
      </article>

      <article class="benefit-card card--features">
        <img src="/tinhnanglogo.png" class="benefit-icon" alt="Features" />
        <h4>Tính năng đa dạng</h4>
        <p>
          Tích hợp TMĐT, thanh toán trực tuyến, tìm kiếm nâng cao… theo đúng nhu
          cầu.
        </p>
      </article>

      <article class="benefit-card card--security">
        <img src="/baomatlogo.png" class="benefit-icon" alt="Security" />
        <h4>Bảo mật tuyệt đối</h4>
        <p>HTTPS, tường lửa/IDS, best practices bảo vệ dữ liệu người dùng.</p>
      </article>

      <article class="benefit-card card--admin">
        <img src="/quantrilogo.png" class="benefit-icon" alt="Admin" />
        <h4>Dễ dàng quản trị</h4>
        <p>
          Hệ thống quản trị nội dung linh hoạt, dễ dùng, cập nhật nhanh chóng.
        </p>
      </article>

      <article class="benefit-card card--connect">
        <img src="/ketnoilogo.png" class="benefit-icon" alt="Connect" />
        <h4>Kết nối</h4>
        <p>
          Kết nối mạng xã hội, mở rộng tệp khách hàng, tăng truy cập tự nhiên.
        </p>
      </article>

      <article class="benefit-card card--platform">
        <img src="/nentanglogo.png" class="benefit-icon" alt="Platform" />
        <h4>Nền tảng</h4>
        <p>Đa nền tảng, đa thiết bị.</p>
      </article>

      <article class="benefit-card card--uiux">
        <img src="/uilogo.png" class="benefit-icon" alt="UI/UX" />
        <h4>Chuẩn UI/UX</h4>
        <p>Thiết kế đẹp, trực quan, tăng trải nghiệm và giữ chân người dùng.</p>
      </article>
    </div>
  </section>
</template>

<style>
.banner {
  text-align: center;
  padding: 2rem 1rem 1rem 1rem;
  color: #fff;
}
.banner h1 {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.2em;
  letter-spacing: 2px;
}
.banner h2 {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1.5em;
}
.banner-slider {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 2em;
  margin: 0 2%;
  gap: 2rem;
}

.banner-slider .box {
  width: 340px;
  height: 340px;
  background: #ccc;
  border-radius: 10px;
  opacity: 0.7;
  box-shadow: 4px 6px 0 #0002;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

/* Thêm hiệu ứng hover cho box */
.banner-slider .box:hover:not(.main) {
  transform: scale(1.05);
  opacity: 0.9;
  box-shadow: 6px 8px 15px #0003;
}

.banner-slider .boxside {
  width: 180px;
  height: 180px;
  background: #ccc;
  border-radius: 10px;
  opacity: 0.3;
  box-shadow: 4px 6px 0 #0002;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  cursor: pointer;
  overflow: hidden;
}

/* Hiệu ứng hover cho boxside */
.banner-slider .boxside:hover {
  transform: scale(1.1);
  opacity: 0.6;
  box-shadow: 6px 8px 15px #0003;
}

.banner-slider .box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

/* Hiệu ứng hover cho ảnh */
.banner-slider .box:hover img {
  transform: scale(1.1);
}

.banner-slider .main {
  width: 600px;
  height: 600px;
  background: #fff;
  opacity: 1;
  z-index: 2;
  box-shadow: 6px 10px 0 #0002;
}

/* Hiệu ứng hover cho main box */
.banner-slider .main:hover {
  transform: scale(1.02);
  box-shadow: 8px 12px 20px #0004;
}

/* Thêm indicator nhỏ để hiển thị đang auto slide */
.banner-slider::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3ee6c5, #009ee3);
  border-radius: 2px;
  animation: slideIndicator 3s linear infinite;
}

@keyframes slideIndicator {
  0% {
    width: 0%;
  }
  100% {
    width: 60px;
  }
}

/* Dừng animation khi hover */
.banner-slider:hover::after {
  animation-play-state: paused;
}

.contact-btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2em;
}
.phone-btn {
  background: #3ee6c5;
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.7em 1.2em;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.zalo-btn,
.messenger-btn {
  display: inline-block;
  background: #fff;
  color: #009ee3;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  line-height: 48px;
  box-shadow: 0 2px 8px #0002;
  text-decoration: none;
  margin-left: 0.5em;
  transition: all 0.3s ease;
}

/* Thêm hover cho contact buttons */
.zalo-btn:hover,
.messenger-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 4px 15px #0003;
}

.zalo-btn {
  background: #fff url("/zalo.png") center/70% no-repeat;
}
.messenger-btn {
  background: #fff url("/messenger.png") center/70% no-repeat;
}

.why {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #222222a0;
  backdrop-filter: #2222228b blur(8px);
  color: #fff;
  padding: 3% 5% 3% 5%;
  border-radius: 20px;
  margin: 10%;
  box-shadow: 0 4px 24px #0002;
}
.why p {
  font-size: 1.3rem;
  line-height: 1.6;
}
.why h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5em;
}
.why h3 span {
  color: #3ee6c5;
}
.why .rowwhy {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.why .reasons {
  list-style: none;
  padding: 0;
  margin: 3% 2% 2%;
}
.why .reasons li {
  background: #fff;
  color: #222;
  border-radius: 8px;
  margin-bottom: 4%;
  padding: 0.7em 1em;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1em;
}
.why .reasons b {
  color: #009ee3;
  font-size: 1.1em;
  margin-right: 0.5em;
}

/* Khung chồng thẻ */
.rowwhy .cards-stack {
  display: grid; /* quan trọng */
  place-items: center;
}

/* Tất cả con cùng nằm 1 ô grid → chồng lên nhau */
.cards-stack > * {
  grid-area: 1 / 1;
}

.hinhminhhoa {
  width: 150px;
  object-fit: contain;
  margin-bottom: 0.5em;
}

.card {
  width: 150px;
  height: 200px;
  margin: 10%;
  border-radius: 16px;
  background: url("/a1.png") center/cover no-repeat;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

/* Lệch và xoay nhẹ để thấy overlap */
.card--right {
  transform: rotate(8deg) translateX(60px);
  z-index: 0;
}

.card--left {
  transform: rotate(-8deg) translateX(-60px);
  z-index: 1;
}

/* Hover để nổi lên */
.card--left:hover {
  transform: rotate(0deg) translateX(-60px) translateY(-10px) scale(1.5);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  z-index: 2;
}
.card--right:hover {
  transform: rotate(0deg) translateX(60px) translateY(-10px) scale(1.5);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.benefits {
  flex: 1;
  align-self: center;
  justify-self: center;
  color: #ffffff;
  padding: 3% 5% 3% 5%;
  margin: 0 1rem 1rem 1rem;
  border-radius: 20px;
}

.benefits h3 {
  text-align: center;
  font-style: oblique;
  margin: 0 0 30px;
  letter-spacing: 0.6px;
  font-weight: 800;
  position: relative;
}

/* Thêm hiệu ứng gạch dưới cho title */
.benefits h3::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #00ffff, #0080ff);
  border-radius: 2px;
  animation: titleUnderline 2s ease-out forwards;
  animation-delay: 0.5s;
}

@keyframes titleUnderline {
  to {
    width: 200px;
  }
}
.benefits h3 span {
  background: linear-gradient(270deg, #ff0000, #00ff1e, #006eff, #7c00a6);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientText 4s ease-in-out infinite;
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

/* Lưới chính giống ảnh: thẻ SEO cao 2 hàng bên trái */
.benefit-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(140px, auto);
  gap: 18px;
  max-width: 1000px;
  margin: 0 auto;
  grid-template-areas:
    "seo speed features"
    "seo security admin"
    "connect platform uiux";
}

/* Stagger animation cho các card khi load */
.benefit-card {
  animation: cardFadeIn 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.card--seo {
  animation-delay: 0.1s;
}
.card--speed {
  animation-delay: 0.2s;
}
.card--features {
  animation-delay: 0.3s;
}
.card--security {
  animation-delay: 0.4s;
}
.card--admin {
  animation-delay: 0.5s;
}
.card--connect {
  animation-delay: 0.6s;
}
.card--platform {
  animation-delay: 0.7s;
}
.card--uiux {
  animation-delay: 0.8s;
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Map area cho từng card */
.card--seo {
  grid-area: seo;
  grid-row: span 2;
  padding: 20px;
}
.card--speed {
  grid-area: speed;
}
.card--features {
  grid-area: features;
}
.card--security {
  grid-area: security;
}
.card--admin {
  grid-area: admin;
}
.card--connect {
  grid-area: connect;
}
.card--platform {
  grid-area: platform;
}
.card--uiux {
  grid-area: uiux;
}

/* Card style */
.benefit-card {
  background: #fff;
  color: #1d2a33;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  padding: 16px 16px 18px;
  display: grid;
  align-content: start;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient overlay hiệu ứng */
.benefit-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00ffff 0%, #0080ff 50%, #0040ff 100%);
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.benefit-card:hover::before {
  left: 0;
}

.benefit-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.3);
  color: white;
}

/* Đưa nội dung lên trên overlay */
.benefit-card > * {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.benefit-card h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  transition: all 0.3s ease;
}

.benefit-card:hover h4 {
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.benefit-card p {
  margin: 0;
  line-height: 1.45;
  color: #344b5a;
  transition: all 0.3s ease;
}

.benefit-card:hover p {
  color: rgba(255, 255, 255, 0.95);
}

/* Thẻ SEO cao 2 hàng + icon lớn */
.benefit-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  margin-bottom: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3)) brightness(1.1);
}

/* Responsive: tablet 2 cột, mobile 1 cột */
@media (max-width: 1024px) {
  .benefit-list {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: none; /* bỏ layout cố định để tự chảy */
  }
  .card--seo {
    grid-row: auto;
  } /* không còn span 2 hàng */
}
@media (max-width: 640px) {
  .benefit-list {
    grid-template-columns: 1fr;
  }
}
</style>
