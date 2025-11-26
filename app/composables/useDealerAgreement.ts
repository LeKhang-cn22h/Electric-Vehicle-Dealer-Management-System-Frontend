
// // app/composables/useDealerAgreement.ts
// import { ref } from "vue";

// export function useDealerAgreement() {
//   const pending = ref(false);

//   const API = "http://localhost:4000/evm-staff-agreement/contract-requests";

//   async function createContractRequest(dto: any) {
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

//   return {
//     pending,
//     createContractRequest,
//   };
// }

// function useAuthHeader() {
//   // Check if running on client-side
//   if (process.client) {
//     const token = localStorage.getItem("access_token");
//     return {
//       Authorization: `Bearer ${token || ''}`,
//     };
//   }
//   return {
//     Authorization: '',
//   };
// }
// app/composables/useDealerAgreement.ts
// app/composables/useDealerAgreement.ts
import { ref } from "vue";

export interface ContractRequestResponse {
  id: number;
  dealer_name: string;
  address: string;
  phone: string;
  email: string;
  user_uid: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  dealer_info?: {
    email: string;
    password: string;
    message: string;
  };
}

export function useDealerAgreement() {
  const pending = ref(false);
  const error = ref<string | null>(null);

  const API_BASE = "http://localhost:4000/dealer-agreement";

  // ✅ Tạo contract request
  async function createContractRequest(dto: any): Promise<any> {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/contract-request`, {
        method: "POST",
        body: dto,
        headers: useAuthHeader(),
      });
      console.log('Create contract request response:', res);
      return res as any;
    } catch (err: any) {
      error.value = err.message || 'Failed to create contract request';
      console.error('Create contract request error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // ✅ Lấy contract request mới nhất của user
  async function getMyContractRequest(): Promise<ContractRequestResponse> {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/requests/my-latest`, {
        method: "GET",
        headers: useAuthHeader(),
      });
      console.log('Get my contract request response:', res);
      return res as ContractRequestResponse;
    } catch (err: any) {
      error.value = err.message || 'Failed to get contract request';
      console.error('Get my contract request error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // ✅ Lấy tất cả contract requests của user
  async function getMyContractRequests(): Promise<ContractRequestResponse[]> {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/requests/my-requests`, {
        method: "GET",
        headers: useAuthHeader(),
      });
      console.log('Get my contract requests response:', res);
      return res as ContractRequestResponse[];
    } catch (err: any) {
      error.value = err.message || 'Failed to get contract requests';
      console.error('Get my contract requests error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // ✅ Kiểm tra trạng thái contract
  async function checkContractStatus(): Promise<ContractRequestResponse> {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/check-status`, {
        method: "GET",
        headers: useAuthHeader(),
      });
      console.log('Check contract status response:', res);
      return res as ContractRequestResponse;
    } catch (err: any) {
      error.value = err.message || 'Failed to check contract status';
      console.error('Check contract status error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // ✅ Lấy contract request theo ID
  async function getContractRequestById(id: number): Promise<ContractRequestResponse> {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_BASE}/requests/${id}`, {
        method: "GET",
        headers: useAuthHeader(),
      });
      console.log('Get contract request by ID response:', res);
      return res as ContractRequestResponse;
    } catch (err: any) {
      error.value = err.message || 'Failed to get contract request';
      console.error('Get contract request by ID error:', err);
      throw err;
    } finally {
      pending.value = false;
    }
  }

  // ✅ Clear error
  function clearError() {
    error.value = null;
  }

  return {
    pending,
    error,
    createContractRequest,
    getMyContractRequest,
    getMyContractRequests,
    checkContractStatus,
    getContractRequestById,
    clearError,
  };
}

function useAuthHeader() {
  if (process.client) {
    const token = localStorage.getItem("access_token") || 
                  localStorage.getItem("auth_token") || 
                  sessionStorage.getItem("access_token") ||
                  sessionStorage.getItem("auth_token");
    
    console.log('Auth token for dealer agreement:', token ? '***' + token.slice(-5) : 'MISSING');
    
    return {
      Authorization: `Bearer ${token || ''}`,
      "Content-Type": "application/json",
    };
  }
  return {
    Authorization: '',
    "Content-Type": "application/json",
  };
}