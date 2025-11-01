import { ref } from 'vue'

// tạo 1 state duy nhất dùng cho toàn app
const notification = ref({
  id: 0,
  message: '',
  type: 'info'
})

export function useNotification() {
  function showNotification(message, type = 'info') {
    notification.value = {
      id: Date.now(), // Tạo ID mới mỗi lần gọi
      message,
      type
    }

    // reset sau 3 giây
    setTimeout(() => {
      notification.value = { id: 0, message: '', type: 'info' }
    }, 3000)
  }

  return { notification, showNotification }
}