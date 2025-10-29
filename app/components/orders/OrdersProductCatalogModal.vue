<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-xl font-semibold text-gray-900">Danh mục sản phẩm</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <!-- Filters -->
            <div class="p-6 border-b bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Tên xe, model..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Hãng xe</label>
                        <select
                            v-model="filters.brand"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="Honda">Honda</option>
                            <option value="Yamaha">Yamaha</option>
                            <option value="Suzuki">Suzuki</option>
                            <option value="SYM">SYM</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                        <select
                            v-model="filters.category"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="scooter">Xe tay ga</option>
                            <option value="manual">Xe số</option>
                            <option value="sport">Xe thể thao</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                        <select
                            v-model="filters.priceRange"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="0-30">Dưới 30 triệu</option>
                            <option value="30-50">30 - 50 triệu</option>
                            <option value="50-100">50 - 100 triệu</option>
                            <option value="100+">Trên 100 triệu</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Product List -->
            <div class="flex-1 overflow-y-auto p-6">
                <div v-if="filteredProducts.length === 0" class="text-center py-12 text-gray-500">
                    Không tìm thấy sản phẩm nào
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        v-for="product in filteredProducts"
                        :key="product.id"
                        class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                        @click="selectProduct(product)"
                    >
                        <!-- Product Image -->
                        <div class="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <span class="text-gray-400 text-4xl">🏍️</span>
                        </div>

                        <!-- Product Info -->
                        <div>
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
                                <span
                                    class="px-2 py-1 text-xs rounded-full"
                                    :class="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                >
                                    {{ product.inStock ? "Còn hàng" : "Hết hàng" }}
                                </span>
                            </div>

                            <div class="text-sm text-gray-600 mb-2">
                                <div>SKU: {{ product.sku }}</div>
                                <div>Màu: {{ product.colors.join(", ") }}</div>
                            </div>

                            <div class="flex justify-between items-center">
                                <span class="text-lg font-bold text-blue-600">
                                    {{ formatCurrency(product.price) }}
                                </span>
                                <button
                                    @click.stop="selectProduct(product)"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    :disabled="!product.inStock"
                                >
                                    {{ product.inStock ? "Chọn" : "Hết hàng" }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t bg-gray-50">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600"> Tìm thấy {{ filteredProducts.length }} sản phẩm </span>
                    <button @click="$emit('close')" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from "@/utils/format";

/**
 * @typedef {import('@/types/ProductItem').ProductItem} ProductItem
 */

const emit = defineEmits(["close", "select"]);

// Filters state
const filters = reactive({
    search: "",
    brand: "",
    category: "",
    priceRange: "",
});

// Mock data - Thay bằng API call thực tế
const products = ref([
    {
        id: 1,
        name: "Honda Vision 2024",
        sku: "HON-VIS-2024",
        brand: "Honda",
        category: "scooter",
        colors: ["Đỏ", "Đen", "Trắng"],
        price: 32000000,
        inStock: true,
    },
    {
        id: 2,
        name: "Yamaha Exciter 155",
        sku: "YAM-EXC-155",
        brand: "Yamaha",
        category: "sport",
        colors: ["Xanh GP", "Đen", "Đỏ"],
        price: 48000000,
        inStock: true,
    },
    {
        id: 3,
        name: "Honda SH Mode 2024",
        sku: "HON-SHM-2024",
        brand: "Honda",
        category: "scooter",
        colors: ["Đen", "Xám", "Trắng"],
        price: 55000000,
        inStock: true,
    },
    {
        id: 4,
        name: "Yamaha Sirius",
        sku: "YAM-SIR-2024",
        brand: "Yamaha",
        category: "manual",
        colors: ["Đen", "Đỏ"],
        price: 22000000,
        inStock: false,
    },
    {
        id: 5,
        name: "Honda Wave Alpha",
        sku: "HON-WAV-ALP",
        brand: "Honda",
        category: "manual",
        colors: ["Đen", "Xanh", "Đỏ"],
        price: 19000000,
        inStock: true,
    },
    {
        id: 6,
        name: "SYM Star SR 170",
        sku: "SYM-STR-170",
        brand: "SYM",
        category: "sport",
        colors: ["Đen", "Trắng"],
        price: 65000000,
        inStock: true,
    },
    {
        id: 7,
        name: "Honda Air Blade 160",
        sku: "HON-AIR-160",
        brand: "Honda",
        category: "scooter",
        colors: ["Đen", "Xanh", "Trắng"],
        price: 42000000,
        inStock: true,
    },
    {
        id: 8,
        name: "Yamaha Janus",
        sku: "YAM-JAN-2024",
        brand: "Yamaha",
        category: "scooter",
        colors: ["Hồng", "Xanh", "Trắng"],
        price: 29000000,
        inStock: true,
    },
]);

// Computed filtered products
const filteredProducts = computed(() => {
    return products.value.filter((product) => {
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchName = product.name.toLowerCase().includes(searchLower);
            const matchSku = product.sku.toLowerCase().includes(searchLower);
            if (!matchName && !matchSku) return false;
        }

        // Brand filter
        if (filters.brand && product.brand !== filters.brand) {
            return false;
        }

        // Category filter
        if (filters.category && product.category !== filters.category) {
            return false;
        }

        // Price range filter
        if (filters.priceRange) {
            const price = product.price / 1000000; // Convert to millions
            const [min, max] = filters.priceRange.split("-");

            if (max === "+") {
                if (price < parseInt(min)) return false;
            } else {
                if (price < parseInt(min) || price > parseInt(max)) return false;
            }
        }

        return true;
    });
});

/**
 * Select product and convert to ProductItem format
 * @param {Object} product - Product from catalog
 */
const selectProduct = (product) => {
    if (!product.inStock) return;

    // Convert product catalog format to ProductItem format
    /** @type {ProductItem} */
    const productItem = {
        id: product.id,
        productName: product.name,
        skuCode: product.sku,
        color: product.colors[0], // Default to first color
        unitPrice: product.price,
        quantity: 1,
    };

    emit("select", productItem);
};
</script>
