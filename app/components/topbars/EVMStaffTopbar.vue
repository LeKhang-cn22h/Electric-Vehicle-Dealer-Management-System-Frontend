<template>
  <nav class="evm-staff-topbar">
    <div class="topbar-content">
      <div class="brand-section">
        <NuxtLink to="/EVM_staff" class="brand-link">
          <h2>EV MANAGEMENT STAFF</h2>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <router-link to="/EVM_staff" class="nav-item">Trang chủ</router-link>
        <router-link to="/vehicle_unit" class="nav-item"
          >Điều phối</router-link
        >
        <router-link to="/manage_product" class="nav-item">Sản phẩm</router-link>

        <router-link to="/EVM_staff/evmStaffAgreement/" class="nav-item"
          >Hợp đồng</router-link
        >
        <router-link to="/EVM_staff/wholesale-pricing" class="nav-item"
          >Giá Sỉ</router-link
        >
        <!-- <router-link to="/" class="nav-item">Công nợ</router-link> -->
        <router-link to="/manage_Feedback/" class="nav-item"
          >Phản hồi</router-link
        >
      </div>
      <div class="user-section">
        <div class="user-info">
          <div class="user-details">
            <template v-if="pending">
              <span class="loading-text">Đang tải...</span>
            </template>

            <template v-else-if="me">
              <div class="user-profile">
                <span class="welcome-text">Xin chào,</span>
                <span class="user-name">{{ userName }}</span>
              </div>
            </template>

            <template v-else>
              <span class="loading-text">Chưa đăng nhập</span>
            </template>
          </div>

          <ClientOnly>
            <div class="dropdown-wrapper">
              <SettingsDropdown align="right" />
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SettingsDropdown from "@/components/SettingsMenu.vue";
import { useMe } from "@/composables/useMe";

const navItems = [
  { path: "/EVM_staff", label: "Trang chủ" },
  { path: "/Vehicle_unit", label: "phối xe" },
  { path: "/EVM_staff/wholesale-pricing", label: "Giá sỉ" },
  // { path: "/EVM_staff/promotions", label: "Khuyến mãi" },
  // { path: "/EVM_staff/receivables", label: "Công nợ" },
  { path: "/EVM_staff/feedback", label: "Phản hồi" },
] as const;

const { me, pending } = useMe();

const userName = computed(() => {
  const user = me.value;
  if (!user) return null;

  return (
    user.user_metadata?.full_name ||
    user.full_name ||
    user.fullName ||
    user.email?.split("@")[0] ||
    "User"
  );
});
</script>

<style scoped>
.evm-staff-topbar {
  background: linear-gradient(135deg, #7587dc 0%, #6b71e0 100%);
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.topbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  max-width: 1400px;
  margin: 0 auto;
  gap: 16px;
}

.brand-section h2 {
  color: white;
  margin: 0;
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.brand-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.brand-link:hover h2 {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.nav-section {
  display: flex;
  gap: 12px;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-item:active {
  transform: translateY(0);
}

.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  background: #ff9ff3;
  color: #2d3436;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(255, 159, 243, 0.3);
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 4px;
}

.welcome-text {
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 400;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 700;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role-tag {
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.loading-text {
  font-size: 0.85rem;
  opacity: 0.8;
  font-style: italic;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dropdown-wrapper {
  margin-left: 4px;
}

.switch-btn {
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  color: white;
  border: none;
  padding: 9px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 184, 148, 0.3);
}

.switch-btn:hover {
  background: linear-gradient(135deg, #00a085 0%, #008f76 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 184, 148, 0.4);
}

.switch-btn:active {
  transform: translateY(0);
}

/* ===== Responsive Design ===== */
@media (max-width: 1200px) {
  .topbar-content {
    gap: 12px;
  }

  .nav-section {
    gap: 8px;
  }

  .nav-item {
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  .brand-section h2 {
    font-size: 1.2rem;
    padding: 6px 12px;
  }
}

@media (max-width: 992px) {
  .topbar-content {
    height: auto;
    flex-direction: column;
    padding: 15px 0;
    gap: 15px;
  }

  .brand-section {
    width: 100%;
    text-align: center;
  }

  .nav-section {
    width: 100%;
    justify-content: center;
  }

  .user-section {
    width: 100%;
    justify-content: center;
  }

  .user-name {
    max-width: 120px;
  }
}

@media (max-width: 768px) {
  .nav-section {
    gap: 6px;
  }

  .nav-item {
    padding: 7px 12px;
    font-size: 0.85rem;
  }

  .brand-section h2 {
    font-size: 1rem;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .welcome-text,
  .user-name {
    font-size: 0.8rem;
  }

  .user-role-tag {
    font-size: 0.65rem;
    padding: 2px 8px;
  }
}

@media (max-width: 480px) {
  .evm-staff-topbar {
    padding: 0 12px;
  }

  .nav-section {
    flex-direction: column;
    gap: 8px;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

.nav-item:focus-visible,
.brand-link:focus-visible,
.switch-btn:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>
