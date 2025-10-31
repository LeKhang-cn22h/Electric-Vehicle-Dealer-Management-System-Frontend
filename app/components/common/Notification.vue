<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-[80px] right-6 z-50 rounded-xl shadow-lg px-5 py-3 flex items-center gap-3"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-yellow-500 text-black': type === 'warning',
        'bg-blue-500 text-white': type === 'info'
      }"
    >
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const visible = ref(false)

watchEffect(() => {
  if (props.message) {
    visible.value = true
    setTimeout(() => (visible.value = false), props.duration)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
