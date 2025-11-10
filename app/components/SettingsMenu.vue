<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Cog6ToothIcon } from "@heroicons/vue/24/outline";
import { useMe } from "~/composables/useMe";
import { User } from "lucide-vue-next";
import { LogOut } from "lucide-vue-next";

type Align = "right" | "left";
const props = defineProps<{ align?: Align }>();
const align: Align = props.align ?? "right";

const open = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const btnRef = ref<HTMLButtonElement | null>(null);

// Lấy thông tin user và hàm logout
const { me, logout: logoutUser } = useMe();

function toggle() {
  open.value = !open.value;
}
function close() {
  open.value = false;
}

function handleAvatarError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
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
  close();
  logoutUser();
  await navigateTo("/auth/login");
  window.location.reload();
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

        <!-- Thông tin user -->
        <div v-if="me" class="user-info">
          <div class="user-avatar">
            <img
              v-if="me.user_metadata?.avatar_url"
              :src="me.user_metadata.avatar_url"
              alt="Avatar"
              class="avatar-img"
              @error="handleAvatarError"
            />
            <span v-else>
              {{
                (me.user_metadata?.full_name ||
                  me.full_name ||
                  me.email)?.[0]?.toUpperCase()
              }}
            </span>
          </div>

          <div class="user-details">
            <p class="user-name">
              {{ me.user_metadata?.full_name || me.full_name || "User" }}
            </p>
            <p class="user-email">{{ me.email }}</p>
          </div>
        </div>

        <div v-if="me" class="divider"></div>

        <NuxtLink class="item" role="menuitem" to="/ProfilePage" @click="close">
          <User />
          Trang cá nhân
        </NuxtLink>

        <div class="divider"></div>

        <button
          class="item-logout"
          role="menuitem"
          type="button"
          @click="handleLogout"
        >
          <LogOut />
          Đăng xuất
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
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

.menu {
  position: absolute;
  top: calc(100% + 10px);
  min-width: 240px;
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

/* User info styles */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 4px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.item-logout {
  color: #ef4444;
}

.item-logout:hover {
  background: #fee2e2;
}

.item-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
  flex-shrink: 0;
}

.item-logout .item-icon {
  color: #ef4444;
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
