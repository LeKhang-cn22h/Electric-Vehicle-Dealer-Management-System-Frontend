<template>
  <div class="dealer-manager-layout">
    <DealerManagerTopbar />
    <main class="main-content">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import DealerManagerTopbar from '@/components/topbars/dealerMTopbar.vue'
import { onMounted } from 'vue'

onMounted(() => {
  console.log('DealerManagerTopbar component:', DealerManagerTopbar)
})
</script>