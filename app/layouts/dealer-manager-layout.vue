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
// <<<<<<< HEAD
// =======
// import { onMounted } from 'vue'

// onMounted(() => {
//   console.log('DealerManagerTopbar component:', DealerManagerTopbar)
// })
// >>>>>>> 47b353286b6505ad9691aadc307fca028dbb6c05
</script>