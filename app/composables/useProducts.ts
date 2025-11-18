import { ref } from 'vue'

export function useVehicles() {
  const vehicles = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Dữ liệu giả
  const mockData = [
    { id: 1, name: 'Vinfast vf1', model: 'vf1', version: 'pro'  },
    { id: 2, name: 'Vinfast vf4', model: 'vf4', version: 'new'},
    { id: 3, name: 'Vinfast vf3', model: 'vf3', version: 'ultra'},
    { id: 4, name: 'Vinfast nt4', model: 'nt4', version: 'sport'},
    { id: 5, name: 'Vinfast gg5', model: 'gg5', version: 'lite'}
  ]

  const fetchVehicles = async (filters: any = {}) => {
    loading.value = true
    try {
      // Mô phỏng delay như gọi API
      await new Promise(res => setTimeout(res, 500))

      let filtered = [...mockData]

      if (filters.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(search) || 
          c.model.toLowerCase().includes(search)
        )
      }

   

      vehicles.value = filtered
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    vehicles,
    loading,
    error,
    fetchVehicles
  }
}
