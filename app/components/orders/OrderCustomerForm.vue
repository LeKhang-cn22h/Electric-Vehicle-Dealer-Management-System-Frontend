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
                <div v-if="filteredCustomers.length > 0 && !selectedCustomer" class="mt-2 space-y-2 max-h-60 overflow-y-auto">
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

                <!-- Hiển thị khách hàng đã chọn -->
                <div v-if="selectedCustomer" class="p-4 mb-4 border rounded-xl bg-gray-50 flex items-start justify-between">
                    <div :key="selectedCustomer.id" @click="selectCustomer(selectedCustomer)">
                        <div class="font-medium">{{ selectedCustomer.name }}</div>
                        <div class="text-sm text-gray-600">
                            {{ selectedCustomer.phone }}
                            <span v-if="selectedCustomer.email"> • {{ selectedCustomer.email }}</span>
                        </div>
                    </div>

                    <!-- Nút xoá -->
                    <button
                        class="ml-4 text-red-600 hover:text-red-800 font-bold text-xl"
                        @click="clearCustomer"
                        title="Xóa khách hàng đã chọn"
                    >
                        ×
                    </button>
                </div>

                <!-- No results -->
                <div v-if="searchQuery.trim() && filteredCustomers.length === 0 && !loading" class="mt-2 text-sm text-gray-500">
                    Không tìm thấy khách hàng
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

const props = defineProps<{
    customer: Customer | null;
}>();

const emit = defineEmits<{
    (e: "update:customer", customer: Customer | null): void;
}>();

// Composable
const { customers, loading, error, fetchAll } = useCustomer();

// State
const searchQuery = ref("");
const selectedCustomer = ref<Customer | null>(null);

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

const selectCustomer = (customer: CustomerSummary) => {
    emit("update:customer", customer as Customer);
    // emit("customer-type", "existing");
    console.log("Đã chọn customer:", customer);
    selectedCustomer.value = customer as Customer;
    // isNewCustomer.value = false;
    searchQuery.value = "";
};

const clearCustomer = () => {
    selectedCustomer.value = null;
    emit("update:customer", null);
};

watch(
    () => props.customer,
    (val) => {
        if (
            val
            // && !isNewCustomer.value
        ) {
            selectedCustomer.value = val as Customer;
        }
    },
    { immediate: true }
);

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
