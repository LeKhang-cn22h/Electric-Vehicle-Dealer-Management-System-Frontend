import { onMounted, ref } from "vue";

import type { UserMe } from "~/types/user";

export function useMe() {
  const me = ref<UserMe | null>(null);
  const error = ref<string | null>(null);
  const pending = ref(false);

  async function fetchMe() {
    // Kiểm tra nếu đang ở server-side
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      console.log("Running on server or localStorage not available");
      return;
    }

    const token = localStorage.getItem("access_token");
    console.log("Token:", token ? `${token.substring(0, 20)}...` : "NULL");

    if (!token) {
      console.log("No access_token found in localStorage");
      return;
    }

    pending.value = true;
    error.value = null;

    try {
      console.log("📡 Fetching user data...");

      const res = await fetch("http://localhost:4000/auth/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(
          data.message || `HTTP ${res.status}: ${data.error || "Unknown error"}`
        );
      }

      me.value = data;
      console.log("User data loaded successfully:", me.value);
    } catch (err: any) {
      error.value = err.message;
      console.error("Error fetching user:", err);

      // Nếu token không hợp lệ, xóa nó
      if (
        err.message.includes("xác thực") ||
        err.message.includes("token") ||
        err.message.includes("401")
      ) {
        console.log("🗑️ Removing invalid token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } finally {
      pending.value = false;
      console.log("🏁 Fetch completed. pending:", pending.value);
    }
  }

  // Refresh user data
  function refreshMe() {
    console.log("Refreshing user data...");
    return fetchMe();
  }

  // Logout
  function logout() {
    console.log("Logging out...");
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    me.value = null;
    error.value = null;
  }

  onMounted(() => {
    console.log("useMe mounted, fetching user data...");
    fetchMe();
  });

  return { me, error, pending, refreshMe, logout };
}
