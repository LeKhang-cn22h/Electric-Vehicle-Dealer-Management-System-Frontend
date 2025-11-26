<template>
  <div class="p-6 max-w-4xl mx-auto">

    <!-- Quay lại -->
    <button @click="goBack" class="mb-6 text-blue-500 hover:underline flex items-center">
      ← Quay lại danh sách
    </button>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Validation Errors Display -->
    <div v-if="Object.keys(validationErrors).length > 0" class="bg-red-50 border border-red-200 rounded p-4 mb-4">
      <h3 class="font-semibold text-red-700 mb-2"> Lỗi xác thực:</h3>
      <ul class="list-disc list-inside text-red-600 space-y-1">
        <li v-for="(msg, field) in validationErrors" :key="field">
          <strong>{{ getFieldLabel(field) }}:</strong> {{ msg }}
        </li>
      </ul>
    </div>

    <!-- Content -->
    <div v-if="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Chi tiết khách hàng</h1>
      </div>

      <!-- Nút Edit -->
      <div class="flex gap-3 mb-6">
        <!-- Nút khóa/mở -->
        <button
          class="px-4 py-2 rounded text-white"
          :class="customer.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
          :disabled="loading"
          @click="confirmToggleStatus"
        >
          {{ customer.status ? 'Khóa' : 'Mở khóa' }}
        </button>

        <!-- Nút chỉnh sửa -->
        <button 
          v-if="!isEditing"
          @click="startEdit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Chỉnh sửa
        </button>

        <!-- Lưu -->
        <button 
          v-if="isEditing"
          @click="saveEdit"
          :disabled="loading"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Đang lưu...' : 'Lưu' }}
        </button>

        <!-- Hủy -->
        <button 
          v-if="isEditing"
          @click="cancelEdit"
          :disabled="loading"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      <!-- Thông tin khách hàng -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <!-- Tên -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Tên</h2>
          <p v-if="!isEditing">{{ customer.name }}</p>
          <div v-else>
            <input 
              v-model="editForm.name" 
              class="border p-2 w-full rounded"
              :class="{ 'border-red-500': validationErrors.name }"
            />
            <p v-if="validationErrors.name" class="text-red-500 text-sm mt-1">
              {{ validationErrors.name }}
            </p>
          </div>
        </div>

        <!-- Email -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Email</h2>
          <p v-if="!isEditing">{{ customer.email || 'N/A' }}</p>
          <div v-else>
            <input 
              v-model="editForm.email" 
              type="email"
              class="border p-2 w-full rounded"
              :class="{ 'border-red-500': validationErrors.email }"
            />
            <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
              {{ validationErrors.email }}
            </p>
          </div>
        </div>

        <!-- SĐT -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Số điện thoại</h2>
          <p v-if="!isEditing">{{ customer.phone }}</p>
          <div v-else>
            <input 
              v-model="editForm.phone" 
              class="border p-2 w-full rounded"
              :class="{ 'border-red-500': validationErrors.phone }"
              placeholder="10-11 chữ số"
            />
            <p v-if="validationErrors.phone" class="text-red-500 text-sm mt-1">
              {{ validationErrors.phone }}
            </p>
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Địa chỉ</h2>
          <p v-if="!isEditing">{{ customer.adress || 'N/A' }}</p>
          <div v-else>
            <input 
              v-model="editForm.adress" 
              class="border p-2 w-full rounded"
              :class="{ 'border-red-500': validationErrors.adress }"
            />
            <p v-if="validationErrors.adress" class="text-red-500 text-sm mt-1">
              {{ validationErrors.adress }}
            </p>
          </div>
        </div>

        <!-- Trạng thái -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Trạng thái</h2>
          <p v-if="!isEditing" :class="customer.status ? 'text-green-600' : 'text-red-600'">
            {{ customer.status ? 'Hoạt động' : 'Ngừng hoạt động' }}
          </p>
          <select v-else v-model="editForm.status" class="border p-2 w-full rounded">
            <option :value="true">Hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
        </div>

        <!-- Ngày tạo -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Ngày tạo tài khoản</h2>
          <p>{{ formatDate(customer.created_at) }}</p>
        </div>

        <!-- Ngày sinh -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Ngày sinh</h2>
          <p v-if="!isEditing">{{ customer.birth_day || 'N/A' }}</p>
          <div v-else>
            <input 
              v-model="editForm.birth_day" 
              type="date"
              class="border p-2 w-full rounded"
              :class="{ 'border-red-500': validationErrors.birth_day }"
            />
            <p v-if="validationErrors.birth_day" class="text-red-500 text-sm mt-1">
              {{ validationErrors.birth_day }}
            </p>
          </div>
        </div>

        <!-- Giới tính -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-semibold mb-2">Giới tính</h2>
          <p v-if="!isEditing">{{ customer.gender || 'N/A' }}</p>
          <div v-else>
            <select 
              v-model="editForm.gender" 
              class="border p-2 w-full rounded"
              :class="{ 'border-red-500': validationErrors.gender }"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <p v-if="validationErrors.gender" class="text-red-500 text-sm mt-1">
              {{ validationErrors.gender }}
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Popup xác nhận khóa/mở -->
    <div 
      v-if="showConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-80">
        <h2 class="text-lg font-bold mb-3">Xác nhận</h2>
        <p class="mb-4">
          Bạn có chắc chắn muốn 
          <b>{{ customer.status ? 'khóa' : 'mở khóa' }}</b> khách hàng này không?
        </p>

        <div class="flex justify-end gap-3">
          <button 
            @click="showConfirm = false" 
            :disabled="loading"
            class="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
          >
            Hủy
          </button>
          <button 
            @click="toggleStatus" 
            :disabled="loading"
            class="px-4 py-2 rounded text-white disabled:opacity-50"
            :class="customer.status ? 'bg-red-500' : 'bg-green-500'"
          >
            {{ loading ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomer } from '~/composables/useCustomer'
import type { Customer } from '~/types/profile'

const route = useRoute()
const router = useRouter()
const customerId = route.params.id as string

const { 
  customer, 
  loading, 
  error, 
  validationErrors,
  fetchOne, 
  update,
  updateStatus,
  clearValidationErrors
} = useCustomer()

const goBack = () => router.push('/manage_profile_customer')

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    'name': 'Tên',
    'email': 'Email',
    'phone': 'Số điện thoại',
    'adress': 'Địa chỉ',
    'birth_day': 'Ngày sinh',
    'gender': 'Giới tính',
    'status': 'Trạng thái',
  }
  return labels[field] || field
}

