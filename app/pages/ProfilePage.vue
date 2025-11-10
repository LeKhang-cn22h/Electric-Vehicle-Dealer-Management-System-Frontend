<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useMe } from "~/composables/useMe";
import type { Profile } from "~/types/profile";

type PasswordForm = { current: string; next: string; confirm: string };

const { me, refreshMe } = useMe();
const isSubmitting = ref(false);
const isLoading = ref(true);
const msg = ref<string | null>(null);
const err = ref<string | null>(null);

const profile = ref<Profile>({
  fullName: "",
  email: "",
  phone: "",
  avatarUrl: null,
});

const pwd = ref<PasswordForm>({ current: "", next: "", confirm: "" });

const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

onMounted(async () => {
  isLoading.value = true;

  // Đợi useMe fetch xong
  if (!me.value) {
    await refreshMe();
  }

  if (me.value) {
    profile.value = {
      fullName: me.value.user_metadata?.full_name || me.value.full_name || "",
      email: me.value.email || "",
      phone: me.value.user_metadata?.phone || me.value.phone || "",
      avatarUrl: me.value.user_metadata?.avatar_url || null,
    };

    if (profile.value.avatarUrl) {
      avatarPreview.value = profile.value.avatarUrl;
    }
  }

  isLoading.value = false;
});

function flash(ok: boolean, text: string, timeout = 3500) {
  err.value = null;
  msg.value = null;
  (ok ? msg : err).value = text;
  window.setTimeout(() => {
    if ((ok ? msg : err).value === text) (ok ? msg : err).value = null;
  }, timeout);
}

const profileErrors = computed(() => {
  const e: Partial<Record<keyof Profile, string>> = {};
  if (!profile.value.fullName.trim()) e.fullName = "Vui lòng nhập họ và tên.";
  if (!profile.value.email.trim()) e.email = "Vui lòng nhập email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(profile.value.email))
    e.email = "Email không hợp lệ.";
  if (profile.value.phone && !/^[+0-9\s-]{7,15}$/.test(profile.value.phone))
    e.phone = "Số điện thoại không hợp lệ.";
  return e;
});
const canSaveProfile = computed(
  () => Object.keys(profileErrors.value).length === 0
);

const pwdErrors = computed(() => {
  const e: Partial<Record<keyof PasswordForm, string>> = {};
  if (!pwd.value.current) e.current = "Nhập mật khẩu hiện tại.";
  if (!pwd.value.next) e.next = "Nhập mật khẩu mới.";
  else if (pwd.value.next.length < 6) e.next = "Mật khẩu tối thiểu 6 ký tự.";
  if (pwd.value.confirm !== pwd.value.next)
    e.confirm = "Xác nhận mật khẩu không khớp.";
  return e;
});
const canChangePwd = computed(() => Object.keys(pwdErrors.value).length === 0);

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

function setAvatar(file: File) {
  if (!ALLOWED_MIME.includes(file.type))
    return flash(false, "Chỉ chấp nhận PNG/JPG/WebP.");
  if (file.size > MAX_AVATAR_SIZE) return flash(false, "Ảnh vượt quá 2MB.");
  avatarFile.value = file;
  const r = new FileReader();
  r.onload = () => (avatarPreview.value = String(r.result || ""));
  r.readAsDataURL(file);
}
function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) setAvatar(f);
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  const f = e.dataTransfer?.files?.[0];
  if (f) setAvatar(f);
}
function onDragOver(e: DragEvent) {
  e.preventDefault();
}
function removeAvatar() {
  avatarFile.value = null;
  avatarPreview.value = null;
  profile.value.avatarUrl = null;
}

async function saveProfile() {
  if (!canSaveProfile.value) return;
  const token = localStorage.getItem("access_token");
  if (!token) return flash(false, "Vui lòng đăng nhập lại");

  try {
    isSubmitting.value = true;

    const form = new FormData();
    form.append("full_name", profile.value.fullName);
    form.append("phone", profile.value.phone || "");
    if (avatarFile.value) form.append("avatar", avatarFile.value);

    await updateUserProfile(form, token);

    await refreshMe();

    if (me.value) {
      profile.value.fullName =
        me.value.user_metadata?.full_name || me.value.full_name || "";
      profile.value.phone =
        me.value.user_metadata?.phone || me.value.phone || "";
      profile.value.avatarUrl = me.value.user_metadata?.avatar_url || null;

      avatarPreview.value = profile.value.avatarUrl;
    }

    avatarFile.value = null;
    flash(true, "Đã lưu hồ sơ thành công!");
  } catch (e: any) {
    flash(false, e.message);
  } finally {
    isSubmitting.value = false;
  }
}

