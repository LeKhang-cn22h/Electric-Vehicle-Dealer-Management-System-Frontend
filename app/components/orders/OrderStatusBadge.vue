<template>
    <span :class="statusClass" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
        {{ statusText }}
    </span>
</template>

<script setup>
const props = defineProps({
    status: {
        type: String,
        required: true,
    },
});

const statusConfig = {
    delivered: { class: "bg-green-100 text-green-800", text: "Đã giao hàng" },
    pending: { class: "bg-yellow-100 text-yellow-800", text: "Đang xử lý" },
    confirmed: { class: "bg-blue-100 text-blue-800", text: "Đã xác nhận" },
    cancelled: { class: "bg-red-100 text-red-800", text: "Đã hủy" },
    draft: { class: "bg-gray-100 text-gray-800", text: "Nháp" },
    converted: { class: "bg-green-100 text-green-800", text: "Đã chuyển" },
    unpaid: { class: "bg-yellow-100 text-yellow-800", text: "Chưa thanh toán" },
    paid: { class: "bg-green-100 text-green-800", text: "Đã thanh toán" },
    partial: { class: "bg-yellow-100 text-yellow-800", text: "1 phần" },
    true: { class: "bg-green-100 text-green-800", text: "Đang hoạt động" },
    false: { class: "bg-gray-100 text-gray-800", text: "Đã ẩn" },
};

const statusClass = computed(() => statusConfig[props.status]?.class || "bg-gray-100 text-gray-800");

const statusText = computed(() => statusConfig[props.status]?.text || props.status);
</script>
