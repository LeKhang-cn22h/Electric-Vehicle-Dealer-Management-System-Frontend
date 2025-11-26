<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Danh sách khách hàng</h1>

    <div class="mb-4">
      <button
        @click="goToCreate"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tạo hồ sơ
      </button>
    </div>

    <CustomerFilter :onFilter="handleFilter" />

    <!-- Dùng filteredCustomers thay vì customers -->
    <CustomerTable :customers="filteredCustomers" />

    <div v-if="loading" class="mt-4">Đang tải dữ liệu...</div>
    <div v-if="error" class="mt-4 text-red-500">Lỗi: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomer } from '~/composables/useCustomer'
import CustomerTable from '~/components/manage-profile-customer/CustomerTable.vue'
import CustomerFilter from '~/components/manage-profile-customer/CustomerFilter.vue'

const router = useRouter()
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
const goToCreate = () => {
  router.push('/manage_profile_customer/CreateCustomer')
}

const { customers, loading, error, fetchAll } = useCustomer()

// Lưu filters
const activeFilters = ref<Record<string, any>>({})

// Tạo danh sách customers đã lọc
const filteredCustomers = computed(() => {
  if (!Array.isArray(customers.value)) return []
  
  let result = customers.value
  
  // Lọc theo tên
  if (activeFilters.value.name) {
    const searchName = activeFilters.value.name.toLowerCase()
    result = result.filter((c: any) =>
      String(c.name ?? '').toLowerCase().includes(searchName)
    )
  }
  
  // Thêm các filter khác nếu cần
  // Ví dụ: lọc theo email
  if (activeFilters.value.email) {
    const searchEmail = activeFilters.value.email.toLowerCase()
    result = result.filter((c: any) =>
      String(c.email ?? '').toLowerCase().includes(searchEmail)
    )
  }
  
  // Lọc theo phone
  if (activeFilters.value.phone) {
    result = result.filter((c: any) =>
      String(c.phone ?? '').includes(activeFilters.value.phone)
    )
  }
  
  return result
})

// Xử lý filter - CHỈ lưu filters, không fetch lại
const handleFilter = (filters: Record<string, any>) => {
  activeFilters.value = filters
}

onMounted(() => {
  fetchAll() // Load dữ liệu ban đầu
})
</script>
