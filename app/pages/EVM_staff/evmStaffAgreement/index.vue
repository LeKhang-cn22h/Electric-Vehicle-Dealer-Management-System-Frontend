<template>
  <div class="evm-staff-page">
    <div class="header">
      <h1 style="font-size: 32px; font-weight: bold;">EVM Staff - Yêu cầu làm hợp đồng</h1>
      <!-- <p>Manage contract requests and approvals</p> -->
    </div>

    <div class="content">
      <!-- Create New Contract Request -->
      <!-- <div class="card">
        <div class="card-header">
          <h2>Create New Contract Request</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleCreateRequest" class="request-form">
            <div class="form-row">
              <div class="form-group">
                <label for="dealer_name">Dealer Name *</label>
                <input
                  id="dealer_name"
                  v-model="newRequest.dealer_name"
                  type="text"
                  placeholder="Enter dealer name"
                  required
                >
              </div>
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  v-model="newRequest.email"
                  type="email"
                  placeholder="Enter email address"
                  required
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone *</label>
                <input
                  id="phone"
                  v-model="newRequest.phone"
                  type="tel"
                  placeholder="Enter phone number"
                  required
                >
              </div>
              <div class="form-group full-width">
                <label for="address">Address *</label>
                <textarea
                  id="address"
                  v-model="newRequest.address"
                  placeholder="Enter complete address"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                <span v-if="loading">Creating...</span>
                <span v-else>Create Contract Request</span>
              </button>
            </div>
          </form>
        </div>
      </div> -->

      <!-- Contract Requests List -->
      <div class="card">
        <div class="card-header">
          <div class="header-actions">
            
            <button
              @click="loadRequests"
              :disabled="loading"
              class="btn-secondary"
            >
              <span v-if="loading">⟳</span>
              Refresh
            </button>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading && requests.length === 0" class="loading">
            Loading contract requests...
          </div>

          <div v-else-if="requests.length === 0" class="empty-state">
            <div class="empty-icon"></div>
            <h3>No Contract Requests</h3>
            <p>Create your first contract request to get started</p>
          </div>

          <div v-else class="requests-list">
            <div
              v-for="request in requests"
              :key="request.id"
              class="request-item"
              v-show="!request.hidden"
            >

              <div class="request-info">
                <div class="request-main">
                  <h4 class="dealer-name">{{ request.dealer_name }}</h4>
                  <p class="request-meta">
                    <span class="email"> {{ request.email }}</span>
                    <span class="phone"> {{ request.phone }}</span>
                  </p>
                  <p class="address"> {{ request.address }}</p>
                  <p class="created-at" v-if="request.created_at">

                     {{ formatDate(request.created_at) }}
                  </p>
                  <!-- <p class="fcm_token">{{ request.fcm_token }}</p> -->
                </div>
                <div class="request-status">
                  <span
                    :class="['status-badge', getStatusClass(request.status)]"
                  >
                    {{ request.status || 'pending' }}
                  </span>
                </div>
              </div>

              <div class="request-actions" v-if="!request.status || request.status === 'pending'">
                <button
                  @click="openApproveModal(request)"
                  class="btn-success"
                  :disabled="loading"
                >
                  Chấp nhận
                </button>
              </div>
              <div class="request-actions" v-if="!request.status || request.status === 'pending'">
                  <button
  @click="handleCancelRequest(request.id)"
  class="btn-cannel"
  :disabled="loading"
>
                    Hủy
                  </button>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Modal -->
    <div v-if="showApproveModal" class="modal-overlay" @click="closeApproveModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Approve Contract Request</h3>
          <button @click="closeApproveModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedRequest" class="request-preview">
            <h4>{{ selectedRequest.dealer_name }}</h4>
            <p><strong>Email:</strong> {{ selectedRequest.email }}</p>
            <p><strong>Phone:</strong> {{ selectedRequest.phone }}</p>
            <p><strong>Address:</strong> {{ selectedRequest.address }}</p>
            <p><strong>UserID:</strong>{{ selectedRequest.user_id }}</p>
            <p><strong>FCM Token:</strong>{{ selectedRequest.fcm_token }}</p>
          </div>
          
          <form @submit.prevent="handleApproveRequest" class="approve-form">
            <div class="form-group">
              <label for="sales_target">Sales Target *</label>
              <input
                id="sales_target"
                v-model.number="approvalData.sales_target"
                type="number"
                placeholder="Enter sales target amount"
                min="1"
                required
              >
            </div>
            <div class="form-group">
              <label for="order_limit">Order Limit *</label>
              <input
                id="order_limit"
                v-model.number="approvalData.order_limit"
                type="number"
                placeholder="Enter order limit amount"
                min="1"
                required
              >
            </div>
            <div class="modal-actions">
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                <span v-if="loading">Approving...</span>
                <span v-else>Approve Request</span>
              </button>
              <button
                type="button"
                @click="closeApproveModal"
                class="btn-secondary"
              >
                Cancel
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="error-toast">
      <div class="toast-content">
        <span class="toast-icon"></span>
        <span class="toast-message">{{ error }}</span>
        <button @click="clearError" class="toast-close">&times;</button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="successMessage" class="success-toast">
      <div class="toast-content">
        <span class="toast-icon"></span>
        <span class="toast-message">{{ successMessage }}</span>
        <button @click="successMessage = ''" class="toast-close">&times;</button>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'evm-staff-layout'
})

