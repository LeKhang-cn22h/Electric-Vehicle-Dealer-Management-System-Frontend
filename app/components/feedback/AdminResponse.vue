<template>
  <div class="border-t pt-6 mt-6">
    <h3 class="font-semibold mb-3 text-lg">
      <span class="text-green-700">Phản hồi từ Admin</span>
    </h3>

    <!-- Có phản hồi -->
    <div
      v-if="response"
      class="bg-blue-50 border border-blue-300 p-4 rounded-lg"
    >
      <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">
        {{ response }}
      </p>
    </div>

    <!-- Chưa có phản hồi -->
    <div v-else class="bg-gray-50 border p-4 rounded-lg">
      <p class="text-gray-600 italic leading-relaxed">
        {{ getEmptyMessage() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  response?: string | null
  status?: string
}>()

function getEmptyMessage(): string {
  if (props.status === 'pending') {
    return 'Hiện tại Admin chưa phản hồi. Vui lòng chờ.'
  }
  return 'Hiện tại Admin chưa có phản hồi cho mục này.'
}
</script>
