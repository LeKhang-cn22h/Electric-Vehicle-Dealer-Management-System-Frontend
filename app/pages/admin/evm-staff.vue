<template>
  <div class="page">
    <header class="page-header">
      <div class="header-content">
        <h1>Quản lý EVM Staff</h1>
        <p class="subtitle">
          Tạo mới, xem danh sách và khóa / mở khóa tài khoản EVM staff.
        </p>
      </div>

      <button class="btn-refresh" @click="loadStaff" :disabled="loading">
        <span class="refresh-icon" :class="{ spinning: loading }">
          <RefreshCcw
        /></span>
        {{ loading ? "Đang tải..." : "Làm mới" }}
      </button>
    </header>

    <section class="content">
      <div class="card list-card">
        <div class="card-header">
          <h2>Danh sách EVM Staff</h2>
          <div class="search-wrapper">
            <span class="search-icon"><Search /></span>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm theo tên / email..."
              class="search-input"
            />
          </div>
        </div>

        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-label">Tổng cộng:</span>
            <span class="stat-value">{{ staff.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Đang hoạt động:</span>
            <span class="stat-value active">{{ activeCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Đã khóa:</span>
            <span class="stat-value locked">{{ lockedCount }}</span>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Điện thoại</th>
                <th>Dealer</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style="width: 160px; text-align: center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!loading && filteredStaff.length === 0">
                <td colspan="7" class="empty">
                  <div class="empty-state">
                    <span class="empty-icon">📭</span>
                    <p>Không có EVM staff nào phù hợp.</p>
                  </div>
                </td>
              </tr>

              <tr v-for="u in filteredStaff" :key="u.id" class="table-row">
                <td class="email-cell">{{ u.email }}</td>
                <td class="name-cell">{{ u.full_name || "—" }}</td>
                <td>{{ u.phone || "—" }}</td>
                <td class="dealer-cell">
                  {{ u.dealer_name || u.dealer_id || "EVM (Global)" }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="
                      u.status === 'active' ? 'badge-active' : 'badge-locked'
                    "
                  >
                    <span class="badge-dot"></span>
                    {{ u.status === "active" ? "Hoạt động" : "Đã khóa" }}
                  </span>
                </td>
                <td class="date-cell">{{ formatDate(u.created_at) }}</td>
                <td>
                  <div class="action-group">
                    <button
                      class="btn-action"
                      :class="u.status === 'active' ? 'btn-lock' : 'btn-unlock'"
                      @click="toggleStatus(u)"
                      :disabled="togglingId === u.id"
                      :title="
                        u.status === 'active'
                          ? 'Khóa tài khoản'
                          : 'Mở khóa tài khoản'
                      "
                    >
                      <span
                        v-if="togglingId === u.id"
                        class="spinner-small"
                      ></span>
                      <span v-else>
                        <Lock v-if="u.status === 'active'" />
                        <KeySquare v-else />
                      </span>
                    </button>

                    <button
                      class="btn-action btn-edit"
                      @click="prefillEdit(u)"
                      title="Chỉnh sửa"
                    >
                      <Pencil />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="loading">
                <td colspan="7" class="loading-cell">
                  <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card form-card">
        <div class="card-header">
          <h2>
            {{ editingId ? "Cập nhật EVM Staff" : " Tạo mới EVM Staff" }}
          </h2>
        </div>

        <form @submit.prevent="onSubmit" class="form">
          <div class="form-group">
            <label>
              Email
              <span class="required">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              class="input"
              placeholder="evm.staff@example.com"
              :disabled="submitting || !!editingId"
            />
          </div>

          <div class="form-group">
            <label>
              Họ tên
              <span class="required">*</span>
            </label>
            <input
              v-model="form.full_name"
              type="text"
              class="input"
              placeholder="Ví dụ: Nguyễn Văn A"
              :disabled="submitting"
            />
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input
              v-model="form.phone"
              type="text"
              class="input"
              placeholder="Ví dụ: 0901234567"
              :disabled="submitting"
            />
          </div>
          <div v-if="!editingId" class="form-group">
            <label>
              Mật khẩu
              <span class="required">*</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              class="input"
              placeholder="Mật khẩu ban đầu cho EVM staff"
              :disabled="submitting"
            />
          </div>

          <div v-if="!editingId" class="form-group">
            <label>
              Nhập lại mật khẩu
              <span class="required">*</span>
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="input"
              placeholder="Nhập lại mật khẩu"
              :disabled="submitting"
            />
          </div>

          <div v-if="errorMsg" class="alert alert-error">
            <span class="alert-icon"> <TriangleAlert /></span>
            {{ errorMsg }}
          </div>
          <div v-if="successMsg" class="alert alert-success">
            <span class="alert-icon"><Check /></span>
            {{ successMsg }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="submitting">
              <span v-if="submitting" class="btn-spinner"></span>
              {{
                submitting
                  ? "Đang lưu..."
                  : editingId
                  ? "Lưu thay đổi"
                  : "Tạo tài khoản"
              }}
            </button>

            <CircleX
              v-if="editingId"
              type="button"
              class="btn-cancel"
              @click="resetForm"
              :disabled="submitting"
            >
            </CircleX
            >Hủy
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  useEvmStaff,
  type EvmStaff,
  type CreateEvmStaffPayload,
  type UpdateEvmStaffPayload,
} from "@/composables/useEvmStaff";
import {
  Search,
  RefreshCcw,
  KeySquare,
  Lock,
  Pencil,
  TriangleAlert,
  Check,
  CircleX,
} from "lucide-vue-next";
definePageMeta({
  layout: "admin",
});

type FormState = {
  email: string;
  full_name: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const {
  staff,
  loading,
  activeCount,
  lockedCount,
  formatDate,
  fetchStaff,
  createStaff,
  updateStaff,
  lockStaff,
  unlockStaff,
} = useEvmStaff();

const search = ref("");

const form = ref<FormState>({
  email: "",
  full_name: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const editingId = ref<string | null>(null);
const submitting = ref(false);
const togglingId = ref<string | null>(null);
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

const filteredStaff = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return staff.value;
  return staff.value.filter(
    (u) =>
      u.email.toLowerCase().includes(q) ||
      (u.full_name && u.full_name.toLowerCase().includes(q))
  );
});

async function loadStaff() {
  errorMsg.value = null;
  try {
    await fetchStaff();
  } catch (err: any) {
    console.error(err);
    errorMsg.value =
      err?.data?.message || "Không tải được danh sách EVM staff.";
  }
}

function validateForm() {
  if (!form.value.email.trim()) {
    errorMsg.value = "Vui lòng nhập email.";
    return false;
  }
  if (!form.value.full_name.trim()) {
    errorMsg.value = "Vui lòng nhập họ tên.";
    return false;
  }

  if (!editingId.value) {
    if (!form.value.password.trim()) {
      errorMsg.value = "Vui lòng nhập mật khẩu cho EVM staff.";
      return false;
    }
    if (form.value.password.trim().length < 6) {
      errorMsg.value = "Mật khẩu phải ít nhất 6 ký tự.";
      return false;
    }
    if (form.value.password.trim() !== form.value.confirmPassword.trim()) {
      errorMsg.value = "Mật khẩu nhập lại không khớp.";
      return false;
    }
  }

  return true;
}

async function onSubmit() {
  errorMsg.value = null;
  successMsg.value = null;
  if (!validateForm()) return;

  submitting.value = true;

  try {
    if (!editingId.value) {
      const payload: CreateEvmStaffPayload = {
        email: form.value.email.trim(),
        password: form.value.password.trim(),
        full_name: form.value.full_name.trim(),
        phone: form.value.phone.trim() || null,
      };
      await createStaff(payload);
      successMsg.value = "Tạo tài khoản EVM staff thành công.";
    } else {
      const payload: UpdateEvmStaffPayload = {
        full_name: form.value.full_name.trim(),
        phone: form.value.phone.trim() || null,
      };
      await updateStaff(editingId.value, payload);
      successMsg.value = "Cập nhật EVM staff thành công.";
    }

    await loadStaff();
    if (!editingId.value) resetForm();
  } catch (err: any) {
    console.error(err);
    errorMsg.value =
      err?.data?.message ||
      (editingId.value
        ? "Không thể cập nhật EVM staff."
        : "Không thể tạo EVM staff.");
  } finally {
    submitting.value = false;
  }
}

async function toggleStatus(u: EvmStaff) {
  togglingId.value = u.id;
  errorMsg.value = null;
  successMsg.value = null;

  try {
    if (u.status === "active") {
      await lockStaff(u.id);
      successMsg.value = "Đã khóa tài khoản EVM staff.";
    } else {
      await unlockStaff(u.id);
      successMsg.value = "Đã mở khóa tài khoản EVM staff.";
    }

    await loadStaff();
  } catch (err: any) {
    console.error(err);
    errorMsg.value =
      err?.data?.message || "Không thể thay đổi trạng thái tài khoản.";
  } finally {
    togglingId.value = null;
  }
}

function prefillEdit(u: EvmStaff) {
  editingId.value = u.id;
  form.value.email = u.email;
  form.value.full_name = u.full_name || "";
  form.value.phone = u.phone || "";
  form.value.password = "";
  form.value.confirmPassword = "";
  successMsg.value = null;
  errorMsg.value = null;
}

function resetForm() {
  editingId.value = null;
  form.value = {
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };
  successMsg.value = null;
  errorMsg.value = null;
}

onMounted(() => {
  loadStaff();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.card .list-card {
  margin-bottom: 20px;
  width: 100%;
}
.page {
  padding: 28px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 18px;
  display: inline-block;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Content Grid */
.content {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

/* Search */
.search-wrapper {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.stats-bar {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
}

.stat-value {
  font-size: 14px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.stat-value.active {
  color: #16a34a;
}

.stat-value.locked {
  color: #dc2626;
}

.table-wrapper {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}

.table thead {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.table th {
  padding: 8px 10px;
  font-size: 11px;
}

.table td {
  padding: 6px 10px;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.email-cell {
  color: #3b82f6;
  font-weight: 500;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.name-cell {
  font-weight: 600;
  color: #1e293b;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dealer-cell {
  font-size: 11px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-action {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-size: 14px;
}

.date-cell {
  font-size: 13px;
  color: #94a3b8;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.badge-active {
  background: #dcfce7;
  color: #166534;
}

.badge-locked {
  background: #fee2e2;
  color: #991b1b;
}

/* Actions */
.action-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-lock {
  background: #fee2e2;
}

.btn-lock:hover:not(:disabled) {
  background: #dc2626;
  transform: scale(1.1);
}

.btn-unlock {
  background: #dcfce7;
}

.btn-unlock:hover:not(:disabled) {
  background: #16a34a;
  transform: scale(1.1);
}

.btn-edit {
  background: #dbeafe;
}

.btn-edit:hover {
  background: #3b82f6;
  transform: scale(1.1);
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Empty & Loading States */
.empty {
  text-align: center;
  padding: 40px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.3;
}

.empty-state p {
  color: #94a3b8;
  font-size: 15px;
  margin: 0;
}

.loading-cell {
  padding: 40px 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

.loading-state p {
  color: #3b82f6;
  font-weight: 600;
  margin: 0;
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.required {
  color: #dc2626;
  margin-left: 2px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
}

.alert-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

/* Responsive */
@media (max-width: 1200px) {
  .content {
    grid-template-columns: minmax(0, 1fr);
  }

  .form-card {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .search-wrapper {
    width: 100%;
  }

  .stats-bar {
    flex-direction: column;
    gap: 12px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
