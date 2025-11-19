<template>
  <div class="contract-request-form">
    <div class="form-container">
      <h2>Yêu cầu Hợp tác với EVM Staff</h2>
      
      <form @submit.prevent="submitForm" class="form">
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
            placeholder="Nhập tên đại lý"
          />
          <span v-if="errors.dealer_name" class="error-message">
            {{ errors.dealer_name }}
          </span>
        </div>

        <!-- Address -->
        <div class="form-group">
          <label for="address" class="form-label">
            Địa chỉ <span class="required">*</span>
          </label>
          <textarea
            id="address"
            v-model="formData.address"
            class="form-input"
            :class="{ 'error': errors.address }"
            placeholder="Nhập địa chỉ đầy đủ"
            rows="3"
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
            placeholder="Nhập số điện thoại"
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
            <span v-if="loading">Đang gửi...</span>
            <span v-else>Gửi Yêu Cầu Hợp Tác</span>
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message-global">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ContractRequestForm',
  setup() {
    const formData = reactive({
      dealer_name: '',
      address: '',
      phone: '',
      email: ''
    })

    const errors = reactive({
      dealer_name: '',
      address: '',
      phone: '',
      email: ''
    })

    const loading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const validateForm = () => {
      let isValid = true
      
      // Reset errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      // Validate dealer_name
      if (!formData.dealer_name.trim()) {
        errors.dealer_name = 'Tên đại lý là bắt buộc'
        isValid = false
      }

      // Validate address
      if (!formData.address.trim()) {
        errors.address = 'Địa chỉ là bắt buộc'
        isValid = false
      }

      // Validate phone
      if (!formData.phone.trim()) {
        errors.phone = 'Số điện thoại là bắt buộc'
        isValid = false
      } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
        errors.phone = 'Số điện thoại không hợp lệ'
        isValid = false
      }

      // Validate email
      if (!formData.email.trim()) {
        errors.email = 'Email là bắt buộc'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ'
        isValid = false
      }

      return isValid
    }

    const submitForm = async () => {
      if (!validateForm()) {
        return
      }

      loading.value = true
      successMessage.value = ''
      errorMessage.value = ''

      try {
        const response = await fetch('http://localhost:3000/dealer-agreement/contract-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        successMessage.value = result.message
        
        // Reset form
        Object.keys(formData).forEach(key => {
          formData[key] = ''
        })
        
      } catch (error) {
        console.error('Error submitting form:', error)
        errorMessage.value = 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      errors,
      loading,
      successMessage,
      errorMessage,
      submitForm
    }
  }
}
</script>

<style scoped>
.contract-request-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #e74c3c;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.submit-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #c3e6cb;
}

.error-message-global {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #f5c6cb;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}
</style>