<template>
  <div class="flex flex-col sm:flex-row gap-4 w-full">    
    <div class="relative w-full">
      <input
        v-model="searchModel"
        type="text"
        placeholder="Lọc theo dòng xe (Model)..."
        class="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        @focus="showModel = true"
        @blur="hideDropdown"
        @input="onModelInput"
      />
      <ul
        v-if="showModel && models.length > 0"
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
      <div
        v-if="showModel && models.length === 0"
        class="absolute z-10 bg-white border w-full rounded-lg shadow-md"
      >
        <div class="px-3 py-2 text-gray-400">Đang tải...</div>
      </div>
    </div>

    <button
      v-if="hasActiveFilters"
      @click="resetFilters"
      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition whitespace-nowrap"
      title="Xóa bộ lọc"
    >
      ✕ Xóa lọc
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVehicle } from '~/composables/useVehicle';

const emits = defineEmits(['filter-change']);

const { models, fetchModels } = useVehicle();
const searchModel = ref('');
const showModel = ref(false);

const hasActiveFilters = computed(() => {
  return searchModel.value !== '';
});

onMounted(async () => {
  await fetchModels();
});

const filteredModels = computed(() => {
  if (!searchModel.value) return models.value;
  return models.value.filter(m =>
    m.toLowerCase().includes(searchModel.value.toLowerCase())
  );
});

const selectModel = (model) => {
  searchModel.value = model;
  showModel.value = false;
  emitFilters();
};

const onModelInput = () => {
  if (!searchModel.value) {
    emitFilters();
  }
};

const emitFilters = () => {
  emits('filter-change', {
    model: searchModel.value || undefined
  });
};

const resetFilters = () => {
  searchModel.value = '';
  emits('filter-change', {});
};

const hideDropdown = () => {
  setTimeout(() => {
    showModel.value = false;
  }, 150);
};
</script>

<style scoped>
ul {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-track {
  background: #f7fafc;
}

ul::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}
</style>