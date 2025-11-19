<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <!-- Header -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
            <h1 class="flex items-center gap-2 text-3xl font-bold text-gray-800 tracking-tight">
                <component :is="icon" class="w-7 h-7" />
                {{ title }}
            </h1>
            <NuxtLink
                v-if="isActiveBtnCreate"
                :to="createLink"
                class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-md"
            >
                <span class="text-lg font-bold">+</span>
                <span>{{ createLabel }}</span>
            </NuxtLink>
        </header>

        <!-- Toolbar -->
        <section v-if="showToolbar" class="mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <slot name="toolbar" />
        </section>

        <!-- Loading -->
        <div v-if="pending" class="flex justify-center py-16">
            <div class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>

        <!-- Table -->
        <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <component
                :is="tableComponent"
                :fields-name="fieldsName"
                :basePath="convertLink(createLink)"
                :data="paginatedItems"
                row-key="id"
                @print="onPrint"
            >
                <!-- Forward toàn bộ slot xuống component con -->
                <template v-for="(_, name) in $slots" #[name]="slotProps">
                    <slot :name="name" v-bind="slotProps" />
                </template>
            </component>
        </div>

        <!-- Empty -->
        <div
            v-if="!pending && items.length === 0"
            class="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm mt-6"
        >
            <p class="text-gray-500 text-lg">Không có dữ liệu 📭</p>
        </div>

        <!-- Pagination -->
        <div v-if="!pending && items.length > 0" class="mt-6">
            <OrderPagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from "vue";
import OrderPagination from "@/components/orders/OrderPagination.vue";

interface BaseItem {
    id?: number | string;
    [key: string]: unknown;
}

interface Column {
    label: string;
    key: string;
}

const props = withDefaults(
    defineProps<{
        title: string;
        icon: any;
        tableComponent: any;
        fieldsName: Column[];
        createLink: string;
        createLabel: string;
        data: BaseItem[];
        showToolbar?: boolean;
        isActiveBtnCreate?: boolean;
        filterFunction?: (item: BaseItem) => boolean;
    }>(),
    {
        isActiveBtnCreate: true,
    }
);

const emit = defineEmits<{
    (e: "print", item: BaseItem): void;
}>();

const pending = ref(false);
const currentPage = ref(1);
const pageSize = 10;
const items = computed(() => props.data || []);

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;

    // Nếu có filterFunction truyền vào, áp dụng lọc trước khi phân trang
    const filtered = props.filterFunction ? items.value.filter(props.filterFunction) : items.value;

    return filtered.slice(start, end);
});

const totalPages = computed(() => {
    const total = props.filterFunction ? items.value.filter(props.filterFunction).length : items.value.length;
    return Math.ceil(total / pageSize);
});

function convertLink(path: string): string {
    const parts = path.split("/").filter(Boolean); // tách và bỏ phần rỗng
    //   if (parts.length <= 1) return parts.join("/"); // nếu chỉ có 1 phần thì trả về nguyên
    return parts.slice(0, -1).join("/"); // bỏ phần cuối
}

const changePage = (page: number) => (currentPage.value = page);

const onPrint = (item: BaseItem) => emit("print", item);

onMounted(() => {
    pending.value = true;
    setTimeout(() => (pending.value = false), 300);
});
</script>
