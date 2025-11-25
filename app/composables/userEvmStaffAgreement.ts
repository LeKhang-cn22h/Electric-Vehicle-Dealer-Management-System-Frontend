import { ref } from 'vue'

interface ContractRequest {
  id: number
  dealer_name: string
  address: string
  phone: string
  email: string
  status: string
  created_at: string
}

interface CreateContractRequestData {
  dealer_name: string
  address: string
  phone: string
  email: string
  user_id?: string;       // thêm user_id (tùy chọn)
  fcm_token?: string;  
}

interface ApproveRequestData {
  sales_target: number
  order_limit: number
}

export const useEvmStaffAgreement = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const getAllContractRequests = async (): Promise<ContractRequest[]> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('http://localhost:4000/evm-staff-agreement/contract-requests', {
        method: 'GET',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createContractRequest = async (requestData: CreateContractRequestData): Promise<any> => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('http://localhost:4000/evm-staff-agreement/contract-requests', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
    throw err;
  } finally {
    loading.value = false;
  }
};

  const approveContractRequest = async (requestId: number, approveData: ApproveRequestData): Promise<any> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`http://localhost:4000/evm-staff-agreement/contract-requests/${requestId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(approveData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }
  interface SaveFcmTokenData {
  fcmToken: string;
  deviceInfo?: any;
}

const saveFcmToken = async (data: SaveFcmTokenData): Promise<any> => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('http://localhost:4000/evm-staff-agreement/save-fcm-token', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
    throw err;
  } finally {
    loading.value = false;
  }
};


  return {
    loading,
  error,
  getAllContractRequests,
  createContractRequest,
  approveContractRequest,
  saveFcmToken,
  }
}