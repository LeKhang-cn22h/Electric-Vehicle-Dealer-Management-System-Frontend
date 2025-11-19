<template>
  <div class="notification-handler">
    <!-- Notification Toast -->
    <div 
      v-if="notification" 
      class="notification-toast"
      :class="notificationType"
      @click="handleNotificationClick"
    >
      <div class="notification-icon">
        <span v-if="notificationType === 'success'">✅</span>
        <span v-else-if="notificationType === 'info'">ℹ️</span>
        <span v-else-if="notificationType === 'warning'">⚠️</span>
        <span v-else>🔔</span>
      </div>
      <div class="notification-content">
        <h4>{{ notificationTitle }}</h4>
        <p>{{ notificationBody }}</p>
        <small>{{ formatTime(notification?.data?.timestamp) }}</small>
      </div>
      <button class="close-btn" @click.stop="clearNotification">×</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { firebaseService } from '../services/firebaseService'

export default {
  name: 'NotificationHandler',
  setup() {
    const router = useRouter()
    const notification = ref(null)

    const notificationTitle = computed(() => {
      return notification.value?.notification?.title || 
             notification.value?.data?.title || 
             'Thông báo mới'
    })

    const notificationBody = computed(() => {
      return notification.value?.notification?.body || 
             notification.value?.data?.body || 
             'Có thông báo mới từ hệ thống'
    })

    const notificationType = computed(() => {
      return notification.value?.data?.type || 'info'
    })

    const handleIncomingMessage = (payload) => {
      console.log('Received FCM message:', payload)
      notification.value = payload
      
      // Hiển thị thông báo hệ thống
      if (payload.notification && Notification.permission === 'granted') {
        const systemNotification = new Notification(
          payload.notification.title,
          {
            body: payload.notification.body,
            icon: '/logo.png',
            data: payload.data
          }
        )
        
        systemNotification.onclick = () => {
          handleNotificationClick()
          systemNotification.close()
        }
      }
      
      // Tự động ẩn sau 5 giây
      setTimeout(() => {
        if (notification.value === payload) {
          clearNotification()
        }
      }, 5000)
    }

    const handleNotificationClick = () => {
      if (!notification.value?.data) return
      
      const data = notification.value.data
      
      switch (data.type) {
        case 'NEW_CONTRACT_REQUEST':
          router.push('/admin/contract-requests')
          break
        case 'CONTRACT_APPROVED':
          router.push('/dealer_manager/contracts')
          break
        case 'NEW_MESSAGE':
          router.push('/messages')
          break
        default:
          console.log('Unknown notification type:', data.type)
      }
      
      clearNotification()
    }

    const clearNotification = () => {
      notification.value = null
    }

    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleTimeString('vi-VN')
    }

    onMounted(async () => {
      // Yêu cầu quyền thông báo
      await firebaseService.requestPermission()
      
      // Subscribe to topic (nếu là EVM staff)
      const user = authStore.getUser()
      if (user && user.role === 'evm_staff') {
        const token = await firebaseService.getFCMToken()
        if (token) {
          await firebaseService.subscribeToTopic(token, 'evm_staff')
        }
      }
      
      // Lắng nghe thông báo đến
      firebaseService.onMessage(handleIncomingMessage)
    })

    return {
      notification,
      notificationTitle,
      notificationBody,
      notificationType,
      handleNotificationClick,
      clearNotification,
      formatTime
    }
  }
}
</script>

<style scoped>
.notification-handler {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #3498db;
  min-width: 300px;
  max-width: 400px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.notification-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.notification-toast.success {
  border-left-color: #27ae60;
}

.notification-toast.warning {
  border-left-color: #f39c12;
}

.notification-toast.error {
  border-left-color: #e74c3c;
}

.notification-icon {
  font-size: 1.2rem;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1rem;
}

.notification-content p {
  margin: 0 0 5px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.notification-content small {
  color: #bdc3c7;
  font-size: 0.8rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #bdc3c7;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #7f8c8d;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .notification-handler {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification-toast {
    min-width: auto;
    max-width: none;
  }
}
</style>