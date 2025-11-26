<template>
  <div class="agreement-request-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>Đăng ký Trở thành Đại lý EVM</h1>
          <p class="page-description">
            Điền đầy đủ thông tin bên dưới để gửi yêu cầu hợp tác với EVM. 
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Form Section -->
          <div class="form-section">
            <div class="form-card">
              <h2>Thông tin Đăng ký</h2>
              
              <form @submit.prevent="submitForm" class="agreement-form">
                <!-- Dealer Name -->
                <div class="form-group">
                  <label for="dealer_name" class="form-label">
                    Tên đại lý <span class="required">*</span>
                  </label>
                  <input
                    id="dealer_name"
                    v-model="formData.dealer_name"
                    type="text"
                    class="form-input"
                    :class="{ 'error': errors.dealer_name }"
                    placeholder="Nhập tên đại lý của bạn"
                    :disabled="loading"
                  />
                  <span v-if="errors.dealer_name" class="error-message">
                    {{ errors.dealer_name }}
                  </span>
                </div>

                <!-- Address -->
                <div class="form-group">
                  <label for="address" class="form-label">
                    Địa chỉ đại lý <span class="required">*</span>
                  </label>
                  <textarea
                    id="address"
                    v-model="formData.address"
                    class="form-input"
                    :class="{ 'error': errors.address }"
                    placeholder="Nhập địa chỉ đầy đủ của đại lý"
                    rows="3"
                    :disabled="loading"
                  ></textarea>
                  <span v-if="errors.address" class="error-message">
                    {{ errors.address }}
                  </span>
                </div>

                <!-- Phone -->
                <div class="form-group">
                  <label for="phone" class="form-label">
                    Số điện thoại <span class="required">*</span>
                  </label>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    class="form-input"
                    :class="{ 'error': errors.phone }"
                    placeholder="Nhập số điện thoại liên hệ"
                    :disabled="loading"
                  />
                  <span v-if="errors.phone" class="error-message">
                    {{ errors.phone }}
                  </span>
                </div>

                <!-- Email -->
                <div class="form-group">
                  <label for="email" class="form-label">
                    Email <span class="required">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-input"
                    :class="{ 'error': errors.email }"
                    placeholder="Nhập địa chỉ email"
                    :disabled="loading"
                  />
                  <span v-if="errors.email" class="error-message">
                    {{ errors.email }}
                  </span>
                </div>

                <!-- Submit Button -->
                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="submit-btn"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="loading-content">
                      <span class="spinner"></span>
                      Đang gửi yêu cầu...
                    </span>
                    <span v-else>
                      Gửi Yêu Cầu Hợp Tác
                    </span>
                  </button>
                </div>
              </form>

              <!-- Success Message -->
              <div v-if="successMessage" class="success-message">
                <div class="success-icon">✅</div>
                <div class="success-content">
                  <h3>{{ successMessage }}</h3>
                  <p>Cảm ơn bạn đã gửi yêu cầu. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                </div>
              </div>

              <!-- Approval Info -->
              <div v-if="approvalInfo" class="approval-info">
                <div class="approval-header">
                  <div class="approval-icon">🎉</div>
                  <h3>Chúc mừng! Hợp đồng đã được phê duyệt</h3>
                </div>
                <div class="approval-content">
                  <div class="info-item">
                    <span class="label">Email đăng nhập:</span>
                    <span class="value">{{ approvalInfo?.email || '' }}</span>
                    <button @click="copyToClipboard(approvalInfo?.email)" class="copy-btn">
                       Copy
                    </button>
                  </div>
                  <div class="info-item">
                    <span class="label">Mật khẩu tạm thời:</span>
                    <span class="value password">{{ approvalInfo?.password || '' }}</span>
                    <button @click="copyToClipboard(approvalInfo?.password)" class="copy-btn">
                       Copy
                    </button>
                  </div>
                  <div class="warning-box">
                    <strong>Lưu ý quan trọng:</strong>
                    <p>Vui lòng lưu lại thông tin này ngay. Đây là mật khẩu tạm thời, bạn nên đổi mật khẩu sau khi đăng nhập lần đầu.</p>
                  </div>
                  <div class="action-buttons">
                    <button @click="goToLogin" class="primary-btn">
                      Đăng nhập ngay
                    </button>
                    <button @click="downloadCredentials" class="secondary-btn">
                       Tải thông tin
                    </button>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="error-message-global">
                <div class="error-icon"></div>
                <div class="error-content">
                  <h3>Có lỗi xảy ra</h3>
                  <p>{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <div class="info-card">
              <div class="info-header">
                <div class="info-icon"></div>
                <h3>Lợi ích khi trở thành Đại lý EVM</h3>
              </div>
              <ul class="benefits-list">
                <li>
                  <span class="benefit-icon"></span>
                  <div>
                    <strong>Hoa hồng hấp dẫn</strong>
                    <p>Chính sách hoa hồng cạnh tranh và minh bạch</p>
                  </div>
                </li>
                <li>
                  <span class="benefit-icon">🛠️</span>
                  <div>
                    <strong>Hỗ trợ kỹ thuật</strong>
                    <p>Đào tạo và hỗ trợ kỹ thuật từ đội ngũ chuyên gia</p>
                  </div>
                </li>
                <li>
                  <span class="benefit-icon">📢</span>
                  <div>
                    <strong>Marketing & Quảng cáo</strong>
                    <p>Hỗ trợ chiến dịch marketing và quảng bá thương hiệu</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <div class="toast-content">
          <span class="toast-icon">🔔</span>
          <div class="toast-text">
            <strong>{{ toastTitle }}</strong>
            <p>{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  ssr: false
})

