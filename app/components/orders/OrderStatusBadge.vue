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
};

const statusClass = computed(() => statusConfig[props.status]?.class || "bg-gray-100 text-gray-800");

const statusText = computed(() => statusConfig[props.status]?.text || props.status);
</script>
