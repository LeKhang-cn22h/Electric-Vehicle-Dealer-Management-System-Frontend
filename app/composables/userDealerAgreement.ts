import { ref } from "vue";

export function useDealerAgreement() {
  const pending = ref(false);

  const API = "http://localhost:4000/dealer-agreement/contract-request";

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
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
}
