<template>
    <BaseListPage
        title="Danh sách khuyến mãi"
        :icon="TicketPercent"
        create-link="/admin/promotions/create"
        create-label="Tạo khuyến mãi mới"
        :is-active-btn-create="isActiveBtn"
        :fields-name="fieldsName"
        :table-component="OrderTable"
        :data="promotions"
        :show-toolbar="true"
        :filter-function="filterPromotions"
    >
        <!-- Toolbar -->
        <template #toolbar>
            <OrderToolbar
                :search-query="filters.searchQuery"
                :status-filter="filters.isActive"
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
        <template #minOrderValue="{ row }">
            <!-- <console class="log">{{ row }}</console> -->
            <span> {{ formatCurrency(row.minOrderValue) }} </span>
        </template>
        <template #discountType="{ row }">
            <span v-if="row.discountType == 'percent'"> Phần trăm </span>
            <span v-else>Giá tiền</span>
        </template>

        <template #dateRange="{ row }">
            {{ formatDate(row.startDate) }} -
            <span v-if="row.endDate">{{ formatDate(row.endDate) }}</span>
            <span v-else>Không giới hạn</span>
        </template>

        <template #isActive="{ row }">
            <OrderStatusBadge :status="row.isActive" />
        </template>
    </BaseListPage>
    <div>
        <button @click="fetchAll">Chạy</button>
    </div>
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

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

// Dữ liệu mẫu
const { promotions, fetchAll } = usePromotions();

const roleCookie = useCookie("role");
const isActiveBtn = ref<boolean>(false);
if (roleCookie.value === "admin") isActiveBtn.value = true;
const filters = reactive({
    searchQuery: "",
    isActive: "",
});

// Cấu hình cột
const fieldsName = [
    { label: "Mã KM", key: "code" },
    { label: "Loại giảm", key: "discountType" },
    { label: "Mô tả", key: "description" },
    { label: "Điều kiện tối thiểu", key: "minOrderValue" },
    { label: "Khoảng thời gian", key: "dateRange" },
    { label: "Trạng thái", key: "isActive" },
    { label: "Thao tác", key: "actions" },
];

onMounted(async () => {
    await fetchAll();
});

watch(promotions, (val) => {
    console.log("Updated promotions:", promotions.value);
});

// Filter danh sách
const filterPromotions = (item: any) => {
    const query = filters.searchQuery.toLowerCase();
    const matchesSearch =
        !query || item.code.toLowerCase().includes(query) || (item.description || "").toLowerCase().includes(query);

    const matchesActive = filters.isActive === "" || String(item.isActive) === filters.isActive;

    return matchesSearch && matchesActive;
};
</script>
