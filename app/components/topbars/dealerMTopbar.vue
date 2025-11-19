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
          <NuxtLink to="/user/orders/create" class="nav-item">
            Tạo đơn hàng
          </NuxtLink>

          <NuxtLink to="/dealer_staff/orders" class="nav-item">
            Đơn hàng của tôi
          </NuxtLink>

          <NuxtLink to="/dealer_staff/payments/vnpay-demo" class="nav-item">
            Thanh toán VNPay
          </NuxtLink>

          <NuxtLink to="/dealer_staff/test-drives" class="nav-item">
            Lịch lái thử
          </NuxtLink>

          <NuxtLink to="/dealer_staff/customers" class="nav-item">
            Hồ sơ khách hàng
          </NuxtLink>
        </template>

        <template v-if="isDealerManager">
          <NuxtLink to="/dealer_manager/discounts" class="nav-item">
            Quản lý chiết khấu
          </NuxtLink>

          <NuxtLink to="/dealer_manager/wholesale-pricing" class="nav-item">
            Quản lý giá sỉ
          </NuxtLink>

          <NuxtLink to="/dealer_manager/promotions" class="nav-item">
            Quản lý khuyến mãi
          </NuxtLink>

          <NuxtLink to="/dealer_manager/receivables" class="nav-item">
            Quản lý công nợ
          </NuxtLink>

          <NuxtLink to="/manage_testDriver" class="nav-item">
            Quản lý lịch lái
          </NuxtLink>

          <NuxtLink to="/manage_profile_customer" class="nav-item">
            Quản lý hồ sơ
          </NuxtLink>

          <NuxtLink to="/dealer_manager/ManageDealerStaff" class="nav-item">
            Quản lý Dealer Staff
          </NuxtLink>
        </template>
      </div>

      <div class="user-section">
        <span class="user-role">{{ roleLabel }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCookie } from "#app";

const router = useRouter();
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
  if (isDealerManager.value) return "/dealer_manager/dashboard";
  if (isDealerStaff.value) return "/dealer_staff/dashboard";
  return "/";
});

const switchToUser = () => {
  router.push("/");
};
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

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-role {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
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
