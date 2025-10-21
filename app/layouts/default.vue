<script setup>
import SiteFooter from "~/components/SiteFooter.vue";
</script>

<template>
  <div class="layout">
    <main class="page-body">
      <Topbar />
      <div class="content">
        <slot />
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
