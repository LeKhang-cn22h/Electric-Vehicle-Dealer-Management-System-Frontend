import { ref, computed } from "vue";
import { $fetch } from "ofetch";

export type EvmStaff = {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string | null;
  dealer_id?: string | null;
  dealer_name?: string | null;
  status: "active" | "locked";
  created_at: string;
};

export type CreateEvmStaffPayload = {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
};

export type UpdateEvmStaffPayload = {
  full_name?: string;
  phone?: string | null;
};

export function useEvmStaff() {
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase || "http://localhost:4000";
  const accessToken = useCookie<string | null>("access_token");
  const authHeaders = computed(() => {
    const headers: Record<string, string> = {};
    if (accessToken.value) {
      headers["Authorization"] = `Bearer ${accessToken.value}`;
    }
    return headers;
  });

  const staff = ref<EvmStaff[]>([]);
  const loading = ref(false);

  const activeCount = computed(
    () => staff.value.filter((s) => s.status === "active").length
  );
  const lockedCount = computed(
    () => staff.value.filter((s) => s.status === "locked").length
  );

  function formatDate(iso: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Lấy danh sách EVM staff qua gateway
  async function fetchStaff() {
    loading.value = true;
    try {
      const data = await $fetch<EvmStaff[]>(`${API_BASE}/users/evm-staff`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders.value,
      });
      staff.value = data;
    } finally {
      loading.value = false;
    }
  }

  // Tạo account EVM staff
  async function createStaff(payload: CreateEvmStaffPayload) {
    await $fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      body: {
        email: payload.email,
        password: payload.password,
        full_name: payload.full_name,
        phone: payload.phone ?? null,
        role: "evm_staff",
      },
      credentials: "include",
    });
  }

  // Cập nhật metadata EVM staff
  async function updateStaff(id: string, payload: UpdateEvmStaffPayload) {
    await $fetch(`${API_BASE}/users/evm-staff/${id}`, {
      method: "PUT",
      body: payload,
      credentials: "include",
      headers: authHeaders.value,
    });
  }

  // Khóa / mở khóa
  async function lockStaff(id: string) {
    await $fetch(`${API_BASE}/users/evm-staff/${id}/lock`, {
      method: "POST",
      credentials: "include",
      headers: authHeaders.value,
    });
  }

  async function unlockStaff(id: string) {
    await $fetch(`${API_BASE}/users/evm-staff/${id}/unlock`, {
      method: "POST",
      credentials: "include",
      headers: authHeaders.value,
    });
  }

  return {
    staff,
    loading,
    activeCount,
    lockedCount,
    formatDate,
    fetchStaff,
    createStaff,
    updateStaff,
    lockStaff,
    unlockStaff,
  };
}
