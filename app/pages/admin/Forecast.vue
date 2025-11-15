<template>
  <div class="page-content">
    <div class="content-card">
      <h2 class="content-title">Dự báo AI</h2>
      <p class="content-description">
        Hệ thống AI dự báo nhu cầu xe điện trong kỳ tới.
      </p>

      <div class="forecast-alert">
        <svg class="icon" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>

        <div>
          <p class="alert-title">Xu hướng dự báo tháng tới</p>
          <p class="alert-text">Nhu cầu EV-SUV Premium dự kiến tăng 18%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
});
</script>
