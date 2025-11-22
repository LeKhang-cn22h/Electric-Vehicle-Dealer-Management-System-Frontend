<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Xác nhận đơn hàng</h2>

        <div class="space-y-6">
            <!-- Thông tin khách hàng -->
            <div class="border border-gray-200 rounded-lg">
                <div class="bg-gray-50 px-4 py-3 border-b">
                    <h3 class="font-medium text-gray-900">Thông tin khách hàng</h3>
                </div>
                <div class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div class="text-sm text-gray-600">Họ tên</div>
                            <div class="font-medium">{{ orderData.customer?.name || "Chưa chọn" }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600">Số điện thoại</div>
                            <div class="font-medium">{{ orderData.customer?.phone || "Chưa chọn" }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600">Email</div>
                            <div class="font-medium">{{ orderData.customer?.email || "Chưa có" }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600">Địa chỉ</div>
                            <div class="font-medium">{{ orderData.customer?.address || "Chưa có" }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sản phẩm -->
            <div class="border border-gray-200 rounded-lg">
                <div class="bg-gray-50 px-4 py-3 border-b">
                    <h3 class="font-medium text-gray-900">Sản phẩm đã chọn</h3>
                </div>
                <div class="divide-y">
                    <div v-for="(item, index) in orderData.items" :key="index" class="p-4">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="font-medium">{{ item.name }}</div>
                                <div class="text-sm text-gray-600">{{ item.model }}</div>
                            </div>
                            <div class="text-right">
                                <div class="font-medium">{{ formatCurrency(item.price) }}</div>
                                <div class="text-sm text-gray-600">SL: {{ item.quantity }}</div>
                                <div class="font-medium text-blue-600">
                                    {{ formatCurrency(item.quantity * item.price) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Khuyến mãi -->
            <div v-if="orderData.appliedPromotions.length > 0" class="border border-gray-200 rounded-lg">
                <div class="bg-gray-50 px-4 py-3 border-b">
                    <h3 class="font-medium text-gray-900">Khuyến mãi đã áp dụng</h3>
                </div>
                <div class="p-4">
                    <div
                        v-for="promotion in orderData.appliedPromotions"
                        :key="promotion.id"
                        class="flex justify-between items-center py-2"
                    >
                        <span class="font-medium">{{ promotion.code }}</span>
                        <span class="text-green-600 font-medium">-{{ formatCurrency(promotion.discountAmount) }}</span>
                    </div>
                </div>
            </div>

            <!-- Thanh toán -->
            <div v-if="isPayment" class="border border-gray-200 rounded-lg">
                <div class="bg-gray-50 px-4 py-3 border-b">
                    <h3 class="font-medium text-gray-900">Phương thức thanh toán</h3>
                </div>
                <div class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div class="text-sm text-gray-600">Phương thức</div>
                            <div class="font-medium">
                                {{ orderData.payment.method === "cash" ? "Trả thẳng" : "Trả góp" }}
                            </div>
                        </div>

                        <div v-if="orderData.payment.method === 'installment'">
                            <div class="text-sm text-gray-600">Ngân hàng</div>
                            <div class="font-medium">{{ orderData.payment.bankPartner?.name || "Chưa chọn" }}</div>
                        </div>

                        <div v-if="orderData.payment.method === 'installment'">
                            <div class="text-sm text-gray-600">Kỳ hạn</div>
                            <div class="font-medium">{{ orderData.payment.tenor }} tháng</div>
                        </div>

                        <div v-if="orderData.payment.method === 'installment'">
                            <div class="text-sm text-gray-600">Trả trước</div>
                            <div class="font-medium">{{ formatCurrency(orderData.payment.downPayment || 0) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tổng kết cuối cùng -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Tổng kết đơn hàng</h3>

                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tổng tiền hàng:</span>
                        <span class="font-medium">{{ formatCurrency(itemsTotal) }}</span>
                    </div>

                    <div v-if="discountTotal > 0" class="flex justify-between">
                        <span class="text-gray-600">Giảm giá:</span>
                        <span class="text-green-600 font-medium">-{{ formatCurrency(discountTotal) }}</span>
                    </div>
                    <div v-if="discountTotal > 0" class="flex justify-between">
                        <span class="text-gray-600">Thuế VAT (10%):</span>
                        <span class="text-green-600 font-medium">+{{ formatCurrency(vatAmount) }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold border-t pt-3">
                        <span>Tổng thanh toán:</span>
                        <span class="text-blue-600">{{ formatCurrency(finalTotal) }}</span>
                    </div>

                    <div v-if="isPayment && orderData.payment.method === 'installment'" class="text-sm text-gray-600">
                        * Trả trước: {{ formatCurrency(orderData.payment.downPayment || 0) }}
                    </div>
                </div>
            </div>

            <!-- Ghi chú đơn hàng -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                    v-model="orderNote"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Thêm ghi chú cho đơn hàng này..."
                ></textarea>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between pt-6">
                <button @click="$emit('back')" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
                    Quay lại
                </button>
                <button
                    @click="submitOrder"
                    :disabled="isSubmitting"
                    class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <span v-if="isSubmitting">
                        <Loader2 class="w-4 h-4 animate-spin" />
                    </span>
                    {{ isSubmitting ? "Đang tạo..." : "Tạo mới" }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Loader2 } from "lucide-vue-next";

const props = defineProps({
    orderData: {
        type: Object,
        required: true,
    },
    orderTotal: {
        type: Number,
        required: true,
    },
    isPayment: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["back", "submit"]);

// State
const orderNote = ref("");
const isSubmitting = ref(false);

// Computed
const itemsTotal = computed(() => {
    return props.orderData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
});

const vatAmount = computed(() => {
    return itemsTotal.value * 0.1;
});

const finalTotal = computed(() => {
    return props.orderTotal + vatAmount.value;
});

const discountTotal = computed(() => {
    return props.orderData.appliedPromotions.reduce((sum, promo) => sum + promo.discountAmount, 0);
});

// Methods
const submitOrder = async () => {
    isSubmitting.value = true;

    try {
        await emit("submit", {
            ...props.orderData,
            note: orderNote.value,
        });
    } finally {
        isSubmitting.value = false;
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};
</script>
