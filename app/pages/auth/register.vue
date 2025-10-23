<script setup lang="ts">
import { ref, computed } from "vue";

type FormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const form = ref<FormState>({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const showPwd = ref(false);
const showPwd2 = ref(false);
const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const serverSuccess = ref<string | null>(null);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const pwdStrength = computed(() => {
  const p = form.value.password;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const errors = computed(() => {
  const e: Partial<Record<keyof FormState, string>> = {};

  if (!form.value.fullName.trim()) e.fullName = "Vui lòng nhập họ tên.";
  else if (form.value.fullName.trim().length < 2)
    e.fullName = "Họ tên quá ngắn.";

  if (!form.value.email.trim()) e.email = "Vui lòng nhập email.";
  else if (!emailRegex.test(form.value.email)) e.email = "Email không hợp lệ.";

  if (!form.value.password) e.password = "Vui lòng nhập mật khẩu.";
  else if (form.value.password.length < 8) e.password = "Tối thiểu 8 ký tự.";
  else if (pwdStrength.value < 3) e.password = "Mật khẩu còn yếu.";

  if (!form.value.confirmPassword)
    e.confirmPassword = "Vui lòng nhập lại mật khẩu.";
  else if (form.value.confirmPassword !== form.value.password)
    e.confirmPassword = "Mật khẩu không khớp.";

  if (!form.value.acceptTerms) e.acceptTerms = "Bạn cần đồng ý điều khoản.";
  return e;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

async function onSubmit() {
  serverError.value = null;
  serverSuccess.value = null;
  if (!isValid.value) return;
  try {
    isSubmitting.value = true;
    // Gọi API thật tại đây nếu có
    await new Promise((r) => setTimeout(r, 800));
    serverSuccess.value = "Tạo tài khoản thành công! Đang chuyển hướng...";
    // navigateTo('/login')
  } catch (err: any) {
    serverError.value = err?.message || "Đăng ký thất bại. Vui lòng thử lại.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="auth">
    <div class="card">
      <header class="head">
        <h1>Tạo tài khoản</h1>
        <p>Đăng ký để sử dụng đầy đủ tính năng</p>
      </header>

      <div v-if="serverError" class="alert error">{{ serverError }}</div>
      <div v-if="serverSuccess" class="alert success">{{ serverSuccess }}</div>

      <form @submit.prevent="onSubmit" novalidate class="form">
        <div class="field">
          <label for="fullName" class="label-with-icon">
            <svg
              class="label-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Họ và tên
          </label>
          <input
            id="fullName"
            v-model.trim="form.fullName"
            type="text"
            autocomplete="name"
            placeholder="Nguyễn Văn A"
            :class="{ 'is-error': !!errors.fullName }"
          />
          <small v-if="errors.fullName" class="msg">{{
            errors.fullName
          }}</small>
        </div>

        <!-- Email -->
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
          <label for="password" class="label-with-icon">
            <svg
              class="label-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Mật khẩu
          </label>

          <div class="password">
            <input
              :type="showPwd ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              autocomplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              :class="{ 'is-error': !!errors.password }"
            />

            <!-- Toggle eye -->
            <button
              type="button"
              class="toggle"
              @click="showPwd = !showPwd"
              :aria-label="showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            >
              <!-- eye -->
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
              <!-- eye-off -->
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

          <!-- Strength -->
          <div class="strength" v-if="form.password">
            <div class="bar">
              <div
                class="fill"
                :class="{
                  strong: pwdStrength >= 4,
                  medium: pwdStrength >= 3 && pwdStrength < 4,
                  weak: pwdStrength < 3,
                }"
                :style="{ width: pwdStrength * 20 + '%' }"
              />
            </div>
            <div class="legend">
              <span>Yếu</span><span>Trung bình</span><span>Mạnh</span>
            </div>
          </div>
        </div>

        <!-- Nhập lại mật khẩu -->
        <div class="field">
          <label for="confirmPassword" class="label-with-icon">
            <svg
              class="label-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Nhập lại mật khẩu
          </label>

          <div class="password">
            <input
              :type="showPwd2 ? 'text' : 'password'"
              id="confirmPassword"
              v-model="form.confirmPassword"
              autocomplete="new-password"
              placeholder="Nhập lại mật khẩu"
              :class="{ 'is-error': !!errors.confirmPassword }"
            />

            <!-- Toggle eye -->
            <button
              type="button"
              class="toggle"
              @click="showPwd2 = !showPwd2"
              :aria-label="
                showPwd2 ? 'Ẩn nhập lại mật khẩu' : 'Hiện nhập lại mật khẩu'
              "
            >
              <svg
                v-if="!showPwd2"
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

          <small v-if="errors.confirmPassword" class="msg">{{
            errors.confirmPassword
          }}</small>
        </div>

        <!-- Điều khoản -->
        <div class="field chk">
          <input id="terms" type="checkbox" v-model="form.acceptTerms" />
          <label for="terms"
            >Tôi đồng ý với <NuxtLink to="/terms">Điều khoản</NuxtLink> &
            <NuxtLink to="/privacy">Bảo mật</NuxtLink></label
          >
        </div>
        <small v-if="errors.acceptTerms" class="msg">{{
          errors.acceptTerms
        }}</small>

        <!-- Submit -->
        <button
          class="auth-btn"
          type="submit"
          :disabled="!isValid || isSubmitting"
        >
          <span v-if="!isSubmitting">Tạo tài khoản</span>
          <span v-else class="loading">Đang xử lý…</span>
        </button>
        <div class="or"><span>hoặc</span></div>

        <button type="button" class="oauth-btn">
          <img
            class="oauth-icon"
            src="/images/google.png"
            alt=""
            decoding="async"
          />
          <span>Đăng nhập với Google</span>
        </button>

        <p class="muted center">
          Đã có tài khoản?
          <NuxtLink to="/auth/login" class="link">Đăng nhập</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.or {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-2);
  font-size: 13px;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.09);
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

.oauth-btn.left {
  justify-content: flex-start;
}
@media (max-width: 520px) {
  .or {
    margin: 10px 0;
  }
  .oauth-btn {
    min-height: 42px;
    padding: 9px 12px;
  }
}

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
  font-weight: bold;
}
.label-icon {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

/* Inputs */
.field input[type="text"],
.field input[type="email"],
.field input[type="password"] {
  width: 100%;
  padding: 11px 14px;
  border-radius: 5px;
  background: transparent;
  color: black;
  outline: none;
  font-size: 15px;
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

/* Strength */
.strength {
  margin-top: 4px;
}
.bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}
.fill {
  height: 100%;
  width: 0%;
  transition: width 0.25s;
}
.fill.weak {
  background: #ef4444;
}
.fill.medium {
  background: #f59e0b;
}
.fill.strong {
  background: #10b981;
}
.legend {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-2);
  margin-top: 4px;
}

.field.chk {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.field.chk input {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--primary);
}
.field.chk label a {
  color: var(--primary);
  text-decoration: none;
}
.field.chk label a:hover {
  text-decoration: underline;
}

/* Button */
.auth-btn {
  background: blue;
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

/* Footer */
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

/* Responsive */
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
