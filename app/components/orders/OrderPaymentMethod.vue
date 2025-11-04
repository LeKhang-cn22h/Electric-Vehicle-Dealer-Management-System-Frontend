<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>

        <div class="space-y-6">
            <!-- Chọn phương thức thanh toán -->
            <div>
                <h3 class="text-md font-medium text-gray-900 mb-3">Chọn phương thức</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Trả thẳng -->
                    <div
                        @click="selectPaymentMethod('cash')"
                        class="border-2 rounded-lg p-4 cursor-pointer transition-all"
                        :class="
                            payment.method === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        "
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                :class="payment.method === 'cash' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"
                            >
                                <div v-if="payment.method === 'cash'" class="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                            <div>
                                <div class="font-medium">Trả thẳng</div>
                                <div class="text-sm text-gray-600">Thanh toán toàn bộ một lần</div>
                            </div>
                        </div>
                    </div>

                    <!-- Trả góp -->
                    <div
                        @click="selectPaymentMethod('installment')"
                        class="border-2 rounded-lg p-4 cursor-pointer transition-all"
                        :class="
                            payment.method === 'installment'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        "
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                :class="payment.method === 'installment' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"
                            >
                                <div v-if="payment.method === 'installment'" class="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                            <div>
                                <div class="font-medium">Trả góp</div>
                                <div class="text-sm text-gray-600">Thanh toán theo kỳ hạn</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form trả góp -->
            <div v-if="payment.method === 'installment'" class="border border-gray-200 rounded-lg p-4">
                <h3 class="text-md font-medium text-gray-900 mb-4">Thông tin trả góp</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Chọn ngân hàng -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ngân hàng *</label>
                        <select
                            v-model="payment.bankPartner"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn ngân hàng</option>
                            <option v-for="bank in bankPartners" :key="bank.id" :value="bank">
                                {{ bank.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Kỳ hạn -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kỳ hạn (tháng) *</label>
                        <select
                            v-model="payment.tenor"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="6">6 tháng</option>
                            <option value="12">12 tháng</option>
                            <option value="24">24 tháng</option>
                            <option value="36">36 tháng</option>
                        </select>
                    </div>

                    <!-- Trả trước -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Trả trước ({{ downPaymentPercentage }}%)
                        </label>
                        <input
                            v-model="payment.downPayment"
                            type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số tiền trả trước"
                        />
                    </div>

                    <!-- Lãi suất -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Lãi suất (%)</label>
                        <input
                            v-model="payment.interestRate"
                            type="number"
                            step="0.1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Lãi suất năm"
                        />
                    </div>
                </div>

                <!-- Thông tin chi tiết trả góp -->
                <div v-if="showInstallmentDetails" class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Chi tiết trả góp</h4>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div class="text-gray-600">Số tiền vay</div>
                            <div class="font-medium">{{ formatCurrency(loanAmount) }}</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Trả hàng tháng</div>
                            <div class="font-medium">{{ formatCurrency(monthlyPayment) }}</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Tổng lãi</div>
                            <div class="font-medium">{{ formatCurrency(totalInterest) }}</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Tổng trả</div>
                            <div class="font-medium">{{ formatCurrency(totalPayment) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tổng kết thanh toán -->
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tổng tiền hàng:</span>
                        <span class="font-medium">{{ formatCurrency(total) }}</span>
                    </div>

                    <div v-if="payment.method === 'installment'" class="flex justify-between">
                        <span class="text-gray-600">Trả trước:</span>
                        <span class="font-medium">{{ formatCurrency(payment.downPayment || 0) }}</span>
                    </div>

                    <div v-if="payment.method === 'installment'" class="flex justify-between">
                        <span class="text-gray-600">Số tiền vay:</span>
                        <span class="font-medium">{{ formatCurrency(loanAmount) }}</span>
                    </div>

                    <div class="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>{{ payment.method === "cash" ? "Tổng thanh toán:" : "Cần trả trước:" }}</span>
                        <span class="text-blue-600">
                            {{ formatCurrency(payment.method === "cash" ? total : payment.downPayment || 0) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    payment: {
        type: Object,
        default: () => ({
            method: "cash",
            bankPartner: null,
            downPayment: 0,
            tenor: 12,
            interestRate: 0,
        }),
    },
    total: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(["update:payment", "back", "next"]);

// State
const bankPartners = ref([]);

// Computed
const isFormValid = computed(() => {
    if (props.payment.method === "cash") return true;

    return props.payment.bankPartner && props.payment.downPayment > 0 && props.payment.tenor;
});

const downPaymentPercentage = computed(() => {
    if (!props.total) return 0;
    return Math.round((props.payment.downPayment / props.total) * 100);
});

const loanAmount = computed(() => {
    return props.total - (props.payment.downPayment || 0);
});

const showInstallmentDetails = computed(() => {
    return props.payment.method === "installment" && props.payment.downPayment > 0 && props.payment.tenor;
});

const monthlyPayment = computed(() => {
    if (!showInstallmentDetails.value) return 0;

    const principal = loanAmount.value;
    const monthlyRate = (props.payment.interestRate || 0) / 100 / 12;
    const months = props.payment.tenor;

    if (monthlyRate === 0) {
        return principal / months;
    }

    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
});

const totalInterest = computed(() => {
    return monthlyPayment.value * props.payment.tenor - loanAmount.value;
});

const totalPayment = computed(() => {
    return monthlyPayment.value * props.payment.tenor;
});

// Methods
const selectPaymentMethod = (method) => {
    emit("update:payment", {
        ...props.payment,
        method,
    });
};

const loadBankPartners = async () => {
    try {
        // TODO: Gọi API lấy danh sách ngân hàng
        const response = await $fetch("/api/bank-partners");
        bankPartners.value = response;
    } catch (error) {
        console.error("Lỗi tải ngân hàng:", error);
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

// Lifecycle
onMounted(() => {
    loadBankPartners();
});
</script>
