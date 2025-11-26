<template>
    <aside :class="['sidebar', { 'sidebar-collapsed': !sidebarOpen }]">
        <div class="sidebar-header">
            <h1 v-if="sidebarOpen" class="logo">EV Admin</h1>

            <button @click="toggle()" class="toggle-btn">
                <X v-if="sidebarOpen" :size="20" />
                <Menu v-else :size="20" />
            </button>
        </div>

        <nav class="sidebar-nav">
            <NuxtLink to="/admin/dashboard" class="nav-item" active-class="active">
                <LayoutDashboard :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Tổng quan</span>
            </NuxtLink>

            <NuxtLink to="/manage_product" class="nav-item" active-class="active">
                <Car :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Sản phẩm</span>
            </NuxtLink>
            <NuxtLink to="/admin/pricing" class="nav-item" active-class="active">
                <Banknote :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Giá</span>
            </NuxtLink>

            <NuxtLink to="/admin/promotions" class="nav-item" active-class="active">
                <TicketPercent :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Khuyến mãi</span>
            </NuxtLink>

            <NuxtLink to="/admin/inventory" class="nav-item" active-class="active">
                <Package :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Tồn kho</span>
            </NuxtLink>

            <NuxtLink to="/admin/dealers" class="nav-item" active-class="active">
                <Building2 :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Đại lý</span>
            </NuxtLink>

            <NuxtLink to="/admin/evm-staff" class="nav-item" active-class="active">
                <Building2 :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">EVM Staff</span>
            </NuxtLink>
            <NuxtLink to="/admin/reports" class="nav-item" active-class="active">
                <FileText :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Báo cáo</span>
            </NuxtLink>

            <NuxtLink to="/admin/forecast" class="nav-item" active-class="active">
                <TrendingUp :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Dự báo AI</span>
            </NuxtLink>

            <NuxtLink to="/admin/settings" class="nav-item" active-class="active">
                <Settings :size="20" class="nav-icon" />
                <span v-if="sidebarOpen" class="nav-text">Cài đặt</span>
            </NuxtLink>
        </nav>
    </aside>
</template>

<script setup>
import {
    X,
    Menu,
    LayoutDashboard,
    Car,
    Package,
    Building2,
    FileText,
    TrendingUp,
    Settings,
    TicketPercent,
    Banknote,
} from "lucide-vue-next";

const props = defineProps({
    sidebarOpen: Boolean,
});
const emits = defineEmits(["toggle"]);

function toggle() {
    emits("toggle");
}
</script>

<style scoped>
.sidebar {
    width: 260px;
    background: #1f2937;
    color: white;
    padding: 16px 0;
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: sticky;
    top: 0;
    overflow: hidden;
}

.sidebar-collapsed {
    width: 80px;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    margin-bottom: 24px;
}

.logo {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
}

.toggle-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.toggle-btn:hover {
    background: #374151;
}

/* SIDEBAR NAV */
.sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    gap: 4px;
    overflow-y: auto;
    flex: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 14px;
    transition: background 0.2s;
    white-space: nowrap;
    min-height: 40px;
}

.nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    flex-shrink: 0;
}

.nav-text {
    overflow: hidden;
    text-overflow: ellipsis;
}

.nav-item:hover {
    background: #374151;
}

.nav-item.active {
    background: #2563eb;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 50;
        transform: translateX(0);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .sidebar-collapsed {
        transform: translateX(-100%);
    }
}
</style>
