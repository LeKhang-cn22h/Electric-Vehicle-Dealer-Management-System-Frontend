<template>
  <div class="landing">
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["redirect-home"],
});
</script>

<style scoped>
.landing {
  background: #009ee3;
  min-height: 100vh;
  font-family: "Inter", Arial, sans-serif;
}
</style>
