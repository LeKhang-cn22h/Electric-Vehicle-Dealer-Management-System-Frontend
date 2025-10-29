<script setup lang="ts">
import { ref, computed } from "vue";

type FormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const form = ref<FormState>({
  email: "",
  password: "",
  rememberMe: false,
});

const showPwd = ref(false);
const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const serverSuccess = ref<string | null>(null);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const errors = computed(() => {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (!form.value.email.trim()) e.email = "Vui lòng nhập email.";
  else if (!emailRegex.test(form.value.email)) e.email = "Email không hợp lệ.";
  if (!form.value.password) e.password = "Vui lòng nhập mật khẩu.";
  else if (form.value.password.length < 6) e.password = "Mật khẩu quá ngắn.";
  return e;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

async function onSubmit() {
  serverError.value = null;
  serverSuccess.value = null;
  if (!isValid.value) return;
  try {
    isSubmitting.value = true;
    await new Promise((r) => setTimeout(r, 800));
    serverSuccess.value = "Đăng nhập thành công! Đang chuyển hướng...";
  } catch (err: any) {
    serverError.value = err?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
  } finally {
    isSubmitting.value = false;
  }
}

async function onGoogle() {
  try {
    isSubmitting.value = true;
    await new Promise((r) => setTimeout(r, 500));
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="auth">
    <div class="card">
      <header class="head">
        <h1>Đăng nhập</h1>
        <p>Chào mừng bạn trở lại 👋</p>
      </header>

      <div v-if="serverError" class="alert error">{{ serverError }}</div>
      <div v-if="serverSuccess" class="alert success">{{ serverSuccess }}</div>

      <form @submit.prevent="onSubmit" novalidate class="form">
        <!-- Email -->
        <div class="field">
          <label for="email" class="label-with-icon">
            <svg
              class="label-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <path d="M3 6l9 6 9-6"></path>
            </svg>
            Email
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

        <!-- Mật khẩu -->
        <div class="field">
          <div class="label-row">
            <label for="password" class="label-with-icon">
              <svg
                class="label-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Mật khẩu
            </label>
            <NuxtLink to="/forgot" class="link">Quên mật khẩu?</NuxtLink>
          </div>

          <div class="password">
            <input
              :type="showPwd ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              autocomplete="current-password"
              placeholder="Nhập mật khẩu"
              :class="{ 'is-error': !!errors.password }"
            />
            <button
              type="button"
              class="toggle"
              @click="showPwd = !showPwd"
              :aria-label="showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            >
              <svg
                v-if="!showPwd"
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94"
                />
                <path
                  d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                />
                <path d="M14.12 15.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>

          <small v-if="errors.password" class="msg">{{
            errors.password
          }}</small>
        </div>

        <label class="remember">
          <input type="checkbox" v-model="form.rememberMe" />
          <span>Ghi nhớ đăng nhập</span>
        </label>
        <button
          class="auth-btn"
          type="submit"
          :disabled="!isValid || isSubmitting"
        >
          <span v-if="!isSubmitting">Đăng nhập</span>
          <span v-else class="loading">Đang xử lý…</span>
        </button>
        <div class="or"><span>hoặc</span></div>
        <button
          type="button"
          class="oauth-btn"
          @click="onGoogle"
          :disabled="isSubmitting"
        >
          <img
            class="oauth-icon"
            src="/images/google.png"
            alt=""
            decoding="async"
          />
          <span>Đăng nhập với Google</span>
        </button>

        <p class="muted center">
          Chưa có tài khoản?
          <NuxtLink to="/auth/register" class="link">Tạo tài khoản</NuxtLink>
        </p>
      </form>
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
  margin-bottom: 18px;
}
.head h1 {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 700;
}
.head p {
  margin: 0;
  color: var(--text-2);
  font-size: 14px;
}

.alert {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  margin: 12px 0 16px;
  border: 1px solid;
}
.alert.error {
  color: var(--error);
  background: #fee2e2;
  border-color: #fecaca;
}
.alert.success {
  color: #059669;
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
  font-weight: bolder;
  white-space: nowrap;
}
.label-icon {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}
.link:hover {
  text-decoration: underline;
}

.field input[type="text"],
.field input[type="email"],
.field input[type="password"] {
  width: 100%;
  padding: 11px 14px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: transparent;
  color: inherit;
  outline: none;
  font-size: 15px;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
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
  box-shadow: 0 0 0 2px beige !important;
}
.msg {
  color: var(--error);
  font-size: 12px;
}

.password {
  position: relative;
}
.toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
}
.toggle .icon {
  width: 18px;
  height: 18px;
  display: block;
}
.toggle:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.05);
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-2);
  font-size: 14px;
}
.remember input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}
.auth-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: filter 0.15s, transform 0.02s, background 0.15s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.auth-btn:hover:not(:disabled) {
  filter: brightness(0.97);
  background: var(--primary-2);
}
.auth-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.loading {
  opacity: 0.95;
}

.or {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-2);
  font-size: 13px;
  margin: 8px 0;
}
.or::before,
.or::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--border);
}

.oauth-btn {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  color: #111;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.02s,
    background 0.15s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}
.oauth-btn:hover {
  border-color: var(--border-hover);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
}
.oauth-btn:active {
  transform: translateY(1px);
}
.oauth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.oauth-icon {
  width: 20px;
  height: 20px;
  display: block;
  object-fit: contain;
  border-radius: 3px;
}
@media (prefers-color-scheme: dark) {
  .oauth-btn {
    background: #0f1419;
    color: #e5e7eb;
  }
}

.muted {
  color: var(--text-2);
  font-size: 14px;
  margin: 8px 0 0;
}
.center {
  text-align: center;
}

@media (max-width: 520px) {
  .card {
    padding: 22px;
    border-radius: 14px;
  }
  .head h1 {
    font-size: 22px;
  }
}
</style>
