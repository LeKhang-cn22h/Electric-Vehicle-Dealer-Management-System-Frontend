<template>
  <div class="evm-staff-layout">
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
import DealerManagerTopbar from '@/components/topbars/EVMStaffTopbar.vue'
</script>


<!-- 


// Hoặc nếu dùng Vue Router thông thường
// export default {
//   layout: 'EVMStaffLayout'
// }
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
</script>

<style scoped>
.evm-staff-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  padding: 0;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}
</style> -->