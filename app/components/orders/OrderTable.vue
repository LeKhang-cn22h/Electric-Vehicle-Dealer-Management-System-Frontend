<!-- components/common/BaseTable.vue -->
<template>
    <div class="border border-gray-300 rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-black">
                <tr>
                    <th
                        v-for="(field, i) in fieldsName"
                        :key="i"
                        class="px-4 py-4 text-center text-base font-semibold text-white truncate w-[120px] max-w-[150px]"
                    >
                        {{ field.label }}
                    </th>
                </tr>
            </thead>

            <!-- Có dữ liệu -->
            <tbody v-if="data.length">
                <tr
                    v-for="(row, rowIndex) in data"
                    :key="rowKey ? row[rowKey] : rowIndex"
                    :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-200'"
                    class="transition-colors"
                >
                    <td v-for="field in fieldsName" :key="field.key" class="px-4 py-3 text-sm text-center">
                        <!-- Nếu là cột thao tác thì dùng phần riêng -->
                        <div v-if="field.key === 'actions'" class="flex gap-2 justify-center">
                            <NuxtLink
                                :to="`/${basePath}/${row[rowKey]}`"
                                class="text-gray-400 hover:text-black transition-colors"
                                title="Xem chi tiết"
                            >
                                <Eye class="w-5 h-5" />
                            </NuxtLink>
                            <button
                                class="text-gray-400 hover:text-black transition-colors"
                                title="In hóa đơn"
                                @click="$emit('print', row)"
                            >
                                <Printer class="w-5 h-5" />
                            </button>
                        </div>

                        <!-- Còn lại thì hiển thị nội dung hoặc slot -->
                        <template v-else>
                            <slot :name="field.key" :row="row">
                                {{ row[field.key] }}
                            </slot>
                        </template>
                    </td>
                </tr>
            </tbody>

            <!-- Không có dữ liệu -->
            <tbody v-else>
                <tr>
                    <td :colspan="fieldsName.length" class="px-4 py-12 text-center text-gray-500">
                        <FileText class="w-12 h-12 mb-3 text-gray-400 mx-auto" />
                        <p class="text-lg font-medium">Không có dữ liệu nào</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { Eye, Printer, FileText } from "lucide-vue-next";

interface Column {
    label: string;
    key: string;
}

defineEmits(["print"]);

defineProps<{
    fieldsName: Column[];
    data: [];
    rowKey: string;
    basePath?: string; // ví dụ: 'orders' -> link thành /orders/:id
}>();
</script>
