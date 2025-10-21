<script setup>
import { NuxtLink } from "#components";

const icons = {
  phone: `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6.6 10.8a15.7 15.7 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.36 2.3.56 3.6.56a1 1 0 011 1V20a1 1 0 01-1 1C11.4 21 3 12.6 3 2a1 1 0 011-1h3.5a1 1 0 011 1c0 1.3.2 2.5.56 3.6a1 1 0 01-.25 1l-2.2 2.2z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v1l10 6 10-6V6a2 2 0 00-2-2zM2 9l10 6 10-6v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M13 10h3l-1 4h-2v8h-4v-8H7v-4h2V8c0-2.2 1.3-5 5-5h2v4h-1c-.8 0-2 .4-2 2v1z"/></svg>`,
  yt: `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M23 7.5a4 4 0 00-2.8-2.9C18 4 12 4 12 4s-6 0-8.2.6A4 4 0 001 7.5 42 42 0 000 12a42 42 0 001 4.5 4 4 0 002.8 2.9C6 20 12 20 12 20s6 0 8.2-.6A4 4 0 0023 16.5 42 42 0 0024 12a42 42 0 00-1-4.5zM10 15V9l6 3-6 3z"/></svg>`,
};
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <section class="col company">
        <NuxtLink to="/" class="brand">
          <img src="/images/logo.png" alt="Logo" />
          <span>EV Dealer DMS</span>
        </NuxtLink>

        <p class="company-name">
          Công ty TNHH Kinh doanh Thương mại & Dịch vụ EV DMS
        </p>
        <p class="muted">
          MST/MSDN: 0108926276 do Sở KH&ĐT TP Hà Nội cấp lần đầu ngày 01/10/2019
          và các lần thay đổi tiếp theo.
        </p>
        <p class="muted">Địa chỉ: Tô Ký, Quận 12, TP. Hồ Chí Minh, Việt Nam</p>

        <div class="badges">
          <img
            src="/images/moit-badge.webp"
            alt="Đã thông báo Bộ Công Thương"
          />
        </div>

        <div class="legal-line">
          <span>EV DMS. All rights reserved.</span>
          <span>© 2025</span>
        </div>
      </section>

      <section class="col link-col">
        <h5 class="section-title">VỀ EV DMS</h5>
        <ul class="links">
          <li><NuxtLink to="/ve-chung-toi">Giới thiệu</NuxtLink></li>
          <li><NuxtLink to="/tuyen-dung">Tuyển dụng</NuxtLink></li>
          <li><NuxtLink to="/lien-he">Liên hệ</NuxtLink></li>
        </ul>

        <h5 class="section-title mt">TIN TỨC</h5>
        <ul class="links">
          <li><NuxtLink to="/tin-tuc/cong-ty">Công ty</NuxtLink></li>
          <li><NuxtLink to="/tin-tuc/cong-dong">Cộng đồng</NuxtLink></li>
        </ul>
      </section>

      <section class="col link-col">
        <h5 class="section-title">SHOWROOM & ĐẠI LÝ</h5>
        <ul class="links">
          <li><NuxtLink to="/showroom">Tìm showroom</NuxtLink></li>
          <li><NuxtLink to="/dai-ly">Danh sách đại lý</NuxtLink></li>
        </ul>

        <h5 class="section-title mt">ĐIỀU KHOẢN CHÍNH SÁCH</h5>
        <ul class="links">
          <li>
            <NuxtLink to="/chinh-sach/bao-mat">Chính sách bảo mật</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/chinh-sach/doi-tra">Chính sách đổi trả</NuxtLink>
          </li>
          <li><NuxtLink to="/dieu-khoan">Điều khoản sử dụng</NuxtLink></li>
        </ul>
      </section>

      <section class="col support">
        <h5 class="section-title">DỊCH VỤ KHÁCH HÀNG</h5>
        <a class="contact" href="tel:1900232389">
          <span class="i" v-html="icons.phone"></span> 1900 23 23 89
        </a>
        <a class="contact" href="mailto:support@evdms.vn">
          <span class="i" v-html="icons.mail"></span> support@evdms.vn
        </a>

        <h5 class="section-title mt">SPEAK-UP HOTLINE</h5>
        <a class="contact" href="tel:+842444582193">
          <span class="i" v-html="icons.phone"></span> +84 24 4458 2193
        </a>
        <a class="contact" href="mailto:v.speakup@evdms.vn">
          <span class="i" v-html="icons.mail"></span> v.speakup@evdms.vn
        </a>

        <h5 class="section-title mt">Kết nối với EV DMS</h5>
        <div class="social">
          <a
            href="https://facebook.com"
            target="_blank"
            aria-label="Facebook"
            v-html="icons.fb"
          ></a>
          <a
            href="https://youtube.com"
            target="_blank"
            aria-label="YouTube"
            v-html="icons.yt"
          ></a>
        </div>
      </section>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #fafafa;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  color: #0f172a;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 16px 22px;
  display: grid;
  gap: 28px;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  margin-bottom: 10px;
}
.brand img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.brand span {
  font-weight: 900;
  letter-spacing: 0.4px;
}
.company-name {
  margin: 6px 0 8px;
  font-weight: 700;
}
.muted {
  color: #475569;
  margin: 0 0 8px;
}
.badges img {
  height: 44px;
  margin: 10px 0;
}
.legal-line {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: #64748b;
  margin-top: 8px;
}

.section-title {
  margin: 0 0 10px;
  font-size: 0.98rem;
  font-weight: 900;
  letter-spacing: 0.3px;
  color: #111827;
}
.mt {
  margin-top: 14px;
}

.links {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
}
.links li {
  margin: 8px 0;
}
.links a {
  color: #334155;
  text-decoration: none;
  font-weight: 600;
}
.links a:hover {
  color: #009ee3;
}

/* Liên hệ + Social */
.contact {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-weight: 700;
  text-decoration: none;
  padding: 4px 0;
}
.contact:hover {
  color: #009ee3;
}
.i {
  line-height: 0;
}

.social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  color: #0f172a;
  text-decoration: none;
  margin-right: 8px;
}
.social a:hover {
  background: #f0f9ff;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-inner {
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  }
}
@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>
