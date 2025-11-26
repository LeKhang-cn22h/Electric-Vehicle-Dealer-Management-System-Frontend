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
      <!-- Debug Info -->
      <!-- <div class="debug-info" style="background: #f5f5f5; padding: 10px; margin-bottom: 15px; border-radius: 5px;">
        <p><strong>Debug:</strong> Requests: {{ requests.length }}, Pending: {{ pending }}, Error: {{ error }}</p>
        <button @click="debugInfo" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px;">
          Debug Info
        </button>
      </div> -->

      <div class="list-header">
        <div class="search-box">
          <input 
            v-model="searchDealerName" 
            placeholder="Tìm theo tên dealer..."
            @keyup.enter="handleSearch"
          />
          <button class="btn-search" @click="handleSearch">
            Tìm
          </button>
        </div>
        <button class="btn-refresh" @click="fetchRequests">
           Tải lại
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
            <div class="info-row">
              <span class="label">ID:</span>
              <span class="value">{{ req.id }}</span>
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

import { ref, reactive, computed, onMounted } from 'vue'
import { useDealerCoordination } from '~/composables/useDealerCoordination'


// SỬA: Sử dụng composable mới với error handling
const { 
  pending, 
  error, // THÊM: error từ composable
  requests, 
  createVehicleRequest, 
  getAllRequests,
  getRequestsByDealerName 
} = useDealerCoordination()

const activeTab = ref('create')
const message = ref('')
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

// Submit form - SỬA: Xử lý error tốt hơn
const handleSubmit = async () => {
  message.value = ''
  
  try {
    const result = await createVehicleRequest({
      dealer_name: form.dealer_name,
      email: form.email,
      address: form.address,
      quantity: form.quantity
    })
    
    console.log('Create request result:', result) // DEBUG
    
    message.value = 'Tạo yêu cầu điều phối thành công!'
    resetForm()
    
    // Tự động chuyển sang tab list sau khi tạo thành công
    setTimeout(() => {
      activeTab.value = 'list'
      fetchRequests()
    }, 1500)
    
  } catch (err: any) {
    console.error('Create request error:', err)
    // Error đã được set trong composable
  }
}

// Fetch all requests - SỬA: Thêm debug
const fetchRequests = async () => {
  message.value = ''
  searchDealerName.value = ''
  
  console.log('=== FETCHING REQUESTS ===') // DEBUG
  
  try {
    const result = await getAllRequests()
    console.log('Fetch requests result:', result) // DEBUG
  } catch (err: any) {
    console.error('Fetch requests error:', err)
    // Error đã được set trong composable
  }
}

// Search by dealer name - SỬA: Thêm debug
const handleSearch = async () => {
  console.log('=== SEARCHING ===', searchDealerName.value) // DEBUG
  
  try {
    if (searchDealerName.value.trim()) {
      const result = await getRequestsByDealerName(searchDealerName.value)
      console.log('Search result:', result) // DEBUG
    } else {
      await getAllRequests()
    }
  } catch (err: any) {
    console.error('Search error:', err)
    // Error đã được set trong composable
  }
}

// Debug function
const debugInfo = () => {
  console.log('=== DEBUG INFO ===')
  console.log('Requests:', requests.value)
  console.log('Pending:', pending.value)
  console.log('Error:', error.value)
  console.log('Active Tab:', activeTab.value)
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
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

// Auto fetch on mount
onMounted(() => {
  console.log('=== COMPONENT MOUNTED ===')
})
</script>

<style scoped>
.coordination-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  font-size: 2rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 30px;
}

.tab {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.tab.active {
  border-bottom-color: #007bff;
  color: #007bff;
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #e74c3c;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.search-box {
  display: flex;
  gap: 10px;
  flex: 1;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-search, .btn-refresh {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-search:hover, .btn-refresh:hover {
  background: #e9ecef;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.request-list {
  display: grid;
  gap: 15px;
}

.request-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.dealer-name {
  font-weight: 600;
  color: #333;
}

.request-date {
  color: #666;
  font-size: 0.9rem;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
}

.value.quantity {
  color: #007bff;
  font-weight: 600;
}

.card-footer {
  padding: 12px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  text-align: right;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-approved {
  background: #d1edff;
  color: #0c5460;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.status-processing {
  background: #d4edda;
  color: #155724;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    margin-bottom: 10px;
  }
}
</style>