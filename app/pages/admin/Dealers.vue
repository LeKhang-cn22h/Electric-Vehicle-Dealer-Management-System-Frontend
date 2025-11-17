<template>
  <div class="page-content">
    <div class="content-card">
      <h2 class="content-title">Quản lý đại lý</h2>
      <p class="content-description">
        Quản lý hợp đồng, chỉ tiêu doanh số và tài khoản đại lý.
      </p>

      <div class="actions">
        <input v-model="search" class="input" placeholder="Tìm đại lý..." />

        <button class="btn btn-primary" @click="openCreateModal">
          + Thêm đại lý mới
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Tên đại lý</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="dealer in filteredDealers" :key="dealer.id">
            <td>{{ dealer.name }}</td>
            <td>{{ dealer.phone }}</td>
            <td>{{ dealer.address }}</td>
            <td>
              <span :class="['status', dealer.status]">
                {{ dealer.status === "active" ? "Hoạt động" : "Tạm dừng" }}
              </span>
            </td>
            <td>
              <button class="btn-sm" @click="editDealer(dealer)">Sửa</button>
              <button
                class="btn-sm btn-danger"
                @click="removeDealer(dealer.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pending" class="loading">Đang tải...</div>
    </div>
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editing ? "Cập nhật đại lý" : "Thêm đại lý mới" }}</h3>

        <div class="form-section">
          <h4 class="section-title">Thông tin đại lý</h4>
          <input v-model="form.name" class="input" placeholder="Tên đại lý *" />
          <input
            v-model="form.phone"
            class="input"
            placeholder="Số điện thoại đại lý"
          />
          <input v-model="form.address" class="input" placeholder="Địa chỉ" />

          <select v-model="form.status" class="input">
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm dừng</option>
          </select>
        </div>

        <div v-if="!editing" class="form-section">
          <h4 class="section-title">Tài khoản đăng nhập</h4>

          <input
            v-model="form.user_full_name"
            class="input"
            placeholder="Họ và tên người quản lý *"
          />
          <input
            v-model="form.user_phone"
            class="input"
            placeholder="SĐT người quản lý"
          />
          <input
            v-model="form.user_email"
            class="input"
            type="email"
            placeholder="Email đăng nhập *"
          />
          <input
            v-model="form.user_password"
            class="input"
            type="password"
            placeholder="Mật khẩu *"
          />
          <input
            v-model="form.user_password_confirm"
            class="input"
            type="password"
            placeholder="Xác nhận mật khẩu *"
          />
        </div>

        <div class="modal-actions">
          <button class="btn" @click="closeModal">Hủy</button>
          <button class="btn btn-primary" @click="saveDealer">
            {{ editing ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin" });

import { ref, onMounted } from "vue";
import { useDealers } from "@/composables/useDealers";

const {
  pending,
  search,
  filteredDealers,
  loadDealers,
  createDealer,
  updateDealer,
  deleteDealer,
} = useDealers();

const showModal = ref(false);
const editing = ref(false);

const emptyForm = {
  id: null,
  name: "",
  phone: "",
  address: "",
  status: "active",
  user_email: "",
  user_password: "",
  user_password_confirm: "",
  user_full_name: "",
  user_phone: "",
};

const form = ref({ ...emptyForm });

function openCreateModal() {
  editing.value = false;
  form.value = { ...emptyForm };
  showModal.value = true;
}

function editDealer(dealer) {
  editing.value = true;
  form.value = {
    id: dealer.id,
    name: dealer.name,
    phone: dealer.phone,
    address: dealer.address,
    status: dealer.status,
    user_email: "",
    user_password: "",
    user_password_confirm: "",
    user_full_name: "",
    user_phone: "",
  };

  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveDealer() {
  // Validate tên đại lý
  if (!form.value.name || form.value.name.trim() === "") {
    return alert("Tên đại lý không được để trống");
  }
  // Validate tài khoản khi thêm mới
  if (!editing.value) {
    if (!form.value.user_full_name.trim())
      return alert("Họ và tên không được để trống");
    if (!form.value.user_email.trim())
      return alert("Email không được để trống");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.user_email))
      return alert("Email không hợp lệ");

    if (!form.value.user_password.trim())
      return alert("Mật khẩu không được để trống");
    if (form.value.user_password.length < 6)
      return alert("Mật khẩu phải có ít nhất 6 ký tự");

    if (form.value.user_password !== form.value.user_password_confirm)
      return alert("Mật khẩu xác nhận không khớp");
  }

  try {
    if (editing.value) {
      await updateDealer(form.value.id, {
        name: form.value.name,
        phone: form.value.phone,
        address: form.value.address,
        status: form.value.status,
      });

      alert("Cập nhật đại lý thành công!");
    } else {
      await createDealer(form.value);
      alert("Thêm đại lý mới thành công!");
    }

    await loadDealers();
    closeModal();
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra, vui lòng thử lại.");
  }
}

async function removeDealer(id) {
  if (!confirm("Bạn chắc chắn muốn xóa đại lý này?")) return;
  await deleteDealer(id);
}

onMounted(() => {
  loadDealers();
});
</script>

<style scoped>
.page-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.content-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.content-description {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.actions .input {
  width: 100%;
  max-width: 300px;
}

.modal .input {
  width: 100%;
  margin-bottom: 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #f9fafb;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.table-container {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: #f9fafb;
}

.table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 14px 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.table tbody tr {
  transition: background 0.15s;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.btn-sm {
  padding: 6px 12px;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  border: none;
  margin-right: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-sm:hover {
  background: #1d4ed8;
}

.btn-danger {
  background: #dc2626 !important;
}

.btn-danger:hover {
  background: #b91c1c !important;
}

.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #dbeafe;
  color: #1e40af;
}

.status.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s;
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

.modal h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions .input {
    max-width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .table {
    min-width: 600px;
  }

  .modal {
    max-width: 95%;
  }
}
</style>