import { reactive, ref, onMounted } from 'vue'
import { useNotificationStore } from '~/store/notification'
import { useDealerAgreement } from '~/composables/useDealerAgreement'
import { useRouter } from 'vue-router'

const router = useRouter()
const notificationStore = useNotificationStore()

const formData = reactive({
  dealer_name: '',
  address: '',
  phone: '',
  email: '',
})

const errors = reactive({})
const { pending: loading, createContractRequest } = useDealerAgreement()

const successMessage = ref('')
const errorMessage = ref('')
const approvalInfo = ref(null)

const showToast = ref(false)
const toastTitle = ref('')
const toastMessage = ref('')

// ✅ Thêm biến lưu user_id
const currentUserId = ref(null)

// ✅ INIT FCM
onMounted(async () => {
  console.log('🎯 Component mounted');
  
  if (!process.client) return;

  // ✅ Lấy user_id từ JWT
  const authToken = localStorage.getItem('access_token');
  if (authToken && authToken !== 'null') {
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      currentUserId.value = payload.sub;
      console.log('👤 Current user ID:', currentUserId.value);
    } catch (e) {
      console.error('❌ Cannot decode token:', e);
    }
  }

  try {
    console.log('🔧 Initializing FCM...');
    const token = await notificationStore.initializeFCM();
    
    if (token) {
      console.log('FCM Token obtained!');
    }

    // Listen for messages
    notificationStore.onMessage((payload) => {
      console.log('📩 Message:', payload);

      if (payload.data?.type === 'CONTRACT_APPROVED') {
        showToastNotification(
          payload.notification?.title || 'Hợp đồng đã được phê duyệt!',
          payload.notification?.body || ''
        );

        approvalInfo.value = {
          dealerEmail: payload.data.dealerEmail || payload.data.email,
          dealerPassword: payload.data.dealerTempPassword || payload.data.temporaryPassword,
          contractId: payload.data.contractId,
          dealerId: payload.data.dealerId,
        };

        successMessage.value = 'Hợp đồng đã được phê duyệt!';
      }
    });
  } catch (error) {
    console.error(' FCM init failed:', error);
  }
});

const showToastNotification = (title, message) => {
  toastTitle.value = title
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 5000)
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let valid = true;

  if (!formData.dealer_name?.trim()) {
    errors.dealer_name = 'Tên đại lý là bắt buộc';
    valid = false;
  }
  if (!formData.address?.trim()) {
    errors.address = 'Địa chỉ là bắt buộc';
    valid = false;
  }
  if (!formData.phone?.trim()) {
    errors.phone = 'Số điện thoại là bắt buộc';
    valid = false;
  } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ';
    valid = false;
  }
  if (!formData.email?.trim()) {
    errors.email = 'Email là bắt buộc';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
    valid = false;
  }
  return valid;
};

const resetForm = () => {
  Object.keys(formData).forEach(key => (formData[key] = ''));
  Object.keys(errors).forEach(key => delete errors[key]);
};

