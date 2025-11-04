<script setup>
import SettingsMenu from "~/components/SettingsMenu.vue";
import Notification from "~/components/common/Notification.vue";
import { useNotification } from "~/composables/useNotification";
import SiteFooter from "~/components/SiteFooter.vue";
import CompareBar from '~/components/compare/CompareBar.vue'

const { notification } = useNotification();
</script>

<template>
  <div class="layout">
    <main class="page-body">
      <div class="topbar-row">
        <Topbar />
        <SettingsMenu />
      </div>

      <div class="content">

        <slot />
        <Notification
          v-if="notification.message"
          :id="notification.id"
          :message="notification.message"
          :type="notification.type"
        />
      </div>
    </main>
    <CompareBar />
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
.topbar-row {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 20px;
  background: var(--card, #fff);
  border-bottom: 1px solid var(--border, #e5e7eb);
  backdrop-filter: saturate(120%) blur(6px);
}

.topbar-row > :first-child {
  flex: 1;
  min-width: 0;
}

.topbar-row > :last-child {
  flex-shrink: 0;
}

.content {
  padding: 20px;
}

@media (max-width: 768px) {
  .topbar-row {
    padding: 10px 16px;
    gap: 12px;
  }
  .content {
    padding: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --card: #111418;
    --border: #1e293b;
  }
}
</style>
