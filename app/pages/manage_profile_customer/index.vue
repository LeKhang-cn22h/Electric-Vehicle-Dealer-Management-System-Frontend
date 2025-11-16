<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Danh sách khách hàng</h1>

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
import { useCustomers } from '~/composables/useCustomers'
import CustomerTable from '~/components/manage-profile-customer/CustomerTable.vue'
import CustomerFilter from '~/components/manage-profile-customer/CustomerFilter.vue'

const { customers, loading, error, fetchCustomers } = useCustomers()

onMounted(() => {
  fetchCustomers() // load mặc định khi vào page
})

const handleFilter = (filters: any) => {
  fetchCustomers(filters)
}
</script>
