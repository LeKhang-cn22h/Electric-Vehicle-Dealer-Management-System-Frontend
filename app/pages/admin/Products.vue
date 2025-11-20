<template>
  <div class="page-content">
    <!-- Header + create button -->
    <div class="content-card header-card">
      <div>
        <h2 class="content-title">Quản lý sản phẩm</h2>
        <p class="content-description">
          Quản lý danh mục xe điện, phiên bản, màu sắc và thông số kỹ thuật.
        </p>
      </div>

      <button class="btn btn-primary" @click="openCreateModal">
        + Thêm mẫu xe mới
      </button>
    </div>

    <!-- Bộ lọc / tìm kiếm -->
    <div class="content-card filters-card">
      <div class="filters-row">
        <div class="form-group">
          <label>Từ khóa</label>
          <input
            v-model="filters.keyword"
            type="text"
            class="input"
            placeholder="Tìm theo tên model, mã, màu..."
          />
        </div>

        <div class="form-group">
          <label>Trạng thái</label>
          <select v-model="filters.status" class="input">
            <option value="">Tất cả</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngưng bán</option>
            <option value="draft">Nháp</option>
          </select>
        </div>

        <div class="form-group">
          <label>Giá từ (VND)</label>
          <input
            v-model.number="filters.minPrice"
            type="number"
            class="input"
            min="0"
          />
        </div>

        <div class="form-group">
          <label>Đến (VND)</label>
          <input
            v-model.number="filters.maxPrice"
            type="number"
            class="input"
            min="0"
          />
        </div>
      </div>

      <div class="filters-actions">
        <button class="btn" @click="resetFilters" :disabled="loading">
          Đặt lại
        </button>
        <button
          class="btn btn-primary"
          @click="loadVehicles"
          :disabled="loading"
        >
          Tìm kiếm
        </button>
      </div>
    </div>

    <!-- Bảng danh sách xe -->
    <div class="content-card">
      <div class="table-header">
        <h3>Danh sách xe điện</h3>
        <span class="table-meta"> Tổng: {{ vehicles.length }} mẫu </span>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-if="loading" class="loading">Đang tải dữ liệu...</div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>Tên mẫu</th>
            <th>Mã model</th>
            <th>Màu sắc</th>
            <th>Pin / Công suất</th>
            <th>Giá (VND)</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th style="width: 140px">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!vehicles.length">
            <td colspan="8" class="empty-cell">
              Không có dữ liệu. Hãy thử thay đổi bộ lọc hoặc thêm mẫu xe mới.
            </td>
          </tr>

          <tr v-for="v in vehicles" :key="v.id">
            <td>
              <div class="vehicle-name-cell">
                <div class="vehicle-main">
                  {{ v.name || v.model_name || "N/A" }}
                </div>
                <div class="vehicle-sub">
                  {{ v.variant || v.version || "" }}
                </div>
              </div>
            </td>
            <td>{{ v.model_code || v.code || v.id }}</td>
            <td>{{ v.color || v.colors || "-" }}</td>
            <td>
              <div>
                {{
                  v.battery_capacity_kwh ? v.battery_capacity_kwh + " kWh" : "-"
                }}
              </div>
              <div class="vehicle-sub">
                {{ v.power_kw ? v.power_kw + " kW" : "" }}
              </div>
            </td>
            <td>{{ formatCurrency(v.base_price_vnd || v.price_vnd || 0) }}</td>
            <td>
              <span :class="['status-pill', `status-${v.status || 'draft'}`]">
                {{ mapStatus(v.status) }}
              </span>
            </td>
            <td>
              {{ v.created_at ? formatDate(v.created_at) : "-" }}
            </td>
            <td>
              <div class="actions">
                <button class="btn btn-sm" @click="openEditModal(v)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(v)">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal tạo / sửa xe -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">
          {{ editMode ? "Cập nhật mẫu xe" : "Thêm mẫu xe mới" }}
        </h3>

        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Tên mẫu xe *</label>
              <input
                v-model="form.name"
                type="text"
                class="input"
                placeholder="Ví dụ: Tesla Model 3 RWD"
              />
            </div>

            <div class="form-group">
              <label>Mã model</label>
              <input
                v-model="form.model_code"
                type="text"
                class="input"
                placeholder="Ví dụ: TM3-RWD"
              />
            </div>

            <div class="form-group">
              <label>Phiên bản / Variant</label>
              <input
                v-model="form.variant"
                type="text"
                class="input"
                placeholder="Standard / Long Range..."
              />
            </div>

            <div class="form-group">
              <label>Giá niêm yết (VND)</label>
              <input
                v-model.number="form.base_price_vnd"
                type="number"
                class="input"
                min="0"
              />
            </div>

            <div class="form-group">
              <label>Màu sắc</label>
              <input
                v-model="form.color"
                type="text"
                class="input"
                placeholder="Ví dụ: Đỏ, Trắng, Đen..."
              />
            </div>

            <div class="form-group">
              <label>Dung lượng pin (kWh)</label>
              <input
                v-model.number="form.battery_capacity_kwh"
                type="number"
                class="input"
                min="0"
              />
            </div>

            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="form.status" class="input">
                <option value="draft">Nháp</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngưng bán</option>
              </select>
            </div>

            <div class="form-group form-group-full">
              <label>Mô tả</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="input textarea"
                placeholder="Mô tả tổng quan về mẫu xe..."
              ></textarea>
            </div>

            <div class="form-group form-group-full">
              <label>Ảnh sản phẩm</label>
              <input
                type="file"
                multiple
                accept="image/*"
                class="input"
                @change="onFilesChange"
              />
              <div v-if="imageFiles.length" class="file-chips">
                <span
                  v-for="(f, idx) in imageFiles"
                  :key="idx"
                  class="file-chip"
                >
                  {{ f.name }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="formError" class="alert alert-error">
            {{ formError }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn" @click="closeModal" :disabled="formLoading">
            Hủy
          </button>
          <button
            class="btn btn-primary"
            @click="submitForm"
            :disabled="formLoading"
          >
            {{
              formLoading
                ? "Đang xử lý..."
                : editMode
                ? "Lưu thay đổi"
                : "Tạo mới"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="deleteTarget" class="modal-backdrop">
      <div class="modal small">
        <h3 class="modal-title">Xóa mẫu xe</h3>
        <p>
          Bạn có chắc chắn muốn xóa
          <strong>{{ deleteTarget.name || deleteTarget.model_name }}</strong
          >?
        </p>
        <div class="modal-footer">
          <button
            class="btn"
            @click="deleteTarget = null"
            :disabled="deleteLoading"
          >
            Hủy
          </button>
          <button
            class="btn btn-danger"
            @click="performDelete"
            :disabled="deleteLoading"
          >
            {{ deleteLoading ? "Đang xóa..." : "Xóa" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRuntimeConfig, useNuxtApp } from "#imports";
import { $fetch } from "ofetch";

definePageMeta({
  layout: "admin",
});

const config = useRuntimeConfig();
const apiBase = (config.public.apiBase as string) || "http://localhost:4000";

const vehicles = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// filter
const filters = ref({
  keyword: "",
  status: "",
  minPrice: null as number | null,
  maxPrice: null as number | null,
});

// modal state
const showModal = ref(false);
const editMode = ref(false);
const formLoading = ref(false);
const formError = ref<string | null>(null);
const form = ref({
  id: null as string | null,
  name: "",
  model_code: "",
  variant: "",
  base_price_vnd: null as number | null,
  color: "",
  battery_capacity_kwh: null as number | null,
  status: "draft",
  description: "",
});
const imageFiles = ref<File[]>([]);

// delete state
const deleteTarget = ref<any | null>(null);
const deleteLoading = ref(false);

function getAuthHeader(): Record<string, string> {
  const headers: Record<string, string> = {};

  if (process.client) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

function formatCurrency(value: number) {
  if (!value) return "0";
  return value.toLocaleString("vi-VN");
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("vi-VN");
}

function mapStatus(status?: string) {
  switch (status) {
    case "active":
      return "Đang bán";
    case "inactive":
      return "Ngưng bán";
    case "draft":
    default:
      return "Nháp";
  }
}

// ====== API CALLS ======
async function loadVehicles() {
  loading.value = true;
  error.value = null;

  try {
    const query: Record<string, any> = {};
    if (filters.value.keyword) query.keyword = filters.value.keyword;
    if (filters.value.status) query.status = filters.value.status;
    if (filters.value.minPrice) query.minPrice = filters.value.minPrice;
    if (filters.value.maxPrice) query.maxPrice = filters.value.maxPrice;

    const res = await $fetch<any>(`${apiBase}/api/vehicle`, {
      method: "GET",
      query,
      headers: getAuthHeader(),
    });

    if (Array.isArray(res)) {
      vehicles.value = res;
    } else if (Array.isArray(res.data)) {
      vehicles.value = res.data;
    } else if (Array.isArray(res.items)) {
      vehicles.value = res.items;
    } else {
      vehicles.value = [];
    }
  } catch (e: any) {
    console.error("loadVehicles error:", e);
    error.value =
      e?.data?.message || e?.message || "Không tải được danh sách xe";
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = {
    keyword: "",
    status: "",
    minPrice: null,
    maxPrice: null,
  };
  loadVehicles();
}

// ====== MODAL ACTIONS ======
function openCreateModal() {
  editMode.value = false;
  formError.value = null;
  formLoading.value = false;
  form.value = {
    id: null,
    name: "",
    model_code: "",
    variant: "",
    base_price_vnd: null,
    color: "",
    battery_capacity_kwh: null,
    status: "draft",
    description: "",
  };
  imageFiles.value = [];
  showModal.value = true;
}

function openEditModal(vehicle: any) {
  editMode.value = true;
  formError.value = null;
  formLoading.value = false;
  form.value = {
    id: vehicle.id,
    name: vehicle.name || vehicle.model_name || "",
    model_code: vehicle.model_code || vehicle.code || "",
    variant: vehicle.variant || vehicle.version || "",
    base_price_vnd: vehicle.base_price_vnd || vehicle.price_vnd || null,
    color: vehicle.color || vehicle.colors || "",
    battery_capacity_kwh: vehicle.battery_capacity_kwh || null,
    status: vehicle.status || "draft",
    description: vehicle.description || "",
  };
  imageFiles.value = []; // edit tạm thời không load lại file cũ
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function onFilesChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    imageFiles.value = Array.from(target.files);
  }
}

async function submitForm() {
  formError.value = null;

  if (!form.value.name) {
    formError.value = "Tên mẫu xe là bắt buộc";
    return;
  }

  if (!process.client) return;

  try {
    formLoading.value = true;

    const fd = new FormData();

    // body.vehicle (gateway yêu cầu body.vehicle là JSON string)
    const vehiclePayload: any = {
      name: form.value.name,
      model_code: form.value.model_code,
      variant: form.value.variant,
      base_price_vnd: form.value.base_price_vnd,
      color: form.value.color,
      battery_capacity_kwh: form.value.battery_capacity_kwh,
      status: form.value.status,
      description: form.value.description,
    };

    fd.append("vehicle", JSON.stringify(vehiclePayload));

    // Ảnh
    if (imageFiles.value.length) {
      imageFiles.value.forEach((f) => fd.append("images", f));
    }

    const headers = getAuthHeader();

    if (editMode.value && form.value.id) {
      // UPDATE
      await $fetch(`${apiBase}/api/vehicle/${form.value.id}`, {
        method: "PUT",
        body: fd,
        headers,
      });
    } else {
      // CREATE
      await $fetch(`${apiBase}/api/vehicle`, {
        method: "POST",
        body: fd,
        headers,
      });
    }

    closeModal();
    await loadVehicles();
  } catch (e: any) {
    console.error("submitForm error:", e);
    formError.value = e?.data?.message || e?.message || "Lưu mẫu xe thất bại";
  } finally {
    formLoading.value = false;
  }
}

// ====== DELETE ======
function confirmDelete(vehicle: any) {
  deleteTarget.value = vehicle;
}

async function performDelete() {
  if (!deleteTarget.value) return;

  try {
    deleteLoading.value = true;
    await $fetch(`${apiBase}/api/vehicle/${deleteTarget.value.id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    deleteTarget.value = null;
    await loadVehicles();
  } catch (e: any) {
    console.error("delete error:", e);
    alert(e?.data?.message || e?.message || "Xóa mẫu xe thất bại");
  } finally {
    deleteLoading.value = false;
  }
}

// ====== LIFECYCLE ======
onMounted(() => {
  loadVehicles();
});
</script>

<style scoped>
.page-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-card {
  background: #111827;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #1f2937;
}

.header-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.content-description {
  font-size: 14px;
  color: #9ca3af;
}

.filters-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.table-header h3 {
  font-size: 16px;
  font-weight: 500;
}

.table-meta {
  font-size: 13px;
  color: #9ca3af;
}

/* Inputs & buttons */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.form-group-full {
  grid-column: 1 / -1;
}

.input {
  border-radius: 8px;
  border: 1px solid #374151;
  background: #030712;
  padding: 8px 10px;
  font-size: 14px;
  color: #e5e7eb;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
}

.textarea {
  resize: vertical;
}

.btn {
  border-radius: 999px;
  border: 1px solid #374151;
  padding: 8px 14px;
  font-size: 14px;
  background: #111827;
  color: #e5e7eb;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled,
.btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 13px;
}

.btn-danger {
  background: #b91c1c;
  border-color: #b91c1c;
}

/* Table */
.table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead tr {
  background: #020617;
}

.table th,
.table td {
  padding: 8px 10px;
  border-bottom: 1px solid #1f2937;
  text-align: left;
}

.table th {
  font-weight: 500;
  color: #9ca3af;
  font-size: 13px;
}

.table tbody tr:hover {
  background: #020617;
}

.empty-cell {
  text-align: center;
  padding: 20px 10px;
  color: #6b7280;
}

.vehicle-name-cell {
  display: flex;
  flex-direction: column;
}

.vehicle-main {
  font-weight: 500;
}

.vehicle-sub {
  font-size: 12px;
  color: #9ca3af;
}

.status-pill {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status-active {
  background: rgba(22, 163, 74, 0.15);
  color: #22c55e;
}

.status-inactive {
  background: rgba(148, 163, 184, 0.15);
  color: #e5e7eb;
}

.status-draft {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
}

.actions {
  display: flex;
  gap: 6px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: #020617;
  border-radius: 12px;
  border: 1px solid #1f2937;
  padding: 16px 18px 14px;
  width: 720px;
  max-width: calc(100% - 24px);
  max-height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.modal.small {
  width: 380px;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

/* Alert & loading */
.alert {
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  margin-bottom: 8px;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #f87171;
  color: #fecaca;
}

.loading {
  padding: 12px 10px;
  font-size: 14px;
  color: #9ca3af;
}

/* Files */
.file-chips {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.file-chip {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #0f172a;
  border: 1px solid #1f2937;
}

/* Responsive */
@media (max-width: 900px) {
  .filters-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .header-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