// ✅ SUBMIT FORM với FCM token
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    console.log(' Submitting contract request...');

    // ✅ Lấy FCM token từ store
    const fcmToken = notificationStore.fcmToken;
    
    console.log('User ID:', currentUserId.value);
    console.log('FCM Token:', fcmToken?.substring(0, 30) + '...');

    // ✅ Tạo request data với FCM token
    const requestData = {
      ...formData,
      user_id: currentUserId.value,
      fcm_token: fcmToken,
      device_info: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timestamp: new Date().toISOString(),
      }
    };

    console.log('📤 Request data:', {
      ...requestData,
      fcm_token: requestData.fcm_token?.substring(0, 30) + '...'
    });

    const result = await createContractRequest(requestData);
    
    console.log('✅ Contract request created:', result);

    successMessage.value = 'Yêu cầu hợp tác đã được gửi thành công!';
    showToastNotification('Thành công!', 'Yêu cầu đã được gửi. Bạn sẽ nhận thông báo khi được phê duyệt.');
    resetForm();
  } catch (err) {
    console.error('Submit error:', err);
    errorMessage.value = err?.message || 'Có lỗi xảy ra';
    showToastNotification('Lỗi!', errorMessage.value);
    
  }
};

const copyToClipboard = async (text) => {
  if (!text) return;
  
  try {
    await navigator.clipboard.writeText(text);
    showToastNotification('Đã sao chép!', 'Thông tin đã được copy');
  } catch (err) {
    console.error('Copy failed:', err);
  }
};

const goToLogin = () => router.push('/login');

const downloadCredentials = () => {
  if (!approvalInfo.value) return;
  
  const content = `
Thông tin đăng nhập Đại lý EVM
================================
Email Dealer: ${approvalInfo.value.dealerEmail || ''}
Mật khẩu tạm: ${approvalInfo.value.dealerPassword || ''}
Ngày tạo: ${new Date().toLocaleString('vi-VN')}

⚠️ LƯU Ý:
- Vui lòng chuyển tiếp thông tin này cho dealer
- Dealer cần đăng nhập và đổi mật khẩu ngay
  `.trim();

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EVM_Dealer_Credentials_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToastNotification('Đã tải xuống!', 'File đã được lưu');
};
</script>

<!-- Template giữ nguyên -->

<!-- Template giữ nguyên -->
<!-- Template và CSS giữ nguyên -->

<!-- Giữ nguyên style -->
<!-- <style scoped>
/* ... giữ nguyên toàn bộ CSS ... */
</style> -->

<style scoped>
.approval-info {
  margin-top: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px;
  color: white;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.approval-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.approval-icon {
  font-size: 3rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.approval-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.approval-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.info-item .label {
  font-weight: 500;
  min-width: 150px;
}

.info-item .value {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 4px;
}

.info-item .value.password {
  letter-spacing: 2px;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.warning-box {
  background: rgba(255, 235, 59, 0.2);
  border: 2px solid rgba(255, 235, 59, 0.5);
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
}

.warning-box strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.warning-box p {
  margin: 0;
  line-height: 1.5;
  opacity: 0.95;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.primary-btn {
  background: white;
  color: #667eea;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  max-width: 400px;
  z-index: 10000;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.toast-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.toast-text {
  flex: 1;
}

.toast-text strong {
  display: block;
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.toast-text p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Responsive */
@media (max-width: 768px) {
  .approval-info {
    padding: 20px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-item .label {
    min-width: auto;
  }

  .action-buttons {
    flex-direction: column;
  }

  .toast-notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
.agreement-request-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-align: center;
}

.page-description {
  color: #7f8c8d;
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.page-content {
  padding: 40px 0;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-card h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.agreement-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
}

.required {
  color: #e74c3c;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-actions {
  margin-top: 10px;
}

.submit-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Success and Error Messages */
.success-message,
.error-message-global {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.error-message-global {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.success-icon,
.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.success-content h3,
.error-content h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.success-content p,
.error-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.info-icon {
  font-size: 2rem;
}

.info-header h3 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.3rem;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #ecf0f1;
}

.benefits-list li:last-child {
  border-bottom: none;
}

.benefit-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.benefits-list strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
}

.benefits-list p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .info-card {
    position: static;
  }
  
  .container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.75rem;
  }
  
  .page-header {
    padding: 30px 0;
  }
  
  .page-content {
    padding: 20px 0;
  }
  
  .form-card h2 {
    font-size: 1.3rem;
  }
}
</style>