<template>
  <div class="dealer-staff-page">
    <div class="header">
      <div>
        <h1>Quản lý Dealer Staff</h1>
        <p class="subtitle">
          Thêm / sửa / xoá nhân viên thuộc đại lý. Khi thêm mới sẽ tạo luôn tài
          khoản đăng nhập cho nhân viên.
        </p>
      </div>

      <button class="add-btn" @click="openCreateModal">
        <span class="btn-icon">+</span> Thêm nhân viên
      </button>
    </div>

    <div class="toolbar">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm theo tên, email hoặc số điện thoại..."
          class="search-input"
        />
      </div>

      <div class="staff-count">
        Tổng: <strong>{{ filteredStaff.length }}</strong> nhân viên
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-error">
      <span class="alert-icon">⚠️</span>
      {{ errorMessage }}
    </div>

    <div class="table-container">
      <table class="staff-table">
        <thead>
          <tr>
            <th>Tên nhân viên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th style="width: 160px; text-align: center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="staff in filteredStaff" :key="staff.id" class="table-row">
            <td class="staff-name">{{ staff.full_name }}</td>
            <td class="staff-email">{{ staff.email }}</td>
            <td>{{ staff.phone || "—" }}</td>
            <td>
              <span class="badge badge-active" v-if="staff.status === 'active'">
                ● Đang hoạt động
              </span>
              <span class="badge badge-inactive" v-else> ● Ngưng </span>
            </td>
            <td class="actions">
              <button
                class="action-btn edit-btn"
                @click="openEdit(staff)"
                title="Sửa thông tin"
              >
                ✏️
              </button>
              <button
                class="action-btn delete-btn"
                @click="confirmDelete(staff)"
                title="Xoá nhân viên"
              >
                🗑️
              </button>
            </td>
          </tr>

          <tr v-if="!isLoading && filteredStaff.length === 0">
            <td colspan="5" class="empty">
              <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>Không tìm thấy nhân viên nào</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Modal Thêm mới -->
    <div
      class="modal-backdrop"
      v-if="openCreateForm"
      @click.self="closeCreateModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>Thêm Dealer Staff</h2>
          <button class="close-btn" @click="closeCreateModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Họ và tên <span class="required">*</span></label>
            <input
              v-model="form.full_name"
              type="text"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@email.com"
            />
          </div>

          <div class="form-group">
            <label>SĐT</label>
            <input v-model="form.phone" type="text" placeholder="0987654321" />
          </div>

          <div class="form-group">
            <label>Mật khẩu đăng nhập <span class="required">*</span></label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div class="form-group">
            <label>Nhập lại mật khẩu <span class="required">*</span></label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
            />
          </div>

          <div v-if="modalError" class="alert alert-error">
            <span class="alert-icon">⚠️</span>
            {{ modalError }}
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="closeCreateModal"
            class="btn btn-cancel"
            :disabled="isSubmitting"
          >
            Hủy
          </button>
          <button
            @click="handleCreateStaff"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Đang lưu..." : "Lưu" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Chỉnh sửa -->
    <div
      class="modal-backdrop"
      v-if="openEditForm"
      @click.self="closeEditModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cập nhật nhân viên</h2>
          <button class="close-btn" @click="closeEditModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Họ và tên</label>
            <input
              v-model="form.full_name"
              type="text"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div class="form-group">
            <label>SĐT</label>
            <input v-model="form.phone" type="text" placeholder="0987654321" />
          </div>

          <div v-if="modalError" class="alert alert-error">
            <span class="alert-icon">⚠️</span>
            {{ modalError }}
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="closeEditModal"
            class="btn btn-cancel"
            :disabled="isSubmitting"
          >
            Hủy
          </button>
          <button
            @click="handleUpdateStaff"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Đang lưu..." : "Lưu" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dealer-manager-layout",
});

import { ref, computed, onMounted } from "vue";
import { useDealerStaff } from "~/composables/useDealerStaff";
import type { DealerStaff } from "~/composables/useDealerStaff";

const {
  staffList,
  isLoading,
  isSubmitting,
  errorMessage,
  loadStaff,
  createStaff: createStaffApi,
  updateStaff: updateStaffApi,
  deleteStaff: deleteStaffApi,
} = useDealerStaff();

const searchQuery = ref("");
const openCreateForm = ref(false);
const openEditForm = ref(false);
const modalError = ref<string | null>(null);

const form = ref<{
  id: string | null;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}>({
  id: null,
  full_name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const accessToken = useCookie<string | null>("access_token");

console.log("🔎 access_token in ManageDealerStaff page:", accessToken.value);

const filteredStaff = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return staffList.value;

  return staffList.value.filter(
    (s) =>
      s.full_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone || "").includes(q)
  );
});

