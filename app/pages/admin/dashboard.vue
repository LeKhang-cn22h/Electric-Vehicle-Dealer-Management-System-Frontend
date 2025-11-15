<template>
  <div class="admin-container">
    <aside :class="['sidebar', { 'sidebar-collapsed': !sidebarOpen }]">
      <div class="sidebar-header">
        <button @click="sidebarOpen = !sidebarOpen" class="toggle-btn">
          <svg v-if="sidebarOpen" class="icon" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>

          <svg v-else class="icon" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </aside>
    <div class="main-wrapper">
      <main class="content">
        <h2 class="page-title">Tổng quan hệ thống</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>45.2 tỷ</h3>
            <p>Tổng doanh số tháng</p>
          </div>

          <div class="stat-card">
            <h3>328</h3>
            <p>Đơn hàng mới</p>
          </div>

          <div class="stat-card">
            <h3>1,247</h3>
            <p>Tồn kho</p>
          </div>

          <div class="stat-card">
            <h3>156</h3>
            <p>Đại lý hoạt động</p>
          </div>
        </div>

        <div class="data-card">
          <h3>Đại lý hiệu suất cao</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Đại lý</th>
                <th>Doanh số</th>
                <th>Đơn hàng</th>
                <th>Công nợ</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Hà Nội Center</td>
                <td>8.5 tỷ</td>
                <td>85</td>
                <td>2.1 tỷ</td>
              </tr>

              <tr>
                <td>TP.HCM Premium</td>
                <td>7.2 tỷ</td>
                <td>72</td>
                <td>1.8 tỷ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(true);
definePageMeta({
  layout: "admin",
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

/* CONTENT */
.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.stat-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-card p {
  font-size: 13px;
  color: #6b7280;
}

/* DATA CARD + TABLE */
.data-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.data-card h3 {
  font-size: 18px;
  font-weight: 600;
}

.data-table {
  margin-top: 16px;
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  padding: 10px 12px;
  background: #f3f4f6;
  text-align: left;
  font-weight: 500;
  color: #4b5563;
}

.data-table td {
  padding: 10px 12px;
  border-top: 1px solid #e5e7eb;
}

.data-table tr:hover {
  background: #f9fafb;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .sidebar {
    position: fixed;
    height: 100vh;
    z-index: 50;
    left: 0;
    top: 0;
    transform: translateX(0);
  }

  .sidebar-collapsed {
    transform: translateX(-100%);
  }

  .main-wrapper {
    width: 100%;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
