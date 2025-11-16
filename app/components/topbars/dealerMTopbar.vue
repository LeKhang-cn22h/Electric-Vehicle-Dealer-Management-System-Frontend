<template>
  <nav class="dealer-manager-topbar">
    <div class="topbar-content">
      <div class="brand-section">
        <router-link to="/dealer_staff/EVM_staff" class="brand-link">
          <h2>DEALER MANAGER</h2>
        </router-link>
      </div>

      <div class="nav-section">
        <router-link to="/dealer_staff/EVM_staff" class="nav-item">Trang chủ</router-link>
        <router-link to="/dealer_staff/EVM_staff/vehicles" class="nav-item">Quản lý chiết khấu</router-link>
        <router-link to="/dealer_staff/EVM_staff/orders" class="nav-item">Quản lý giá sỉ</router-link>
        <router-link to="/dealer_staff/EVM_staff/pricing" class="nav-item">Quản lý khuyến mãi</router-link>
        <router-link to="/dealer_staff/EVM_staff/test-drive" class="nav-item">Quản lý công nợ</router-link>
        <router-link to="/manage_testDriver" class="nav-item">Quản lý lịch lái</router-link>
        <router-link to="/manage_profile_customer" class="nav-item">QUản lý hồ sơ</router-link>
      </div>

      <div class="user-section">
        <span class="user-role">DEALER MANAGER</span>
        <button @click="switchToUser" class="switch-btn">Switch to User</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const switchToUser = () => {
  router.push('/')
}
</script>

<style scoped>
.dealer-manager-topbar {
  background: linear-gradient(135deg, #7587dc 0%, #6ba0e0 100%);
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
  /* border-bottom: 3px solid #5d69e6; */
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
  background: rgba(255,255,255,0.1);
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
  background: rgba(255,255,255,0.1);
}

.nav-item:hover {
  background: rgba(255,255,255,0.2);
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
  background: rgba(255,255,255,0.2);
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