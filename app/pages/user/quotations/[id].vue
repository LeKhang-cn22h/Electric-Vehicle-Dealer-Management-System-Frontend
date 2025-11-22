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
                <button
                    class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    @click="convertOrder(quoteId)"
                    :disabled="quotation?.status === 'converted'"
                >
                    {{ quotation?.status === "draft" ? "Tạo đơn hàng" : "Đã tạo đơn hàng" }}
                </button>
            </header>

            <!-- Loading -->
            <div v-if="pending" class="flex justify-center py-20">
                <div class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>

            <!-- Nội dung chi tiết -->
            <div v-else-if="quotation" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
                <!-- Thông tin khách hàng -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h2>
                    <p><strong>Tên:</strong> {{ quotation?.customer.name || "Không có" }}</p>
                    <p><strong>Số điện thoại:</strong> {{ quotation?.customer.phone || "Không có" }}</p>
                    <p><strong>Email:</strong> {{ quotation?.customer.email || "Không có" }}</p>
                    <p><strong>Ngày sinh:</strong> {{ quotation?.customer.birth_day || "Không có" }}</p>
                    <p><strong>Địa chỉ:</strong> {{ quotation?.customer.adress || "Không có" }}</p>
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
                            <tr v-for="item in quotation?.vehicles" :key="item.id" class="border-t">
                                <td class="px-4 py-2">{{ item.name }}</td>
                                <td class="px-4 py-2">
                                    {{ quotation.items.find((i) => i.product_id === item.id)?.quantity || 0 }}
                                </td>
                                <td v-if="item.price" class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                                <td
                                    v-if="item.price && quotation.items.find((i) => i.product_id === item.id)?.quantity"
                                    class="px-4 py-2"
                                >
                                    {{
                                        formatCurrency(
                                            (quotation.items.find((i) => i.product_id === item.id)?.quantity || 0) * item.price
                                        )
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- Khuyến mãi -->
                <section v-if="quotation?.promotions?.length">
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Khuyến mãi</h2>
                    <ul class="list-disc list-inside text-gray-700">
                        <li v-for="promo in quotation.promotions" :key="promo.id">
                            {{ promo.code }} — Giảm
                            {{
                                promo.discountType === "amount" ? formatCurrency(promo.discountValue) : promo.discountValue + "%"
                            }}
                        </li>
                    </ul>
                </section>

                <!-- Thuế VAT -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Thuế VAT</h2>
                    <ul class="list-disc list-inside text-gray-700">
                        <li>10%</li>
                    </ul>
                </section>

                <!-- Tổng kết -->
                <section class="border-t pt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-700">Tổng tiền:</span>
                        <span class="text-2xl font-bold text-blue-600">{{ formatCurrency(quotation?.totalAmount) }}</span>
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
import type { QuoteDetail } from "@/schemas"; // bạn có thể định nghĩa kiểu này theo project

definePageMeta({
    layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

const route = useRoute();
const router = useRouter();
const quoteId = route.params.id as string;

// Trạng thái
const quote = ref<QuoteDetail | null>(null);
const pending = ref(true);

const { loading, error, fetchOne, quotation } = useQuotations();
// Lấy dữ liệu từ API
onMounted(async () => {
    try {
        await fetchOne(quoteId);
        console.log("quotation", toRaw(quotation));
    } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
        pending.value = false;
    }
    pending.value = false;
});
function convertOrder(id: string) {
    router.push(`/user/orders/create/${id}`);
}
function goBack() {
    router.back();
}
</script>
