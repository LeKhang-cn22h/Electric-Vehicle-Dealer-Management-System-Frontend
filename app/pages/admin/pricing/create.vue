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
                <!-- Loading -->
                <div v-if="loading" class="flex justify-center py-20">
                    <div class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
                <option v-else-if="vehicles" v-for="v in vehicles" :key="v.id" :value="v.id">
                    {{ v.name }}
                </option>
                <option v-else value="">-- Không có --</option>
            </select>
        </div>

        <!-- Pricing -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="label">Giá lẻ (VNĐ)</label>
                <input type="number" v-model="form.basePrice" class="input" />
            </div>
            <div>
                <label class="label">Giá sỉ (VNĐ)</label>
                <input type="number" v-model="form.wholesalePrice" class="input" />
            </div>
        </div>

        <!-- VAT & Preview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label class="label">Giá bán đề xuất (VNĐ)</label>
                <input type="number" v-model="form.discountedPrice" class="input" />
            </div>

            <div>
                <label class="label">Số lượng (nhập sỉ)</label>
                <input type="number" v-model="form.quantity" class="input" />
            </div>
            <!-- <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500 mb-1">Giá sau VAT</p>
                <p class="text-lg font-semibold text-gray-800">
                    {{ formattedFinalPrice }}
                </p>
            </div> -->
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
            <button class="btn-secondary" @click="resetForm">Hủy</button>
            <button class="btn-primary" @click="submit">Lưu bảng giá</button>
        </div>
    </div>
    <ConfirmModal
        v-model:show="showModal"
        title="Xác nhận tạo báo giá"
        message="Bạn có chắc chắn muốn <b>tạo</b> báo giá mới này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        @confirm="handleConfirm"
    />
    <StatusModal
        :visible="visible"
        :loading="loadingPrice"
        :error="errorPrice"
        @update:visible="(val: boolean) => (visible = val)"
        @update:loading="(val: boolean) => (loadingPrice = val)"
        @update:error="(val: string | null) => (errorPrice = val)"
        @close="goToListPrice"
    />
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import StatusModal from "~/components/shared/StatusModal.vue";
import { usePricing } from "~/composables/usePricing";

definePageMeta({
    layout: false,
});

// Layout theo role
const { applyLayout } = useRoleBasedLayout();
applyLayout();

const router = useRouter();
const { fetchNoPrice, loading, error, vehicles } = useVehicle();
const { create, loading: loadingPrice, error: errorPrice } = usePricing();
/* ========== FORM ========= */
const form = reactive({
    modelId: "",
    basePrice: 0,
    wholesalePrice: 0,
    discountedPrice: 0,
    quantity: 0,
});

/* ========== ACTIONS ========= */
const submit = () => {
    showModal.value = true;
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
    if (confirm("Bạn có chắc muốn hủy? Dữ liệu sẽ không được lưu.")) {
        router.back();
    }
};
const goToListPrice = () => {
    router.push("/admin/pricing");
};
const showModal = ref(false);

const createPrice = async () => {
    try {
        const body: any = {
            productId: form.modelId,
            basePrice: form.basePrice,
            discountedPrice: form.discountedPrice,
            wholesalePrice: form.wholesalePrice,
            quantity: form.quantity,
        };
        const response = await create(body);
        console.log("Tạo thành công", response);
    } catch (err) {
        console.error("Lỗi khi tạo báo giá:", err);
        alert("Có lỗi xảy ra khi tạo báo giá, vui lòng thử lại!");
    }
};

const handleConfirm = () => {
    console.log("Người dùng xác nhận hành động!");
    if (!form.modelId) {
        alert("Vui lòng chọn model xe");
        return;
    }

    if (form.basePrice <= 0) {
        alert("Giá lẻ phải lớn hơn 0");
        return;
    }

    if (form.wholesalePrice <= 0) {
        alert("Giá sỉ phải lớn hơn 0");
        return;
    }

    if (form.discountedPrice <= 0) {
        alert("Giá bán đề xuất phải lớn hơn 0");
        return;
    }

    console.log("📌 DATA SUBMIT:", JSON.parse(JSON.stringify(form)));
    // Gọi API hoặc thực hiện action ở đây
    showModal.value = false; // đóng modal sau khi xác nhận
    createPrice();
};

// State của modal
const visible = ref(false);

watch(loadingPrice, () => {
    if (loadingPrice.value) visible.value = true;
});
onMounted(async () => {
    await fetchNoPrice();
});
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
