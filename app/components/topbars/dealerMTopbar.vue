<template>
  <nav class="dealer-topbar">
    <div class="topbar-content">
      <div class="brand-section">
        <NuxtLink :to="homePath" class="brand-link">
          <h2>{{ roleLabel }}</h2>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <NuxtLink :to="homePath" class="nav-item"> Trang chủ </NuxtLink>
        <template v-if="isDealerStaff">
          <NuxtLink to="/user/quotations" class="nav-item">
            Báo giá của tôi
          </NuxtLink>

          <NuxtLink to="/user/orders" class="nav-item">
            Đơn hàng của tôi
          </NuxtLink>
          <NuxtLink to="/inventory" class="nav-item"> Quản lý kho </NuxtLink>

          <NuxtLink to="/manage_testDriver" class="nav-item">
            Lịch lái thử
          </NuxtLink>
          <NuxtLink to="/manage_product" class="nav-item"> Sản phẩm </NuxtLink>

          <NuxtLink to="/manage_profile_customer" class="nav-item">
            Khách hàng
          </NuxtLink>
        </template>

        <template v-if="isDealerManager">
          <NuxtLink to="/dealer_manager/promotions" class="nav-item">
            Khuyến mãi
          </NuxtLink>
          <NuxtLink to="/user/contracts" class="nav-item"> Hợp đồng </NuxtLink>

          <NuxtLink to="/dealer_manager/receivables" class="nav-item">
            Công nợ
          </NuxtLink>

          <NuxtLink to="/manage_testDriver" class="nav-item">
            Lịch lái
          </NuxtLink>

          <NuxtLink to="/manage_profile_customer" class="nav-item">
            Hồ sơ
          </NuxtLink>
          <NuxtLink to="/inventory" class="btn btn-secondary">
            Quản lý kho
          </NuxtLink>

          <NuxtLink to="/manage_Feedback" class="nav-item"> Khiếu nại</NuxtLink>
          <NuxtLink to="/vehicle_unit" class="nav-item"> Điều phối </NuxtLink>
          <NuxtLink to="/dealer_manager/ManageDealerStaff" class="nav-item">
            Quản lý Dealer Staff
          </NuxtLink>
        </template>
      </div>

      <div class="user-section">
        <div class="user-info">
          <div class="user-details">
            <template v-if="pending">
              <span class="loading-text">Đang tải...</span>
            </template>

            <template v-else-if="me">
              <div class="user-profile">
                <span class="welcome-text">Xin chào, </span>
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
import { useCookie } from "#app";
import SettingsDropdown from "@/components/SettingsMenu.vue";
import { useMe } from "@/composables/useMe";

// lấy role từ cookie
const userRole = useCookie<string>("role");

// flags
const isDealerManager = computed(() => userRole.value === "dealer_manager");
const isDealerStaff = computed(() => userRole.value === "dealer_staff");

// label hiển thị
const roleLabel = computed(() => {
  if (isDealerManager.value) return "DEALER MANAGER";
  if (isDealerStaff.value) return "DEALER STAFF";
  return "DEALER PORTAL";
});

// trang chủ theo từng role
const homePath = computed(() => {
  if (isDealerManager.value) return "/dealer_manager";
  if (isDealerStaff.value) return "/dealer_manager";
  return "/";
});

const { me, pending } = useMe();

const userName = computed(() => {
  const u: any = me.value;
  if (!u) return null;

  return (
    u.user_metadata?.full_name ||
    u.full_name ||
    u.fullName ||
    u.email?.split("@")[0] ||
    "User"
  );
});
</script>

<style scoped>
.dealer-topbar {
  background: linear-gradient(135deg, #7587dc 0%, #6ba0e0 100%);
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.topbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  max-width: 1400px;
  margin: 0 auto;
}

.brand-section h2 {
  color: white;
  margin: 0;
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 8px;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.nav-section {
  display: flex;
  gap: 15px;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 6px;
  transition: all 0.3s;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  background: #ff9ff3;
  color: #2d3436;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.switch-btn {
  background: #00b894;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.switch-btn:hover {
  background: #00a085;
  transform: translateY(-2px);
}
</style>
