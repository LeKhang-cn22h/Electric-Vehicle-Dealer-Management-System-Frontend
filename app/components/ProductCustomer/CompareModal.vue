<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-11/12 max-w-6xl p-6 relative overflow-auto max-h-[90vh]">
      <!-- Nút đóng -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
      >
        ✕
      </button>

      <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">So sánh xe</h2>

      <!-- Nếu chưa chọn xe -->
      <div v-if="cars.length === 0" class="text-center text-gray-500 py-10">
        Chưa có xe nào được chọn để so sánh.
      </div>

      <!-- Bảng so sánh -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 w-48">Thông số</th>
              <th
                v-for="(car, i) in cars"
                :key="i"
                class="p-3 text-center"
              >
                <img :src="car.src" :alt="car.name" class="h-24 mx-auto object-cover rounded-lg mb-2" />
                <div class="font-semibold">{{ car.name }}</div>
                <div class="text-blue-600 font-bold">{{ car.price }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(spec, key) in specs" :key="key" class="border-t">
              <td class="p-3 font-medium bg-gray-50">{{ spec.label }}</td>
              <td
                v-for="(car, i) in cars"
                :key="i"
                class="p-3 text-center"
              >
                {{ car[spec.key] || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  cars: {
    type: Array,
    default: () => []
  }
})

const specs = [
  { label: 'Hãng xe', key: 'make' },
  { label: 'Dòng xe', key: 'model' },
  { label: 'Năm sản xuất', key: 'year' },
  { label: 'Động cơ', key: 'engine' },
  { label: 'Công suất (HP)', key: 'power' },
  { label: 'Mức tiêu thụ nhiên liệu', key: 'fuel' },
  { label: 'Giá bán', key: 'price' }
]
</script>
