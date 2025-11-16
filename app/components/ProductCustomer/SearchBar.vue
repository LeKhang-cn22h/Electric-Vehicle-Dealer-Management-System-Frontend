<template>
  <div class="relative w-full">
    <div class="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
      <!-- Icon tìm kiếm -->
      <button class="text-gray-500 hover:text-blue-500 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
        </svg>
      </button>

      <input
        v-model="keyword"
        type="text"
        placeholder="Tìm kiếm..."
        class="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        @keyup.enter="saveSearchHistory"
        @blur="hideDropdown"
        @focus="showHistory = true"
      />
      
      <!-- Clear button -->
      <button 
        v-if="keyword" 
        @click="clearSearch"
        class="text-gray-400 hover:text-gray-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Dropdown lịch sử -->
    <div 
      v-if="showHistory && searchHistory.length" 
      class="absolute bg-white border rounded-lg mt-1 w-full max-h-40 overflow-auto shadow-lg z-10"
    >
      <div class="flex justify-between items-center px-3 py-2 border-b">
        <span class="text-sm font-medium text-gray-500">Lịch sử tìm kiếm</span>
        <button 
          @click="clearAllHistory"
          class="text-xs text-red-500 hover:text-red-700"
        >
          Xóa tất cả
        </button>
      </div>
      <ul>
        <li 
          v-for="(item, index) in searchHistory" 
          :key="index"
          class="flex justify-between items-center px-3 py-2 hover:bg-gray-100 cursor-pointer group"
          @mousedown="selectHistoryItem(item)"
        >
          <span class="text-gray-700">{{ item }}</span>
          <button 
            @mousedown.stop="removeHistoryItem(index)"
            class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, onMounted } from 'vue';

const emits = defineEmits(['update:search']);

const keyword = ref('');
const searchHistory = ref<string[]>([]);
const showHistory = ref(false);

// Constants
const MAX_HISTORY_ITEMS = 10;
const STORAGE_KEY = 'searchHistory';

// Load lịch sử khi mount
onMounted(() => {
  loadSearchHistory();
});

// Watch keyword changes với debounce
let searchTimeout: NodeJS.Timeout;
watch(keyword, (newVal) => {
  emits('update:search', newVal);
  
  // Clear previous timeout
  clearTimeout(searchTimeout);
  
  // Set new timeout để tránh lưu quá nhiều
  searchTimeout = setTimeout(() => {
    if (newVal.trim() && newVal.length > 2) { // Chỉ lưu khi có ít nhất 3 ký tự
      saveSearchHistory();
    }
  }, 1000);
});

// Load search history từ localStorage
const loadSearchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    if (history) {
      searchHistory.value = JSON.parse(history);
    }
  } catch (error) {
    console.error('Error loading search history:', error);
    searchHistory.value = [];
  }
};

// Save search history
const saveSearchHistory = () => {
  if (!keyword.value.trim()) return;
  
  const searchTerm = keyword.value.trim();
  
  // Remove existing item if exists (để đưa lên đầu)
  const existingIndex = searchHistory.value.findIndex(item => item.toLowerCase() === searchTerm.toLowerCase());
  if (existingIndex !== -1) {
    searchHistory.value.splice(existingIndex, 1);
  }
  
  // Add to beginning
  searchHistory.value.unshift(searchTerm);
  
  // Limit số lượng items
  if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
    searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS);
  }
  
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

// Select item from history
const selectHistoryItem = (item: string) => {
  keyword.value = item;
  showHistory.value = false;
  emits('update:search', item);
};

// Remove single history item
const removeHistoryItem = (index: number) => {
  searchHistory.value.splice(index, 1);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value));
  } catch (error) {
    console.error('Error updating search history:', error);
  }
};

// Clear all history
const clearAllHistory = () => {
  searchHistory.value = [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
  showHistory.value = false;
};

// Clear current search
const clearSearch = () => {
  keyword.value = '';
  emits('update:search', '');
  showHistory.value = false;
};

// Hide dropdown
const hideDropdown = () => {
  setTimeout(() => {
    showHistory.value = false;
  }, 200);
};
</script>

<style scoped>
/* Custom scrollbar */
ul {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 0 0 8px 0;
}

ul::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}
</style>