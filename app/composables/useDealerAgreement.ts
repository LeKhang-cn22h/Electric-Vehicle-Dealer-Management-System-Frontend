
// app/composables/useDealerAgreement.ts
import { ref } from "vue";

export function useDealerAgreement() {
  const pending = ref(false);

  const API = "http://localhost:4000/evm-staff-agreement/contract-requests";

  async function createContractRequest(dto: any) {
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

  return {
    pending,
    createContractRequest,
  };
}

function useAuthHeader() {
  // Check if running on client-side
  if (process.client) {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token || ''}`,
    };
  }
  return {
    Authorization: '',
  };
}
// app/composables/useDealerAgreement.ts
// import { ref } from "vue";

// export interface ContractRequestHistory {
//   id: string;
//   dealer_name: string;
//   address: string;
//   phone: string;
//   email: string;
//   user_uid: string;
//   created_at: string;
//   status: 'pending' | 'approved' | 'rejected';
//   credentials?: {
//     email: string;
//     password: string;
//   };
// }

// export function useDealerAgreement() {
//   const pending = ref(false);
//   const history = ref<ContractRequestHistory[]>([]);
//   const loadingHistory = ref(false);

//   const API_BASE = "http://localhost:3003/dealer-agreement";

//   async function createContractRequest(dto: any) {
//     pending.value = true;
//     try {
//       const res = await $fetch(`${API_BASE}/create-request`, {
//         method: "POST",
//         body: dto,
//         headers: useAuthHeader(),
//       });
      
//       // Sau khi tạo xong, tự động load lại history
//       await getHistory();
      
//       return res;
//     } finally {
//       pending.value = false;
//     }
//   }

//   async function getHistory() {
//     loadingHistory.value = true;
//     try {
//       const res = await $fetch<ContractRequestHistory[]>(`${API_BASE}/history`, {
//         method: "GET",
//         headers: useAuthHeader(),
//       });
//       history.value = res;
//       return res;
//     } catch (error) {
//       console.error("Error fetching history:", error);
//       throw error;
//     } finally {
//       loadingHistory.value = false;
//     }
//   }

//   return {
//     pending,
//     history,
//     loadingHistory,
//     createContractRequest,
//     getHistory,
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