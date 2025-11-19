import { defineStore } from "pinia";
import type { CompareCar } from "~/types/vehicle";

export const useCompareStore = defineStore("compare", {
  state: () => ({
    selectedCars: [] as CompareCar[],   // danh sách xe FE
    compareResult: [] as CompareCar[]   // dữ liệu trả về BE (nếu cùng format)
  }),

  getters: {
    // Getter để kiểm tra số lượng xe đã chọn
    compareCount: (state) => state.selectedCars.length,
    
    // Getter để kiểm tra xe đã có trong danh sách chưa
    isInCompare: (state) => (carId: number) => {
      return state.selectedCars.some(car => car.id === carId);
    }
  },

  actions: {
    /** Thêm xe vào danh sách so sánh */
    addCar(car: CompareCar) {
      // Kiểm tra nếu xe đã tồn tại
      if (this.selectedCars.find((c) => c.id === car.id)) {
        console.warn('Xe đã có trong danh sách so sánh');
        return;
      }
      
      // Giới hạn số lượng xe có thể so sánh (tuỳ chọn)
      if (this.selectedCars.length >= 4) {
        console.warn('Chỉ có thể so sánh tối đa 4 xe');
        return;
      }
      
      this.selectedCars.push(car);
    },

    /** Xóa 1 xe khỏi danh sách */
    removeCar(id: number) {
      this.selectedCars = this.selectedCars.filter((c) => c.id !== id);
    },

    /** Xóa toàn bộ */
    clearAll() {
      this.selectedCars = [];
      this.compareResult = [];
    },

    /** Lưu kết quả so sánh */
    setCompareResult(data: CompareCar[]) {
      this.compareResult = data;
    },
    
    /** Toggle xe trong danh sách so sánh */
    toggleCar(car: CompareCar) {
      const existingIndex = this.selectedCars.findIndex(c => c.id === car.id);
      if (existingIndex > -1) {
        this.removeCar(car.id);
      } else {
        this.addCar(car);
      }
    }
  }
});