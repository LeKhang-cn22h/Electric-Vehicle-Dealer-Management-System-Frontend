import { ref } from 'vue'

const notification = ref({
  message: '',
  type: 'info'
})

export function useNotification() {
  function showNotification(message, type = 'info') {
    notification.value = { message, type }
  }

  return { notification, showNotification }
}
