<template>
  <div class="evm-staff-layout">
    <EVMStaffTopbar />
    <main class="main-content">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import EVMStaffTopbar from '@/components/topbars/EVMStaffTopbar.vue'
import { onMounted } from 'vue'

onMounted(() => {
  console.log('EVMStaffTopbar component:', EVMStaffTopbar)
})
</script>

// Hoặc nếu dùng Vue Router thông thường
// export default {
//   layout: 'EVMStaffLayout'
// }
