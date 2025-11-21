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
                      📨 Gửi Yêu Cầu Hợp Tác
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

              <!-- Error Message -->
              <div v-if="errorMessage" class="error-message-global">
                <div class="error-icon">❌</div>
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
                <div class="info-icon">🏢</div>
                <h3>Lợi ích khi trở thành Đại lý EVM</h3>
              </div>
              <ul class="benefits-list">
                <li>
                  <span class="benefit-icon">💰</span>
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
                  <span class="benefit-icon">📈</span>
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
  </div>
</template>


<script>
import { reactive } from 'vue'
import { useDealerAgreement } from '~/composables/userDealerAgreement';

export default {
  setup() {
    const formData = reactive({
      dealer_name: '',
      address: '',
      phone: '',
      email: ''
    });

    const errors = reactive({});
    const {
      pending: loading, // Map pending thành loading
      createContractRequest: createAgreementRequest // Map tên hàm
    } = useDealerAgreement();

    // Tạo local success và error messages
    const successMessage = ref('')
    const errorMessage = ref('')

    const validateForm = () => {
      Object.keys(errors).forEach(key => {
        delete errors[key];
      });
      
      let valid = true;

      if (!formData.dealer_name.trim()) {
        errors.dealer_name = "Tên đại lý là bắt buộc";
        valid = false;
      }

      if (!formData.address.trim()) {
        errors.address = "Địa chỉ là bắt buộc";
        valid = false;
      }

      if (!formData.phone.trim()) {
        errors.phone = "Số điện thoại là bắt buộc";
        valid = false;
      } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = "Số điện thoại không hợp lệ";
        valid = false;
      }

      if (!formData.email.trim()) {
        errors.email = "Email là bắt buộc";
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Email không hợp lệ";
        valid = false;
      }

      return valid;
    };

    const resetForm = () => {
      Object.keys(formData).forEach(key => {
        formData[key] = '';
      });
      Object.keys(errors).forEach(key => {
        delete errors[key];
      });
    };

    const submitForm = async () => {
      console.log('Submit started');
      if (!validateForm()) {
        console.log('Validation failed');
        return;
      }

      try {
        const result = await createAgreementRequest({ ...formData });
        console.log('Request successful:', result);
        successMessage.value = "Yêu cầu hợp tác đã được gửi thành công!";
        resetForm();
        
        // Tự động ẩn success message sau 5 giây
        setTimeout(() => {
          successMessage.value = '';
        }, 5000);
      } catch (err) {
        console.error('Request failed:', err);
        errorMessage.value = "Có lỗi xảy ra khi gửi yêu cầu";
        
        // Tự động ẩn error message sau 5 giây
        setTimeout(() => {
          errorMessage.value = '';
        }, 5000);
      }
    };

    return {
      formData,
      errors,
      loading,
      errorMessage,
      successMessage,
      submitForm,
    };
  },
};

</script>

<style scoped>
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