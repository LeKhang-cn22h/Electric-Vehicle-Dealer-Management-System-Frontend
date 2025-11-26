<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatCurrency } from "../../utils/format";
import { CalendarClock, Gauge, Settings, Fuel } from "lucide-vue-next";
import { useVehicle } from "~/composables/useVehicle";
definePageMeta({
    layout: "default",
});

const route = useRoute();
const id = computed(() => Number(route.params.id));
const { vehicle, loading, error, fetchOne, getSimilarVehicles } = useVehicle();

onMounted(async () => {
    await fetchOne(id.value);

    try {
        relatedLoading.value = true;
        const res = await getSimilarVehicles(id.value, 4);
        console.log("Similar vehicles:", res);
        relatedCars.value = (res as any).data ?? res;
    } catch (e: any) {
        console.error("Lỗi khi load sản phẩm gợi ý:", e);
        relatedError.value = e.message || "Không tải được sản phẩm gợi ý";
    } finally {
        relatedLoading.value = false;
    }
});

const car = computed(() => vehicle.value);

const formattedPrice = computed(() => {
    if (!car.value) return "Liên hệ";
    return car.value.price && car.value.price > 0 ? formatCurrency(car.value.price) : "Liên hệ";
});

const selectedImageIndex = ref(0);

// Computed để sort images (ảnh chính lên đầu)
const sortedImages = computed(() => {
    if (!car.value?.images || car.value.images.length === 0) return [];

    return [...car.value.images].sort((a, b) => {
        // Ảnh is_main = true lên đầu
        return (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0);
    });
});

// Computed ảnh hiện tại
const currentImage = computed(() => {
    if (sortedImages.value.length === 0) {
        return "https://via.placeholder.com/800x500?text=No+Image";
    }
    return sortedImages.value[selectedImageIndex.value]?.imageUrl || "https://via.placeholder.com/800x500?text=No+Image";
});

// Function select image
const selectImage = (index: number) => {
    selectedImageIndex.value = index;
};

const selectedColor = ref<string | null>(null);

const tabs = ["specs", "features", "description"] as const;
type TabType = (typeof tabs)[number];
const activeTab = ref<TabType>("specs");
type RelatedCar = {
    id: number;
    name: string;
    imageUrl: string;
    price?: number | null;
    tagline?: string | null;
};
const relatedCars = ref<RelatedCar[]>([]);
const relatedLoading = ref(false);
const relatedError = ref<string | null>(null);
</script>

