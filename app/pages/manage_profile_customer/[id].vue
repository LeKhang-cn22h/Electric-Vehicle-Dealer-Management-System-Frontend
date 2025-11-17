<template>
  <div class="p-6 max-w-4xl mx-auto">

    <!-- Quay lại -->
    <button @click="goBack" class="mb-6 text-blue-500 hover:underline flex items-center">
      ← Quay lại danh sách
    </button>

    <!-- Header + Nút hiển thị/ẩn Activity Log -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Chi tiết khách hàng</h1>

      <button
        @click="showActivity = !showActivity"
        class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        {{ showActivity ? 'Ẩn nhật ký hoạt động' : 'Hiển thị nhật ký hoạt động' }}
      </button>
    </div>

    <!-- Activity Log -->
    <ActivityLog v-if="showActivity" :logs="activityLogs" class="mb-6" />

    <!-- Nút Edit / Lưu / Hủy / Khóa -->
    <div class="flex gap-3 mb-6">
      <!-- Nút khóa/mở -->
      <button
        class="px-4 py-2 rounded text-white"
        :class="customer.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
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
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Lưu
      </button>

      <!-- Hủy -->
      <button 
        v-if="isEditing"
        @click="cancelEdit"
        class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
        <input v-else v-model="customer.name" class="border p-2 w-full rounded" />
      </div>

      <!-- Email -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Email</h2>
        <p v-if="!isEditing">{{ customer.email }}</p>
        <input v-else v-model="customer.email" class="border p-2 w-full rounded" />
      </div>

      <!-- SĐT -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Số điện thoại</h2>
        <p v-if="!isEditing">{{ customer.phone }}</p>
        <input v-else v-model="customer.phone" class="border p-2 w-full rounded" />
      </div>

      <!-- Địa chỉ -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Địa chỉ</h2>
        <p v-if="!isEditing">{{ customer.address }}</p>
        <input v-else v-model="customer.address" class="border p-2 w-full rounded" />
      </div>

      <!-- Trạng thái -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Trạng thái</h2>

        <p v-if="!isEditing" :class="customer.status ? 'text-green-600' : 'text-red-600'">
          {{ customer.status ? 'Hoạt động' : 'Ngừng hoạt động' }}
        </p>

        <select v-else v-model="customer.status" class="border p-2 w-full rounded">
          <option :value="true">Hoạt động</option>
          <option :value="false">Ngừng hoạt động</option>
        </select>
      </div>

      <!-- Ngày tạo -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Ngày tạo tài khoản</h2>
        <p v-if="!isEditing">{{ customer.createdAt }}</p>
        <input v-else type="date" v-model="customer.createdAt" class="border p-2 w-full rounded" />
      </div>

      <!-- Ngày sinh -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Ngày sinh</h2>
        <p v-if="!isEditing">{{ customer.birthDate }}</p>
        <input v-else type="date" v-model="customer.birthDate" class="border p-2 w-full rounded" />
      </div>

      <!-- Giới tính -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Giới tính</h2>
        <p v-if="!isEditing">{{ customer.gender }}</p>
        <select v-else v-model="customer.gender" class="border p-2 w-full rounded">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

    </div>

    <!-- Popup xác nhận khóa/mở -->
    <div 
      v-if="showConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-80">
        <h2 class="text-lg font-bold mb-3">Xác nhận</h2>
        <p class="mb-4">
          Bạn có chắc chắn muốn 
          <b>{{ customer.status ? 'khóa' : 'mở khóa' }}</b> khách hàng này không?
        </p>

        <div class="flex justify-end gap-3">
          <button @click="showConfirm = false" class="px-4 py-2 rounded bg-gray-300">Hủy</button>
          <button 
            @click="toggleStatus" 
            class="px-4 py-2 rounded text-white"
            :class="customer.status ? 'bg-red-500' : 'bg-green-500'"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ActivityLog from '~/components/manage-profile-customer/ActivityLog.vue'

// Router
const route = useRoute()
const router = useRouter()
const customerId = route.params.id

// Dữ liệu demo
const customer = ref({
  id: customerId,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0909123456',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  status: true, // TRUE = hoạt động | FALSE = ngừng hoạt động
  createdAt: '2023-01-15',
  birthDate: '1990-05-20',
  gender: 'Nam',
})

// Quay lại
const goBack = () => router.push('/manage_profile_customer')

// ======================
// Chế độ chỉnh sửa
// ======================
const isEditing = ref(false)
const backup = ref({ ...customer.value })

const startEdit = () => {
  backup.value = { ...customer.value }
  isEditing.value = true
}

const cancelEdit = () => {
  customer.value = { ...backup.value }
  isEditing.value = false
}

const saveEdit = () => {
  console.log("Lưu dữ liệu:", customer.value)
  isEditing.value = false
}

// ======================
// Khóa / Mở khóa
// ======================
const showConfirm = ref(false)

const confirmToggleStatus = () => {
  showConfirm.value = true
}

const toggleStatus = () => {
  customer.value.status = !customer.value.status
  showConfirm.value = false
  console.log("Trạng thái mới:", customer.value.status)
}

// ======================
// Activity Log
// ======================
const showActivity = ref(false)

const activityLogs = ref([
  {
    action: "Chỉnh sửa thông tin khách hàng",
    user: "Admin",
    time: "2025-11-15T10:22:00",
    description: "Cập nhật số điện thoại và địa chỉ."
  },
  {
    action: "Khóa hồ sơ",
    user: "Quản lý",
    time: "2025-11-10T08:12:00",
    description: "Khách hàng yêu cầu tạm khóa."
  },
  {
    action: "Tạo hồ sơ",
    user: "Admin",
    time: "2025-11-01T14:55:00"
  }
])
</script>
