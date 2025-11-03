<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>

        <div class="space-y-4">
            <!-- Tìm khách hàng hiện có -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Tìm khách hàng hiện có </label>
                <SearchInput v-model="searchQuery" placeholder="Tìm theo tên, số điện thoại, email..." />

                <!-- Danh sách kết quả tìm kiếm -->
                <div v-if="searchResults.length > 0" class="mt-2 space-y-2">
                    <div
                        v-for="customer in searchResults"
                        :key="customer.id"
                        class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        @click="selectCustomer(customer)"
                    >
                        <div class="font-medium">{{ customer.fullName }}</div>
                        <div class="text-sm text-gray-600">{{ customer.phone }} • {{ customer.email }}</div>
                    </div>
                </div>
            </div>

            <!-- Hoặc tạo khách hàng mới -->
            <div class="border-t pt-4">
                <button
                    @click="showFormNewCustomer"
                    :disabled="isNewCustomer"
                    class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-md"
                >
                    <span class="text-lg font-bold">+</span>
                    <span>Tạo khách hàng mới</span>
                </button>

                <div v-if="isNewCustomer">
                    <h3 class="text-md font-medium text-gray-900 mb-3 pt-4">Khách hàng mới</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Họ tên <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="newCustomer.fullName"
                                type="text"
                                @input="validateField('fullName')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập họ tên"
                            />
                            <span v-if="errors.fullName" class="text-red-500 text-sm">{{ errors.fullName }}</span>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="newCustomer.phone"
                                type="tel"
                                @keypress="onlyNumber"
                                @input="validateField('phone')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số điện thoại"
                            />
                            <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                v-model="newCustomer.email"
                                type="email"
                                @input="validateField('email')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập email"
                            />
                            <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                v-model="newCustomer.address"
                                type="text"
                                @input="validateField('address')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập địa chỉ"
                            />
                            <span v-if="errors.address" class="text-red-500 text-sm">{{ errors.address }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Navigation -->
            <!-- <div class="flex justify-end pt-6">
                <button
                    @click="handleNext"
                    :disabled="!isFormValid"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tiếp theo: Chọn sản phẩm
                </button>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchInput from "@/components/shared/SearchInput.vue";
import { CustomerSchema, CreateCustomerSchema } from "@/schemas";
import type { Customer, CreateCustomer } from "@/schemas";
import { useDebounceFn } from "@vueuse/core";
import { z } from "zod";
import type { ApiResponse } from "@/types/";

const props = defineProps<{
    customer: Customer | null | CreateCustomer;
}>();

const emit = defineEmits<{
    (e: "update:customer", customer: Customer | CreateCustomer): void;
    (e: "customer-type", type: "existing" | "new"): void;
    (e: "form-valid", isValid: boolean): void;
}>();

// State
const searchQuery = ref("");
const searchResults = ref<Customer[]>([]);
const newCustomer = reactive<CreateCustomer>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
});

const isNewCustomer = ref(false);
const showFormNewCustomer = () => {
    isNewCustomer.value = true;
    searchQuery.value = "";
    searchResults.value = [];
    emit("update:customer", newCustomer);
    emit("customer-type", "new");
};
// Chỉ cho phép nhập số
const onlyNumber = (event: KeyboardEvent) => {
    const charCode = event.which || event.keyCode;
    // Cho phép: số 0-9
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
};

const errors = reactive<Partial<Record<keyof CreateCustomer, string>>>({});

// Hàm kiểm tra validate của các input
function validateField(field: keyof CreateCustomer) {
    delete errors[field];
    try {
        CreateCustomerSchema.pick({ [field]: true }).parse({
            [field]: newCustomer[field],
        });
    } catch (err) {
        if (err instanceof z.ZodError && err.issues.length > 0) {
            const issue = err.issues[0];
            if (issue) {
                errors[field] = issue.message;
            }
        }
    }
}

const isFormValid = computed(() => {
    return Boolean(Object.keys(errors).length === 0 && newCustomer.fullName && newCustomer.phone && isNewCustomer);
});

// Watch và emit khi validation thay đổi
watch(isFormValid, (val) => {
    emit("form-valid", val);
});

// Hàm search API
const handleCustomerSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
        searchResults.value = [];
        return;
    }

    try {
        const response = await $fetch<ApiResponse<Customer[]>>("/api/customers/search", {
            params: { q: query.trim() },
        });
        searchResults.value = response.data;
    } catch (err) {
        console.error("Error searching customers:", err);
        searchResults.value = [];
    }
};

const debouncedSearch = useDebounceFn(handleCustomerSearch, 300);

// Watch searchQuery và tự động search
watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery);
});

const selectCustomer = (customer: Customer) => {
    emit("update:customer", customer);
    emit("customer-type", "existing");
    isNewCustomer.value = false;
    searchResults.value = [];
    searchQuery.value = "";
};
</script>
