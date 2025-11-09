<template>
  <div>
    <div class="flex gap-3 mb-5">
      <input
        :value="keyword"
        @input="updateKeyword"
        type="text"
        placeholder="Tìm kiếm..."
        class="border px-4 py-2 rounded-xl w-full"
      />
    </div>

    <table class="w-full bg-white shadow rounded-xl border-collapse">
  <thead class="bg-gray-100 text-left">
    <tr>
      <th class="px-4 py-2">ID</th>
      <th class="px-4 py-2">Tiêu đề</th>
      <th class="px-4 py-2">Ngày gửi</th>
      <th class="px-4 py-2">Trạng thái</th>
      <th class="px-4 py-2 text-center">Hành động</th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="(fb, idx) in feedbacks"
      :key="fb.id"
      class="border-t hover:bg-gray-50"
    >
      <td class="px-4 py-2">{{ idx + 1 }}</td>
      <td class="px-4 py-2">{{ fb.tieuDe }}</td>
      <td class="px-4 py-2">{{ fb.ngayGui }}</td>
      <td
        class="px-4 py-2"
        :class="fb.trangThai ==true ? 'text-green-600' : 'text-yellow-500'"
      >
       {{ fb.trangThai ? 'Đã phản hồi' : 'Chưa phản hồi' }}

      </td>
      <td class="px-4 py-2 text-center">
        <button
          @click="$emit('view-detail', fb.id)"
          class="text-blue-600 hover:underline"
        >
          Xem chi tiết
        </button>
      </td>
    </tr>
  </tbody>
</table>

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  feedbacks: Array <{
    id: number
    tieuDe: String
    ngayGui: String
    trangThai: Boolean  
  }>,
  keyword: String
})

const emit = defineEmits(['view-detail', 'update:keyword'])

function updateKeyword(e: Event) {
  emit('update:keyword', (e.target as HTMLInputElement).value)
}
  </script>
