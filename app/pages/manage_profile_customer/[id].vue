<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Quay lại -->
    <button @click="goBack" class="mb-6 text-blue-500 hover:underline flex items-center">
      ← Quay lại danh sách
    </button>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Chi tiết khách hàng</h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Chỉnh sửa</button>
    </div>

    <!-- Thông tin cơ bản -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Tên</h2>
        <p>{{ customer.name }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Email</h2>
        <p>{{ customer.email }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Số điện thoại</h2>
        <p>{{ customer.phone }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Địa chỉ</h2>
        <p>{{ customer.address }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Trạng thái</h2>
        <p :class="customer.status === 'Hoạt động' ? 'text-green-600' : 'text-red-600'">
          {{ customer.status }}
        </p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Ngày tạo tài khoản</h2>
        <p>{{ customer.createdAt }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Ngày sinh</h2>
        <p>{{ customer.birthDate }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Giới tính</h2>
        <p>{{ customer.gender }}</p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Điểm tích lũy</h2>
        <p>{{ customer.points }} điểm</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Router
const route = useRoute()
const router = useRouter()
const customerId = route.params.id

// Dữ liệu giả
const customer = ref({
  id: customerId,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0909123456',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  status: 'Hoạt động',
  createdAt: '2023-01-15',
  birthDate: '1990-05-20',
  gender: 'Nam',
  points: 1200,
  
})

// Quay lại danh sách
const goBack = () => router.push('/manage_profile_customer')

// Filter hiển thị tiền
const currency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>
