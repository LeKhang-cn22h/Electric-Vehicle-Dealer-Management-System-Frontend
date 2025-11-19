<template>
    <BaseListPage
        title="Danh sách khuyến mãi"
        :icon="TicketPercent"
        create-link="/user/promotions/create"
        create-label="Tạo khuyến mãi mới"
        :fields-name="fieldsName"
        :table-component="OrderTable"
        :data="promotions"
        :filter-function="filterPromotions"
    >
        <!-- Toolbar -->
        <template #toolbar>
            <OrderToolbar
                :search-query="filters.searchQuery"
                :active-filter="filters.isActive"
                @update:search-query="filters.searchQuery = $event"
                @update:active-filter="filters.isActive = $event"
            />
        </template>

        <!-- Custom Columns -->
        <template #discount="{ row }">
            <span v-if="row.discountType === 'percent'"> {{ row.discountValue }}% </span>
            <span v-else>
                {{ formatCurrency(row.discountValue) }}
            </span>
        </template>

        <template #dateRange="{ row }">
            {{ formatDate(row.startDate) }} -
            <span v-if="row.endDate">{{ formatDate(row.endDate) }}</span>
            <span v-else>Không giới hạn</span>
        </template>

        <template #isActive="{ row }">
            <OrderStatusBadge :is-active="row.isActive" />
        </template>
    </BaseListPage>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import BaseListPage from "@/components/shared/BaseListPage.vue";
import { TicketPercent } from "lucide-vue-next";
import { formatCurrency, formatDate } from "@/utils/format";
import OrderTable from "~/components/orders/OrderTable.vue";
import OrderToolbar from "~/components/orders/OrderToolbar.vue";
import OrderStatusBadge from "~/components/orders/OrderStatusBadge.vue";

definePageMeta({
    layout: false,
});

const filters = reactive({
    searchQuery: "",
    isActive: "",
});

// Cấu hình cột
const fieldsName = [
    { label: "Mã KM", key: "code" },
    { label: "Loại giảm", key: "discount" },
    { label: "Mô tả", key: "description" },
    { label: "Điều kiện tối thiểu", key: "conditions" },
    { label: "Khoảng thời gian", key: "dateRange" },
    { label: "Trạng thái", key: "isActive" },
    { label: "Thao tác", key: "actions" },
];

// Dữ liệu mẫu
const promotions = [
    {
        id: "1",
        code: "SUMMER10",
        description: "Giảm giá mùa hè",
        discountType: "percent",
        discountValue: 10,
        minOrderValue: 2000000,
        startDate: "2024-09-01",
        endDate: "2024-10-01",
        isActive: true,
    },
    {
        id: "2",
        code: "VOUCHER300K",
        description: "Giảm 300.000đ cho đơn từ 5 triệu",
        discountType: "amount",
        discountValue: 300000,
        minOrderValue: 5000000,
        startDate: "2024-09-01",
        endDate: null,
        isActive: false,
    },
];

// Filter danh sách
const filterPromotions = (item: any) => {
    const query = filters.searchQuery.toLowerCase();
    const matchesSearch =
        !query || item.code.toLowerCase().includes(query) || (item.description || "").toLowerCase().includes(query);

    const matchesActive = filters.isActive === "" || String(item.isActive) === filters.isActive;

    return matchesSearch && matchesActive;
};
</script>
