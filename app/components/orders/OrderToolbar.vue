<template>
    <div class="flex flex-col md:flex-row gap-4 mb-6">
        <!-- Search with invisible label -->
        <div class="flex flex-col flex-1">
            <label class="text-sm font-medium text-gray-600 mb-1 opacity-0 select-none"> Tìm kiếm </label>
            <SearchInput
                :model-value="searchQuery"
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                @update:model-value="onSearch"
            />
        </div>

        <!-- Filters -->
        <div class="flex gap-3 flex-wrap items-end">
            <!-- Status -->
            <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">Trạng thái</label>
                <select
                    :value="statusFilter"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    @change="onStatusChange"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                        {{ status.label }}
                    </option>
                </select>
            </div>

            <!-- Date From -->
            <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">Từ ngày</label>
                <DatePicker :model-value="dateFrom" placeholder="Từ ngày" @update:model-value="onDateFromChange" />
            </div>

            <!-- Date To -->
            <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">Đến ngày</label>
                <DatePicker :model-value="dateTo" placeholder="Đến ngày" @update:model-value="onDateToChange" />
            </div>

            <!-- Clear Button -->
            <button
                @click="clearFilters"
                class="px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                :disabled="!hasActiveFilters"
                :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }"
            >
                <Trash2 class="w-4 h-4" />
                Xóa bộ lọc
            </button>
        </div>
    </div>
</template>

<script setup>
import DatePicker from "@/components/shared/DatePicker.vue";
import SearchInput from "@/components/shared/SearchInput.vue";
import { Trash2 } from "lucide-vue-next"; // Import Lucide icon
const props = defineProps({
    searchQuery: {
        type: String,
        default: "",
    },
    statusFilter: {
        type: String,
        default: "",
    },
    dateFrom: {
        type: String,
        default: "",
    },
    dateTo: {
        type: String,
        default: "",
    },
    statusOptions: {
        type: Array,
        default: () => [], // [{ label, value }]
    },
});

const emit = defineEmits(["update:searchQuery", "update:statusFilter", "update:dateFrom", "update:dateTo", "filterChange"]);

const onSearch = (value) => {
    emit("update:searchQuery", value);
    emit("filterChange");
};

const onStatusChange = (event) => {
    emit("update:statusFilter", event.target.value);
    emit("filterChange");
};

const onDateFromChange = (value) => {
    emit("update:dateFrom", value);
    emit("filterChange");
};

const onDateToChange = (value) => {
    emit("update:dateTo", value);
    emit("filterChange");
};

// Kiểm tra xem có bộ lọc đang active không
const hasActiveFilters = computed(() => {
    return props.searchQuery || props.statusFilter || props.dateFrom || props.dateTo;
});

// Xóa tất cả bộ lọc
const clearFilters = () => {
    if (!hasActiveFilters.value) return;

    emit("update:searchQuery", "");
    emit("update:statusFilter", "");
    emit("update:dateFrom", "");
    emit("update:dateTo", "");
    emit("filterChange");
};
</script>
