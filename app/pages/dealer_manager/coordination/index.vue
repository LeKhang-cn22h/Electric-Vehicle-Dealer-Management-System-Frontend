<!-- pages/dealer_manager/coordination/index.vue -->
<template>
  <div class="coordination-page">
    <div class="page-header">
      <h1>Điều Phối Xe</h1>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'create' }]"
        @click="activeTab = 'create'"
      >
        Tạo Yêu Cầu
      </button>
      <button 
        :class="['tab', { active: activeTab === 'list' }]"
        @click="activeTab = 'list'; fetchRequests()"
      >
        Danh Sách Yêu Cầu
      </button>
    </div>

    <!-- Tab: Tạo yêu cầu -->
    <div v-if="activeTab === 'create'" class="tab-content">
      <div class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label>Tên Dealer <span class="required">*</span></label>
            <input 
              v-model="form.dealer_name" 
              placeholder="VD: Honda Bình Dương" 
            />
          </div>
          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input 
              v-model="form.email" 
              type="email"
              placeholder="VD: dealer@example.com" 
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Địa chỉ <span class="required">*</span></label>
            <input 
              v-model="form.address" 
              placeholder="VD: 123 Nguyễn Văn Linh, Q.7, TP.HCM" 
            />
          </div>
          <div class="form-group">
            <label>Số lượng xe <span class="required">*</span></label>
            <input 
              v-model.number="form.quantity" 
              type="number" 
              min="1"
              placeholder="VD: 10" 
            />
          </div>
        </div>

        <button 
          class="btn-primary"
          :disabled="pending || !isFormValid"
          @click="handleSubmit"
        >
          {{ pending ? 'Đang xử lý...' : 'Tạo Yêu Cầu Điều Phối' }}
        </button>

        <div v-if="message" class="message success">{{ message }}</div>
        <div v-if="error" class="message error">{{ error }}</div>
      </div>
    </div>

    <!-- Tab: Danh sách -->
    <div v-if="activeTab === 'list'" class="tab-content">
      <div class="list-header">
        <div class="search-box">
          <input 
            v-model="searchDealerName" 
            placeholder="Tìm theo tên dealer..."
            @keyup.enter="handleSearch"
          />
          <button class="btn-search" @click="handleSearch">
            🔍 Tìm
          </button>
        </div>
        <button class="btn-refresh" @click="fetchRequests">
          🔄 Tải lại
        </button>
      </div>

      <div v-if="pending" class="loading">Đang tải...</div>
      
      <div v-else-if="requests.length === 0" class="empty">
        Chưa có yêu cầu nào
      </div>

      <div v-else class="request-list">
        <div 
          v-for="req in requests" 
          :key="req.id"
          class="request-card"
        >
          <div class="card-header">
            <span class="dealer-name">{{ req.dealer_name }}</span>
            <span class="request-date">{{ formatDate(req.created_at) }}</span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ req.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">Địa chỉ:</span>
              <span class="value">{{ req.address }}</span>
            </div>
            <div class="info-row">
              <span class="label">Số lượng:</span>
              <span class="value quantity">{{ req.quantity }} xe</span>
            </div>
          </div>
          <div class="card-footer">
            <span :class="['status', getStatusClass(req.status)]">
              {{ getStatusText(req.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dealer-manager-layout",
});
import { ref, reactive, computed } from 'vue'
import { useDealerCoordination } from '~/composables/useDealerCoordination'

const { 
  pending, 
  requests, 
  createVehicleRequest, 
  getAllRequests,
  getRequestsByDealerName 
} = useDealerCoordination()

const activeTab = ref('create')
const message = ref('')
const error = ref('')
const searchDealerName = ref('')

const form = reactive({
  dealer_name: '',
  email: '',
  address: '',
  quantity: 1
})

// Validate form
const isFormValid = computed(() => {
  return (
    form.dealer_name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.address.trim() !== '' &&
    form.quantity > 0
  )
})

// Reset form
const resetForm = () => {
  form.dealer_name = ''
  form.email = ''
  form.address = ''
  form.quantity = 1
}

// Submit form
const handleSubmit = async () => {
  message.value = ''
  error.value = ''
  
  try {
    await createVehicleRequest({
      dealer_name: form.dealer_name,
      email: form.email,
      address: form.address,
      quantity: form.quantity
    })
    message.value = ' Tạo yêu cầu điều phối thành công!'
    resetForm()
  } catch (err: any) {
    error.value = err.message || 'Có lỗi xảy ra, vui lòng thử lại'
  }
}

// Fetch all requests
const fetchRequests = async () => {
  message.value = ''
  error.value = ''
  searchDealerName.value = ''
  
  try {
    await getAllRequests()
  } catch (err: any) {
    error.value = err.message || 'Không thể tải danh sách'
  }
}

// Search by dealer name
const handleSearch = async () => {
  error.value = ''
  
  try {
    if (searchDealerName.value.trim()) {
      await getRequestsByDealerName(searchDealerName.value)
    } else {
      await getAllRequests()
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể tìm kiếm'
  }
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Status helpers
const getStatusClass = (status?: string) => {
  switch (status) {
    case 'approved': return 'status-approved'
    case 'rejected': return 'status-rejected'
    case 'processing': return 'status-processing'
    default: return 'status-pending'
  }
}

const getStatusText = (status?: string) => {
  switch (status) {
    case 'approved': return 'Đã duyệt'
    case 'rejected': return 'Từ chối'
    case 'processing': return 'Đang xử lý'
    default: return 'Chờ duyệt'
  }
}
</script>

<style scoped>
.coordination-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 24px;
  color: #1a56db;
  margin-bottom: 20px;
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s;
}

.tab:hover {
  color: #1a56db;
}

.tab.active {
  color: #1a56db;
  border-bottom: 2px solid #1a56db;
  margin-bottom: -2px;
}

/* Form */
.form-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1a56db;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
}

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 12px;
  background: #1a56db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) { 
  background: #1e40af; 
}

.btn-primary:disabled { 
  background: #9ca3af; 
  cursor: not-allowed;
}

/* Messages */
.message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.message.success { 
  background: #d1fae5; 
  color: #065f46; 
  border: 1px solid #a7f3d0;
}

.message.error { 
  background: #fee2e2; 
  color: #991b1b; 
  border: 1px solid #fecaca;
}

/* List Header */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.search-box {
  display: flex;
  gap: 8px;
  flex: 1;
}

.search-box input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.btn-search {
  padding: 10px 16px;
  background: #1a56db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-search:hover {
  background: #1e40af;
}

.btn-refresh {
  padding: 10px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-refresh:hover {
  background: #e5e7eb;
}

/* Loading & Empty */
.loading, .empty {
  text-align: center;
  color: #6b7280;
  padding: 40px;
  background: white;
  border-radius: 8px;
}

/* Request List */
.request-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.2s;
}

.request-card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.dealer-name { 
  font-weight: 600; 
  font-size: 16px;
  color: #1f2937;
}

.request-date { 
  color: #6b7280; 
  font-size: 13px;
}

.card-body {
  font-size: 14px;
  color: #4b5563;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.info-row .label {
  font-weight: 500;
  width: 80px;
  color: #6b7280;
}

.info-row .value {
  flex: 1;
  color: #1f2937;
}

.info-row .quantity {
  font-weight: 600;
  color: #1a56db;
}

.card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

/* Status */
.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .list-header {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .btn-refresh {
    width: 100%;
  }
}
</style>