<template>
    <div class="border border-gray-300 rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã đơn hàng</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Khách hàng</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày đặt</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Sản phẩm</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Tổng tiền</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">
                        {{ order.orderCode }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                        {{ order.customerName }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                        {{ formatDate(order.orderDate) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                        <div class="flex flex-col">
                            <span class="font-medium">{{ order.productName }}</span>
                            <span class="text-gray-500">x{{ order.quantity }}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">
                        {{ formatCurrency(order.totalAmount) }}
                    </td>
                    <td class="px-4 py-3">
                        <OrderStatusBadge :status="order.status" />
                    </td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <NuxtLink
                                :to="`/orders/${order.id}`"
                                class="text-gray-400 hover:text-black transition-colors"
                                title="Xem chi tiết"
                            >
                                <Eye class="w-5 h-5" />
                            </NuxtLink>
                            <button
                                class="text-gray-400 hover:text-black transition-colors"
                                title="In hóa đơn"
                                @click="$emit('print', order)"
                            >
                                <Printer class="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import OrderStatusBadge from "@/components/orders/OrderStatusBadge.vue";
import { Eye, Printer } from "lucide-vue-next";
const props = defineProps({
    orders: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["print"]);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};
</script>
