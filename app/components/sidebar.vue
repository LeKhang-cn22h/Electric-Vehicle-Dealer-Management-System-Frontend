<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from '#app'
import { NuxtLink } from '#components'


// TODO: Thay bằng auth thực tế (Pinia/NuxtAuth)
const role = ref('dealer') // 'dealer' | 'evm' | 'admin'

const showForm = ref(false)
const isMenuOpen = ref(false)
const openDropdown = ref(null) 

const route = useRoute()
const router = useRouter()

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
    openDropdown.value = null
  }
)

function onKeydown(e) {
  if (e.key === 'Escape') {
    isMenuOpen.value = false
    openDropdown.value = null
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
const commonMenu = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Danh mục xe', to: '/catalog' },
  { label: 'So sánh xe', to: '/compare' },
  { label: 'Khuyến mãi', to: '/promotions' },
]

const dealerMenu = [
  {
    id: 'sales',
    label: 'Bán hàng',
    children: [
      { label: 'Tạo báo giá', to: '/dealer/quotes' },
      { label: 'Đơn hàng', to: '/dealer/orders' },
      { label: 'Hợp đồng', to: '/dealer/contracts' },
      { label: 'Thanh toán (trả thẳng/trả góp)', to: '/dealer/payments' },
    ],
  },
  {
    id: 'ops',
    label: 'Vận hành',
    children: [
      { label: 'Đặt xe từ hãng', to: '/dealer/place-requests' },
      { label: 'Theo dõi giao xe', to: '/dealer/delivery-tracking' },
      { label: 'Lịch hẹn lái thử', to: '/dealer/test-drives' },
      { label: 'Khách hàng (CRM)', to: '/dealer/customers' },
      { label: 'Khiếu nại/Phản hồi', to: '/dealer/feedback' },
    ],
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    children: [
      { label: 'Doanh số theo NV', to: '/dealer/reports/sales-by-staff' },
      { label: 'Công nợ khách hàng', to: '/dealer/reports/accounts-receivable' },
    ],
  },
]

const evmMenu = [
  {
    id: 'product',
    label: 'Sản phẩm & Phân phối',
    children: [
      { label: 'Quản lý mẫu/phiên bản/màu', to: '/evm/products' },
      { label: 'Tồn kho tổng', to: '/evm/inventory' },
      { label: 'Điều phối & Phân bổ', to: '/evm/allocation' },
      { label: 'Giá sỉ & Chiết khấu', to: '/evm/price-policies' },
      { label: 'Khuyến mãi theo đại lý', to: '/evm/dealer-promotions' },
    ],
  },
  {
    id: 'dealers',
    label: 'Đại lý',
    children: [
      { label: 'Hợp đồng & Chỉ tiêu', to: '/evm/dealers/contracts-quotas' },
      { label: 'Công nợ đại lý', to: '/evm/dealers/accounts' },
      { label: 'Tài khoản đại lý', to: '/evm/dealers/accounts-management' },
    ],
  },
  {
    id: 'analytics',
    label: 'Báo cáo & AI',
    children: [
      { label: 'Doanh số theo khu vực/đại lý', to: '/evm/reports/geo-sales' },
      { label: 'Tồn kho & tốc độ tiêu thụ', to: '/evm/reports/stock-turnover' },
      { label: 'AI Dự báo nhu cầu', to: '/evm/reports/forecast' },
    ],
  },
]

const adminMenu = [
  {
    id: 'admin',
    label: 'Quản trị',
    children: [
      { label: 'Người dùng & Vai trò', to: '/admin/users' },
      { label: 'Phân quyền (RBAC)', to: '/admin/roles-permissions' },
      { label: 'Audit log', to: '/admin/audit' },
      { label: 'Cấu hình hệ thống', to: '/admin/settings' },
    ],
  },
]

const roleMenuMap = {
  dealer: dealerMenu,
  evm: evmMenu,
  admin: adminMenu,
}

const currentRoleMenus = computed(() => roleMenuMap[role.value] || [])
const topLeftLinks = computed(() => commonMenu)

const cta = computed(() => {
  if (role.value === 'dealer') return { label: 'Tạo báo giá', to: '/dealer/quotes/new' }
  if (role.value === 'evm') return { label: 'Phân bổ xe', to: '/evm/allocation/create' }
  if (role.value === 'admin') return { label: 'Trang quản trị', to: '/admin' }
  return null
})

function toggleDropdown(id) {
  openDropdown.value = openDropdown.value === id ? null : id
}
function go(to) {
  router.push(to)
}
</script>

<template>
  <nav class="topbar" role="navigation" aria-label="Main">
    <NuxtLink to="/" class="logo" aria-label="Trang chủ">
      <img src="/images/logo.png" alt="Logo" />
      <span class="brand">EV Dealer DMS</span>
    </NuxtLink>
    <button
      class="menu-toggle"
      @click="isMenuOpen = !isMenuOpen"
      :aria-expanded="isMenuOpen"
      aria-controls="main-menu"
      aria-label="Mở/đóng menu"
    >
      ☰
    </button>
    <div id="main-menu" class="menu" :class="{ open: isMenuOpen }">
      <ul class="menu-left">
        <li v-for="item in topLeftLinks" :key="item.to" class="menu-item">
          <NuxtLink :to="item.to" exact-active-class="is-active">{{ item.label }}</NuxtLink>
        </li>
      </ul>
      <ul class="menu-center">
        <li
          v-for="group in currentRoleMenus"
          :key="group.id"
          class="menu-item dropdown"
          @mouseenter="toggleDropdown(group.id)"
          @mouseleave="toggleDropdown(null)"
        >
          <button class="dropdown-btn" @click.stop="toggleDropdown(group.id)">
            {{ group.label }}
            <span class="chev">▾</span>
          </button>
          <div class="dropdown-panel" v-if="openDropdown === group.id">
            <div class="dropdown-grid">
              <button
                v-for="child in group.children"
                :key="child.to"
                class="dropdown-link"
                @click="go(child.to)"
              >
                {{ child.label }}
              </button>
            </div>
          </div>
          <ul class="dropdown-mobile" v-if="isMenuOpen">
            <li v-for="child in group.children" :key="child.to">
              <NuxtLink :to="child.to">{{ child.label }}</NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
      <ul class="menu-right">
        <li v-if="cta" class="menu-item">
          <NuxtLink :to="cta.to" class="btn-cta">{{ cta.label }}</NuxtLink>
        </li>

        <li class="menu-item role-switch">
          <label class="role-label">Vai trò:</label>
          <select v-model="role" class="role-select" aria-label="Chọn vai trò">
            <option value="dealer">Dealer Staff/Manager</option>
            <option value="evm">EVM Staff</option>
            <option value="admin">Admin</option>
          </select>
        </li>

        <!-- <li>
          <button class="btn-ghost" @click="showForm = true">Liên hệ</button>
        </li>
        <FormPopup v-model:show="showForm" /> -->
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.75);
  backdrop-filter: saturate(150%) blur(10px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding: 0.5rem 1.25rem;
  min-height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo img {
  width: 40px; height: 40px; object-fit: contain;
}
.brand {
  font-weight: 800;
  color: #0f172a; /* slate-900 */
  letter-spacing: .2px;
}

/* khung menu */
.menu {
  display: flex;
  align-items: center;
  gap: 20px;
}
.menu-left, .menu-center, .menu-right {
  display: flex;
  align-items: center;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.menu-center {
  gap: 8px;
}

.menu-item a {
  color: #1f2937; /* gray-800 */
  text-decoration: none;
  font-weight: 600;
  padding: 0.35rem 0.2rem;
}
.menu-item a:hover { color: #009ee3; }
.menu-item a.is-active {
  color: #009ee3;
  border-bottom: 2px solid #009ee3;
}

/* Dropdown */
.dropdown {
  position: relative;
}
.dropdown-btn {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: 0; cursor: pointer;
  font-weight: 700; color: #1f2937; padding: 0.35rem 0.2rem;
}
.dropdown-btn:hover { color: #009ee3; }
.chev { font-size: .85rem; opacity: .7; }

/* Panel desktop */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 320px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 14px;
  box-shadow: 0 16px 50px rgba(0,0,0,.12);
  padding: 10px;
  animation: fadeIn .12s ease-out;
}
.dropdown-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}
.dropdown-link {
  text-align: left;
  background: transparent; border: 0; cursor: pointer;
  padding: .55rem .7rem; border-radius: 10px; font-weight: 600; color: #111827;
}
.dropdown-link:hover { background: rgba(0,158,227,.08); color: #0b6fa3; }


.dropdown-mobile {
  display: none;
}
.menu.open .dropdown-mobile {
  display: block;
  list-style: none;
  padding-left: .6rem;
}
.dropdown-mobile a {
  display: block; padding: .4rem 0;
  font-weight: 600; color: #334155; text-decoration: none;
}
.dropdown-mobile a:hover { color: #009ee3; }


.btn-cta {
  display: inline-block;
  background: #009ee3; color: #fff; text-decoration: none;
  padding: .55rem 1rem; border-radius: 999px; font-weight: 800;
  box-shadow: 0 10px 22px rgba(0,158,227,.25);
}
.btn-cta:hover { background: #007fba; }

.role-switch {
  display: flex; align-items: center; gap: 8px;
}
.role-label { color: #475569; font-weight: 600; }
.role-select {
  appearance: none;
  background: #fff; border: 1px solid rgba(0,0,0,.12);
  padding: .4rem .6rem; border-radius: 10px; font-weight: 600;
}


.menu-toggle {
  display: none;
  font-size: 1.8rem;
  background: none; border: none; cursor: pointer;
  color: #0f172a;
}

/* Responsive */
@media (max-width: 1100px) {
  .menu-center { display: none; } 
}

@media (max-width: 900px) {
  .menu-left { display: none; }
}

@media (max-width: 768px) {
  .menu-toggle { display: block; }
  .menu {
    display: none;
    position: absolute; right: 12px; top: 64px;
    flex-direction: column;
    width: min(92vw, 360px);
    background: #fff;
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 16px;
    box-shadow: 0 16px 50px rgba(0,0,0,.14);
    padding: 12px;
  }
  .menu.open { display: flex; }
  .menu-left, .menu-center, .menu-right {
    display: block;
  }
  .menu-item { margin: .35rem 0; }
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>
