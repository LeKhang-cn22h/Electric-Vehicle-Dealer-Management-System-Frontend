<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Back -->
    <button @click="goBack" class="mb-4 text-blue-600 hover:underline">← Quay lại</button>

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">Tạo sản phẩm mới</h1>
        <p class="text-gray-600 mt-2">Thêm xe điện mới vào hệ thống</p>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-6">
      <!-- Basic Info Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Thông tin cơ bản</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="VD: VinFast VF8"
              class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="errors.name ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Slogan
            </label>
            <input
              v-model="form.tagline"
              type="text"
              placeholder="VD: SUV điện thông minh"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Model <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.model"
              type="text"
              placeholder="VD: VF8"
              class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="errors.model ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.model" class="text-red-500 text-sm mt-1">{{ errors.model }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phiên bản
            </label>
            <input
              v-model="form.version"
              type="text"
              placeholder="VD: Plus, Eco"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Năm sản xuất <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.year"
              type="number"
              min="2020"
              max="2030"
              class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="errors.year ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.year" class="text-red-500 text-sm mt-1">{{ errors.year }}</p>
          </div>

          
        </div>
      </div>

      <!-- Technical Specs Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quãng đường
            </label>
            <input
              v-model="form.mileage"
              type="text"
              placeholder="VD: 0 km, 420 km"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nhiên liệu
            </label>
            <select
              v-model="form.fuel_type"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hộp số
            </label>
            <select
              v-model="form.transmission"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Auto">Tự động</option>
              <option value="Manual">Số sàn</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Động cơ
            </label>
            <input
              v-model="form.engine"
              type="text"
              placeholder="VD: 150kW/320Nm"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số ghế
            </label>
            <input
              v-model.number="form.seats"
              type="number"
              min="2"
              max="9"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Xuất xứ
            </label>
            <input
              v-model="form.origin"
              type="text"
              placeholder="VD: Việt Nam"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Images Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Hình ảnh sản phẩm</h2>
        
        <div v-if="imageFiles.length > 0" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ảnh chính
          </label>
          <div class="relative">
            <img :src="mainImage" class="w-full h-64 object-cover rounded-lg shadow" alt="Main Image" />
          </div>
        </div>

        <div class="flex gap-3 flex-wrap mb-4">
          <div
            v-for="(img, index) in imagePreviews"
            :key="index"
            class="relative group"
          >
            <img
              :src="img.path"
              @click="selectMainImage(index)"
              :class="[
                'w-24 h-20 rounded-lg cursor-pointer border-2 hover:scale-105 transition object-cover',
                img.is_main ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
              ]"
            />
            <button
              @click="removeImageAtIndex(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
          
          <!-- Add Image Button -->
          <label
            class="w-24 h-20 rounded-lg border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-blue-50 transition"
          >
            <div class="text-center">
              <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-xs text-gray-500">Thêm</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleImageUpload"
            />
          </label>
        </div>
        <p class="text-sm text-gray-500">Click vào ảnh để chọn làm ảnh chính</p>
      </div>

      <!-- Colors Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Màu sắc</h2>
        <div class="flex gap-3 items-center flex-wrap">
          <div
            v-for="(color, index) in form.color"
            :key="index"
            class="relative group"
          >
            <div
              class="w-12 h-12 rounded-full border-2 border-gray-300 shadow cursor-pointer"
              :style="{ background: color }"
            ></div>
            <button
              @click="removeColor(index)"
              class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
          
          <button
            @click="showColorPicker = true"
            class="w-12 h-12 rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500 flex items-center justify-center bg-gray-50 hover:bg-blue-50 transition"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Lợi ích</h2>
          <button
            @click="addBenefit"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Thêm
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(benefit, index) in form.benefits"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="benefit.benefit"
              type="text"
              placeholder="VD: Bảo hành 10 năm"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="removeBenefit(index)"
              class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Tính năng nổi bật</h2>
          <button
            @click="addFeature"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Thêm
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="(feature, index) in form.features"
            :key="index"
            class="flex gap-2"
          >
            <select
              v-model="feature.category"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Ngoại thất">Ngoại thất</option>
              <option value="Nội thất">Nội thất</option>
              <option value="An toàn">An toàn</option>
              <option value="Tiện nghi">Tiện nghi</option>
              <option value="Công nghệ">Công nghệ</option>
            </select>
            <input
              v-model="feature.item"
              type="text"
              placeholder="VD: Đèn LED tự động"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="removeFeature(index)"
              class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Mô tả chi tiết</h2>
        <textarea
          v-model="form.description"
          rows="6"
          placeholder="Nhập mô tả chi tiết về sản phẩm..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <button
          @click="goBack"
          class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
        >
          Hủy
        </button>
        <button
          @click="showCreateConfirm = true"
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          Tạo sản phẩm
        </button>
      </div>
    </div>

    <!-- Color Picker Modal -->
    <div 
      v-if="showColorPicker"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-3">Chọn màu sắc</h2>
        <div class="mb-4">
          <input
            v-model="newColor"
            type="color"
            class="w-full h-24 rounded border border-gray-300 cursor-pointer"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Hoặc nhập mã màu:</label>
          <input
            v-model="newColor"
            type="text"
            placeholder="#000000"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button 
            @click="showColorPicker = false" 
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button 
            @click="addColor" 
            class="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
          >
            Thêm màu
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Create Modal -->
    <div 
      v-if="showCreateConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-3">Xác nhận tạo sản phẩm</h2>
        <p class="mb-4">
          Bạn có chắc chắn muốn <b>tạo</b> sản phẩm mới này không?
        </p>

        <div class="flex justify-end gap-3">
          <button 
            @click="showCreateConfirm = false" 
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button 
            @click="handleSubmit" 
            class="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Image Modal -->
    <div 
      v-if="showDeleteImageConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-3">Xác nhận xóa</h2>
        <p class="mb-4">
          Bạn có chắc chắn muốn <b>xóa</b> ảnh này không?
        </p>

        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteImageConfirm = false" 
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button 
            @click="confirmDeleteImage" 
            class="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "@/composables/useNotification.js";