// ======================
// Chế độ chỉnh sửa
// ======================
const isEditing = ref(false)
const editForm = ref<Partial<Customer>>({})

const startEdit = () => {
  clearValidationErrors()
  
  editForm.value = {
    name: customer.value.name,
    email: customer.value.email,
    phone: customer.value.phone,
    adress: customer.value.adress,
    birth_day: customer.value.birth_day,
    gender: customer.value.gender,
    status: customer.value.status,
  }
  isEditing.value = true
}

const cancelEdit = () => {
  editForm.value = {}
  clearValidationErrors()
  isEditing.value = false
}

const saveEdit = async () => {
  try {
    const updateData: Partial<Customer> = {}
    
    if (editForm.value.name !== undefined) updateData.name = editForm.value.name
    if (editForm.value.email !== undefined) updateData.email = editForm.value.email
    if (editForm.value.phone !== undefined) updateData.phone = editForm.value.phone
    if (editForm.value.adress !== undefined) updateData.adress = editForm.value.adress
    if (editForm.value.birth_day !== undefined) updateData.birth_day = editForm.value.birth_day
    if (editForm.value.gender !== undefined) updateData.gender = editForm.value.gender
    if (editForm.value.status !== undefined) updateData.status = editForm.value.status

    console.log(" Dữ liệu gửi lên:", updateData)
    
    await update(customer.value.id, updateData)
    
    console.log(" Lưu thành công!")
    
    //  Fetch lại dữ liệu từ server
    await fetchOne(customerId)
    
    isEditing.value = false
    alert("Cập nhật thành công!")
  } catch (e: any) {
    console.error(" Lỗi khi lưu:", e)
    if (!Object.keys(validationErrors.value).length) {
      alert("Có lỗi xảy ra khi lưu dữ liệu: " + (e.message || "Unknown error"))
    }
  }
}

// ======================
// Khóa / Mở khóa
// ======================
const showConfirm = ref(false)

const confirmToggleStatus = () => {
  clearValidationErrors()
  showConfirm.value = true
}

const toggleStatus = async () => {
  try {
    const newStatus = !customer.value.status
    
    await updateStatus(customer.value.id, newStatus)
    
    //  Fetch lại dữ liệu từ server
    await fetchOne(customerId)
    
    showConfirm.value = false
    console.log(" Trạng thái đã cập nhật:", customer.value.status)
    alert("Cập nhật trạng thái thành công!")
  } catch (e: any) {
    console.error(" Lỗi khi thay đổi trạng thái:", e)
    showConfirm.value = false
    alert("Có lỗi xảy ra: " + (e.message || "Unknown error"))
  }
}

onMounted(() => {
  fetchOne(customerId)
})
</script>