<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watchEffect } from "vue";
import { Cog6ToothIcon } from "@heroicons/vue/24/outline";

type Align = "right" | "left";
const props = defineProps<{ align?: Align }>();
const align: Align = props.align ?? "right";

const open = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const btnRef = ref<HTMLButtonElement | null>(null);

function toggle() {
  open.value = !open.value;
}
function close() {
  open.value = false;
}

function onGlobalClick(e: MouseEvent) {
  const t = e.target as Node;
  if (!menuRef.value || !btnRef.value) return;
  if (!menuRef.value.contains(t) && !btnRef.value.contains(t)) close();
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}
async function handleLogout() {
  navigateTo("/auth/login");
}

onMounted(() => {
  window.addEventListener("click", onGlobalClick);
  window.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", onGlobalClick);
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="settings" :class="[`align-${align}`]">
    <button
      ref="btnRef"
      class="btn-setting"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-label="open ? 'Đóng menu cài đặt' : 'Mở menu cài đặt'"
      @click.stop="toggle"
    >
      <Cog6ToothIcon class="icon" aria-hidden="true" />
    </button>

    <transition name="pop">
      <div v-if="open" ref="menuRef" class="menu" role="menu" @click.stop>
        <div class="caret" aria-hidden="true"></div>

        <NuxtLink class="item" role="menuitem" to="/ProfilePage" @click="close">
          <svg
            class="item-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Trang cá nhân
        </NuxtLink>

        <div class="divider"></div>

        <button
          class="item-logout"
          role="menuitem"
          type="button"
          @click="handleLogout"
        >
          <svg
            class="item-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.item-logout {
  color: red;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
}
.settings {
  position: relative;
  display: inline-block;
}
.settings.align-right .menu {
  right: 0;
  left: auto;
}
.settings.align-left .menu {
  left: 0;
  right: auto;
}

.btn-setting {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.06s;
}
.btn-setting:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}
.btn-setting:active {
  transform: scale(0.97);
}
.icon {
  width: 20px;
  height: 20px;
}

.menu {
  position: absolute;
  top: calc(100% + 10px);
  min-width: 190px;
  padding: 6px;
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06);
  z-index: 50;
}

.caret {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -6px;
  right: 14px;
  background: #fff;
  transform: rotate(45deg);
  border-left: 1px solid #e5e7eb;
  border-top: 1px solid #e5e7eb;
}
.settings.align-left .caret {
  left: 14px;
  right: auto;
}
.drop-up .caret {
  top: auto;
  bottom: -6px;
  transform: rotate(225deg);
}

.item,
.item-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  transition: background 0.12s ease, transform 0.04s ease;
}
.item:hover {
  background: #f3f4f6;
}
.item:active {
  transform: translateY(1px);
}
.item-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
  flex-shrink: 0;
}
.divider {
  height: 1px;
  margin: 4px 6px;
  background: #e5e7eb;
  border-radius: 1px;
}

/* Transition nhỏ gọn */
.pop-enter-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.pop-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
