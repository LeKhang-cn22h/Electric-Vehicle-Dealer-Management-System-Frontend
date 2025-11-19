// services/contractRequestService.js
import { authStore } from '../store/authStore'

const API_BASE_URL = 'http://localhost:3000'

export const contractRequestService = {
  async submitContractRequest(formData) {
    try {
      const token = authStore.getToken()
      
      const response = await fetch(`${API_BASE_URL}/dealer-agreement/contract-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Cập nhật role nếu backend trả về
      if (result.user && result.user.role) {
        authStore.updateUserRole(result.user.role)
      }
      
      return result
    } catch (error) {
      console.error('Error submitting contract request:', error)
      throw error
    }
  }
}