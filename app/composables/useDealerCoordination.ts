// // app/composables/useDealerCoordination.ts
// import { ref } from "vue";

// export interface CreateVehicleRequestDto {
//   dealer_name: string;
//   email: string;
//   address: string;
//   quantity: number;
// }

// export interface VehicleRequest {
//   id: string;
//   dealer_name: string;
//   email: string;
//   address: string;
//   quantity: number;
//   user_id: string | null;
//   status?: string;
//   created_at: string;
//   updated_at: string;
// }

// export function useDealerCoordination() {
//   const pending = ref(false);
//   const requests = ref<VehicleRequest[]>([]);

//   const API = "http://localhost:4000/dealer-coordination/requests";

//   // Tạo vehicle request mới
//   async function createVehicleRequest(dto: CreateVehicleRequestDto) {
//     pending.value = true;
//     try {
//       const res = await $fetch(API, {
//         method: "POST",
//         body: dto,
//         headers: useAuthHeader(),
//       });
//       return res;
//     } finally {
//       pending.value = false;
//     }
//   }

//   // Lấy tất cả requests
//   async function getAllRequests() {
//     pending.value = true;
//     try {
//       const res = await $fetch<{ data: VehicleRequest[] }>(API, {
//         method: "GET",
//         headers: useAuthHeader(),
//       });
//       requests.value = res.data || [];
//       return res;
//     } finally {
//       pending.value = false;
//     }
//   }

//   // Lấy requests theo dealer_name
//   async function getRequestsByDealerName(dealer_name: string) {
//     pending.value = true;
//     try {
//       const res = await $fetch<{ data: VehicleRequest[] }>(
//         `${API}?dealer_name=${encodeURIComponent(dealer_name)}`,
//         {
//           method: "GET",
//           headers: useAuthHeader(),
//         }
//       );
//       requests.value = res.data || [];
//       return res;
//     } finally {
//       pending.value = false;
//     }
//   }

//   return {
//     pending,
//     requests,
//     createVehicleRequest,
//     getAllRequests,
//     getRequestsByDealerName,
//   };
// }

// function useAuthHeader() {
//   if (process.client) {
//     const token = localStorage.getItem("access_token");
//     return {
//       Authorization: `Bearer ${token || ""}`,
//     };
//   }
//   return {
//     Authorization: "",
//   };
// }
// app/composables/useDealerCoordination.ts
import { ref } from "vue";

export interface CreateVehicleRequestDto {
  dealer_name: string;
  email: string;
  address: string;
  quantity: number;
}

export interface VehicleRequest {
  id: number; // SỬA: string -> number
  dealer_name: string;
  email: string;
  address: string;
  quantity: number;
  user_id: string | null;
  status: string; // THÊM: status field
  created_at: string;
  updated_at: string;
}

export function useDealerCoordination() {
  const pending = ref(false);
  const error = ref<string | null>(null); // THÊM: error handling
  const requests = ref<VehicleRequest[]>([]);

  // SỬA: URL đúng theo gateway
  const API_BASE = "http://localhost:4000/dealer-coordination";

  // Tạo vehicle request mới
  async function createVehicleRequest(dto: CreateVehicleRequestDto) {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/requests`, {
        method: "POST",
        body: dto,
        headers: useAuthHeader(),
      });
      console.log('Create request response:', res); // DEBUG
      return res;
    } catch (err: any) {
      error.value = err.message || 'Failed to create request';
      console.error('Create request error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // Lấy tất cả requests - SỬA: API response structure
  async function getAllRequests() {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch<any>(`${API_BASE}/requests`, {
        method: "GET",
        headers: useAuthHeader(),
      });
      
      console.log('Get all requests response:', res); // DEBUG
      
      // SỬA: Xử lý response structure khác nhau
      if (Array.isArray(res)) {
        requests.value = res;
      } else if (res.data && Array.isArray(res.data)) {
        requests.value = res.data;
      } else if (res.request && Array.isArray(res.request)) {
        requests.value = res.request;
      } else {
        requests.value = [];
      }
      
      return requests.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to get requests';
      console.error('Get requests error:', err);
      requests.value = [];
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // Lấy requests theo dealer_name
  async function getRequestsByDealerName(dealer_name: string) {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch<any>(
        `${API_BASE}/requests?dealer_name=${encodeURIComponent(dealer_name)}`,
        {
          method: "GET",
          headers: useAuthHeader(),
        }
      );
      
      console.log('Get requests by dealer response:', res); // DEBUG
      
      // SỬA: Xử lý response structure
      if (Array.isArray(res)) {
        requests.value = res;
      } else if (res.data && Array.isArray(res.data)) {
        requests.value = res.data;
      } else {
        requests.value = [];
      }
      
      return requests.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to get requests by dealer';
      console.error('Get requests by dealer error:', err);
      requests.value = [];
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // THÊM: Lấy requests theo status
  async function getRequestsByStatus(status: string) {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch<any>(
        `${API_BASE}/requests/status/${status}`,
        {
          method: "GET",
          headers: useAuthHeader(),
        }
      );
      
      console.log('Get requests by status response:', res); // DEBUG
      
      if (Array.isArray(res)) {
        requests.value = res;
      } else {
        requests.value = [];
      }
      
      return requests.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to get requests by status';
      console.error('Get requests by status error:', err);
      requests.value = [];
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // THÊM: Cập nhật status
  async function updateRequestStatus(requestId: number, status: string) {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/requests/${requestId}/status`, {
        method: "PUT",
        body: { status },
        headers: useAuthHeader(),
      });
      console.log('Update status response:', res); // DEBUG
      return res;
    } catch (err: any) {
      error.value = err.message || 'Failed to update status';
      console.error('Update status error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // THÊM: Lấy request by ID
  async function getRequestById(id: number) {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch<any>(`${API_BASE}/requests/${id}`, {
        method: "GET",
        headers: useAuthHeader(),
      });
      console.log('Get request by ID response:', res); // DEBUG
      return res;
    } catch (err: any) {
      error.value = err.message || 'Failed to get request';
      console.error('Get request by ID error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  return {
    pending,
    error, // THÊM: export error
    requests,
    createVehicleRequest,
    getAllRequests,
    getRequestsByDealerName,
    getRequestsByStatus, // THÊM
    updateRequestStatus, // THÊM
    getRequestById, // THÊM
  };
}

function useAuthHeader() {
  if (process.client) {
    const token = localStorage.getItem("access_token") || 
                  localStorage.getItem("auth_token") || 
                  sessionStorage.getItem("access_token") ||
                  sessionStorage.getItem("auth_token");
    console.log('Auth token:', token ? '***' + token.slice(-5) : 'MISSING'); // DEBUG
    return {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    };
  }
  return {
    Authorization: "",
    "Content-Type": "application/json",
  };
}