const resetForm = () => {
  form.value = {
    id: null,
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };
  modalError.value = null;
};

const openCreateModal = () => {
  resetForm();
  openCreateForm.value = true;
};

const closeCreateModal = () => {
  openCreateForm.value = false;
  resetForm();
};

const closeEditModal = () => {
  openEditForm.value = false;
  resetForm();
};

onMounted(() => {
  loadStaff();
});

const handleCreateStaff = async () => {
  modalError.value = null;

  if (!form.value.full_name || !form.value.email || !form.value.password) {
    modalError.value = "Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.";
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    modalError.value = "Mật khẩu và xác nhận mật khẩu không khớp.";
    return;
  }

  try {
    await createStaffApi({
      full_name: form.value.full_name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
    });

    openCreateForm.value = false;
    resetForm();
    alert("Tạo tài khoản staff thành công!");
  } catch (err: any) {
    modalError.value =
      err?.message || "Không tạo được nhân viên. Vui lòng thử lại.";
  }
};

const openEdit = (staff: DealerStaff) => {
  form.value = {
    id: staff.id,
    full_name: staff.full_name,
    email: staff.email,
    phone: staff.phone || "",
    password: "",
    confirmPassword: "",
  };
  modalError.value = null;
  openEditForm.value = true;
};

const handleUpdateStaff = async () => {
  modalError.value = null;

  if (!form.value.id) return;

  try {
    await updateStaffApi(form.value.id, {
      full_name: form.value.full_name,
      phone: form.value.phone,
    });

    openEditForm.value = false;
    resetForm();
    alert("Cập nhật nhân viên thành công!");
  } catch (err: any) {
    modalError.value =
      err?.message || "Không cập nhật được nhân viên. Vui lòng thử lại.";
  }
};

const confirmDelete = async (staff: DealerStaff) => {
  if (!confirm(`Bạn có chắc muốn xoá nhân viên "${staff.full_name}"?`)) return;

  try {
    await deleteStaffApi(staff.id);
    alert("Xoá nhân viên thành công!");
  } catch (err: any) {
    alert(err?.message || "Không xoá được nhân viên. Vui lòng thử lại.");
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dealer-staff-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header h1 {
  margin: 0 0 8px 0;
  color: #2d3436;
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  color: #636e72;
  font-size: 14px;
  line-height: 1.6;
}

.add-btn {
  background: linear-gradient(135deg, #00b894 0%, #00a080 100%);
  padding: 12px 24px;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 184, 148, 0.4);
}

.btn-icon {
  font-size: 20px;
  font-weight: bold;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-wrapper {
  position: relative;
  width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

.staff-count {
  font-size: 15px;
  color: #636e72;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
}

.staff-count strong {
  color: #6c5ce7;
  font-size: 18px;
  margin: 0 4px;
}

/* Alert */
.alert {
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.alert-error {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.alert-icon {
  font-size: 18px;
}

/* Table */
.table-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table thead {
  background: linear-gradient(135deg, #6c5ce7 0%, #5f4fd1 100%);
}

.staff-table th {
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.staff-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f3f5;
  font-size: 14px;
  color: #495057;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.staff-name {
  font-weight: 600;
  color: #2d3436;
}

.staff-email {
  color: #6c5ce7;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.badge-active {
  background: #d4edda;
  color: #155724;
}

.badge-inactive {
  background: #f8d7da;
  color: #721c24;
}

/* Actions */
.actions {
  text-align: center;
}

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 4px;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #e3f2fd;
}

.edit-btn:hover {
  background: #0984e3;
  transform: scale(1.1);
}

.delete-btn {
  background: #ffebee;
}

.delete-btn:hover {
  background: #d63031;
  transform: scale(1.1);
}

/* Empty State */
.empty {
  text-align: center;
  padding: 60px 20px;
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
  color: #868e96;
  font-size: 16px;
  margin: 0;
}

/* Loading */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top-color: #6c5ce7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6c5ce7;
  font-weight: 600;
  margin: 0;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  width: 480px;
  max-width: 95%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #6c5ce7 0%, #5f4fd1 100%);
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3436;
}

.required {
  color: #d63031;
  margin-left: 2px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #e9ecef;
  color: #495057;
}

.btn-cancel:hover:not(:disabled) {
  background: #dee2e6;
}

.btn-primary {
  background: linear-gradient(135deg, #00b894 0%, #00a080 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 184, 148, 0.4);
}
</style>
