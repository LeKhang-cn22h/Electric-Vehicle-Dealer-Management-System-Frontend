<template>
  <header class="header">
    <div class="header-left">
      <div class="brand-section">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div class="brand-info">
          <h1 class="brand-title">Admin Dashboard</h1>
          <p class="brand-subtitle">Quản lý hệ thống</p>
        </div>
      </div>
    </div>

    <div class="user-info">
      <div class="user-details">
        <template v-if="pending">
          <span class="loading-text">Đang tải...</span>
        </template>

        <template v-else-if="me">
          <div class="user-profile">
            <span class="welcome-text">Xin chào, </span>
            <span class="user-name">{{ userName }}</span>
          </div>
        </template>
      </div>

      <div class="user-avatar">
        {{ avatarLetter }}
      </div>
      <ClientOnly>
        <div class="dropdown-wrapper">
          <SettingsDropdown align="right" />
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import SettingsDropdown from "@/components/SettingsMenu.vue";
import { useMe } from "@/composables/useMe";

const { me, pending } = useMe();

const userName = computed(() => {
  if (!me.value) return null;
  return (
    me.value.user_metadata?.full_name ||
    me.value.full_name ||
    me.value.fullName ||
    me.value.email?.split("@")[0] ||
    "User"
  );
});

// Avatar letter
const avatarLetter = computed(() => {
  const name = userName.value;
  return name ? name.charAt(0).toUpperCase() : "U";
});
</script>

<style scoped>
.header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: 72px;
}

.header-search {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  background: #f9fafb;
}

.search-input:hover {
  border-color: #9ca3af;
  background: white;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: white;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  border-radius: 8px;
  transition: background 0.2s;
  position: relative;
}

.user-info:hover {
  background: #f3f4f6;
}

.user-details {
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.dropdown-wrapper {
  position: relative;
  z-index: 100;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
    min-height: auto;
  }

  .header-search {
    max-width: 100%;
    order: 2;
  }

  .user-info {
    order: 1;
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: 16px;
  }
}
/* Header Left (Logo + Brand Info) */
.header-left {
  display: flex;
  align-items: center;
  gap: 16px; /* khoảng cách giữa logo và brand info */
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px; /* khoảng cách giữa icon và text */
}

.logo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
  color: white;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 24px;
  height: 24px;
  stroke: white;
}

.brand-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

</style>
