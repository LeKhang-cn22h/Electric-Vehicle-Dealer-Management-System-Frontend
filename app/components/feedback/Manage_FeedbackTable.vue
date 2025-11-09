<template>
  <div class="p-4 bg-gray-50 rounded-lg shadow-md">
    <!-- Input tìm kiếm -->
    <input
      :value="keyword"
      @input="updateKeyword"
      type="text"
      placeholder="Tìm kiếm..."
      class="border border-gray-300 px-4 py-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg border border-gray-200">
        <thead class="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Tiêu đề</th>
            <th class="px-4 py-3 text-left">Ngày gửi</th>
            <th class="px-4 py-3 text-left">Trạng thái</th>
            <th class="px-4 py-3 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody class="text-gray-700">
          <tr
            v-for="fb in items"
            :key="fb.id"
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3">{{ fb.id }}</td>
            <td class="px-4 py-3">{{ fb.title }}</td>
            <td class="px-4 py-3">{{ formatDate(fb.createdAt) }}</td>
            <td
              class="px-4 py-3 font-medium"
              :class="fb.status ? 'text-green-600' : 'text-yellow-500'"
            >
              {{ fb.status ? "Đã phản hồi" : "Chưa phản hồi" }}
            </td>
            <td class="px-4 py-3 text-center">
              <button
                @click="$emit('view-detail', fb.id)"
                class="text-blue-600 hover:underline font-medium"
              >
                Xem chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Feedback } from '~/data/feedback'
import { formatDate } from '~/utils/format'

const props = defineProps<{
  items: Feedback[]
  keyword: string
}>()

const emit = defineEmits(['view-detail', 'update:keyword'])

function updateKeyword(e: Event) {
  emit('update:keyword', (e.target as HTMLInputElement).value)
}
</script>
