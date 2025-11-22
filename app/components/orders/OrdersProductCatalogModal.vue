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
                            @input="debouncedSearch"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <select
                            v-model="filters.model"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            @change="applyFilters"
                        >
                            <option value="">Tất cả</option>
                            <option v-for="model in models" :key="model" :value="model">
                                {{ model }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            v-model="filters.status"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            @change="applyFilters"
                        >
                            <option value="">Tất cả</option>
                            <option value="available">Có sẵn</option>
                            <option value="sold">Đã bán</option>
                            <option value="reserved">Đã đặt cọc</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                        <select
                            v-model="filters.priceRange"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            @change="applyFilters"
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
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p class="mt-2 text-gray-600">Đang tải...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                    <div class="text-red-600 mb-2">❌ {{ error }}</div>
                    <button 
                        @click="loadProducts" 
                        class="text-blue-600 hover:underline text-sm"
                    >
                        Thử lại
                    </button>
                </div>

                <!-- Empty State -->
                <div v-else-if="filteredProducts.length === 0" class="text-center py-12 text-gray-500">
                    <div class="text-4xl mb-2">📭</div>
                    <div>Không tìm thấy sản phẩm nào</div>
                    <button 
                        v-if="hasFilters" 
                        @click="clearFilters" 
                        class="mt-3 text-blue-600 hover:underline text-sm"
                    >
                        Xóa bộ lọc
                    </button>
                </div>

                <!-- Products Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        v-for="product in filteredProducts"
                        :key="product.id"
                        class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                        :class="{ 'opacity-60': product.status !== 'available' }"
                        @click="selectProduct(product)"
                    >
                        <!-- Product Image -->
                        <div class="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                            <img
                                v-if="getImageUrl(product)"
                                :src="getImageUrl(product)"
                                :alt="product.name || 'Product'"
                                class="w-full h-full object-cover"
                                @error="(e) => handleImageError(e, product)"
                                @load="() => console.log('✅ Image loaded:', getImageUrl(product))"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <span class="text-gray-400 text-4xl">🏍️</span>
                            </div>
                            
                            <!-- Debug overlay cho image -->
                            <div v-if="!getImageUrl(product)" class="absolute bottom-2 left-2 right-2 bg-red-500 text-white text-xs p-1 rounded">
                                No image_url field
                            </div>
                        </div>

                        <!-- Product Info -->
                        <div>
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="font-semibold text-gray-900 line-clamp-2">
                                    {{ product.name || product.model || 'Unnamed Product' }}
                                </h3>
                                <span
                                    class="px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2"
                                    :class="getStatusClass(product.status)"
                                >
                                    {{ getStatusText(product.status) }}
                                </span>
                            </div>

                            <div class="text-sm text-gray-600 mb-2">
                                <div v-if="product.model">Model: {{ product.model }}</div>
                                <div v-if="product.license_plate">Biển số: {{ product.license_plate }}</div>
                                <div v-if="product.year">Năm: {{ product.year }}</div>
                                
                                <!-- Debug price -->
                                <div v-if="!product.price && !product.selling_price" class="text-red-500 text-xs mt-1">
                                    ⚠️ No price field found
                                </div>
                            </div>

                            <div class="flex justify-between items-center mt-3">
                                <span class="text-lg font-bold text-blue-600">
                                    {{ formatCurrency(getPrice(product)) }}
                                </span>
                                <button
                                    @click.stop="selectProduct(product)"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    :disabled="product.status !== 'Còn hàng'"
                                >
                                    {{ product.status === 'Còn hàng' ? 'Chọn' : 'Không khả dụng' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t bg-gray-50">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600"> 
                        Hiển thị {{ filteredProducts.length }} / {{ allProducts.length }} sản phẩm 
                    </span>
                    <button @click="$emit('close')" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVehicle } from "~/composables/useVehicle";

console.log("[ProductModal] Component mounted");

// ====================== EMIT ======================
const emit = defineEmits<{
    (e: "close"): void;
    (e: "select", product: any): void;
}>();

// ====================== API ======================
const { 
    fetchAll,
    fetchModels,
    getListVehiclePrice,
    models, 
    loading, 
    error 
} = useVehicle();

// ====================== FILTERS ======================
const filters = reactive({
    search: "",
    model: "",
    status: "",
    priceRange: "",
});

const hasFilters = computed(() => 
    filters.search || filters.model || filters.status || filters.priceRange
);

const clearFilters = () => {
    filters.search = "";
    filters.model = "";
    filters.status = "";
    filters.priceRange = "";
    applyFilters();
};

// ====================== DATA ======================
const allProducts = ref<any[]>([]);
const filteredProducts = ref<any[]>([]);

// ====================== HELPER: GET IMAGE URL ======================
// Supabase có thể trả về nhiều field khác nhau
const getImageUrl = (product: any): string => {
    // Thử các field phổ biến
    const possibleFields = [
        'image_url',
        'imageUrl', 
        'image',
        'thumbnail',
        'photo_url',
        'avatar_url',
        'images',
        'picture'
    ];
    
    for (const field of possibleFields) {
        if (product[field]) {
            // Nếu là array, lấy phần tử đầu
            if (Array.isArray(product[field]) && product[field].length > 0) {
                return product[field][0];
            }
            // Nếu là string
            if (typeof product[field] === 'string') {
                return product[field];
            }
        }
    }
    
    console.warn('[ProductModal] No image URL found for product:', product);
    return '';
};

// ====================== HELPER: GET PRICE ======================
const getPrice = (product: any): number => {
    // Thử các field giá khác nhau
    return product.price || 
           product.selling_price || 
           product.sellingPrice ||
           product.sale_price ||
           product.salePrice ||
           0;
};

// ====================== MOUNT ======================
onMounted(async () => {
    console.log("[ProductModal] onMounted triggered");

    try {
        console.log("[ProductModal] Fetching models...");
        await fetchModels();
        console.log("[ProductModal] Models loaded:", models.value);

        console.log("[ProductModal] Loading all products...");
        await loadProducts();
        console.log("[ProductModal] Products loaded:", allProducts.value.length);
    } catch (err) {
        console.error("[ProductModal] ERROR during mounted:", err);
    }
});

// ====================== LOAD ALL PRODUCTS ======================
const loadProducts = async () => {
    console.log("[ProductModal] loadProducts() called");

    try {
        const response = await fetchAll({ limit: 100 });

        if (!response || !response.data) {
            allProducts.value = [];
            filteredProducts.value = [];
            return;
        }

        const products = response.data;
        allProducts.value = products;

        // ==== LẤY DANH SÁCH ID ====
        const vehicleIds = products.map((p: any) => p.id);
        console.log("[ProductModal] Vehicle IDs:", vehicleIds);

 
const priceData = await getListVehiclePrice(vehicleIds);
const prices = priceData?.data ?? [];  // <-- lấy array thực sự

const priceMap = new Map<number, any>();
prices.forEach((p: any) => priceMap.set(p.id, p));

allProducts.value = products.map((product: any) => {
    const p = priceMap.get(product.id);
    return {
        ...product,
        price: p?.price ?? product.price ?? 0,
        selling_price: p?.selling_price ?? product.selling_price ?? 0,
    };
});

        allProducts.value = products.map((product: any) => {
            const priceData = priceMap.get(product.id);

            return {
                ...product,
                price: priceData?.price ?? product.price ?? 0,
                selling_price: priceData?.selling_price ?? product.selling_price ?? 0
            };
        });

        filteredProducts.value = [...allProducts.value];

        console.log("[ProductModal] ✅ Final products with prices:", allProducts.value);

    } catch (err: any) {
        console.error("[ProductModal] ❌ ERROR loading products:", err);
        error.value = err.message || "Failed to load products";
        allProducts.value = [];
        filteredProducts.value = [];
    }
};


// ====================== APPLY FILTERS ======================
const applyFilters = () => {
    console.log("[ProductModal] applyFilters() triggered", filters);

    let filtered = [...allProducts.value];

    if (filters.model) {
        filtered = filtered.filter(p => p.model === filters.model);
    }

    if (filters.status) {
        filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-");
        const minValue = parseInt(min || "0") * 1_000_000;
        const maxValue = max === "+" ? Infinity : parseInt(max || "0") * 1_000_000;

        filtered = filtered.filter(p => {
            const price = getPrice(p);
            return price >= minValue && price <= maxValue;
        });
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.model?.toLowerCase().includes(searchLower) ||
            p.license_plate?.toLowerCase().includes(searchLower)
        );
    }

    filteredProducts.value = filtered;
    console.log("[ProductModal] Final filtered:", filteredProducts.value.length);
};

// ====================== DEBOUNCED SEARCH ======================
let debounceTimer: NodeJS.Timeout | null = null;

const debouncedSearch = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applyFilters(), 300);
};

