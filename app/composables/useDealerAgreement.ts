
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
