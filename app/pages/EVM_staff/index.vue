<template>
  <div class="evm-coordination-page">
    <!-- Header -->
    <div class="page-header">
      <h1 style="font-size: 28px; font-weight: bold;">Điều Phối Xe Điện</h1>
      <div class="header-actions">
        <!-- <button @click="showCreateModal = true" class="btn btn-primary">
          + Tạo Yêu Cầu Mới
        </button> -->
        <button @click="refreshData" class="btn btn-secondary" :disabled="loading">
           Làm mới
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total || 0 }}</div>
        <div class="stat-label">Tổng Yêu Cầu</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.pending || 0 }}</div>
        <div class="stat-label">Đang Chờ</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.approved || 0 }}</div>
        <div class="stat-label">Đã Duyệt</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.rejected || 0 }}</div>
        <div class="stat-label">Từ Chối</div>
      </div>
      <!-- <div class="stat-card">
        <div class="stat-value">{{ stats.total_vehicles || 0 }}</div>
        <div class="stat-label">Tổng Xe</div>
      </div> -->
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Trạng Thái:</label>
        <select v-model="filters.status" @change="loadVehicleRequests">
          <option value="">Tất Cả</option>
          <option value="pending">Đang Chờ</option>
          <option value="approved">Đã Duyệt</option>
          <option value="rejected">Từ Chối</option>
          <option value="processing">Đang Xử Lý</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Tên Dealer:</label>
        <input 
          type="text" 
          v-model="filters.dealer_name" 
          placeholder="Tìm theo tên dealer..."
          @input="onDealerNameSearch"
        />
      </div>

      <div class="filter-group">
        <label>Tìm theo Email:</label>
        <input 
          type="email" 
          v-model="emailSearch" 
          placeholder="Nhập email..."
          @keyup.enter="searchByEmail"
        />
        <!-- <button @click="searchByEmail" class="btn btn-outline">Tìm</button> -->
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !vehicleRequests.length" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-message">
         {{ error }}
        <button @click="refreshData" class="btn btn-outline">Thử Lại</button>
      </div>
    </div>

    <!-- Requests Table -->
    <div v-if="vehicleRequests.length" class="requests-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer</th>
            <th>Email</th>
            <th>Địa Chỉ</th>
            <th>Số Lượng</th>
            <th>Trạng Thái</th>
            <th>Ngày Tạo</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in vehicleRequests" :key="request.id" :class="`status-${request.status}`">
            <td>{{ request.id }}</td>
            <td>{{ request.dealer_name }}</td>
            <td>{{ request.email }}</td>
            <td>{{ request.address }}</td>
            <td>{{ request.quantity }}</td>
            <td>
              <span class="status-badge" :class="request.status">
                {{ getStatusText(request.status) }}
              </span>
            </td>
            <td>{{ formatDate(request.created_at) }}</td>
            <td>
              <div class="action-buttons">
                <!-- <button @click="viewRequestDetails(request.id)" class="btn btn-sm btn-info">
                  👁️
                </button>
                <button 
                  v-if="request.status === 'pending'" 
                  @click="openProcessModal(request)" 
                  class="btn btn-sm btn-warning"
                >
                            </button>
                <button @click="editRequest(request)" class="btn btn-sm btn-secondary">
                  ✏️
                </button> -->
                <button @click="deleteRequest(request.id)" class="btn btn-sm btn-danger">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button 
          @click="changePage(pagination.page - 1)" 
          :disabled="pagination.page <= 1"
          class="btn btn-outline"
        >
          ← Previous
        </button>
        <span>Trang {{ pagination.page }} / {{ pagination.totalPages }}</span>
        <button 
          @click="changePage(pagination.page + 1)" 
          :disabled="pagination.page >= pagination.totalPages"
          class="btn btn-outline"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !vehicleRequests.length" class="empty-state">
      <p> Không có yêu cầu nào</p>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Tạo Yêu Cầu Đầu Tiên
      </button>
    </div>

    <!-- Create Request Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Tạo Yêu Cầu Điều Phối Xe</h3>
          <button @click="showCreateModal = false" class="btn-close">×</button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-btn" @click="navigateTo('vehicles')">
            <span class="action-icon">🚙</span>
            <span>Manage Vehicles</span>
          </button>
          <button class="action-btn" @click="navigateTo('orders')">
            <span class="action-icon">📦</span>
            <span>Process Orders</span>
          </button>
          <button class="action-btn" @click="navigateTo('pricing')">
            <span class="action-icon">💰</span>
            <span>Update Pricing</span>
          </button>
          <button class="action-btn" @click="navigateTo('test-drive')">
            <span class="action-icon">🧪</span>
            <span>Schedule Test Drives</span>
          </button>
        </div>
      </div>

    <!-- Process Request Modal -->
    <div v-if="showProcessModal && selectedRequest" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Xử Lý Yêu Cầu #{{ selectedRequest.id }}</h3>
          <button @click="showProcessModal = false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitProcessRequest">
            <div class="form-group">
              <label>Trạng Thái *</label>
              <select v-model="processData.status" required>
                <option value="approved">Phê Duyệt</option>
                <option value="rejected">Từ Chối</option>
                <option value="processing">Đang Xử Lý</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ghi Chú</label>
              <textarea v-model="processData.notes" placeholder="Nhập ghi chú..."></textarea>
            </div>
            <div v-if="processData.status === 'approved'" class="form-group">
              <label>ID Nhân Viên Phụ Trách</label>
              <input v-model="processData.assigned_staff_id" type="text" />
            </div>
            <div v-if="processData.status === 'approved'" class="form-group">
              <label>Ngày Dự Kiến Giao Hàng</label>
              <input v-model="processData.estimated_delivery_date" type="date" />
            </div>
            <div class="form-actions">
              <button type="button" @click="showProcessModal = false" class="btn btn-outline">
                Hủy
              </button>
              <button type="submit" :disabled="loading" class="btn btn-primary">
                {{ loading ? 'Đang xử lý...' : 'Xác Nhận' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'evm-staff-layout'
})
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateTo = (route) => {
  router.push(`/EVM_staff/${route}`)
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'Đang Chờ',
    approved: 'Đã Duyệt',
    rejected: 'Từ Chối',
    processing: 'Đang Xử Lý'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.evm-coordination-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  color: #666;
  margin-top: 5px;
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
}

.requests-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d1edff;
  color: #0c5460;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.processing {
  background: #d4edda;
  color: #155724;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #333;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.loading-state,
.empty-state,
.error-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin: 20px 0;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
}
</style>