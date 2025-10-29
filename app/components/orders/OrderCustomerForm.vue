<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>

        <div class="space-y-4">
            <!-- Tìm khách hàng hiện có -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Tìm khách hàng hiện có </label>
                <SearchInput placeholder="Tìm theo tên, số điện thoại, email..." @search="handleCustomerSearch" />

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
                <h3 class="text-md font-medium text-gray-900 mb-3">Hoặc tạo khách hàng mới</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Họ tên <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="newCustomer.fullName"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập họ tên"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="newCustomer.phone"
                            type="tel"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            v-model="newCustomer.email"
                            type="email"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                        <input
                            v-model="newCustomer.address"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-end pt-6">
                <button
                    @click="$emit('next')"
                    :disabled="!isFormValid"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tiếp theo: Chọn sản phẩm
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    customer: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["update:customer", "next"]);

// State
const searchResults = ref([]);
const newCustomer = reactive({
    fullName: "",
    phone: "",
    email: "",
    address: "",
});

// Computed
const isFormValid = computed(() => {
    return props.customer || (newCustomer.fullName && newCustomer.phone);
});

// Methods
const handleCustomerSearch = async (query) => {
    if (!query) {
        searchResults.value = [];
        return;
    }

    // TODO: Gọi API tìm kiếm khách hàng
    try {
        const response = await $fetch("/api/customers/search", {
            params: { q: query },
        });
        searchResults.value = response;
    } catch (error) {
        console.error("Lỗi tìm kiếm khách hàng:", error);
    }
};

const selectCustomer = (customer) => {
    emit("update:customer", customer);
    searchResults.value = [];
};
</script>
