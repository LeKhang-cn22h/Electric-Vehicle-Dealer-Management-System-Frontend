<template>
  <BaseListPage
    title="Danh sách báo giá"
    :icon="ScrollText"
    create-link="/user/quotations/create"
    create-label="Tạo báo giá mới"
    :fields-name="fieldsName"
    :table-component="OrderTable"
    :data="quotationsByCreator"
    :show-toolbar="true"
    :filter-function="filterQuotes"
    @print="handlePrint"
  >
    <template #toolbar>
      <OrderToolbar
        :search-query="filters.searchQuery"
        :status-filter="filters.status"
        @update:search-query="filters.searchQuery = $event"
        @update:status-filter="filters.status = $event"
      />
    </template>

    <!-- custom cột trong bảng -->
    <template #createdAt="{ row }">
      {{ formatDate(row.createdAt) }}
    </template>

    <template #totalAmount="{ row }">
      {{ formatCurrency(row.totalAmount) }}
    </template>

    <template #customerName="{ row }">
      {{ row.customer.name }}
    </template>

    <template #status="{ row }">
      <OrderStatusBadge :status="row.status" />
    </template>
  </BaseListPage>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from "vue";
import { ScrollText } from "lucide-vue-next";

import BaseListPage from "@/components/shared/BaseListPage.vue";
import OrderTable from "@/components/orders/OrderTable.vue";
import OrderToolbar from "@/components/orders/OrderToolbar.vue";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge.vue";

import { formatCurrency, formatDate } from "@/utils/format";
import { useRoleBasedLayout } from "@/composables/useRoleBasedLayout";

definePageMeta({
  layout: "dealer-manager-layout",
});

// Layout theo role
const { applyLayout } = useRoleBasedLayout();
applyLayout();

// Lấy data báo giá
const { quotationsByCreator, fetchAllByCreator } = useQuotations();

// userId phải dùng ref + chỉ đọc localStorage ở client
const userId = ref<string | null>(null);

watch(
  () => quotationsByCreator.value,
  (val) => {
    console.log("quotationsByCreator", val);
  }
);

const filters = reactive({
  searchQuery: "",
  status: "",
});

const fieldsName = [
  { label: "Mã báo giá", key: "id" },
  { label: "Khách hàng", key: "customerName" },
  { label: "Người tạo", key: "createdBy" },
  { label: "Ngày tạo", key: "createdAt" },
  { label: "Tổng tiền", key: "totalAmount" },
  { label: "Trạng thái", key: "status" },
  { label: "Thao tác", key: "actions" },
];

const filterQuotes = (order: any) => {
  const query = filters.searchQuery.toLowerCase();

  const matchesSearch =
    !query ||
    order.customerName.toLowerCase().includes(query) ||
    order.orderCode.toLowerCase().includes(query);

  const matchesStatus = !filters.status || order.status === filters.status;

  return matchesSearch && matchesStatus;
};

const handlePrint = (order: any) => {
  console.log("In đơn hàng:", order);
};

onMounted(async () => {
  if (process.client) {
    userId.value = localStorage.getItem("user_id");
    console.log("user id:", userId.value);

    if (userId.value) {
      await fetchAllByCreator(userId.value);
    }
  }
});
</script>
