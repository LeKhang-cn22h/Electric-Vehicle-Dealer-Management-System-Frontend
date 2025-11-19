<template>
    <div class="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Tạo khuyến mãi mới</h2>

        <!-- Thông tin chung -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="font-medium">Tên khuyến mãi</label>
                <input v-model="promotion.name" class="input" placeholder="Nhập tên chương trình (VD: Giảm giá cuối năm)" />
            </div>

            <div>
                <label class="font-medium">Mã khuyến mãi (tuỳ chọn)</label>
                <input v-model="promotion.code" class="input" placeholder="VD: SALE2025" />
            </div>
        </div>

        <!-- Loại khuyến mãi -->
        <div class="mb-6">
            <label class="font-medium">Loại khuyến mãi</label>
            <div class="flex gap-4 mt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="%" v-model="promotion.discountType" class="text-blue-600" />
                    <span>Giảm theo phần trăm (%)</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="amount" v-model="promotion.discountType" class="text-blue-600" />
                    <span>Giảm theo số tiền (VNĐ)</span>
                </label>
            </div>
        </div>

        <!-- Giá trị khuyến mãi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="font-medium">
                    Giá trị khuyến mãi
                    <span v-if="promotion.discountType === '%'">(%)</span>
                    <span v-else>(VNĐ)</span>
                </label>
                <input type="number" min="0" v-model.number="promotion.value" class="input" placeholder="VD: 20 hoặc 50000" />
            </div>

            <div>
                <label class="font-medium">Giá trị tối đa (VNĐ)</label>
                <input type="number" v-model.number="promotion.maxDiscount" class="input" placeholder="VD: 100000" />
            </div>
        </div>

        <!-- Thời gian áp dụng -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="font-medium">Ngày bắt đầu</label>
                <input type="date" v-model="promotion.startDate" class="input" />
            </div>
            <div>
                <label class="font-medium">Ngày kết thúc</label>
                <input type="date" v-model="promotion.endDate" class="input" />
            </div>
        </div>

        <!-- Điều kiện áp dụng -->
        <div class="mb-6">
            <label class="font-medium">Điều kiện áp dụng</label>
            <textarea
                v-model="promotion.condition"
                class="input"
                rows="3"
                placeholder="VD: Áp dụng cho đơn hàng từ 500.000đ"
            ></textarea>
        </div>

        <!-- Kích hoạt -->
        <div class="mb-6 flex items-center gap-2">
            <input type="checkbox" v-model="promotion.isActive" />
            <span>Kích hoạt khuyến mãi ngay</span>
        </div>

        <!-- Nút hành động -->
        <div class="flex justify-end gap-4">
            <button @click="resetForm" class="btn-outline">Hủy</button>
            <button @click="savePromotion" class="btn-primary">Lưu khuyến mãi</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
    layout: "admin",
});

const promotion = ref({
    name: "",
    code: "",
    discountType: "%",
    value: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    condition: "",
    isActive: true,
});

// Reset form
const resetForm = () => {
    promotion.value = {
        name: "",
        code: "",
        discountType: "%",
        value: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        condition: "",
        isActive: true,
    };
};

// Giả lập lưu (sau này gọi API)
const savePromotion = () => {
    console.log("Dữ liệu khuyến mãi:", promotion.value);
    alert("Đã lưu khuyến mãi!");
};
</script>

<style scoped>
.input {
    @apply w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700;
}
.btn-outline {
    @apply border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100;
}
</style>
