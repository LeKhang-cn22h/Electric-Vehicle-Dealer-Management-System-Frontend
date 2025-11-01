<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-[80px] right-6 z-50 rounded-xl shadow-lg px-5 py-3 flex items-center gap-3"
      :class="notificationClasses"
    >
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
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

// Computed property cho classes
const notificationClasses = computed(() => {
  return {
    'bg-green-500 text-white': props.type === 'success',
    'bg-red-500 text-white': props.type === 'error',
    'bg-yellow-500 text-black': props.type === 'warning',
    'bg-blue-500 text-white': props.type === 'info'
  }
})

// Watch cho props.id thay đổi
watch(
  () => props.id,
  (newId, oldId) => {
    if (newId && newId !== oldId && props.message) {
      visible.value = true
      setTimeout(() => {
        visible.value = false
      }, props.duration)
    }
  },
  { immediate: true }
)

// Watch cho message thay đổi
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage && props.id) {
      visible.value = true
      setTimeout(() => {
        visible.value = false
      }, props.duration)
    }
  }
)
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