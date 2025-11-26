// composables/useEvmCoordination.ts
import { ref } from 'vue'

interface VehicleRequest {
  id: number
  dealer_name: string
  email: string
  address: string
  quantity: number
  status: 'pending' | 'approved' | 'rejected' | 'processing'
  user_id: string
  notes?: string
  assigned_staff_id?: string
  estimated_delivery_date?: string
  created_at: string
  updated_at: string
}

interface CreateVehicleRequestData {
  dealer_name: string
  email: string
  address: string
  quantity: number
}

interface ProcessVehicleRequestData {
  status: 'approved' | 'rejected' | 'processing'
  notes?: string
  assigned_staff_id?: string
  estimated_delivery_date?: string
}

interface VehicleRequestsResponse {
  data: VehicleRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface StatsResponse {
  total: number
  total_vehicles: number
  pending: number
  approved: number
  rejected: number
  processing: number
}

interface HealthCheckResponse {
  status: string
  message: string
  timestamp: string
}

export const useEvmCoordination = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id')
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    
    if (userId) {
      headers['user-id'] = userId
    }
    
    return headers
  }

  const createVehicleRequest = async (requestData: CreateVehicleRequestData): Promise<VehicleRequest> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('http://localhost:4000/staff-coordination/vehicle-requests', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData)
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

  const getVehicleRequests = async (filters?: {
    status?: string
    dealer_name?: string
    page?: number
    limit?: number
  }): Promise<VehicleRequestsResponse> => {
    loading.value = true
    error.value = null
    
    try {
      let url = 'http://localhost:4000/staff-coordination/vehicle-requests?'
      const params = new URLSearchParams()

      if (filters?.status) params.append('status', filters.status)
      if (filters?.dealer_name) params.append('dealer_name', filters.dealer_name)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())

      url += params.toString()

      const response = await fetch(url, {
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

  const getVehicleRequestsByUserId = async (
    userId: string,
    filters?: {
      status?: string
      page?: number
      limit?: number
    }
  ): Promise<VehicleRequestsResponse> => {
    loading.value = true
    error.value = null
    
    try {
      let url = `http://localhost:4000/staff-coordination/vehicle-requests/user/${userId}?`
      const params = new URLSearchParams()

      if (filters?.status) params.append('status', filters.status)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())

      url += params.toString()

      const response = await fetch(url, {
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

  const searchVehicleRequestsByEmail = async (email: string): Promise<VehicleRequest[]> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `http://localhost:4000/staff-coordination/vehicle-requests/search/email?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      )

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

  const getVehicleRequestById = async (id: number): Promise<VehicleRequest> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `http://localhost:4000/staff-coordination/vehicle-requests/${id}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      )

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

  const processVehicleRequest = async (
    id: number,
    processData: ProcessVehicleRequestData
  ): Promise<VehicleRequest> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `http://localhost:4000/staff-coordination/vehicle-requests/${id}/process`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(processData)
        }
      )

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

  const updateVehicleRequest = async (
    id: number,
    updateData: Partial<CreateVehicleRequestData>
  ): Promise<VehicleRequest> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `http://localhost:4000/staff-coordination/vehicle-requests/${id}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updateData)
        }
      )

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

  const deleteVehicleRequest = async (id: number): Promise<{ message: string }> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `http://localhost:4000/staff-coordination/vehicle-requests/${id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      )

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

  const getRequestStats = async (): Promise<StatsResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        'http://localhost:4000/staff-coordination/vehicle-requests/stats/summary',
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      )

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

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        'http://localhost:4000/staff-coordination/vehicle-requests/health/check',
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      )

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

  return {
    loading,
    error,
    createVehicleRequest,
    getVehicleRequests,
    getVehicleRequestsByUserId,
    searchVehicleRequestsByEmail,
    getVehicleRequestById,
    processVehicleRequest,
    updateVehicleRequest,
    deleteVehicleRequest,
    getRequestStats,
    healthCheck
  }
}