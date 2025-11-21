<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>

        <div class="space-y-4">
            <!-- Tìm khách hàng hiện có -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tìm khách hàng hiện có</label>
                <SearchInput v-model="searchQuery" placeholder="Tìm theo tên, số điện thoại, email..." />

                <!-- Loading state -->
                <div v-if="loading" class="mt-2 text-sm text-gray-500">Đang tải...</div>

                <!-- Danh sách kết quả tìm kiếm -->
                <!-- Danh sách khách hàng -->
<div v-if="filteredCustomers.length > 0" class="mt-2 space-y-2 max-h-60 overflow-y-auto">
    <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        @click="selectCustomer(customer)"
    >
        <div class="font-medium">{{ customer.name }}</div>
        <div class="text-sm text-gray-600">
            {{ customer.phone }}
            <span v-if="customer.email"> • {{ customer.email }}</span>
        </div>
    </div>
</div>


                <!-- No results -->
                <div v-if="searchQuery.trim() && filteredCustomers.length === 0 && !loading" class="mt-2 text-sm text-gray-500">
                    Không tìm thấy khách hàng
                </div>
            </div>

            <!-- Hoặc tạo khách hàng mới -->
            <div class="border-t pt-4">
                <button
                    @click="showFormNewCustomer"
                    :disabled="isNewCustomer"
                    class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span class="text-lg font-bold">+</span>
                    <span>Tạo khách hàng mới</span>
                </button>

                <div v-if="isNewCustomer">
                    <h3 class="text-md font-medium text-gray-900 mb-3 pt-4">Khách hàng mới</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Họ tên -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Họ tên <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="newCustomer.name"
                                type="text"
                                @input="validateField('name')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập họ tên"
                            />
                            <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
                        </div>

                        <!-- Số điện thoại -->
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

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                v-model="newCustomer.email"
                                type="email"
                                @input="validateField('email')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập email"
                            />
                            <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
                        </div>

                        <!-- Ngày sinh -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input
                                v-model="newCustomer.birth_day"
                                type="date"
                                @input="validateField('birth_day')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span v-if="errors.birth_day" class="text-red-500 text-sm">{{ errors.birth_day }}</span>
                        </div>

                        <!-- Giới tính -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                            <select
                                v-model="newCustomer.gender"
                                @change="validateField('gender')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                            <span v-if="errors.gender" class="text-red-500 text-sm">{{ errors.gender }}</span>
                        </div>

                        <!-- Địa chỉ -->
                        <div class="md:col-span-2">
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

            <!-- Error message -->
            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import SearchInput from "@/components/shared/SearchInput.vue";
import { useCustomer } from "~/composables/useCustomer";
import type { Customer, CustomerSummary } from "~/types/profile";

// Types
interface CreateCustomer {
    name: string;
    email?: string;
    phone: string;
    birth_day?: string;
    gender?: string;
    address?: string;
}

const props = defineProps<{
    customer: Customer | null | CreateCustomer;
}>();

const emit = defineEmits<{
    (e: "update:customer", customer: Customer | CreateCustomer): void;
    (e: "customer-type", type: "existing" | "new"): void;
    (e: "form-valid", isValid: boolean): void;
}>();

// Composable
const { customers, loading, error, fetchAll } = useCustomer();

// State
const searchQuery = ref("");
const isNewCustomer = ref(false);

const newCustomer = reactive<CreateCustomer>({
    name: "",
    phone: "",
    email: "",
    birth_day: "",
    gender: "",
    address: "",
});

const errors = reactive<Partial<Record<keyof CreateCustomer, string>>>({});

// Computed - Filter customers locally
const filteredCustomers = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return customers.value; // trả về tất cả khách hàng nếu search rỗng

    return customers.value.filter((customer) => {
        const matchName = customer.name?.toLowerCase().includes(query);
        const matchPhone = customer.phone?.toLowerCase().includes(query);
        const matchEmail = customer.email?.toLowerCase().includes(query);
        return matchName || matchPhone || matchEmail;
    });
});


// Form validation
const isFormValid = computed(() => {
    return Boolean(
        Object.keys(errors).length === 0 && 
        newCustomer.name && 
        newCustomer.phone && 
        isNewCustomer.value
    );
});

// Watch và emit khi validation thay đổi
watch(isFormValid, (val) => {
    emit("form-valid", val);
});

// Methods
const showFormNewCustomer = () => {
    isNewCustomer.value = true;
    searchQuery.value = "";
    emit("update:customer", newCustomer);
    emit("customer-type", "new");
};

const selectCustomer = (customer: CustomerSummary) => {
    emit("update:customer", customer as Customer);
    emit("customer-type", "existing");
    isNewCustomer.value = false;
    searchQuery.value = "";
};

const onlyNumber = (event: KeyboardEvent) => {
    const charCode = event.which || event.keyCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
};

const validateField = (field: keyof CreateCustomer) => {
    delete errors[field];

    // Validate name
    if (field === "name" && !newCustomer.name) {
        errors.name = "Họ tên là bắt buộc";
    }

    // Validate phone
    if (field === "phone") {
        if (!newCustomer.phone) {
            errors.phone = "Số điện thoại là bắt buộc";
        } else if (!/^[0-9]{10,11}$/.test(newCustomer.phone)) {
            errors.phone = "Số điện thoại không hợp lệ";
        }
    }

    // Validate email
    if (field === "email" && newCustomer.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
            errors.email = "Email không hợp lệ";
        }
    }
};

// Lifecycle
onMounted(async () => {
    try {
        await fetchAll();
        console.log("Customers:", customers.value);

    } catch (err) {
        console.error("Error loading customers:", err);
    }
});
</script>