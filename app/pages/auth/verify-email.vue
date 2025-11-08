<template>
  <div class="verify-container">
    <div class="verify-card">
      <div class="icon-wrapper">
        <div class="email-icon">📧</div>
      </div>

      <h1 class="title">Xác thực email của bạn</h1>

      <template v-if="email">
        <div class="content">
          <p class="description">Chúng tôi đã gửi một email xác nhận đến</p>
          <p class="email-display">{{ email }}</p>

          <div class="instructions">
            <div class="instruction-item">
              <span class="step-number">1</span>
              <span class="step-text">Kiểm tra hộp thư đến của bạn</span>
            </div>
            <div class="instruction-item">
              <span class="step-number">2</span>
              <span class="step-text"
                >Nhấn vào liên kết xác nhận trong email</span
              >
            </div>
            <div class="instruction-item">
              <span class="step-number">3</span>
              <span class="step-text">Hoàn tất đăng ký và bắt đầu sử dụng</span>
            </div>
          </div>

          <div class="info-box">
            <span class="info-icon">💡</span>
            <p>
              Không thấy email? Hãy kiểm tra mục <strong>Spam</strong> hoặc
              <strong>Thư rác</strong>
            </p>
          </div>

          <button
            class="resend-button"
            @click="resendConfirm"
            :disabled="loading || countdown > 0"
          >
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else-if="countdown > 0">Gửi lại sau {{ countdown }}s</span>
            <span v-else>
              <span class="button-icon">🔄</span>
              Gửi lại email xác nhận
            </span>
          </button>

          <transition name="fade">
            <div v-if="message" class="alert alert-success">
              <span class="alert-icon">✓</span>
              {{ message }}
            </div>
          </transition>

          <transition name="fade">
            <div v-if="error" class="alert alert-error">
              <span class="alert-icon">✕</span>
              {{ error }}
            </div>
          </transition>
        </div>
      </template>

      <template v-else>
        <div class="alert alert-error">
          <span class="alert-icon">⚠</span>
          Không tìm thấy địa chỉ email. Vui lòng thử lại.
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const email = ref<string>("");

const message = ref("");
const error = ref("");
const loading = ref(false);
const countdown = ref(0);

let countdownTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  email.value = (route.query.email as string) || "";
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
function startCountdown() {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
}

async function resendConfirm() {
  if (!email.value) {
    error.value = "Email không hợp lệ";
    return;
  }

  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const res = await fetch("http://localhost:4000/auth/resend-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Có lỗi xảy ra");
    }

    message.value = "Email xác nhận đã được gửi lại thành công!";
    startCountdown();

    setTimeout(() => {
      message.value = "";
    }, 5000);
  } catch (err: any) {
    error.value =
      err.message || "Không thể gửi lại email. Vui lòng thử lại sau.";
    setTimeout(() => {
      error.value = "";
    }, 5000);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.verify-card {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.email-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 30px;
}

.content {
  text-align: center;
}

.description {
  font-size: 16px;
  color: #718096;
  margin-bottom: 10px;
}

.email-display {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 30px;
  padding: 12px 20px;
  background: #f7fafc;
  border-radius: 10px;
  word-break: break-all;
}

.instructions {
  text-align: left;
  margin: 30px 0;
  padding: 25px;
  background: #f7fafc;
  border-radius: 12px;
}

.instruction-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
}

.instruction-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.step-text {
  color: #4a5568;
  font-size: 15px;
  line-height: 1.5;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: #fef5e7;
  border-left: 4px solid #f39c12;
  border-radius: 8px;
  margin: 25px 0;
  text-align: left;
}

.info-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.info-box p {
  margin: 0;
  color: #856404;
  font-size: 14px;
  line-height: 1.6;
}

.resend-button {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 25px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.resend-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.resend-button:active:not(:disabled) {
  transform: translateY(0);
}

.resend-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  box-shadow: none;
}

.button-icon {
  font-size: 18px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.alert {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
}

.alert-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .verify-card {
    padding: 40px 25px;
  }

  .title {
    font-size: 24px;
  }

  .email-icon {
    width: 70px;
    height: 70px;
    font-size: 35px;
  }

  .instructions {
    padding: 20px;
  }

  .step-text {
    font-size: 14px;
  }
}
</style>