import { useVehicle } from '~/composables/useVehicle'
const { showNotification } = useNotification();
const router = useRouter();
const {create, loading, error} =useVehicle();

// Form state
const form = reactive({
  name: "",
  tagline: "",
  model: "",
  version: "",
  year: new Date().getFullYear(),
  mileage: "0 km",
  fuel_type: "Electric",
  transmission: "Auto",
  engine: "",
  seats: 5,
  origin: "Việt Nam",
  status: "Còn hàng",
  description: "",
  quantity:0,
  color: [] as string[],
  benefits: [] as any[],
  features: [] as any[]
});
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<{ path: string; is_main: boolean }[]>([]);
// Validation errors
const errors = reactive({
  name: "",
  model: "",
  year: ""
});

// Modal states
const showCreateConfirm = ref(false);
const showColorPicker = ref(false);
const showDeleteImageConfirm = ref(false);
const imageIndexToDelete = ref<number | null>(null);

// Color picker
const newColor = ref("#000000");

// Computed
const mainImage = computed(() => {
  const main = imagePreviews.value.find(img => img.is_main);
  return main ? main.path : (imagePreviews.value[0]?.path || "");
});

const goBack = () => router.back();

// Image functions
function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    if (!file.type.startsWith("image/")) {
      showNotification("Vui lòng chỉ chọn file ảnh!", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Kích thước ảnh không được vượt quá 5MB!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push({
        path: e.target?.result as string,
        is_main: imagePreviews.value.length === 0
      });
      imageFiles.value.push(file);
    };
    reader.readAsDataURL(file);
  });

  input.value = "";
  showNotification("Đã thêm ảnh thành công!", "success");
}


function selectMainImage(index: number) {
  imagePreviews.value.forEach((img, i) => {
    img.is_main = i === index;
  });
}


function removeImageAtIndex(index: number) {
  imageIndexToDelete.value = index;
  showDeleteImageConfirm.value = true;
}

function confirmDeleteImage() {
  if (imageIndexToDelete.value === null) return;

  imagePreviews.value.splice(imageIndexToDelete.value, 1);
  imageFiles.value.splice(imageIndexToDelete.value, 1);

  // Nếu xóa ảnh chính, set ảnh đầu tiên là chính
  if (imagePreviews.value.length > 0 && !imagePreviews.value.some(img => img.is_main)) {
    const firstImage = imagePreviews.value[0];
    if (firstImage) {
      firstImage.is_main = true;
    }
  }

  showDeleteImageConfirm.value = false;
  imageIndexToDelete.value = null;
  showNotification("Đã xóa ảnh!", "success");
}


// Color functions
function addColor() {
  if (!newColor.value) return;
  
  form.color.push(newColor.value);
  showColorPicker.value = false;
  newColor.value = "#000000";
  showNotification('Đã thêm màu!', 'success');
}

function removeColor(index: number) {
  form.color.splice(index, 1);
}

// Benefit functions
function addBenefit() {
  form.benefits.push({ benefit: "" });
}

function removeBenefit(index: number) {
  form.benefits.splice(index, 1);
}

// Feature functions
function addFeature() {
  form.features.push({ category: "Ngoại thất", item: "" });
}

function removeFeature(index: number) {
  form.features.splice(index, 1);
}

// Validation
function validate() {
  errors.name = "";
  errors.model = "";
  errors.year = "";
  
  let isValid = true;
  
  if (!form.name.trim()) {
    errors.name = "Vui lòng nhập tên sản phẩm";
    isValid = false;
  }
  
  if (!form.model.trim()) {
    errors.model = "Vui lòng nhập model";
    isValid = false;
  }
  
  if (form.year < 2020 || form.year > 2030) {
    errors.year = "Năm sản xuất không hợp lệ";
    isValid = false;
  }
  
  return isValid;
}

// Submit
async function handleSubmit() {
  if (!validate()) {
    showCreateConfirm.value = false;
    showNotification('Vui lòng kiểm tra lại thông tin!', 'error');
    return;
  }

  const cleanedData = {
    ...form,
    benefits: form.benefits.filter(b => b.benefit.trim() !== ""),
    features: form.features.filter(f => f.item.trim() !== "")
  };

  // Gửi lên backend
  const result = await create(cleanedData, imageFiles.value);

  showCreateConfirm.value = false;
  showNotification('Tạo sản phẩm thành công!', 'success');
  
  setTimeout(() => router.push('/admin/products'), 1500);
}

definePageMeta({
  layout: "admin",
});
</script>