async function changePassword() {
  if (!canChangePwd.value) return;
  const token = localStorage.getItem("access_token");
  if (!token) return flash(false, "Vui lòng đăng nhập lại");

  try {
    isSubmitting.value = true;

    await changePasswordApi(token, pwd.value.current, pwd.value.next);

    pwd.value = { current: "", next: "", confirm: "" };
    flash(true, "Đổi mật khẩu thành công!");
  } catch (e: any) {
    flash(false, e.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="head">
        <h1 style="margin: 0 0 6px; font-size: 28px; font-weight: bold">
          Hồ sơ cá nhân
        </h1>
        <p class="muted">Quản lý thông tin cơ bản & bảo mật tài khoản.</p>
      </header>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner-large"></div>
        <p>Đang tải thông tin...</p>
      </div>

      <template v-else>
        <div v-if="err" class="alert error" role="alert">{{ err }}</div>
        <div v-if="msg" class="alert success" role="status">{{ msg }}</div>

        <div class="grid">
          <section class="card">
            <h2 class="title">Thông tin tài khoản</h2>
            <div
              class="avatar-zone"
              @dragover="onDragOver"
              @drop="onDrop"
              :class="{ empty: !avatarPreview && !profile.avatarUrl }"
            >
              <img
                v-if="avatarPreview || profile.avatarUrl"
                :src="avatarPreview || profile.avatarUrl!"
                class="avatar"
                alt="Avatar"
              />
              <div v-else class="placeholder">
                <div class="placeholder-avatar">
                  {{ profile.fullName?.[0]?.toUpperCase() || "?" }}
                </div>
                <p>PNG/JPG/WebP &lt; 2MB</p>
              </div>

              <div class="actions-row">
                <label class="btn secondary">
                  <input
                    class="file"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    @change="onPick"
                  />
                  Chọn ảnh
                </label>
                <button
                  class="btn ghost"
                  type="button"
                  @click="removeAvatar"
                  :disabled="isSubmitting"
                >
                  Xoá ảnh
                </button>
              </div>
            </div>

            <form class="form" @submit.prevent="saveProfile" novalidate>
              <div class="row">
                <div class="field">
                  <label for="fullName">Họ và tên</label>
                  <input
                    id="fullName"
                    v-model.trim="profile.fullName"
                    :class="{ 'is-error': !!profileErrors.fullName }"
                    placeholder="Nguyễn Văn A"
                  />
                  <small v-if="profileErrors.fullName" class="msg">{{
                    profileErrors.fullName
                  }}</small>
                </div>

                <div class="field">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    v-model.trim="profile.email"
                    type="email"
                    :class="{ 'is-error': !!profileErrors.email }"
                    placeholder="you@example.com"
                    disabled
                    title="Email không thể thay đổi"
                  />
                  <small class="msg info">Email không thể thay đổi</small>
                </div>
              </div>

              <div class="row">
                <div class="field">
                  <label for="phone">Số điện thoại</label>
                  <input
                    id="phone"
                    v-model.trim="profile.phone"
                    inputmode="tel"
                    :class="{ 'is-error': !!profileErrors.phone }"
                    placeholder="+84 901 234 567"
                  />
                  <small v-if="profileErrors.phone" class="msg">{{
                    profileErrors.phone
                  }}</small>
                </div>
                <div class="field"></div>
              </div>

              <div class="actions-end">
                <button
                  class="btn primary"
                  type="submit"
                  :disabled="!canSaveProfile || isSubmitting"
                >
                  <span v-if="!isSubmitting">Lưu hồ sơ</span>
                  <span v-else class="loading"
                    ><span class="spinner"></span>Đang lưu…</span
                  >
                </button>
              </div>
            </form>
          </section>

          <section class="card">
            <h2 class="title">Bảo mật</h2>

            <form class="form" @submit.prevent="changePassword" novalidate>
              <div class="field">
                <label for="pwd-current">Mật khẩu hiện tại</label>
                <input
                  id="pwd-current"
                  v-model.trim="pwd.current"
                  type="password"
                  :class="{ 'is-error': !!pwdErrors.current }"
                />
                <small v-if="pwdErrors.current" class="msg">{{
                  pwdErrors.current
                }}</small>
              </div>

              <div class="row">
                <div class="field">
                  <label for="pwd-next">Mật khẩu mới</label>
                  <input
                    id="pwd-next"
                    v-model.trim="pwd.next"
                    type="password"
                    :class="{ 'is-error': !!pwdErrors.next }"
                  />
                  <small v-if="pwdErrors.next" class="msg">{{
                    pwdErrors.next
                  }}</small>
                </div>
                <div class="field">
                  <label for="pwd-confirm">Xác nhận mật khẩu</label>
                  <input
                    id="pwd-confirm"
                    v-model.trim="pwd.confirm"
                    type="password"
                    :class="{ 'is-error': !!pwdErrors.confirm }"
                  />
                  <small v-if="pwdErrors.confirm" class="msg">{{
                    pwdErrors.confirm
                  }}</small>
                </div>
              </div>

              <div class="actions-end">
                <button
                  class="btn primary"
                  type="submit"
                  :disabled="!canChangePwd || isSubmitting"
                >
                  <span v-if="!isSubmitting">Đổi mật khẩu</span>
                  <span v-else class="loading"
                    ><span class="spinner"></span>Đang đổi…</span
                  >
                </button>
              </div>
            </form>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
:root {
  --bg: #f7f8fa;
  --panel: #fff;
  --text: #0f172a;
  --text2: #64748b;
  --border: #e5e7eb;
  --primary: #4f46e5;
  --focus: rgba(79, 70, 229, 0.18);
  --error: #dc2626;
  --success: #059669;
  --info: #3b82f6;
}

.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 28px 20px;
  color: var(--text);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.head {
  margin-bottom: 16px;
  text-align: center;
}

.muted {
  color: var(--text2);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}

.alert {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 14px;
  margin: 12px 0 18px;
  border: 1px solid;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
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

.grid {
  display: grid;
  gap: 20px;
}
@media (min-width: 960px) {
  .grid {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 10px 28px rgba(2, 6, 23, 0.06);
}
.title {
  margin: 4px 0 14px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.avatar-zone {
  display: grid;
  gap: 12px;
  align-items: center;
  border: 1px dashed var(--border);
  border-radius: 14px;
  padding: 14px;
}
@media (min-width: 960px) {
  .avatar-zone {
    grid-template-columns: auto 1fr;
  }
}
.avatar-zone.empty {
  justify-items: center;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
}
.placeholder-avatar {
  width: 120px;
  height: 120px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
}
.placeholder p {
  font-size: 13px;
  color: var(--text2);
  margin: 0;
}
.actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.file {
  display: none;
}

.form {
  display: grid;
  gap: 14px;
}
.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 720px) {
  .row {
    grid-template-columns: 1fr 1fr;
  }
}
.field {
  display: grid;
  gap: 8px;
}
.field label {
  font-size: 13px;
  font-weight: 700;
}
.field input {
  width: 100%;
  padding: 12px 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  color: var(--text);
  outline: none;
  font-size: 15px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field input:disabled {
  background: #f3f4f6;
  color: var(--text2);
  cursor: not-allowed;
}
.field input:hover:not(:disabled) {
  border-color: #d3dae5;
}
.field input:focus-visible {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--focus);
}
.is-error {
  border-color: var(--error) !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12) !important;
}
.msg {
  color: var(--error);
  font-size: 12px;
}
.msg.info {
  color: var(--text2);
}

.actions-end {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
@media (max-width: 480px) {
  .actions-end .btn {
    width: 100%;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  font-weight: 700;
  transition: filter 0.15s, transform 0.02s;
}
.btn.primary {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #4f46e5 100%);
}
.btn.primary:hover:not(:disabled) {
  filter: brightness(1.05);
}
.btn.primary:active:not(:disabled) {
  transform: translateY(1px);
}
.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.secondary {
  background: #fff;
  color: var(--primary);
  border: 1px solid var(--border);
}
.btn.secondary:hover {
  border-color: #d3dae5;
}
.btn.ghost {
  background: #fff;
  color: var(--text2);
  border: 1px dashed var(--border);
}
.btn.ghost:hover {
  color: var(--text);
  border-color: #d3dae5;
}

.loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
