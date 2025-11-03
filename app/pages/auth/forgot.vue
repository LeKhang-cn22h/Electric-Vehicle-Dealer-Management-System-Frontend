<script setup lang="ts">
import { ref, computed } from "vue";

type FormState = {
  email: string;
};

const form = ref<FormState>({
  email: "",
});

const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const serverSuccess = ref<string | null>(null);
const emailSent = ref(false);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const errors = computed(() => {
  const e: Partial<Record<keyof FormState, string>> = {};

  if (!form.value.email.trim()) e.email = "Vui lòng nhập email.";
  else if (!emailRegex.test(form.value.email)) e.email = "Email không hợp lệ.";

  return e;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

async function onSubmit() {
  serverError.value = null;
  serverSuccess.value = null;
  if (!isValid.value) return;
  try {
    isSubmitting.value = true;
    await new Promise((r) => setTimeout(r, 1200));
    emailSent.value = true;
    serverSuccess.value = "Đã gửi link đặt lại mật khẩu đến email của bạn!";
  } catch (err: any) {
    serverError.value = err?.message || "Gửi email thất bại. Vui lòng thử lại.";
  } finally {
    isSubmitting.value = false;
  }
}

function resendEmail() {
  emailSent.value = false;
  serverSuccess.value = null;
  onSubmit();
}
</script>

<template>
  <div class="auth">
    <div class="card">
      <header class="head">
        <div class="icon-wrapper">
          <svg
            class="lock-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1>Quên mật khẩu?</h1>
        <p v-if="!emailSent">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
        </p>
        <p v-else>Kiểm tra hộp thư của bạn</p>
      </header>

      <div v-if="serverError" class="alert error">{{ serverError }}</div>
      <div v-if="serverSuccess" class="alert success">{{ serverSuccess }}</div>

      <form
        v-if="!emailSent"
        @submit.prevent="onSubmit"
        novalidate
        class="form"
      >
        <div class="field">
          <label for="email" class="label-with-icon">
            <svg
              class="label-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <path d="M3 6l9 6 9-6"></path>
            </svg>
            Địa chỉ email
          </label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="{ 'is-error': !!errors.email }"
          />
          <small v-if="errors.email" class="msg">{{ errors.email }}</small>
        </div>

        <button
          class="auth-btn"
          type="submit"
          :disabled="!isValid || isSubmitting"
        >
          <span v-if="!isSubmitting">Gửi link đặt lại mật khẩu</span>
          <span v-else class="loading">Đang gửi…</span>
        </button>

        <p class="muted center">
          <NuxtLink to="/auth/login" class="link back-link">
            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Quay lại đăng nhập
          </NuxtLink>
        </p>
      </form>

      <div v-else class="success-state">
        <div class="email-sent-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <p class="success-text">
          Chúng tôi đã gửi link đặt lại mật khẩu đến
          <strong>{{ form.email }}</strong>
        </p>
        <p class="muted small-text">
          Link sẽ hết hạn sau 30 phút. Kiểm tra cả thư mục spam nếu không thấy
          email.
        </p>

        <button
          class="auth-btn secondary"
          type="button"
          @click="resendEmail"
          :disabled="isSubmitting"
        >
          <svg
            class="resend-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
            />
          </svg>
          <span v-if="!isSubmitting">Gửi lại email</span>
          <span v-else class="loading">Đang gửi…</span>
        </button>

        <p class="muted center">
          <NuxtLink to="/auth/login" class="link back-link">
            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Quay lại đăng nhập
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --bg: #f6f7f8;
  --card: #fff;
  --text: #0f172a;
  --text-2: #64748b;
  --border: #e5e7eb;
  --border-hover: #cfd6e1;
  --primary: #4f46e5;
  --primary-2: #4338ca;
  --focus: rgba(79, 70, 229, 0.18);
  --error: #dc2626;
  --success: #059669;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b0d11;
    --card: #111418;
    --text: #e5e7eb;
    --text-2: #94a3b8;
    --border: #1f2937;
    --border-hover: #2b3444;
    --focus: rgba(99, 102, 241, 0.25);
  }
}
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
}
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--bg);
}
.card {
  width: 100%;
  max-width: 460px;
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.head {
  text-align: center;
  margin-bottom: 24px;
}
.icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: grid;
  place-items: center;
}
.lock-icon {
  width: 32px;
  height: 32px;
  color: white;
}
.head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
}
.head p {
  margin: 0;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.5;
}

.alert {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  margin: 0 0 16px;
  border: 1px solid;
}
.alert.error {
  color: var(--error);
  background: #fee2e2;
  border-color: #fecaca;
}
.alert.success {
  color: var(--success);
  background: #e8f8f1;
  border-color: #bbefd9;
}

/* ===== Form ===== */
.form {
  display: grid;
  gap: 16px;
}
.field {
  display: grid;
  gap: 8px;
}
.label-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-weight: 600;
  font-size: 14px;
}
.label-icon {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.field input[type="email"] {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  outline: none;
  font-size: 15px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field input:hover {
  border-color: var(--border-hover);
}
.field input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--focus);
  background: var(--card);
}
.is-error {
  border-color: var(--error) !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}
.msg {
  color: var(--error);
  font-size: 12px;
}

.auth-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: filter 0.15s, transform 0.02s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.auth-btn:hover:not(:disabled) {
  filter: brightness(1.05);
}
.auth-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.auth-btn.secondary {
  background: var(--card);
  color: var(--primary);
  border: 2px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.auth-btn.secondary:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--card);
  filter: none;
}
.loading {
  opacity: 0.95;
}
.resend-icon {
  width: 18px;
  height: 18px;
}
.success-state {
  display: grid;
  gap: 16px;
}
.email-sent-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.email-sent-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}
.success-text {
  text-align: center;
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
}
.success-text strong {
  color: var(--primary);
  font-weight: 600;
}
.small-text {
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
}

.muted {
  color: var(--text-2);
  font-size: 14px;
  margin: 8px 0 0;
}
.center {
  text-align: center;
}
.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}
.link:hover {
  text-decoration: underline;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.arrow-icon {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 520px) {
  .card {
    padding: 22px;
    border-radius: 14px;
  }
  .head h1 {
    font-size: 22px;
  }
  .icon-wrapper {
    width: 56px;
    height: 56px;
  }
  .lock-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
