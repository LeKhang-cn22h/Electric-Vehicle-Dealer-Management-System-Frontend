import { ref, computed } from "vue";

export type DealerStaff = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: "active" | "inactive";
};

export function useDealerStaff() {
  const config = useRuntimeConfig();
  const API = (config.public.apiBase as string) ?? "http://localhost:4000";

  // Khai báo cookie ở đây là đủ, nó tự động reactive
  const accessToken = useCookie<string | null>("access_token");

  const authHeaders = computed(() => {
    const headers: Record<string, string> = {};
    if (accessToken.value) {
      headers["Authorization"] = `Bearer ${accessToken.value}`;
    }
    return headers;
  });
  const staffList = ref<DealerStaff[]>([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  // Helper check login
  function ensureLoggedIn() {
    if (!accessToken.value) {
      throw new Error("Bạn chưa đăng nhập.");
    }
  }

  // LOAD LIST
  async function loadStaff() {
    errorMessage.value = null;
    if (!accessToken.value) {
      console.error("Không tìm thấy token trong Cookie!");
      return;
    }

    try {
      isLoading.value = true;
      const data = await $fetch<DealerStaff[]>(`${API}/users/dealer-staff`, {
        headers: authHeaders.value,
        onResponseError({ response }) {
          if (response.status === 401) {
            accessToken.value = null;
            throw new Error("Phiên đăng nhập hết hạn.");
          }
        },
      });
      staffList.value = data;
    } catch (err: any) {
      console.error("Load staff error:", err);
      errorMessage.value = err.message || "Lỗi tải dữ liệu.";
    } finally {
      isLoading.value = false;
    }
  }

  // CREATE
  async function createStaff(payload: any) {
    errorMessage.value = null;
    try {
      ensureLoggedIn();
      isSubmitting.value = true;

      const created = await $fetch<DealerStaff>(`${API}/users/dealer-staff`, {
        method: "POST",
        headers: { ...authHeaders.value, "Content-Type": "application/json" },
        body: payload,
      });

      staffList.value.unshift(created);
      return created;
    } catch (err: any) {
      throw new Error(err.data?.message || err.message || "Tạo thất bại");
    } finally {
      isSubmitting.value = false;
    }
  }

  // UPDATE
  async function updateStaff(id: string, payload: any) {
    try {
      ensureLoggedIn();
      isSubmitting.value = true;

      const updated = await $fetch<DealerStaff>(
        `${API}/users/dealer-staff/${id}`,
        {
          method: "PUT",
          headers: { ...authHeaders.value, "Content-Type": "application/json" },
          body: payload,
        }
      );

      const index = staffList.value.findIndex((s) => s.id === id);
      if (index !== -1) staffList.value[index] = updated;

      return updated;
    } catch (err: any) {
      throw new Error(err.data?.message || err.message || "Cập nhật thất bại");
    } finally {
      isSubmitting.value = false;
    }
  }
  // DELETE
  async function deleteStaff(id: string) {
    errorMessage.value = null;

    ensureLoggedIn();

    try {
      isLoading.value = true;

      await $fetch(`${API}/users/dealer-staff/${id}`, {
        method: "DELETE",
        headers: authHeaders.value,
      });

      staffList.value = staffList.value.filter((s) => s.id !== id);
    } catch (err: any) {
      console.error("Delete staff error:", err);

      if (err?.status === 401 || err?.statusCode === 401) {
        throw new Error(
          "Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại."
        );
      }

      throw new Error(
        err?.data?.message || "Không xoá được nhân viên. Vui lòng thử lại."
      );
    } finally {
      isLoading.value = false;
    }
  }

  return {
    staffList,
    isLoading,
    isSubmitting,
    errorMessage,
    loadStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
}
