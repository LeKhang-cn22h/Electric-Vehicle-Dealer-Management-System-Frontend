import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', {
  state: () => ({
    selectedCars: []
  }),
  actions: {
    addCar(car) {
      if (!this.selectedCars.find(c => c.id === car.id)) {
        this.selectedCars.push(car)
      }
    },
    removeCar(id) {
      this.selectedCars = this.selectedCars.filter(c => c.id !== id)
    },
    clearAll() {    
      this.selectedCars = []
    }
  }
})