<template>
    <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p class="mt-4 text-gray-600">Đang tải thông tin xe...</p>
        </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <p class="text-red-600 text-lg mb-4">❌ {{ error }}</p>
            <NuxtLink
                to="/product"
                class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                ← Quay lại danh sách
            </NuxtLink>
        </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!car" class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <p class="text-gray-600 text-lg mb-4">Không tìm thấy xe với ID: {{ id }}</p>
            <NuxtLink
                to="/product"
                class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                ← Quay lại danh sách
            </NuxtLink>
        </div>
    </div>

    <!-- Main content -->
    <div v-else class="min-h-screen bg-gray-50 font-sans pb-20">
        <!-- Breadcrumb -->
        <div class="bg-white border-b border-gray-200 py-4">
            <div class="max-w-7xl mx-auto px-6">
                <nav class="flex items-center gap-3 text-sm">
                    <NuxtLink to="/user/home" class="text-gray-500 hover:text-indigo-500 transition-colors"> Trang chủ </NuxtLink>
                    <span class="text-gray-300">›</span>
                    <NuxtLink to="/product" class="text-gray-500 hover:text-indigo-500 transition-colors"> Sản phẩm </NuxtLink>
                    <span class="text-gray-300">›</span>
                    <span class="text-gray-800 font-semibold">{{ car.name }}</span>
                </nav>
            </div>
        </div>

        <!-- Main content -->
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8 mb-16">
                <!-- Image gallery -->
                <div class="sticky top-6 h-fit">
                    <!-- Main image -->
                    <div class="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl mb-4">
                        <img :src="currentImage" :alt="car.name" class="w-full h-full object-cover" />
                        <div
                            v-if="car.status"
                            class="absolute top-5 left-5 bg-emerald-500/95 text-white px-4 py-2 rounded-full font-semibold text-sm backdrop-blur-lg"
                        >
                            {{ car.status }}
                        </div>
                    </div>

                    <!-- Thumbnails -->
                    <div v-if="sortedImages.length > 0" class="grid grid-cols-5 gap-3 mb-4">
                        <button
                            v-for="(img, index) in sortedImages"
                            :key="img.id || index"
                            :class="[
                                'relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 cursor-pointer transition-all border-2',
                                selectedImageIndex === index
                                    ? 'border-indigo-500 shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                                    : 'border-transparent hover:border-gray-300',
                            ]"
                            @click="selectImage(index)"
                        >
                            <img
                                :src="img.imageUrl || 'https://via.placeholder.com/200x150'"
                                :alt="`${car.name} ${index + 1}`"
                                class="w-full h-full object-cover"
                            />
                            <!-- Badge nếu là ảnh chính -->
                            <div
                                v-if="img.is_main"
                                class="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            >
                                *
                            </div>
                        </button>
                    </div>

                    <!-- Color selector -->
                    <div v-if="car.color" class="flex items-center gap-3">
                        <span class="text-sm text-gray-600 font-medium">Màu sắc:</span>
                        <!-- Nếu car.color là string -->
                        <div
                            v-if="typeof car.color === 'string'"
                            class="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                        >
                            {{ car.color }}
                        </div>
                        <!-- Nếu car.color là array (nhiều màu) -->
                        <template v-else-if="Array.isArray(car.color)">
                            <div
                                v-for="(color, index) in car.color"
                                :key="index"
                                @click="selectedColor = color"
                                class="w-8 h-8 rounded-full cursor-pointer border-2 transition-all hover:scale-110"
                                :class="[selectedColor === color ? 'border-gray-900 scale-110 shadow-lg' : 'border-gray-300']"
                                :style="{ backgroundColor: color }"
                                :title="color"
                            ></div>
                        </template>
                    </div>
                </div>

                <!-- Info -->
                <div class="flex flex-col gap-8">
                    <div class="pb-6 border-b-2 border-gray-200">
                        <h1 class="text-3xl font-extrabold text-gray-800 mb-2">
                            {{ car.name }}
                        </h1>
                        <p v-if="car.tagline" class="text-gray-500 font-medium">
                            {{ car.tagline }}
                        </p>
                    </div>

                    <!-- Price box -->
                    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
                        <div class="text-4xl font-extrabold mb-1">{{ formattedPrice }}</div>
                        <div class="text-sm opacity-90">Liên hệ để biết thêm chi tiết</div>
                    </div>

                    <!-- Specs summary -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-lg">
                        <div v-if="car.year" class="flex gap-3 items-center">
                            <CalendarClock class="text-blue-800" />
                            <div>
                                <span class="text-xs text-gray-500 block mb-0.5">Năm</span>
                                <span class="text-sm text-gray-800 font-semibold">{{ car.year }}</span>
                            </div>
                        </div>

                        <div v-if="car.mileage" class="flex gap-3 items-center">
                            <Gauge class="text-yellow-300" />
                            <div>
                                <span class="text-xs text-gray-500 block mb-0.5">Km</span>
                                <span class="text-sm text-gray-800 font-semibold">{{ car.mileage }}</span>
                            </div>
                        </div>

                        <div v-if="car.transmission" class="flex gap-3 items-center">
                            <Settings />
                            <div>
                                <span class="text-xs text-gray-500 block mb-0.5">Hộp số</span>
                                <span class="text-sm text-gray-800 font-semibold">{{ car.transmission }}</span>
                            </div>
                        </div>

                        <div v-if="car.fuel_type" class="flex gap-3 items-center">
                            <Fuel class="text-red-500" />
                            <div>
                                <span class="text-xs text-gray-500 block mb-0.5">Nhiên liệu</span>
                                <span class="text-sm text-gray-800 font-semibold">{{ car.fuel_type }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Benefits -->
                    <div v-if="car.benefits && car.benefits.length > 0" class="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Ưu đãi</h3>
                        <ul class="grid gap-3">
                            <li v-for="b in car.benefits" :key="b.id" class="flex items-center gap-3 text-gray-600 text-sm">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    class="text-emerald-500 flex-shrink-0"
                                >
                                    <path
                                        d="M20 6L9 17l-5-5"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                {{ b.benefit }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
                <div class="flex border-b-2 border-gray-100 overflow-x-auto scrollbar-hide">
                    <button
                        v-for="tab in tabs"
                        :key="tab"
                        :class="[
                            'flex-1 py-5 px-6 text-base font-semibold transition-all relative',
                            activeTab === tab
                                ? 'text-indigo-500 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600'
                                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-50',
                        ]"
                        @click="activeTab = tab as TabType"
                    >
                        {{ tab === "specs" ? "Thông số" : tab === "features" ? "Trang bị" : "Mô tả" }}
                    </button>
                </div>

                <div class="p-8">
                    <!-- Specs -->
                    <div v-show="activeTab === 'specs'" class="animate-fade-in">
                        <div class="divide-y divide-gray-200 rounded-xl overflow-hidden">
                            <div v-if="car.origin" class="flex justify-between py-4 px-6 bg-gray-50">
                                <span class="text-gray-500 text-sm">Xuất xứ</span>
                                <span class="text-gray-800 font-semibold text-sm">{{ car.origin }}</span>
                            </div>
                            <div v-if="car.seats" class="flex justify-between py-4 px-6 bg-gray-50">
                                <span class="text-gray-500 text-sm">Số chỗ</span>
                                <span class="text-gray-800 font-semibold text-sm">{{ car.seats }}</span>
                            </div>
                            <div v-if="car.engine" class="flex justify-between py-4 px-6 bg-gray-50">
                                <span class="text-gray-500 text-sm">Động cơ</span>
                                <span class="text-gray-800 font-semibold text-sm">{{ car.engine }}</span>
                            </div>
                            <div v-if="car.color" class="flex justify-between py-4 px-6 bg-gray-50">
                                <span class="text-gray-500 text-sm">Màu</span>
                                <span class="text-gray-800 font-semibold text-sm">
                                    {{ typeof car.color === "string" ? car.color : car.color.join(", ") }}
                                </span>
                            </div>
                            <div v-if="car.model" class="flex justify-between py-4 px-6 bg-gray-50">
                                <span class="text-gray-500 text-sm">Model</span>
                                <span class="text-gray-800 font-semibold text-sm">{{ car.model }}</span>
                            </div>
                            <div v-if="car.version" class="flex justify-between py-4 px-6 bg-gray-50">
                                <span class="text-gray-500 text-sm">Phiên bản</span>
                                <span class="text-gray-800 font-semibold text-sm">{{ car.version }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Features -->
                    <div v-show="activeTab === 'features'" class="animate-fade-in">
                        <div v-if="car.features && car.features.length > 0" class="grid md:grid-cols-2 gap-8">
                            <div v-for="(f, index) in car.features" :key="f.id || index" class="bg-gray-50 p-6 rounded-xl">
                                <h3 class="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-200">
                                    {{ f.category }}
                                </h3>
                                <div class="flex items-center gap-3 text-gray-600 text-sm">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        class="text-indigo-500 flex-shrink-0"
                                    >
                                        <path
                                            d="M20 6L9 17l-5-5"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    {{ f.item }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-gray-500 py-8">Chưa có thông tin trang bị</div>
                    </div>

                    <!-- Description -->
                    <div v-show="activeTab === 'description'" class="animate-fade-in">
                        <div v-if="car.description" class="text-base leading-relaxed text-gray-600">
                            <p>{{ car.description }}</p>
                        </div>
                        <div v-else class="text-center text-gray-500 py-8">Chưa có mô tả chi tiết</div>
                    </div>
                </div>
            </div>

            <!-- Related Cars -->
            <div class="max-w-7xl mx-auto px-6 mb-20">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Sản phẩm gợi ý</h2>

                <!-- Đang tải -->
                <div v-if="relatedLoading" class="text-gray-500 py-6">Đang tải sản phẩm gợi ý...</div>

                <!-- Lỗi -->
                <div v-else-if="relatedError" class="text-red-500 py-6">
                    {{ relatedError }}
                </div>

                <!-- Không có gợi ý -->
                <div v-else-if="!relatedCars.length" class="text-gray-500 py-6">Chưa có sản phẩm gợi ý phù hợp.</div>

                <!-- Có dữ liệu từ BE -->
                <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div
                        v-for="relatedCar in relatedCars"
                        :key="relatedCar.id"
                        class="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <NuxtLink :to="`/product/${relatedCar.id}`">
                            <img :src="relatedCar.imageUrl" :alt="relatedCar.name" class="w-full aspect-video object-cover" />
                            <div class="p-4">
                                <h3 class="font-bold text-gray-800 mb-1">
                                    {{ relatedCar.name }}
                                </h3>
                                <p v-if="relatedCar.tagline" class="text-sm text-gray-500 mb-2">
                                    {{ relatedCar.tagline }}
                                </p>
                                <div v-if="relatedCar.price" class="text-indigo-600 font-semibold">
                                    {{ formatCurrency(relatedCar.price) }}
                                </div>
                                <div v-else class="text-gray-500 text-sm">Liên hệ để biết giá</div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
.scrollbar-hide {
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
