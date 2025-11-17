<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Danh sách khách hàng</h1>

    <!-- Nút tạo khách hàng -->
    <div class="mb-4">
      <button
        @click="goToCreate"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tạo hồ sơ
      </button>
    </div>

    <!-- Search & Filter -->
    <CustomerFilter :onFilter="handleFilter" />

    <!-- Table -->
    <CustomerTable :customers="customers" />

    <!-- Loading -->
    <div v-if="loading" class="mt-4">Đang tải dữ liệu...</div>

    <!-- Error -->
    <div v-if="error" class="mt-4 text-red-500">
      Lỗi: {{ error }}
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '~/composables/useCustomers'
import CustomerTable from '~/components/manage-profile-customer/CustomerTable.vue'
import CustomerFilter from '~/components/manage-profile-customer/CustomerFilter.vue'
import CreateCustomer from './CreateCustomer.vue'

const router = useRouter()

// 👉 Hàm chuyển trang
const goToCreate = () => {
  router.push('/manage_profile_customer/CreateCustomer')
}

const { customers, loading, error, fetchCustomers } = useCustomers()

onMounted(() => {
  fetchCustomers() // load mặc định
})

const handleFilter = (filters: any) => {
  fetchCustomers(filters)
}
</script>
