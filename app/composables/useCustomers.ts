import { ref } from 'vue'

export function useCustomers() {
  const customers = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Dữ liệu giả
  const mockData = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0123456789', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', phone: '0987654321', status: 'inactive' },
    { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', phone: '0912345678', status: 'active' },
    { id: 4, name: 'Phạm Thị D', email: 'd@gmail.com', phone: '0909876543', status: 'active' },
    { id: 5, name: 'Hoàng Văn E', email: 'e@gmail.com', phone: '0934567890', status: 'inactive' }
  ]

  const fetchCustomers = async (filters: any = {}) => {
    loading.value = true
    try {
      // Mô phỏng delay như gọi API
      await new Promise(res => setTimeout(res, 500))

      let filtered = [...mockData]

      if (filters.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(search) || 
          c.email.toLowerCase().includes(search)
        )
      }

      if (filters.status) {
        filtered = filtered.filter(c => c.status === filters.status)
      }

      customers.value = filtered
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers
  }
}
