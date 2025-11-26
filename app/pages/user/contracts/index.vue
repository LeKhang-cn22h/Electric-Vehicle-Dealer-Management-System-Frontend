<template>
    <BaseListPage
        title="Danh sách hợp đồng"
        :icon="ScrollText"
        create-link="/user/contracts/create"
        create-label="Tạo hợp đồng mới"
        :fields-name="fieldsName"
        :table-component="OrderTable"
        :data="contracts"
        :show-toolbar="true"
        :filter-function="filteredContracts"
        :isActiveBtnCreate="false"
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
        <template #createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>

        <template #dealerId="{ row }">{{ row.dealerId }}</template>

        <template #totalAmount="{ row }">{{ formatCurrency(row.total_amount) }}</template>
        <template #orderId="{ row }">{{ row.orderId }}</template>
    </BaseListPage>
</template>

<script setup lang="ts">
import OrderToolbar from "@/components/orders/OrderToolbar.vue";
import OrderTable from "@/components/orders/OrderTable.vue";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge.vue";
import { formatCurrency, formatDate } from "@/utils/format";
import { ScrollText } from "lucide-vue-next";
import BaseListPage from "~/components/shared/BaseListPage.vue";

definePageMeta({
    layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

const filters = reactive({
    searchQuery: "",
    status: "",
    dateFrom: "",
    dateTo: "",
});

const fieldsName = [
    { label: "Mã hợp đồng", key: "contractNumber" },
    { label: "Mã đơn hàng", key: "orderId" },
    { label: "Người tạo", key: "dealerId" },
    { label: "Tổng tiền", key: "contractValue" },
    { label: "Ngày tạo", key: "createdAt" },
    { label: "Thao tác", key: "actions" },
];

const { loading, error, contracts, fetchAll } = useContract();

const filteredContracts = (order: any) => {
    const query = filters.searchQuery.toLowerCase();
    const matchesSearch =
        !query || order.customerName.toLowerCase().includes(query) || order.orderCode.toLowerCase().includes(query);
    const matchesStatus = !filters.status || order.status === filters.status;
    return matchesSearch && matchesStatus;
};

const handlePrint = (order: any) => {
    console.log("In hóa đơn:", order);
};

watch(
    () => contracts.value,
    () => {
        console.log("contracts ", contracts.value);
    }
);

onMounted(async () => {
    console.log(localStorage.getItem("user_id"));
    await fetchAll();
});
</script>