import { ref, reactive, onMounted, watch } from 'vue';
import { useEvmStaffAgreement } from '~/composables/userEvmStaffAgreement';
import { useDealers } from '~/composables/useDealers';
const {
  createDealer,
  loadDealers,
} = useDealers();
// Composable - sử dụng đúng tên biến từ composable
const {
  loading, // Đổi từ pending thành loading
  error,
  getAllContractRequests,
  createContractRequest,
  approveContractRequest,
} = useEvmStaffAgreement();

// Data
const requests = ref<any[]>([]);
const successMessage = ref('');
const showApproveModal = ref(false);
const selectedRequest = ref<any>(null);

const newRequest = reactive({
  dealer_name: '',
  address: '',
  phone: '',
  email: '',
  user_id:'',
  fcm_token:'',
});

const approvalData = reactive({
  sales_target: 0,
  order_limit: 0,
});

// Methods
function getStatusClass(status: string) {
  const statusMap: any = {
    'pending': 'status-pending',
    'approved': 'status-approved',
    'rejected': 'status-rejected',
  };
  return statusMap[status] || 'status-pending';
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function loadRequests() {
  try {
    const data = await getAllContractRequests();
    requests.value = data;
    successMessage.value = 'Requests loaded successfully';
  } catch (err) {
    // Error handled by composable
  }
}

async function handleCreateRequest() {
  try {
    await createContractRequest({ ...newRequest });
    successMessage.value = 'Contract request created successfully!';
    
    // Reset form
    Object.assign(newRequest, {
      dealer_name: '',
      address: '', 
      phone: '',
      email: '',
      user_id: '',
      fcm_token: '',
    });
    
    // Reload requests
    await loadRequests();
  } catch (err) {
    // Error handled by composable
  }
}

function openApproveModal(request: any) {
  selectedRequest.value = request;
  showApproveModal.value = true;
  // Reset approval data
  Object.assign(approvalData, {
    sales_target: 0,
    order_limit: 0,
  });
}
function handleCancelRequest(requestId: number) {
  // tìm và ẩn request
  const index = requests.value.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests.value[index].hidden = true;
  }
}

function closeApproveModal() {
  showApproveModal.value = false;
  selectedRequest.value = null;
}

function clearError() {
  error.value = null;
}

async function handleApproveRequest() {
  if (!selectedRequest.value) return;

  try {
    // ✅ CHỈ GỌI 1 LẦN - API approveContractRequest đã tạo dealer + contract + gửi notification
    const result = await approveContractRequest(selectedRequest.value.id, { ...approvalData });

    // ✅ Hiển thị thông tin credentials
    if (result?.credentials) {
      successMessage.value = `Approved! Email: ${result.credentials.email}, Password: ${result.credentials.temporaryPassword}`;
    } else {
      successMessage.value = 'Contract request approved successfully!';
    }

    closeApproveModal();
    await loadRequests();
  } catch (err) {
    // Error handled by composable
  }
}

// Auto-hide toasts
watch(successMessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  }
});

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      error.value = null;
    }, 5000);
  }
});

// Lifecycle
onMounted(() => {
  loadRequests();
});
</script>

<style scoped>
.evm-staff-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 16px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
  background: #fafafa;
}

.card-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 24px;
}

/* Forms */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.form-actions {
  margin-top: 20px;
}

/* Buttons */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-success {
  background: #28a745;
  color: white;
}
.btn-cannel {
  background: #f77777;
  color: white;
}
.btn-success:hover:not(:disabled) {
  background: #1e7e34;
}

/* Requests List */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background: #fafafa;
}

.request-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.request-main {
  flex: 1;
}

.dealer-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.request-meta {
  margin: 0 0 8px 0;
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.address, .created-at {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.request-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-approved {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.request-actions {
  flex-shrink: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 24px;
}

.request-preview {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #007bff;
}

.request-preview h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 18px;
}

.request-preview p {
  margin: 6px 0;
  color: #666;
  font-size: 14px;
}

.approve-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
}

/* Toasts */
.error-toast,
.success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.error-toast .toast-content {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-toast .toast-content {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading and Empty States */
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .content {
    padding: 0 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .request-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .request-info {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .request-meta {
    flex-direction: column;
    gap: 4px;
  }

  .modal {
    width: 95%;
    margin: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>