<template>
    <BaseListPage
        title="Danh sách đơn hàng"
        :icon="ScrollText"
        create-link="/user/orders/create"
        create-label="Tạo đơn hàng mới"
        :fields-name="fieldsName"
        :table-component="OrderTable"
        :data="orders"
        :show-toolbar="true"
        :filter-function="filteredOrders"
        :isActiveBtnCreate="false"
        @print="handlePrint"
    >
        <template #toolbar>
            <OrderToolbar
                :search-query="filters.searchQuery"
                :status-filter="filters.status"
                @update:search-query="filters.searchQuery = $event"
                @update:status-filter="filters.status = $event"
                :status-options="fieldStatus"
            />
        </template>
        <!-- custom cột trong bảng -->
        <template #createdAt="{ row }">{{ formatDate(row.created_at) }}</template>

        <template #createdBy="{ row }">{{ row.created_by }}</template>

        <template #totalAmount="{ row }">{{ formatCurrency(row.total_amount) }}</template>

        <template #customerName="{ row }">{{ row.quotation.customer.name }}</template>

        <template #status="{ row }">
            <OrderStatusBadge :status="row.status" />
        </template>

        <template #paymentStatus="{ row }">
            <OrderStatusBadge :status="row.payment_status" />
        </template>
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
const userRole = useCookie<string>("role");

const filters = reactive({
    searchQuery: "",
    status: "",
    dateFrom: "",
    dateTo: "",
});

const fieldsName = computed(() => {
    const baseFields = [
        { label: "Mã đơn hàng", key: "id" },
        { label: "Khách hàng", key: "customerName" },
    ];

    // ✅ Chỉ dealer_manager mới thấy "Người tạo"
    if (userRole.value === "dealer_manager") {
        baseFields.push({ label: "Người tạo", key: "createdBy" });
    }

    return [
        ...baseFields,
        { label: "Tổng tiền", key: "totalAmount" },
        { label: "Trạng thái", key: "status" },
        { label: "Thanh toán", key: "paymentStatus" },
        { label: "Ngày tạo", key: "createdAt" },
        { label: "Thao tác", key: "actions" },
    ];
});

const fieldStatus = [
    { label: "Đang xử lí", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
    { label: "Đang giao hàng", value: "delivering" },
    { label: "Hoàn tất", value: "completed" },
    { label: "Hủy", value: "cancelled" },
];

const { loading, error, orders, fetchAll } = useOrders();

const filteredOrders = (order: any) => {
    const query = filters.searchQuery.toLowerCase();
    const matchesSearch =
        !query || order.quotation.customer.name.toLowerCase().includes(query) || order.id.toLowerCase().includes(query);
    const matchesStatus = !filters.status || order.status === filters.status;
    return matchesSearch && matchesStatus;
};

const handlePrint = (order: any) => {
    console.log("In hóa đơn:", order);
};

watch(
    () => orders.value,
    () => {
        console.log("orders ", orders.value);
    }
);

onMounted(async () => {
    const role = userRole.value;
    const userId = localStorage.getItem("user_id");
    console.log("role", role);
    console.log("id", userId);

    const token = localStorage.getItem("access_token");
    console.log("token: ", token);
    await fetchAll({ role: role, id: userId });
});
</script>
