<template>
  <form @submit.prevent="sendFB" class="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
    <!-- Hiển thị lỗi chung -->
    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">
      {{ error }}
    </div>

    <!-- Tiêu đề -->
    <div class="mb-4">
      <label class="block font-medium mb-2">
        Tiêu đề <span class="text-red-500">*</span>
      </label>
      <input 
        v-model="form.title" 
        type="text" 
        placeholder="Nhập tiêu đề phản hồi/khiếu nại" 
        class="border px-4 py-2 rounded-xl w-full"
        :class="validationErrors.title ? 'border-red-500' : 'border-gray-300'"
      >
      <p v-if="validationErrors.title" class="text-red-500 text-sm mt-1">
        {{ validationErrors.title }}
      </p>
    </div>

    <!-- Nội dung -->
    <div class="mb-4">
      <label class="block font-medium mb-2">
        Nội dung <span class="text-red-500">*</span>
      </label>
      <textarea 
        v-model="form.content" 
        placeholder="Mô tả nội dung phản hồi hoặc khiếu nại của bạn..." 
        class="w-full border px-4 py-2 rounded-xl h-32"
        :class="validationErrors.content ? 'border-red-500' : 'border-gray-300'"
      />
      <p v-if="validationErrors.content" class="text-red-500 text-sm mt-1">
        {{ validationErrors.content }}
      </p>
    </div>

    <!-- Button Submit -->
    <button 
      type="submit" 
      :disabled="loading"
      class="font-bold bg-blue-600 text-white px-20 py-2 rounded-xl hover:bg-blue-700 transition-colors mx-auto block disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {{ loading ? 'Đang gửi...' : 'GỬI' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
import type { CreateFeedbackInput } from '@/types/feedback'

// Emits
const emit = defineEmits<{
  submitted: [feedback: any]
}>()

// Composable
const { create, loading, error, validationErrors, clearValidationErrors } = useFeedback()

// Form data
const form = ref<CreateFeedbackInput>({
  title: '',
  content: '',
  status: 'pending' // Default status
})

// Submit handler
async function sendFB() {
  try {
    // Clear previous errors
    clearValidationErrors()
    
    console.log('📤 Đang gửi phản hồi:', form.value)
    
    // Gọi create từ useFeedback (đã có validation)
    const result = await create(form.value)
    
    console.log('✅ Gửi thành công:', result)
    
    // Emit event khi thành công
    emit('submitted', result)
    
    // Reset form
    form.value = {
      title: '',
      content: '',
      status: 'pending'
    }
  } catch (e: any) {
    console.error('❌ Lỗi khi gửi phản hồi:', e)
    // Error đã được handle trong useFeedback
  }
}
</script>