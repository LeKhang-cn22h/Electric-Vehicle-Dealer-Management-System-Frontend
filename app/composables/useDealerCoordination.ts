// app/composables/useDealerCoordination.ts
import { ref } from "vue";

export interface CreateVehicleRequestDto {
  dealer_name: string;
  email: string;
  address: string;
  quantity: number;
}

export interface VehicleRequest {
  id: string;
  dealer_name: string;
  email: string;
  address: string;
  quantity: number;
  user_id: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
}

export function useDealerCoordination() {
  const pending = ref(false);
  const requests = ref<VehicleRequest[]>([]);

  const API = "http://localhost:4000/dealer-coordination/requests";

  // Tạo vehicle request mới
  async function createVehicleRequest(dto: CreateVehicleRequestDto) {
    pending.value = true;
    try {
      const res = await $fetch(API, {
        method: "POST",
        body: dto,
        headers: useAuthHeader(),
      });
      return res;
    } finally {
      pending.value = false;
    }
  }

  // Lấy tất cả requests
  async function getAllRequests() {
    pending.value = true;
    try {
      const res = await $fetch<{ data: VehicleRequest[] }>(API, {
        method: "GET",
        headers: useAuthHeader(),
      });
      requests.value = res.data || [];
      return res;
    } finally {
      pending.value = false;
    }
  }

  // Lấy requests theo dealer_name
  async function getRequestsByDealerName(dealer_name: string) {
    pending.value = true;
    try {
      const res = await $fetch<{ data: VehicleRequest[] }>(
        `${API}?dealer_name=${encodeURIComponent(dealer_name)}`,
        {
          method: "GET",
          headers: useAuthHeader(),
        }
      );
      requests.value = res.data || [];
      return res;
    } finally {
      pending.value = false;
    }
  }

  return {
    pending,
    requests,
    createVehicleRequest,
    getAllRequests,
    getRequestsByDealerName,
  };
}

function useAuthHeader() {
  if (process.client) {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token || ""}`,
    };
  }
  return {
    Authorization: "",
  };
}