<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>

    <button
      @click="goToCreate"
      class="px-4 py-2 bg-blue-600 text-white rounded mb-4"
    >
      Tạo sản phẩm
    </button>

    <ProductFilter @filter="handleFilter" />

    <ProductTable :vehicles="vehicles" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "#app"

import ProductTable from "~/components/manage_product/ProductTable.vue"
import ProductFilter from "~/components/manage_product/ProductFilter.vue"
import { useVehicles } from "~/composables/useProducts"

// router
const router = useRouter()

const goToCreate = () => {
  router.push("/manage_product/CreateProduct")
}

// composable lấy xe
const { vehicles, loading, error, fetchVehicles } = useVehicles()

onMounted(() => {
  fetchVehicles() // tải mặc định
})

const handleFilter = (filters: any) => {
  fetchVehicles(filters)
}
</script>
