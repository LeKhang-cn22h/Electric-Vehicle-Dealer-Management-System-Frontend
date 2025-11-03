<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Áp dụng khuyến mãi</h2>

        <div class="space-y-6">
            <!-- Danh sách khuyến mãi khả dụng -->
            <div>
                <h3 class="text-md font-medium text-gray-900 mb-3">Khuyến mãi khả dụng</h3>

                <div class="space-y-3">
                    <div
                        v-for="promotion in availablePromotions"
                        :key="promotion.id"
                        class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="font-medium text-gray-900">{{ promotion.name }}</span>
                                    <span class="px-2 py-1 text-xs rounded-full" :class="getPromotionTypeClass(promotion.type)">
                                        {{ getPromotionTypeText(promotion.type) }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 mb-2">{{ promotion.description }}</p>
                                <div class="text-sm text-gray-500">
                                    Áp dụng: {{ formatDate(promotion.validFrom) }} - {{ formatDate(promotion.validTo) }}
                                </div>
                                <div class="text-sm font-medium text-green-600 mt-1">Giảm: {{ formatDiscount(promotion) }}</div>
                            </div>

                            <button
                                @click="togglePromotion(promotion)"
                                :class="isPromotionApplied(promotion) ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'"
                                class="px-3 py-1 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                            >
                                {{ isPromotionApplied(promotion) ? "Hủy áp dụng" : "Áp dụng" }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="availablePromotions.length === 0" class="text-center py-8 text-gray-500">
                    Không có khuyến mãi khả dụng
                </div>
            </div>

            <!-- Khuyến mãi đã áp dụng -->
            <div v-if="appliedPromotions.length > 0">
                <h3 class="text-md font-medium text-gray-900 mb-3">Khuyến mãi đã áp dụng</h3>

                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="space-y-2">
                        <div v-for="promotion in appliedPromotions" :key="promotion.id" class="flex justify-between items-center">
                            <div>
                                <span class="font-medium">{{ promotion.name }}</span>
                                <span class="text-sm text-green-700 ml-2"> -{{ formatCurrency(promotion.discountAmount) }} </span>
                            </div>
                            <button @click="removePromotion(promotion)" class="text-red-600 hover:text-red-800">
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div class="border-t border-green-200 mt-3 pt-3">
                        <div class="flex justify-between font-medium">
                            <span>Tổng giảm giá:</span>
                            <span class="text-green-700">-{{ formatCurrency(totalDiscount) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tổng tiền sau khuyến mãi -->
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900">Tổng tiền sau khuyến mãi:</span>
                    <span class="text-xl font-bold text-blue-600">{{ formatCurrency(finalTotal) }}</span>
                </div>
            </div>

            <!-- Navigation -->
            <!-- <div class="flex justify-between pt-6">
                <button @click="$emit('back')" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
                    Quay lại
                </button>
                <button @click="$emit('next')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Tiếp theo: Thanh toán
                </button>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { X } from "lucide-vue-next";

const props = defineProps({
    promotions: {
        type: Array,
        default: () => [],
    },
    items: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["update:promotions", "back", "next"]);

// State
const availablePromotions = ref([]);
const appliedPromotions = computed(() => props.promotions);

// Computed
const itemsTotal = computed(() => {
    return props.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
});

const totalDiscount = computed(() => {
    return appliedPromotions.value.reduce((sum, promo) => sum + promo.discountAmount, 0);
});

const finalTotal = computed(() => itemsTotal.value - totalDiscount.value);

// Methods
const loadAvailablePromotions = async () => {
    try {
        // TODO: Gọi API lấy khuyến mãi khả dụng từ EVM
        const response = await $fetch("/api/promotions/available");
        availablePromotions.value = response.map((promo) => ({
            ...promo,
            discountAmount: calculateDiscountAmount(promo, itemsTotal.value),
        }));
    } catch (error) {
        console.error("Lỗi tải khuyến mãi:", error);
    }
};

const calculateDiscountAmount = (promotion, total) => {
    switch (promotion.type) {
        case "percentage":
            return total * (promotion.discountValue / 100);
        case "fixed":
            return promotion.discountValue;
        case "cashback":
            return promotion.discountValue;
        default:
            return 0;
    }
};

const togglePromotion = (promotion) => {
    const isApplied = isPromotionApplied(promotion);

    if (isApplied) {
        removePromotion(promotion);
    } else {
        applyPromotion(promotion);
    }
};

const applyPromotion = (promotion) => {
    const newPromotions = [...appliedPromotions.value, promotion];
    emit("update:promotions", newPromotions);
};

const removePromotion = (promotion) => {
    const newPromotions = appliedPromotions.value.filter((p) => p.id !== promotion.id);
    emit("update:promotions", newPromotions);
};

const isPromotionApplied = (promotion) => {
    return appliedPromotions.value.some((p) => p.id === promotion.id);
};

const getPromotionTypeClass = (type) => {
    const classes = {
        percentage: "bg-blue-100 text-blue-800",
        fixed: "bg-green-100 text-green-800",
        cashback: "bg-purple-100 text-purple-800",
    };
    return classes[type] || "bg-gray-100 text-gray-800";
};

const getPromotionTypeText = (type) => {
    const texts = {
        percentage: "%",
        fixed: "Fixed",
        cashback: "Cashback",
    };
    return texts[type] || type;
};

const formatDiscount = (promotion) => {
    switch (promotion.type) {
        case "percentage":
            return `${promotion.discountValue}%`;
        case "fixed":
            return formatCurrency(promotion.discountValue);
        case "cashback":
            return formatCurrency(promotion.discountValue);
        default:
            return "";
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
};

// Lifecycle
onMounted(() => {
    loadAvailablePromotions();
});
</script>
