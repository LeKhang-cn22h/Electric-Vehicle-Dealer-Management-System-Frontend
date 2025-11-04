<template>
  <div class="vehicle-coordination-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Quản Lý Điều Phối Xe</h1>
      <p>Quản lý yêu cầu điều phối xe giữa các đại lý</p>
    </div>

    <!-- Filters và Actions -->
    <div class="page-actions">
      <div class="filters">
        <div class="filter-group">
          <label>Trạng thái:</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Từ ngày:</label>
          <input type="date" v-model="filters.fromDate" class="filter-input">
        </div>
        
        <div class="filter-group">
          <label>Đến ngày:</label>
          <input type="date" v-model="filters.toDate" class="filter-input">
        </div>
        
        <button @click="applyFilters" class="btn-primary">Áp dụng</button>
        <button @click="resetFilters" class="btn-secondary">Reset</button>
      </div>
      
      <div class="action-buttons">
        <button @click="exportData" class="btn-export">
           Xuất Excel
        </button>
        <button @click="showStats = true" class="btn-info">
          Thống kê
        </button>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-value">{{ coordinationStats.total }}</div>
        <div class="stat-label">Tổng yêu cầu</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ coordinationStats.pending }}</div>
        <div class="stat-label">Chờ xử lý</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ coordinationStats.approved }}</div>
        <div class="stat-label">Đã duyệt</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ coordinationStats.completed }}</div>
        <div class="stat-label">Hoàn thành</div>
      </div>
    </div>

    <!-- Coordination Requests Table -->
    <div class="coordination-table">
      <div class="table-header">
        <h3>Danh sách yêu cầu điều phối</h3>
        <div class="table-actions">
          <input 
            v-model="searchQuery" 
            placeholder="Tìm kiếm theo mã, xe, đại lý..." 
            class="search-input"
          >
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã YC</th>
              <th>Thông tin xe</th>
              <th>Đại lý gửi</th>
              <th>Đại lý nhận</th>
              <th>Ngày yêu cầu</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in filteredRequests" :key="request.id">
              <td class="request-code">{{ request.code }}</td>
              <td class="vehicle-info">
                <div class="vehicle-name">{{ request.vehicleName }}</div>
                <div class="vehicle-model">{{ request.vehicleModel }}</div>
              </td>
              <td>{{ request.fromDealer }}</td>
              <td>{{ request.toDealer }}</td>
              <td>{{ formatDate(request.requestDate) }}</td>
              <td class="quantity">{{ request.quantity }}</td>
              <td>
                <span class="status-badge" :class="request.status">
                  {{ getStatusText(request.status) }}
                </span>
              </td>
              <td class="actions">
                <button 
                  v-if="request.status === 'pending'" 
                  @click="approveRequest(request.id)"
                  class="btn-approve"
                >
                  Duyệt
                </button>
                <button 
                  v-if="request.status === 'pending'" 
                  @click="rejectRequest(request.id)"
                  class="btn-reject"
                >
                  Từ chối
                </button>
                <button 
                  v-if="request.status === 'approved'" 
                  @click="completeRequest(request.id)"
                  class="btn-complete"
                >
                  Hoàn thành
                </button>
                <button 
                  @click="viewDetails(request)"
                  class="btn-details"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
          class="pagination-btn"
        >
          ← Previous
        </button>
        <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
          class="pagination-btn"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Request Details Modal -->
    <div v-if="selectedRequest" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết yêu cầu điều phối</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Mã yêu cầu:</label>
              <span>{{ selectedRequest.code }}</span>
            </div>
            <div class="detail-item">
              <label>Xe:</label>
              <span>{{ selectedRequest.vehicleName }} - {{ selectedRequest.vehicleModel }}</span>
            </div>
            <div class="detail-item">
              <label>Đại lý gửi:</label>
              <span>{{ selectedRequest.fromDealer }}</span>
            </div>
            <div class="detail-item">
              <label>Đại lý nhận:</label>
              <span>{{ selectedRequest.toDealer }}</span>
            </div>
            <div class="detail-item">
              <label>Số lượng:</label>
              <span>{{ selectedRequest.quantity }}</span>
            </div>
            <div class="detail-item">
              <label>Ngày yêu cầu:</label>
              <span>{{ formatDate(selectedRequest.requestDate) }}</span>
            </div>
            <div class="detail-item">
              <label>Trạng thái:</label>
              <span :class="['status-text', selectedRequest.status]">
                {{ getStatusText(selectedRequest.status) }}
              </span>
            </div>
            <div class="detail-item full-width">
              <label>Ghi chú:</label>
              <span>{{ selectedRequest.notes || 'Không có ghi chú' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
definePageMeta({
  layout: 'evm-staff-layout'  // hoặc 'evm-staff-layout' tùy theo tên file layout của bạn
})
// Data
const filters = ref({
  status: '',
  fromDate: '',
  toDate: ''
})
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedRequest = ref(null)
const showStats = ref(false)

// Demo data
const coordinationRequests = ref([
  {
    id: 1,
    code: 'DP-001',
    vehicleName: 'Tesla Model 3',
    vehicleModel: '2024',
    fromDealer: 'Đại lý Quận 1',
    toDealer: 'Đại lý Quận 7',
    requestDate: '2024-01-15',
    quantity: 2,
    status: 'pending',
    notes: 'Cần gấp cho khách hàng đặt trước'
  },
  {
    id: 2,
    code: 'DP-002',
    vehicleName: 'Ford Mustang Mach-E',
    vehicleModel: '2024',
    fromDealer: 'Đại lý Quận 3',
    toDealer: 'Đại lý Quận 2',
    requestDate: '2024-01-14',
    quantity: 1,
    status: 'approved',
    notes: ''
  },
  {
    id: 3,
    code: 'DP-003',
    vehicleName: 'Hyundai Ioniq 5',
    vehicleModel: '2024',
    fromDealer: 'Đại lý Quận 7',
    toDealer: 'Đại lý Quận 1',
    requestDate: '2024-01-13',
    quantity: 3,
    status: 'completed',
    notes: 'Đã giao xe thành công'
  },
  {
    id: 4,
    code: 'DP-004',
    vehicleName: 'Kia EV6',
    vehicleModel: '2024',
    fromDealer: 'Đại lý Quận 2',
    toDealer: 'Đại lý Quận 3',
    requestDate: '2024-01-12',
    quantity: 1,
    status: 'rejected',
    notes: 'Không đủ xe trong kho'
  }
])

// Computed
const coordinationStats = computed(() => {
  const total = coordinationRequests.value.length
  const pending = coordinationRequests.value.filter(r => r.status === 'pending').length
  const approved = coordinationRequests.value.filter(r => r.status === 'approved').length
  const completed = coordinationRequests.value.filter(r => r.status === 'completed').length
  return { total, pending, approved, completed }
})

const filteredRequests = computed(() => {
  let filtered = coordinationRequests.value

  // Filter by status
  if (filters.value.status) {
    filtered = filtered.filter(request => request.status === filters.value.status)
  }

  // Filter by date range
  if (filters.value.fromDate) {
    filtered = filtered.filter(request => request.requestDate >= filters.value.fromDate)
  }
  if (filters.value.toDate) {
    filtered = filtered.filter(request => request.requestDate <= filters.value.toDate)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(request => 
      request.code.toLowerCase().includes(query) ||
      request.vehicleName.toLowerCase().includes(query) ||
      request.fromDealer.toLowerCase().includes(query) ||
      request.toDealer.toLowerCase().includes(query)
    )
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(coordinationRequests.value.length / itemsPerPage)
})

// Methods
const applyFilters = () => {
  currentPage.value = 1
  // In real app, you would call API here
}

const resetFilters = () => {
  filters.value = {
    status: '',
    fromDate: '',
    toDate: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
}

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    completed: 'Hoàn thành'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const approveRequest = (id) => {
  const request = coordinationRequests.value.find(r => r.id === id)
  if (request) {
    request.status = 'approved'
    // In real app, call API to update status
  }
}

const rejectRequest = (id) => {
  const request = coordinationRequests.value.find(r => r.id === id)
  if (request) {
    request.status = 'rejected'
    // In real app, call API to update status
  }
}

const completeRequest = (id) => {
  const request = coordinationRequests.value.find(r => r.id === id)
  if (request) {
    request.status = 'completed'
    // In real app, call API to update status
  }
}

const viewDetails = (request) => {
  selectedRequest.value = request
}

const closeModal = () => {
  selectedRequest.value = null
}

const exportData = () => {
  // In real app, implement Excel export
  alert('Xuất dữ liệu Excel - Chức năng đang phát triển')
}

onMounted(() => {
  // In real app, fetch data from API
  console.log('Vehicle Coordination page loaded')
})
</script>

<style scoped>
.vehicle-coordination-page {
  padding: 20px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 2.2rem;
}

.page-header p {
  color: #718096;
  font-size: 1.1rem;
}

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.filter-select, .filter-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary, .btn-export, .btn-info {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-export {
  background: #48bb78;
  color: white;
}

.btn-export:hover {
  background: #38a169;
}

.btn-info {
  background: #4299e1;
  color: white;
}

.btn-info:hover {
  background: #3182ce;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 5px;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
}

.coordination-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 300px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.request-code {
  font-weight: 600;
  color: #667eea;
}

.vehicle-name {
  font-weight: 600;
  color: #2d3748;
}

.vehicle-model {
  color: #718096;
  font-size: 0.9rem;
}

.quantity {
  text-align: center;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #feebc8;
  color: #744210;
}

.status-badge.approved {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.rejected {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge.completed {
  background: #bee3f8;
  color: #1a365d;
}

.actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-approve {
  background: #48bb78;
  color: white;
}

.btn-approve:hover {
  background: #38a169;
}

.btn-reject {
  background: #f56565;
  color: white;
}

.btn-reject:hover {
  background: #e53e3e;
}

.btn-complete {
  background: #4299e1;
  color: white;
}

.btn-complete:hover {
  background: #3182ce;
}

.btn-details {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-details:hover {
  background: #cbd5e0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 15px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #718096;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
}

.close-btn:hover {
  color: #2d3748;
}

.modal-body {
  padding: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.status-text.pending { color: #d69e2e; }
.status-text.approved { color: #38a169; }
.status-text.rejected { color: #e53e3e; }
.status-text.completed { color: #3182ce; }

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    justify-content: stretch;
  }
  
  .filter-group {
    flex: 1;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .table-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>