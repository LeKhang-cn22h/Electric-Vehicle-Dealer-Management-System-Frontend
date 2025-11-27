<template>
    <BaseListPage
        title="Danh sách giá sản phẩm"
        :icon="TicketPercent"
        create-link="/admin/pricing/create"
        create-label="Tạo giá mới"
        :is-active-btn-create="isActiveBtn"
        :fields-name="fieldsName"
        :table-component="OrderTable"
        :data="pricings"
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
        <template #basePrice="{ row }">
            <!-- <console class="log">{{ row }}</console> -->
            <span> {{ formatCurrency(row.basePrice) }} </span>
        </template>
        <template #discountedPrice="{ row }">
            <!-- <console class="log">{{ row }}</console> -->
            <span> {{ formatCurrency(row.discountedPrice) }} </span>
        </template>
        <template #wholesalePrice="{ row }">
            <!-- <console class="log">{{ row }}</console> -->
            <span> {{ formatCurrency(row.wholesalePrice) }} </span>
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
import { usePricing } from "~/composables/usePricing";

definePageMeta({
    layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

// Dữ liệu mẫu
const { pricings, fetchAll, loading, error } = usePricing();

const roleCookie = useCookie("role");
const isActiveBtn = ref<boolean>(false);
if (roleCookie.value === "admin") isActiveBtn.value = true;
const filters = reactive({
    searchQuery: "",
    isActive: "",
});

// Cấu hình cột
const fieldsName = [
    { label: "Mã model", key: "productId" },
    { label: "Giá lẻ", key: "basePrice" },
    { label: "Giá sỉ", key: "wholesalePrice" },
    { label: "Giá bán đề xuất", key: "discountedPrice" },
    { label: "Số lượng tối thiểu", key: "quantity" },
];

onMounted(async () => {
    await fetchAll();
});

watch(pricings, () => {
    console.log("Updated promotions:", pricings.value);
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
