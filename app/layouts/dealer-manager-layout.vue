<template>
  <div class="dealer-manager-layout">
    <!-- BỎ comment và đảm bảo file tồn tại -->
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
</script>