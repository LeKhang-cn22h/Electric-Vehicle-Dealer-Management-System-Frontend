<!-- Gốc -->
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
        :can-remove="canRemove"
        @remove="handleSubmit"
    >
        <template #toolbar>
            <OrderToolbar
                :search-query="filters.searchQuery"
                :status-filter="filters.status"
                :date-from="filters.dateFrom"
                :date-to="filters.dateTo"
                :status-options="fieldStatus"
                @update:search-query="filters.searchQuery = $event"
                @update:status-filter="filters.status = $event"
                @update:date-from="filters.dateFrom = $event"
                @update:date-to="filters.dateTo = $event"
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
    <ConfirmModal
        v-model:show="showModal"
        title="Xác nhận 'XÓA' báo giá"
        message="Bạn có chắc chắn muốn <b>XÓA</b> báo giá này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        @confirm="handleConfirm"
    />
    <StatusModal
        :visible="visible"
        :loading="loadingRemove"
        :error="errorRemove"
        @update:visible="(val: boolean) => (visible = val)"
        @update:loading="(val: boolean) => (loadingRemove = val)"
        @update:error="(val: string | null) => (errorRemove = val)"
        @close="reloadPage"
    />
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
import { date } from "zod";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import StatusModal from "~/components/shared/StatusModal.vue";

definePageMeta({
    layout: false,
});

// Layout theo role
const { applyLayout } = useRoleBasedLayout();
applyLayout();

// Lấy data báo giá
const { quotationsByCreator, fetchAllByCreator, remove, loadingRemove, errorRemove } = useQuotations();
const router = useRouter();
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
    dateTo: "",
    dateFrom: "",
});

const fieldsName = [
    { label: "Mã báo giá", key: "id" },
    { label: "Khách hàng", key: "customerName" },
    { label: "Ngày tạo", key: "createdAt" },
    { label: "Tổng tiền", key: "totalAmount" },
    { label: "Trạng thái", key: "status" },
    { label: "Thao tác", key: "actions" },
];

const fieldStatus = [
    { label: "Nháp", value: "draft" },
    { label: "Đã chuyển", value: "converted" },
];

const filterQuotes = (order: any) => {
    const query = filters.searchQuery.toLowerCase();

    const matchesSearch =
        !query || order.customerName.toLowerCase().includes(query) || order.orderCode.toLowerCase().includes(query);

    const matchesStatus = !filters.status || order.status === filters.status;

    // --- DATE FILTER (DATE ONLY) ---
    const orderDateOnly = toDateOnly(order.createdAt);

    const from = filters.dateFrom || null; // đã là "YYYY-MM-DD"
    const to = filters.dateTo || null; // đã là "YYYY-MM-DD"

    const matchesDate = (!from || orderDateOnly >= from) && (!to || orderDateOnly <= to);

    return matchesSearch && matchesStatus && matchesDate;
};

const removeQuote = async (id: string) => {
    try {
        const response = await remove(id);
    } catch (err) {
        console.error("Lỗi khi Xóa báo giá:", err);
        alert("Có lỗi xảy ra khi Xóa báo giá, vui lòng thử lại!");
    }
};

const item: any = ref();
const showModal = ref(false);
const canRemove = (row: any) => {
    if (quotationsByCreator.value.find((quote) => quote.id === row.id)?.status == "draft") return true;
    return false;
};

const handleSubmit = (row: any) => {
    showModal.value = true;
    item.value = row;
};

const handleConfirm = () => {
    console.log("Người dùng xác nhận hành động!", item);
    // Gọi API hoặc thực hiện action ở đây
    showModal.value = false; // đóng modal sau khi xác nhận
    removeQuote(item.value.id);
};

// State của modal
const visible = ref(false);

watch(loadingRemove, () => {
    if (loadingRemove.value) visible.value = true;
});

const reloadPage = () => {
    router.go(0);
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
