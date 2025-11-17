<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border border-gray-200 rounded-md divide-y divide-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tên</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Số điện thoại</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Thao tác</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="customer in customers"
          :key="customer.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-2 text-sm text-gray-600">{{ customer.id }}</td>
          <td class="px-4 py-2 text-sm text-gray-800">{{ customer.name }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ customer.email }}</td>
          <td class="px-4 py-2 text-sm text-gray-600">{{ customer.phone }}</td>
          <td class="px-4 py-2 text-sm">
            <!-- Dùng router để chuyển hướng -->
            <button
              @click="goToDetail(customer.id)"
              class="text-blue-500 hover:underline"
            >
              Chi tiết
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  customers: any[]
}>()

const router = useRouter()

const goToDetail = (id: string | number) => {
  router.push(`/manage_profile_customer/${id}`)
}
</script>
