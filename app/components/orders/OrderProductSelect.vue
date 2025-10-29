<template>
    <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Chọn sản phẩm</h2>

        <div class="space-y-4">
            <!-- Tìm và chọn sản phẩm -->
            <div class="flex gap-4">
                <button
                    @click="showProductCatalog = true"
                    class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                    Danh mục xe
                </button>
            </div>

            <!-- Danh sách sản phẩm đã chọn -->
            <div v-if="items.length > 0" class="border rounded-lg">
                <div class="bg-gray-50 px-4 py-3 border-b">
                    <h3 class="font-medium text-gray-900">Sản phẩm đã chọn</h3>
                </div>

                <div class="divide-y">
                    <div v-for="(item, index) in items" :key="item.id || index" class="p-4 flex justify-between items-center">
                        <div class="flex-1">
                            <div class="font-medium">{{ item.productName }}</div>
                            <div class="text-sm text-gray-600">{{ item.skuCode }} • {{ item.color }}</div>
                            <div class="text-sm font-medium text-blue-600">
                                {{ formatCurrency(item.unitPrice) }}
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-2">
                                <button
                                    @click="updateQuantity(index, item.quantity - 1)"
                                    :disabled="item.quantity <= 1"
                                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                >
                                    -
                                </button>
                                <span class="w-8 text-center">{{ item.quantity }}</span>
                                <button
                                    @click="updateQuantity(index, item.quantity + 1)"
                                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>

                            <button @click="removeItem(index)" class="text-red-600 hover:text-red-800">✕</button>
                        </div>
                    </div>
                </div>

                <!-- Tổng cộng -->
                <div class="bg-gray-50 px-4 py-3 border-t">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">Tổng cộng:</span>
                        <span class="font-medium text-lg">{{ formatCurrency(itemsTotal) }}</span>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between pt-6">
                <button @click="$emit('back')" class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
                    Quay lại
                </button>
                <button
                    @click="$emit('next')"
                    :disabled="items.length === 0"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    Tiếp theo: Khuyến mãi
                </button>
            </div>
        </div>
    </div>
    <ProductCatalogModal v-if="showProductCatalog" @close="showProductCatalog = false" @select="addProductToOrder" />
</template>

<script setup>
import { ref, computed } from "vue";
import SearchInput from "@/components/shared/SearchInput.vue";
import ProductCatalogModal from "@/components/orders/OrdersProductCatalogModal.vue";
/**
 * @typedef {import('@/types/ProductItem').ProductItem} ProductItem
 */

const props = defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    searchQuery: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["back", "next", "update:items", "update:searchQuery", "filterChange"]);

const showProductCatalog = ref(false);

const handleProductSearch = (value) => {
    emit("update:searchQuery", value);
    emit("filterChange");
};

const updateQuantity = (index, newQty) => {
    const updated = [...props.items];
    if (updated[index]) {
        updated[index].quantity = Math.max(newQty, 1);
        emit("update:items", updated);
    }
};

const removeItem = (index) => {
    const updated = props.items.filter((_, i) => i !== index);
    emit("update:items", updated);
};

const itemsTotal = computed(() => props.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));

const addProductToOrder = (productItem) => {
    // Kiểm tra sản phẩm đã tồn tại chưa
    const existingIndex = props.items.findIndex((item) => item.id === productItem.id);

    if (existingIndex >= 0) {
        // Nếu đã có, tăng số lượng
        const updated = [...props.items];
        updated[existingIndex].quantity += 1;
        emit("update:items", updated);
    } else {
        // Nếu chưa có, thêm mới
        emit("update:items", [...props.items, productItem]);
    }

    showProductCatalog.value = false;
};
</script>
