<template>
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
        <!-- Header -->
        <h1 class="text-2xl font-bold text-gray-800 mb-1">Tạo giá cho nhóm xe (Model)</h1>
        <p class="text-sm text-gray-500 mb-6">Giá áp dụng cho toàn bộ xe thuộc cùng model</p>

        <!-- Model -->
        <div class="mb-6">
            <label class="label"> Model xe <span class="text-red-500">*</span> </label>
            <select v-model="form.modelId" class="input">
                <option value="">-- Chọn model xe --</option>
                <option v-for="m in models" :key="m.id" :value="m.id">
                    {{ m.name }}
                </option>
            </select>
        </div>

        <!-- Pricing -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="label">Giá niêm yết (VNĐ)</label>
                <input type="number" v-model="form.listPrice" class="input" />
            </div>
            <div>
                <label class="label">Giá bán đề xuất (VNĐ)</label>
                <input type="number" v-model="form.salePrice" class="input" />
            </div>
        </div>

        <!-- VAT & Preview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="label">VAT (%)</label>
                <input type="number" v-model="form.vat" class="input" />
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500 mb-1">Giá sau VAT</p>
                <p class="text-lg font-semibold text-gray-800">
                    {{ formattedFinalPrice }}
                </p>
            </div>
        </div>

        <!-- Note -->
        <div class="mb-6">
            <label class="label">Ghi chú</label>
            <input type="text" v-model="form.note" class="input" placeholder="Ví dụ: Giá áp dụng toàn quốc" />
        </div>

        <!-- Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="label">Ngày bắt đầu</label>
                <input type="date" v-model="form.startDate" class="input" />
            </div>
            <div>
                <label class="label">Ngày kết thúc</label>
                <input type="date" v-model="form.endDate" class="input" />
            </div>
        </div>

        <!-- Status -->
        <div class="mb-6">
            <label class="label">Trạng thái</label>
            <select v-model="form.status" class="input">
                <option value="draft">Nháp</option>
                <option value="active">Đang áp dụng</option>
                <option value="inactive">Ngừng áp dụng</option>
            </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
            <button class="btn-secondary" @click="resetForm">Hủy</button>
            <button class="btn-primary" @click="submit">Lưu bảng giá</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

/* ========== MOCK DATA ========= */
const models = [
    { id: "model-ev-a", name: "EV Sedan A" },
    { id: "model-ev-b", name: "EV SUV B" },
    { id: "model-ev-c", name: "EV Truck C" },
];

/* ========== FORM ========= */
const form = reactive({
    modelId: "",
    listPrice: 0,
    salePrice: 0,
    vat: 10,
    note: "",
    startDate: "",
    endDate: "",
    status: "draft",
});

/* ========== COMPUTED ========= */
const finalPrice = computed(() => {
    if (!form.salePrice) return 0;
    return form.salePrice * (1 + form.vat / 100);
});

const formattedFinalPrice = computed(() => finalPrice.value.toLocaleString("vi-VN") + " VNĐ");

/* ========== ACTIONS ========= */
const submit = () => {
    if (!form.modelId) {
        alert("Vui lòng chọn model xe");
        return;
    }

    if (form.salePrice <= 0) {
        alert("Giá bán phải lớn hơn 0");
        return;
    }

    console.log("📌 DATA SUBMIT:", JSON.parse(JSON.stringify(form)));
    alert("Tạo bảng giá thành công (xem console)");
};

const resetForm = () => {
    Object.assign(form, {
        modelId: "",
        listPrice: 0,
        salePrice: 0,
        vat: 10,
        note: "",
        startDate: "",
        endDate: "",
        status: "draft",
    });
};
</script>

<style scoped>
.label {
    @apply block text-sm font-medium text-gray-700 mb-1;
}
.input {
    @apply w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500;
}
.btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
}
.btn-secondary {
    @apply px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100;
}
</style>
