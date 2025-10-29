<template>
    <div class="test-drive-page">
        <TestDriveBooking />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "default",
});

// Import component
import TestDriveBooking from "@/components/test-drive/TestDriverBooking.vue";
</script>

<style scoped>
.test-drive-page {
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}
</style>
