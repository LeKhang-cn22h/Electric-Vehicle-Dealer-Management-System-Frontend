<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { useRoute, useRouter } from "#app";
import { NuxtLink } from "#components";

const role = ref("visitor");

const isMenuOpen = ref(false);
const openDropdown = ref(null);
const route = useRoute();
const router = useRouter();

watch(
    () => route.fullPath,
    () => {
        isMenuOpen.value = false;
        openDropdown.value = null;
    }
);

function onKeydown(e) {
    if (e.key === "Escape") {
        isMenuOpen.value = false;
        openDropdown.value = null;
    }
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const commonMenu = [
    // { label: "EVM Staff", to: "/EVM_staff" },
    { label: "Trang chủ", to: "/user/home" },
    { label: "Danh mục xe", to: "/catalog" },
    { label: "So sánh xe", to: "/compare" },
    { label: "Khuyến mãi", to: "/promotions" },
    { label: "Danh sách đơn hàng", to: "/user/orders" },
    { label: "Báo giá", to: "/user/quotations" },
    { label: "Khiếu nại", to: "/Customer/Feedback" },
];
const topLeftLinks = computed(() => commonMenu);

const cta = computed(() => ({ label: "Đăng ký lái thử", to: "/user/test-driver" }));

function go(to) {
    router.push(to);
}
</script>

<template>
    <nav class="topbar" role="navigation" aria-label="Main">
        <NuxtLink to="/user/home" class="logo" aria-label="Trang chủ">
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
                    <NuxtLink :to="item.to" exact-active-class="is-active">
                        {{ item.label }}
                    </NuxtLink>
                </li>
            </ul>

            <ul class="menu-right">
                <li v-if="cta" class="menu-item">
                    <NuxtLink :to="cta.to" class="btn-cta">{{ cta.label }}</NuxtLink>
                </li>
                <li class="menu-item auth">
                    <NuxtLink to="/auth/login" class="btn-link">Đăng nhập</NuxtLink>
                    <NuxtLink to="/auth/register" class="btn-outline">Đăng ký</NuxtLink>
                </li>
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
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: saturate(150%) blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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
    width: 40px;
    height: 40px;
    object-fit: contain;
}
.brand {
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.2px;
}

.menu {
    display: flex;
    align-items: center;
    gap: 20px;
}
.menu-left,
.menu-right {
    display: flex;
    align-items: center;
    gap: 18px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.menu-item a {
    color: #1f2937;
    text-decoration: none;
    font-weight: 600;
    padding: 0.35rem 0.2rem;
}
.menu-item a:hover {
    color: #009ee3;
}
.menu-item a.is-active {
    color: #009ee3;
    border-bottom: 2px solid #009ee3;
}

.auth {
    display: flex;
    gap: 10px;
}
.btn-link {
    color: #0b6fa3;
    text-decoration: none;
    font-weight: 800;
}
.btn-outline {
    text-decoration: none;
    font-weight: 800;
    color: #0b6fa3;
    border: 1px solid rgba(11, 111, 163, 0.28);
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
}
.btn-outline:hover {
    background: rgba(0, 158, 227, 0.08);
}

.btn-cta {
    display: inline-block;
    background: #009ee3;
    color: #fff;
    text-decoration: none;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    font-weight: 800;
    box-shadow: 0 10px 22px rgba(0, 158, 227, 0.25);
}
.btn-cta:hover {
    background: #007fba;
}

.menu-toggle {
    display: none;
    font-size: 1.8rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #0f172a;
}

@media (max-width: 900px) {
}

@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }
    .menu {
        display: none;
        position: absolute;
        right: 12px;
        top: 64px;
        flex-direction: column;
        width: min(92vw, 360px);
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 16px;
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.14);
        padding: 12px;
    }
    .menu.open {
        display: flex;
    }
    .menu-left,
    .menu-right {
        display: block;
    }
    .menu-item {
        margin: 0.35rem 0;
    }
}
</style>
