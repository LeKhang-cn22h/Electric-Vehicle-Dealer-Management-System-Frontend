<script setup>
import Notification from '~/components/common/Notification.vue'
import { useNotification } from '~/composables/useNotification'

const { notification } = useNotification()
import SiteFooter from "~/components/SiteFooter.vue";
</script>

<template>
  <div class="layout">
    <main class="page-body">
      <Topbar />
      <div class="content">
        <slot />
          <Notification
            v-if="notification.message"
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
