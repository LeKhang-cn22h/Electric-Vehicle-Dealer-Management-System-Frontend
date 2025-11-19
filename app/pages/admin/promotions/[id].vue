<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-3xl mx-auto">
            <!-- Header -->
            <header class="mb-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Khuyến mãi: {{ promotion?.code }}</h1>
                        <p class="text-gray-600 mt-1">Thông tin chi tiết chương trình khuyến mãi</p>
                    </div>

                    <button @click="goBack" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        ← Quay lại danh sách
                    </button>
                </div>
            </header>

            <!-- Loading -->
            <div v-if="pending" class="flex justify-center py-20">
                <div class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>

            <!-- Detail content -->
            <div v-else-if="promotion" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
                <!-- Basic Info -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Thông tin chung</h2>

                    <div class="space-y-2">
                        <p><strong>Mã khuyến mãi:</strong> {{ promotion.code }}</p>

                        <p v-if="promotion.description"><strong>Mô tả:</strong> {{ promotion.description }}</p>

                        <p>
                            <strong>Loại giảm:</strong>
                            <span class="font-medium">
                                <span v-if="promotion.discountType === 'percent'"> Giảm {{ promotion.discountValue }}% </span>
                                <span v-else> Giảm {{ formatCurrency(promotion.discountValue) }} </span>
                            </span>
                        </p>

                        <p v-if="promotion.minOrderValue">
                            <strong>Đơn hàng tối thiểu:</strong>
                            {{ formatCurrency(promotion.minOrderValue) }}
                        </p>

                        <p v-if="promotion.minQuantity"><strong>Số lượng tối thiểu:</strong> {{ promotion.minQuantity }}</p>
                    </div>
                </section>

                <!-- Date Range -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Thời gian áp dụng</h2>
                    <p><strong>Từ:</strong> {{ formatDate(promotion.startDate) }}</p>
                    <p>
                        <strong>Đến:</strong>
                        <span v-if="promotion.endDate">
                            {{ formatDate(promotion.endDate) }}
                        </span>
                        <span v-else>Không giới hạn</span>
                    </p>
                </section>

                <!-- Status -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Trạng thái</h2>
                    <p>
                        <span
                            class="px-3 py-1 rounded-full text-sm font-medium"
                            :class="promotion.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                        >
                            {{ promotion.isActive ? "Đang hoạt động" : "Không hoạt động" }}
                        </span>
                    </p>
                </section>

                <!-- Created / Updated -->
                <section class="border-t pt-4 text-gray-600 text-sm">
                    <p>Ngày tạo: {{ formatDate(promotion.createdAt) }}</p>
                    <p>Cập nhật lần cuối: {{ formatDate(promotion.updatedAt) }}</p>
                </section>
            </div>

            <!-- Empty -->
            <div v-else class="text-center py-16 text-gray-500">Không tìm thấy khuyến mãi 📭</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formatCurrency, formatDate } from "@/utils/format";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const promotionId = route.params.id;

const promotion = ref<any | null>(null);
const pending = ref(true);

// Mock API data
onMounted(async () => {
    // Sau này thay bằng API thật:
    // const resp = await $fetch(`/api/promotions/${promotionId}`);

    const mockPromotion = {
        id: "1",
        code: "SUMMER10",
        description: "Giảm giá mùa hè",
        discountType: "percent",
        discountValue: 10,
        minOrderValue: 2000000,
        minQuantity: null,
        startDate: "2024-09-01",
        endDate: "2024-10-01",
        isActive: true,
        createdAt: "2024-08-20T10:00:00Z",
        updatedAt: "2024-09-01T10:00:00Z",
    };

    promotion.value = mockPromotion;
    pending.value = false;
});

function goBack() {
    router.back();
}
</script>
