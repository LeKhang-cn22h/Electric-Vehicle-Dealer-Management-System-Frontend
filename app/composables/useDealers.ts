import { ref, computed } from "vue";
import type { Dealer } from "~/types/dealer";
export function useDealers() {
  const dealers = ref<Dealer[]>([]);
  const pending = ref(false);
  const search = ref("");

  const API = "http://localhost:4000/users/dealers";

  async function loadDealers() {
    pending.value = true;
    try {
      const res = await $fetch<Dealer[]>(API, {
        headers: useAuthHeader(),
      });
      dealers.value = Array.isArray(res) ? res : [];
    } finally {
      pending.value = false;
    }
  }

  async function createDealer(dto: Omit<Dealer, "id">) {
    await $fetch(API, {
      method: "POST",
      body: dto,
      headers: useAuthHeader(),
    });
    loadDealers();
  }

  async function updateDealer(id: string, dto: Partial<Dealer>) {
    await $fetch(`${API}/${id}`, {
      method: "PUT",
      body: dto,
      headers: useAuthHeader(),
    });
    loadDealers();
  }

  async function deleteDealer(id: string) {
    await $fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: useAuthHeader(),
    });
    loadDealers();
  }
  const filteredDealers = computed<Dealer[]>(() => {
    return dealers.value.filter((d) =>
      d.name.toLowerCase().includes(search.value.toLowerCase())
    );
  });

  return {
    dealers,
    pending,
    search,
    filteredDealers,
    loadDealers,
    createDealer,
    updateDealer,
    deleteDealer,
  };
}

function useAuthHeader() {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
}
