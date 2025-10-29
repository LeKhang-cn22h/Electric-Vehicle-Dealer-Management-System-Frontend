<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <header class="mb-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Tạo đơn hàng mới</h1>
                        <p class="text-gray-600 mt-1">Tạo đơn hàng cho khách hàng</p>
                    </div>
                    <button @click="goBack" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        ← Quay lại danh sách
                    </button>
                </div>
            </header>

            <!-- Progress Steps -->
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <div v-for="(step, index) in steps" :key="step.id" class="flex items-center flex-1">
                        <div class="flex items-center">
                            <div
                                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                                :class="getStepClass(step.id)"
                            >
                                {{ index + 1 }}
                            </div>
                            <span
                                class="ml-2 text-sm font-medium hidden sm:block"
                                :class="currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'"
                            >
                                {{ step.name }}
                            </span>
                        </div>
                        <div
                            v-if="index < steps.length - 1"
                            class="flex-1 h-0.5 mx-4"
                            :class="currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Form Content -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <!-- Step 1: Customer -->
                <OrderCustomerForm v-if="currentStep === 1" v-model:customer="orderData.customer" @next="goToStep(2)" />

                <!-- Step 2: Products -->
                <OrderProductSelect
                    v-else-if="currentStep === 2"
                    v-model:items="orderData.items"
                    @back="goToStep(1)"
                    @next="goToStep(3)"
                />

                <!-- Step 3: Promotions -->
                <OrderPromotionSelect
                    v-else-if="currentStep === 3"
                    v-model:promotions="orderData.appliedPromotions"
                    :items="orderData.items"
                    @back="goToStep(2)"
                    @next="goToStep(4)"
                />

                <!-- Step 4: Payment -->
                <OrderPaymentMethod
                    v-else-if="currentStep === 4"
                    v-model:payment="orderData.payment"
                    :total="orderTotal"
                    @back="goToStep(3)"
                    @next="goToStep(5)"
                />

                <!-- Step 5: Summary -->
                <OrderSummary
                    v-else-if="currentStep === 5"
                    :order-data="orderData"
                    :order-total="orderTotal"
                    @back="goToStep(4)"
                    @submit="createOrder"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import OrderCustomerForm from "@/components/orders/OrderCustomerForm.vue";
import OrderProductSelect from "@/components/orders/OrderProductSelect.vue";
import OrderPromotionSelect from "@/components/orders/OrderPromotionSelect.vue";
import OrderPaymentMethod from "@/components/orders/OrderPaymentMethod.vue";
import OrderSummary from "@/components/orders/OrderSummary.vue";
/**
 * @typedef {import('@/types/ProductItem').ProductItem} ProductItem
 */

// State
const currentStep = ref(1);
const orderData = reactive({
    customer: null,
    /** @type {ProductItem[]} */
    items: [],
    appliedPromotions: [],
    payment: {
        method: "cash", // cash, installment
        bankPartner: null,
        downPayment: 0,
        tenor: 12,
    },
});

// Steps configuration
const steps = [
    { id: 1, name: "Khách hàng" },
    { id: 2, name: "Sản phẩm" },
    { id: 3, name: "Khuyến mãi" },
    { id: 4, name: "Thanh toán" },
    { id: 5, name: "Xác nhận" },
];

// Computed
const orderTotal = computed(() => {
    const itemsTotal = orderData.items.reduce((sum, item) => {
        return sum + item.quantity * item.unitPrice;
    }, 0);

    const discountTotal = orderData.appliedPromotions.reduce((sum, promo) => {
        return sum + promo.discountAmount;
    }, 0);

    return itemsTotal - discountTotal;
});

// Methods
const getStepClass = (stepId) => {
    if (currentStep.value > stepId) {
        return "bg-blue-600 text-white";
    } else if (currentStep.value === stepId) {
        return "bg-blue-100 text-blue-600 border-2 border-blue-600";
    } else {
        return "bg-gray-100 text-gray-400";
    }
};

const goToStep = (step) => {
    currentStep.value = step;
};

const createOrder = async () => {
    try {
        // TODO: Gọi API tạo đơn hàng
        const response = await $fetch("/api/orders", {
            method: "POST",
            body: {
                customerId: orderData.customer?.id,
                items: orderData.items,
                promotions: orderData.appliedPromotions,
                payment: orderData.payment,
                totalAmount: orderTotal.value,
            },
        });

        // Chuyển hướng đến trang chi tiết đơn hàng
        await navigateTo(`/orders/${response.orderId}`);
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        // TODO: Hiển thị thông báo lỗi
    }
};

const router = useRouter();

function goBack() {
    router.back();
}
</script>
