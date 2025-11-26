<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-5xl mx-auto">
            <!-- Header -->
            <header class="mb-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">
                            {{ currentStep === 1 ? "Tạo báo giá mới" : "Xác nhận báo giá" }}
                        </h1>
                        <p class="text-gray-600 mt-1">
                            {{
                                currentStep === 1
                                    ? "Nhập thông tin báo giá cho khách hàng tiềm năng"
                                    : "Kiểm tra lại toàn bộ thông tin trước khi gửi"
                            }}
                        </p>
                    </div>
                    <button @click="goBack" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        ← Quay lại danh sách
                    </button>
                </div>
            </header>

            <!-- Step 1: Nhập thông tin -->
            <div v-if="currentStep === 1" class="space-y-6">
                <!-- Customer Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <OrderCustomerForm v-model:customer="quoteData.customer" />
                    <!-- @form-valid="handleFormValid" -->
                    <!-- @customer-type="quoteData.customerType = $event" -->
                </div>

                <!-- Products Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
                    <OrderProductSelect v-model:items="quoteData.vehicles" />
                </div>

                <!-- Promotions Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <OrderPromotionSelect v-model:promotions="quoteData.promotions" :items="quoteData.vehicles" />
                </div>

                <!-- Notes Section -->
                <!-- <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h2>

                    <div class="mt-4">
                        <textarea
                            v-model="quoteData.notes"
                            rows="3"
                            placeholder="Nhập ghi chú thêm (nếu có)"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        ></textarea>
                    </div>
                </div> -->

                <!-- Next Button -->
                <div class="flex justify-end">
                    <button @click="goToSummary" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Tiếp tục
                    </button>
                </div>
                <NuxtLink to="/dealer_manager/payments/vnpay" class="nav-item"> Test thanh toán VNPay </NuxtLink>
            </div>

            <!-- Step 2: Xác nhận -->
            <div v-else>
                <OrderSummary
                    :order-data="quoteData"
                    :order-total="total"
                    @back="currentStep = 1"
                    @submit="handleSubmit"
                    :is-payment="false"
                />
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
                :loading="loading"
                :error="error"
                @update:visible="(val: boolean) => (visible = val)"
                @update:loading="(val: boolean) => (loading = val)"
                @update:error="(val: string | null) => (error = val)"
                @close="goToListQuote"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import OrderCustomerForm from "@/components/orders/OrderCustomerForm.vue";
import OrderProductSelect from "@/components/orders/OrderProductSelect.vue";
import OrderPromotionSelect from "@/components/orders/OrderPromotionSelect.vue";
import OrderSummary from "@/components/orders/OrderSummary.vue";
import type { Promotion } from "@/schemas";
import { notiFail, notiSuccess } from "@/utils/format";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import StatusModal from "~/components/shared/StatusModal.vue";
import type { Customer } from "~/types/profile";
import type { ProductItem, ProductItemDetail } from "~/types/product-item";

definePageMeta({
    layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();

const { loading, error, create } = useQuotations();

const router = useRouter();
const isSubmitting = ref(false);
const currentStep = ref(1);
// const isCustomerFormValid = ref(false);

const quoteData = reactive({
    customer: null as Customer | null,
    // | CreateCustomer
    // customerType: null as "existing" | "new" | null,
    vehicles: [] as ProductItemDetail[],
    promotions: [] as Promotion[],
    notes: "",
});

// --- Computed totals ---
const subtotal = computed(() => quoteData.vehicles.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0));
const promoDiscount = computed(() => quoteData.promotions.reduce((sum, promo) => sum + promo.discountAmount, 0));
const total = computed(() => subtotal.value - promoDiscount.value);

// const handleFormValid = (val: boolean) => {
//     isCustomerFormValid.value = val;
// };

// --- Validation ---
const validateQuote = () => {
    if (
        !quoteData.customer
        // || !isCustomerFormValid.value
    ) {
        notiFail("Vui lòng kiểm tra thông tin khách hàng");
        return false;
    }
    console.log("!quoteData.customer", !quoteData.customer);
    console.log("quoteData.items", quoteData.vehicles);
    console.log("quoteData.items.length", quoteData.vehicles.length);
    if (quoteData.vehicles.length === 0) {
        notiFail("Vui lòng thêm ít nhất một sản phẩm");
        return false;
    }
    console.log("quoteData.items.length === 0", quoteData.vehicles.length === 0);
    const invalidItem = quoteData.vehicles.some((i) => !i.name || (i.quantity || 0) <= 0 || (i.price || 0) < 0);
    if (invalidItem) {
        notiFail("Vui lòng điền đầy đủ thông tin sản phẩm");
        return false;
    }
    console.log("invalidItem", invalidItem);
    return true;
};

// --- Step Control ---
const goToSummary = () => {
    console.log("Đã tiếp tục");
    if (!validateQuote()) {
        console.log("Lỗi");
        return;
    }
    currentStep.value = 2;
    console.log("currentStep", currentStep.value);
};

// --- Submit ---
const createQuote = async () => {
    isSubmitting.value = true;
    const createBy = localStorage.getItem("user_id");
    console.log("createBy", createBy);
    const promotionsCode = quoteData.promotions.map((promo) => {
        return promo.id;
    });
    console.log("promotionsCode", promotionsCode);
    console.log("quoteData.appliedPromotions", quoteData.promotions);
    try {
        const body: any = {
            customerId: quoteData.customer?.id,
            createdBy: createBy,
            items: quoteData.vehicles,
            vatRate: 0.1,
            note: quoteData.notes,
            promotionCode: promotionsCode,
        };
        console.log("body", body);
        const response = await create(body);
        console.log("Tạo thành công");
    } catch (err) {
        console.error("Lỗi khi tạo báo giá:", err);
        alert("Có lỗi xảy ra khi tạo báo giá, vui lòng thử lại!");
    } finally {
        isSubmitting.value = false;
    }
};

const goBack = () => {
    if (confirm("Bạn có chắc muốn hủy? Dữ liệu sẽ không được lưu.")) {
        router.back();
    }
};
const goToListQuote = () => {
    router.push("/user/quotations");
};
const showModal = ref(false);

const handleSubmit = () => {
    showModal.value = true;
};

const handleConfirm = () => {
    console.log("Người dùng xác nhận hành động!");
    // Gọi API hoặc thực hiện action ở đây
    showModal.value = false; // đóng modal sau khi xác nhận
    createQuote();
};

// State của modal
const visible = ref(false);

watch(loading, () => {
    if (loading.value) visible.value = true;
});
</script>
