<template>
    <BaseListPage
        title="Danh sách báo giá"
        :icon="ScrollText"
        create-link="/user/quotations/create"
        create-label="Tạo báo giá mới"
        :fields-name="fieldsName"
        :table-component="OrderTable"
        :data="quotes"
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
        <template #orderDate="{ row }">{{ formatDate(row.orderDate) }}</template>
        <template #totalAmount="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
        <template #status="{ row }">
            <OrderStatusBadge :status="row.status" />
        </template>
        <template #quantity="{ row }"> x{{ row.quantity }} </template>
    </BaseListPage>
</template>

<script setup lang="ts">
import BaseListPage from "@/components/shared/BaseListPage.vue";
import OrderTable from "@/components/orders/OrderTable.vue";
import OrderToolbar from "@/components/orders/OrderToolbar.vue";
import { ScrollText } from "lucide-vue-next";
import { reactive } from "vue";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge.vue";
import { formatCurrency, formatDate } from "@/utils/format";

const filters = reactive({
    searchQuery: "",
    status: "",
});
const fieldsName = [
    { label: "Mã đơn hàng", key: "orderCode" },
    { label: "Khách hàng", key: "customerName" },
    { label: "Sản phẩm", key: "productName" },
    { label: "Số lượng", key: "quantity" },
    { label: "Ngày đặt", key: "orderDate" },
    { label: "Tổng tiền", key: "totalAmount" },
    { label: "Trạng thái", key: "status" },
    { label: "Thao tác", key: "actions" },
];
const quotes = [
    {
        id: 19,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 20,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 21,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
];

const filterQuotes = (order: any) => {
    const query = filters.searchQuery.toLowerCase();
    const matchesSearch =
        !query || order.customerName.toLowerCase().includes(query) || order.orderCode.toLowerCase().includes(query);
    const matchesStatus = !filters.status || order.status === filters.status;
    return matchesSearch && matchesStatus;
};

const handlePrint = (order: any) => {
    console.log("In đơn hàng:", order);
};
</script>
