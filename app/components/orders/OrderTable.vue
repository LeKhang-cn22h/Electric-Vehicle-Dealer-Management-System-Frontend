<template>
    <div class="border border-gray-300 rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-black">
                <tr>
                    <th class="px-4 py-4 text-left text-base font-semibold text-white" v-for="fieldName in fieldsName">
                        {{ fieldName }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200" v-if="orders.length > 0">
                <tr
                    v-for="(order, index) in orders"
                    :key="order.id"
                    class="transition-colors"
                    :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-200'"
                >
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

            <tbody v-else>
                <tr>
                    <td colspan="7" class="px-4 py-12 text-center">
                        <div class="flex flex-col items-center justify-center text-gray-500">
                            <FileText class="w-12 h-12 mb-3 text-gray-400" />
                            <p class="text-lg font-medium">Không có đơn hàng nào</p>
                            <p class="text-sm mt-1">Hãy tạo đơn hàng mới để bắt đầu</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import OrderStatusBadge from "@/components/orders/OrderStatusBadge.vue";
import { Eye, Printer, FileText } from "lucide-vue-next";
import { formatCurrency, formatDate } from "@/utils/format";
const props = defineProps({
    fieldsName: {
        type: Array,
        default: () => ["Mã đơn hàng", "Khách hàng", "Ngày đặt", "Sản phẩm", "Tổng tiền", "Trạng thái", "Thao tác"],
    },
    orders: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["print"]);
</script>
