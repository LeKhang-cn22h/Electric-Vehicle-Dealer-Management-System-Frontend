<template>
  <div class="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto">
    <!-- Filter by Make -->
    <div class="relative w-full">
      <input
        v-model="searchMake"
        type="text"
        placeholder="Lọc theo hãng (Make)..."
        class="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        @focus="showMake = true"
        @blur="hideDropdown('make')"
      />
      <ul
        v-if="showMake"
        class="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded-lg shadow-md"
      >
        <li
          v-for="(m, index) in filteredMakes"
          :key="index"
          @mousedown.prevent="selectMake(m)"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ m }}
        </li>
        <li v-if="filteredMakes.length === 0" class="px-3 py-2 text-gray-400">
          Không tìm thấy
        </li>
      </ul>
    </div>

    <!-- Filter by Model -->
    <div class="relative w-full">
      <input
        v-model="searchModel"
        type="text"
        placeholder="Lọc theo dòng xe (Model)..."
        class="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        @focus="showModel = true"
        @blur="hideDropdown('model')"
      />
      <ul
        v-if="showModel"
        class="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded-lg shadow-md"
      >
        <li
          v-for="(m, index) in filteredModels"
          :key="index"
          @mousedown.prevent="selectModel(m)"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ m }}
        </li>
        <li v-if="filteredModels.length === 0" class="px-3 py-2 text-gray-400">
          Không tìm thấy
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

const emits = defineEmits(['filter-change'])

const makes = ref(['Toyota', 'Honda', 'Ford', 'Mazda', 'Hyundai'])
const models = ref(['Camry', 'Civic', 'Ranger', 'CX-5', 'Accent'])

const searchMake = ref('')
const searchModel = ref('')
const showMake = ref(false)
const showModel = ref(false)

const filteredMakes = computed(() =>
  makes.value.filter(m =>
    m.toLowerCase().includes(searchMake.value.toLowerCase())
  )
)

const filteredModels = computed(() =>
  models.value.filter(m =>
    m.toLowerCase().includes(searchModel.value.toLowerCase())
  )
)

const selectMake = (make) => {
  searchMake.value = make
  showMake.value = false
  emits('filter-change', { make, model: searchModel.value })
}

const selectModel = (model) => {
  searchModel.value = model
  showModel.value = false
  emits('filter-change', { make: searchMake.value, model })
}

const hideDropdown = (type) => {
  setTimeout(() => {
    if (type === 'make') showMake.value = false
    if (type === 'model') showModel.value = false
  }, 150)
}
</script>
