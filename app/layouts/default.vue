<script setup>
import Notification from '~/components/common/Notification.vue'
import { useNotification } from '~/composables/useNotification'
import SiteFooter from "~/components/SiteFooter.vue";

const { notification } = useNotification()
</script>

<template>
  <div class="layout">
    <main class="page-body">
      <Topbar />
      <div class="content">
        <slot />
        <!-- Notification component -->
        <Notification
          v-if="notification.message"
          :id="notification.id"
          :message="notification.message"
          :type="notification.type"
        />
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-body {
  flex: 1;
  font-family: "Inter", Arial, sans-serif;
}
.content {
  padding: 20px;
}
</style>