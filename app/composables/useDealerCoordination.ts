// composables/useDealerCoordination.ts
import { ref } from 'vue'
import axios from 'axios'

const API_URL = '/api/dealer-coordination'

interface Vehicle {
  model: string
  color: string
  quantity: number
}

interface CreateRequestPayload {
  dealer_id: string
  dealer_name: string
  request_type: 'new' | 'transfer'
  vehicles: Vehicle[]
}

interface VehicleRequest {
  id: string
  dealer_id: string
  dealer_name: string
  request_type: string
  model: string
  color: string
  quantity: number
  created_at?: string
}

export function useDealerCoordination() {
  const requests = ref<VehicleRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Tạo yêu cầu điều phối
  const createRequest = async (payload: CreateRequestPayload) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.post(`${API_URL}/requests`, payload)
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Lỗi tạo yêu cầu'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy tất cả yêu cầu
  const getAllRequests = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get(`${API_URL}/requests`)
      requests.value = data.data || []
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Lỗi tải dữ liệu'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy yêu cầu theo dealer_id
  const getRequestsByDealerId = async (dealerId: string) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get(`${API_URL}/requests/${dealerId}`)
      requests.value = data.data || []
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Lỗi tải dữ liệu'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy yêu cầu theo dealer_name
  const getRequestsByDealerName = async (dealerName: string) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get(`${API_URL}/requests`, {
        params: { dealer_name: dealerName }
      })
      requests.value = data.data || []
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Lỗi tải dữ liệu'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    requests,
    loading,
    error,
    createRequest,
    getAllRequests,
    getRequestsByDealerId,
    getRequestsByDealerName
  }
}