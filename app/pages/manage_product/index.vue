<template>
  <div class="p-6">
  <h1 class="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>

  <div class="flex gap-4 mb-4">
    <button
      @click="goToCreate"
      class="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Tạo sản phẩm
    </button>
    <button
      @click="goToSS"
      class="px-4 py-2 bg-blue-600 text-white rounded"
    >
      So sánh
    </button>
  </div>

  <ProductFilter @filter="handleFilter" />

  <ProductTable :vehicles="vehicles" />
</div>

</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "#app"

import ProductTable from "~/components/manage_product/ProductTable.vue"
import ProductFilter from "~/components/manage_product/ProductFilter.vue"
import { useVehicle } from "~/composables/useVehicle"
// router
const router = useRouter()

const goToCreate = () => {
  router.push("/manage_product/CreateProduct")
}
const goToSS = () => {
  router.push("/product")
}

// composable lấy xe
const { vehicles, loading, error, fetchAll } = useVehicle()

onMounted(() => {
  fetchAll() // tải mặc định
})

const handleFilter = (filters: any) => {
  fetchAll(filters)
}
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
</script>
