<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <header class="mb-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Chi tiết báo giá #{{ quoteId }}</h1>
                        <p class="text-gray-600 mt-1">Thông tin chi tiết của báo giá</p>
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

            <!-- Nội dung chi tiết -->
            <div v-else-if="quote" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
                <!-- Thông tin khách hàng -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h2>
                    <p><strong>Tên:</strong> {{ quote.customer.fullName }}</p>
                    <p><strong>Số điện thoại:</strong> {{ quote.customer.phone }}</p>
                    <p><strong>Email:</strong> {{ quote.customer.email }}</p>
                </section>

                <!-- Sản phẩm -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Sản phẩm</h2>
                    <table class="w-full border border-gray-200 rounded-lg">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="text-left px-4 py-2">Tên sản phẩm</th>
                                <th class="text-left px-4 py-2">Số lượng</th>
                                <th class="text-left px-4 py-2">Đơn giá</th>
                                <th class="text-left px-4 py-2">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in quote.items" :key="item.id" class="border-t">
                                <td class="px-4 py-2">{{ item.productName }}</td>
                                <td class="px-4 py-2">{{ item.quantity }}</td>
                                <td class="px-4 py-2">{{ formatCurrency(item.unitPrice) }}</td>
                                <td class="px-4 py-2">{{ formatCurrency(item.quantity * item.unitPrice) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- Khuyến mãi -->
                <section v-if="quote.promotions?.length">
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Khuyến mãi</h2>
                    <ul class="list-disc list-inside text-gray-700">
                        <li v-for="promo in quote.promotions" :key="promo.promo_id">
                            {{ promo.name }} — Giảm {{ formatCurrency(promo.discountAmount) }}
                        </li>
                    </ul>
                </section>

                <!-- Tổng kết -->
                <section class="border-t pt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-700">Tổng tiền:</span>
                        <span class="text-2xl font-bold text-blue-600">{{ formatCurrency(quote.totalAmount) }}</span>
                    </div>
                </section>
            </div>

            <!-- Không có dữ liệu -->
            <div v-else class="text-center py-16 text-gray-500">Không tìm thấy báo giá nào 📭</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/utils/format";
import type { ApiResponse } from "@/types";
import type { QuoteDetail } from "@/schemas"; // bạn có thể định nghĩa kiểu này theo project

const route = useRoute();
const router = useRouter();
const quoteId = route.params.id;

// Trạng thái
const quote = ref<QuoteDetail | null>(null);
const pending = ref(true);

// Lấy dữ liệu từ API
onMounted(async () => {
    // try {
    //     const response = await $fetch<ApiResponse<OrderDetail>>(`/api/orders/${orderId}`);
    //     order.value = response.data;
    // } catch (error) {
    //     console.error("Lỗi khi tải đơn hàng:", error);
    // } finally {
    //     pending.value = false;
    // }
    const mockQuoteDetail: QuoteDetail = {
        id: 1,
        customer: {
            id: 1001,
            fullName: "Nguyễn Văn A",
            phone: "0912345678",
            email: "vana@example.com",
            address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
            createdAt: new Date("2024-01-01T10:00:00Z"),
            updatedAt: new Date("2024-06-01T10:00:00Z"),
        },
        items: [
            {
                id: 501,
                productName: "Xe điện VinFast Vento",
                skuCode: "VF-VNT01",
                color: "Trắng ngọc trai",
                unitPrice: 45000000,
                quantity: 1,
            },
            {
                id: 502,
                productName: "Mũ bảo hiểm VinFast",
                skuCode: "VF-HELM01",
                color: "Đen bóng",
                unitPrice: 500000,
                quantity: 2,
            },
        ],
        promotions: [
            {
                promo_id: 301,
                name: "Giảm giá khai trương",
                promo_type: "discount",
                conditions: "Áp dụng cho đơn hàng trên 40 triệu",
                discountAmount: 2000000,
                valid_from: new Date("2024-01-01T00:00:00Z"),
                valid_to: new Date("2024-12-31T23:59:59Z"),
            },
        ],
        totalAmount: 44000000, // 45.000.000 + (2 * 500.000) - 2.000.000
    };
    quote.value = mockQuoteDetail;
    pending.value = false;
});

function goBack() {
    router.back();
}
</script>
