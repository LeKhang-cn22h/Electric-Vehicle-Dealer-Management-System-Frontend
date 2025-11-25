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
            <label>Mã Dealer</label>
            <input v-model="form.dealer_id" placeholder="VD: DL001" />
          </div>
          <div class="form-group">
            <label>Tên Dealer</label>
            <input v-model="form.dealer_name" placeholder="VD: Honda Bình Dương" />
          </div>
        </div>

        <div class="form-group">
          <label>Loại yêu cầu</label>
          <select v-model="form.request_type">
            <option value="new">Xe mới</option>
            <option value="transfer">Điều chuyển</option>
          </select>
        </div>

        <!-- Danh sách xe -->
        <div class="vehicles-section">
          <div class="section-header">
            <label>Danh sách xe</label>
            <button class="btn-link" @click="addVehicle">+ Thêm xe</button>
          </div>

          <div 
            v-for="(vehicle, index) in form.vehicles" 
            :key="index"
            class="vehicle-row"
          >
            <input 
              v-model="vehicle.model" 
              placeholder="Model (VD: Civic)"
              class="flex-1"
            />
            <input 
              v-model="vehicle.color" 
              placeholder="Màu"
              class="w-28"
            />
            <input 
              v-model.number="vehicle.quantity" 
              type="number" 
              min="1"
              class="w-20"
            />
            <button 
              v-if="form.vehicles.length > 1"
              class="btn-remove"
              @click="removeVehicle(index)"
            >
              ✕
            </button>
          </div>
        </div>

        <button 
          class="btn-primary"
          :disabled="loading"
          @click="handleSubmit"
        >
          {{ loading ? 'Đang xử lý...' : 'Tạo Yêu Cầu Điều Phối' }}
        </button>

        <div v-if="message" class="message success">{{ message }}</div>
        <div v-if="error" class="message error">{{ error }}</div>
      </div>
    </div>

    <!-- Tab: Danh sách -->
    <div v-if="activeTab === 'list'" class="tab-content">
      <div class="list-header">
        <button class="btn-refresh" @click="fetchRequests">
          🔄 Tải lại
        </button>
      </div>

      <div v-if="loading" class="loading">Đang tải...</div>
      
      <div v-else-if="requests.length === 0" class="empty">
        Chưa có yêu cầu nào
      </div>

      <div v-else class="request-list">
        <div 
          v-for="(req, index) in requests" 
          :key="index"
          class="request-card"
        >
          <div class="card-header">
            <span class="dealer-name">{{ req.dealer_name }}</span>
            <span class="dealer-id">{{ req.dealer_id }}</span>
          </div>
          <div class="card-body">
            <p><strong>Loại:</strong> {{ req.request_type === 'new' ? 'Xe mới' : 'Điều chuyển' }}</p>
            <p><strong>Model:</strong> {{ req.model }} | <strong>Màu:</strong> {{ req.color }} | <strong>SL:</strong> {{ req.quantity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDealerCoordination } from '~/composables/useDealerCoordination'

const { requests, loading, error, createRequest, getAllRequests } = useDealerCoordination()

const activeTab = ref('create')
const message = ref('')

const form = reactive({
  dealer_id: '',
  dealer_name: '',
  request_type: 'new' as 'new' | 'transfer',
  vehicles: [{ model: '', color: '', quantity: 1 }]
})

const addVehicle = () => {
  form.vehicles.push({ model: '', color: '', quantity: 1 })
}

const removeVehicle = (index: number) => {
  form.vehicles.splice(index, 1)
}

const resetForm = () => {
  form.dealer_id = ''
  form.dealer_name = ''
  form.request_type = 'new'
  form.vehicles = [{ model: '', color: '', quantity: 1 }]
}

const handleSubmit = async () => {
  message.value = ''
  try {
    const result = await createRequest(form)
    message.value = `✓ Tạo thành công ${result.total} yêu cầu`
    resetForm()
  } catch (err) {
    // error đã được set trong composable
  }
}

const fetchRequests = async () => {
  message.value = ''
  await getAllRequests()
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
}

.tab.active {
  color: #1a56db;
  border-bottom: 2px solid #1a56db;
  margin-bottom: -2px;
}

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
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.vehicles-section {
  margin: 20px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.btn-link {
  background: none;
  border: none;
  color: #1a56db;
  cursor: pointer;
  font-size: 14px;
}

.vehicle-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.vehicle-row input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.vehicle-row .flex-1 { flex: 1; }
.vehicle-row .w-28 { width: 100px; }
.vehicle-row .w-20 { width: 80px; }

.btn-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0 8px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #1a56db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary:hover { background: #1e40af; }
.btn-primary:disabled { background: #9ca3af; }

.message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
}

.message.success { background: #d1fae5; color: #065f46; }
.message.error { background: #fee2e2; color: #991b1b; }

.list-header {
  margin-bottom: 16px;
}

.btn-refresh {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.loading, .empty {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

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
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.dealer-name { font-weight: 600; }
.dealer-id { color: #6b7280; font-size: 14px; }

.card-body {
  font-size: 14px;
  color: #4b5563;
}

.card-body p { margin: 4px 0; }
</style>