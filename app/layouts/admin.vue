<template>
  <div class="admin-container">
    <AdminSidebar
      :sidebarOpen="sidebarOpen"
      @toggle="sidebarOpen = !sidebarOpen"
    />

    <div class="main-wrapper">
      <AdminTopbar />

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTopbar from "@/components/AdminTopbar.vue";

const sidebarOpen = ref(true);
</script>

<style>
.admin-container {
  display: flex;
  height: 100vh;
  background: #f3f4f6;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
