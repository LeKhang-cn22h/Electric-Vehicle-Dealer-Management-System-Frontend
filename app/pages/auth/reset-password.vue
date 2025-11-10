<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

type FormState = { newPassword: string; confirmPassword: string };

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const API = (config.public.apiBase as string) ?? "http://localhost:4000";

const form = ref<FormState>({ newPassword: "", confirmPassword: "" });

const token = ref<string | null>(null);
const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const serverSuccess = ref<string | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function extractTokenFromHash(hash?: string | null) {
  const queryToken = (route.query.token as string) || null;
  if (queryToken) {
    token.value = queryToken;
    serverError.value = null;
    return;
  }

  const raw = (hash ?? "").replace(/^#/, "");
  const p = new URLSearchParams(raw);
  const t = p.get("access_token");
  const typ = p.get("type");
  const err = p.get("error");
  const errCode = p.get("error_code");
  const errDesc = p.get("error_description");

  if (err) {
    serverError.value =
      errCode === "otp_expired"
        ? "Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email."
        : errDesc || "Link đặt lại mật khẩu không hợp lệ.";
    token.value = null;
    return;
  }

  if (t && typ === "recovery") {
    token.value = t;
    serverError.value = null;
    return;
  }

  token.value = null;
  serverError.value = "Token không tìm thấy trong URL.";
}

onMounted(() => {
  extractTokenFromHash(window.location.hash || route.hash);
});

watch(
  () => route.hash,
  (h) => extractTokenFromHash(h),
  { immediate: false }
);

const errors = computed(() => {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (!form.value.newPassword) e.newPassword = "Vui lòng nhập mật khẩu mới.";
  else if (form.value.newPassword.length < 8)
    e.newPassword = "Mật khẩu phải có ít nhất 8 ký tự.";
  if (!form.value.confirmPassword)
    e.confirmPassword = "Vui lòng xác nhận mật khẩu.";
  else if (form.value.newPassword !== form.value.confirmPassword)
    e.confirmPassword = "Mật khẩu xác nhận không khớp.";
  return e;
});

const isValid = computed(
  () => Object.keys(errors.value).length === 0 && !!token.value
);

async function onSubmit() {
  if (!isValid.value || !token.value) return;

  serverError.value = null;
  serverSuccess.value = null;

  try {
    isSubmitting.value = true;
    await $fetch(`${API}/auth/reset-password`, {
      method: "POST",
      body: {
        accessToken: token.value,
        newPassword: form.value.newPassword,
      },
    });
    serverSuccess.value = "Mật khẩu đã được đặt lại thành công!";
    setTimeout(() => router.push("/auth/login"), 1600);
  } catch (err: any) {
    serverError.value =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      "Đặt lại mật khẩu thất bại.";
  } finally {
    isSubmitting.value = false;
  }
}

function togglePassword(field: "new" | "confirm") {
  if (field === "new") showPassword.value = !showPassword.value;
  else showConfirmPassword.value = !showConfirmPassword.value;
}
</script>

<template>
  <div class="auth">
    <div class="card">
      <header class="head">
        <div class="icon-wrapper">
          <svg
            class="key-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
            ></path>
          </svg>
        </div>
        <h1>Đặt lại mật khẩu</h1>
        <p v-if="!serverSuccess">Nhập mật khẩu mới của bạn</p>
        <p v-else>Mật khẩu đã được cập nhật!</p>
      </header>

      <div v-if="serverError" class="alert error">{{ serverError }}</div>
      <div v-if="serverSuccess" class="alert success">
        {{ serverSuccess }}
        <br />
        <small>Đang chuyển hướng đến trang đăng nhập...</small>
      </div>

      <form
        v-if="!serverSuccess && token"
        @submit.prevent="onSubmit"
        novalidate
        class="form"
      >
        <div class="field">
          <label for="newPassword" class="label-with-icon">
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
            Mật khẩu mới
          </label>
          <div class="password-wrapper">
            <input
              id="newPassword"
              v-model="form.newPassword"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Nhập mật khẩu mới"
              :class="{ 'is-error': !!errors.newPassword }"
            />
            <button
              type="button"
              class="toggle-password"
              @click="togglePassword('new')"
              :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            >
              <svg
                v-if="!showPassword"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <small v-if="errors.newPassword" class="msg">{{
            errors.newPassword
          }}</small>
        </div>

        <div class="field">
          <label for="confirmPassword" class="label-with-icon">
            <svg
              class="label-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 11l3 3L22 4"></path>
              <path
                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              ></path>
            </svg>
            Xác nhận mật khẩu
          </label>
          <div class="password-wrapper">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Nhập lại mật khẩu mới"
              :class="{ 'is-error': !!errors.confirmPassword }"
            />
            <button
              type="button"
              class="toggle-password"
              @click="togglePassword('confirm')"
              :aria-label="
                showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
              "
            >
              <svg
                v-if="!showConfirmPassword"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <small v-if="errors.confirmPassword" class="msg">{{
            errors.confirmPassword
          }}</small>
        </div>

        <button
          class="auth-btn"
          type="submit"
          :disabled="!isValid || isSubmitting"
        >
          <span v-if="!isSubmitting">Đặt lại mật khẩu</span>
          <span v-else class="loading">Đang xử lý…</span>
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

      <div v-else-if="!token" class="error-state">
        <div class="error-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <p class="error-text">Link không hợp lệ hoặc đã hết hạn</p>
        <NuxtLink to="/auth/forgot-password" class="auth-btn secondary">
          Yêu cầu link mới
        </NuxtLink>
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
.key-icon {
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

.password-wrapper {
  position: relative;
}
.password-wrapper input {
  width: 100%;
  padding: 11px 44px 11px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  outline: none;
  font-size: 15px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.password-wrapper input:hover {
  border-color: var(--border-hover);
}
.password-wrapper input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--focus);
  background: var(--card);
}
.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-2);
  display: grid;
  place-items: center;
}
.toggle-password svg {
  width: 20px;
  height: 20px;
}
.toggle-password:hover {
  color: var(--text);
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
  text-decoration: none;
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

.error-state {
  display: grid;
  gap: 16px;
  text-align: center;
}
.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.error-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}
.error-text {
  margin: 0;
  font-size: 15px;
  color: var(--text);
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
  .key-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