// ====================== IMAGE ERROR ======================
const handleImageError = (e: Event, product: any) => {
    console.error('[ProductModal] ❌ Image failed to load:', {
        url: getImageUrl(product),
        product: product
    });
    
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
};

// ====================== FORMAT CURRENCY ======================
const formatCurrency = (value: number) => {
    if (!value || value === 0) return 'Liên hệ';
    
    return new Intl.NumberFormat("vi-VN", { 
        style: "currency", 
        currency: "VND" 
    }).format(value);
};

// ====================== STATUS CLASS ======================
const getStatusClass = (status: string) => {
    switch (status) {
        case "available":
            return "bg-green-100 text-green-800";
        case "sold":
            return "bg-red-100 text-red-800";
        case "reserved":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

// ====================== STATUS TEXT ======================
const getStatusText = (status: string) => {
    switch (status) {
        case "available":
            return "Có sẵn";
        case "sold":
            return "Đã bán";
        case "reserved":
            return "Đã đặt cọc";
        default:
            return status || "N/A";
    }
};

// ====================== SELECT PRODUCT ======================
const selectProduct = (product: any) => {
    console.log("[ProductModal] selectProduct:", product);

    if (product.status !== "available") {
        console.warn("[ProductModal] Product not available:", product);
        return;
    }

    emit("select", product);
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>