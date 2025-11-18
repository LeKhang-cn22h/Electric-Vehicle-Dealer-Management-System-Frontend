<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Back -->
    <button @click="goBack" class="mb-4 text-blue-600 hover:underline">← Quay lại</button>

    <div v-if="loading">Đang tải...</div>
    <div v-else>
      <!-- Title + Edit Toggle -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">{{ vehicle.name }}</h1>
        <button
          @click="isEditing = !isEditing"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ isEditing ? 'Hủy' : 'Chỉnh sửa' }}
        </button>
      </div>
      <p class="text-gray-600 mb-4">{{ vehicle.tagline }}</p>

      <!-- Main Image -->
      <div class="mb-4 relative">
        <img :src="mainImage" class="w-full rounded-xl shadow" alt="Main Image" />
        <button
          v-if="isEditing"
          @click="setMainImage"
          class="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
        >
          Đặt làm ảnh chính
        </button>
      </div>

      <!-- Thumbnail Images -->
      <div class="flex gap-3 mb-6 flex-wrap">
        <div
          v-for="img in vehicle.images"
          :key="img.id"
          class="relative group"
        >
          <img
            :src="img.path"
            @click="mainImage = img.path"
            :class="[
              'w-24 h-20 rounded-lg cursor-pointer border-2 hover:scale-105 transition',
              img.is_main ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
            ]"
          />
          <button
            v-if="isEditing"
            @click="removeImage(img.id)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
        
        <!-- Add Image Button -->
        <label
          v-if="isEditing"
          class="w-24 h-20 rounded-lg border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-blue-50 transition"
        >
          <div class="text-center">
            <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-xs text-gray-500">Thêm ảnh</span>
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

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h2 class="font-bold text-xl mb-3">Thông tin kỹ thuật</h2>
          <ul class="space-y-2">
            <li>
              <strong>Model:</strong>
              <span v-if="!isEditing">{{ vehicle.model }}</span>
              <input v-else v-model="form.model" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Version:</strong>
              <span v-if="!isEditing">{{ vehicle.version }}</span>
              <input v-else v-model="form.version" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Năm SX:</strong>
              <span v-if="!isEditing">{{ vehicle.year }}</span>
              <input v-else type="number" v-model.number="form.year" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Quãng đường:</strong>
              <span v-if="!isEditing">{{ vehicle.mileage }}</span>
              <input v-else v-model="form.mileage" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Nhiên liệu:</strong>
              <span v-if="!isEditing">{{ vehicle.fuel_type }}</span>
              <input v-else v-model="form.fuel_type" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Hộp số:</strong>
              <span v-if="!isEditing">{{ vehicle.transmission }}</span>
              <input v-else v-model="form.transmission" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Động cơ:</strong>
              <span v-if="!isEditing">{{ vehicle.engine }}</span>
              <input v-else v-model="form.engine" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Số ghế:</strong>
              <span v-if="!isEditing">{{ vehicle.seats }}</span>
              <input v-else type="number" v-model.number="form.seats" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Xuất xứ:</strong>
              <span v-if="!isEditing">{{ vehicle.origin }}</span>
              <input v-else v-model="form.origin" class="border rounded px-2 py-1 w-full"/>
            </li>
            <li>
              <strong>Tình trạng:</strong>
              <span v-if="!isEditing">{{ vehicle.status }}</span>
              <input v-else v-model="form.status" class="border rounded px-2 py-1 w-full"/>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="font-bold text-xl mb-3">Màu sắc</h2>
          <div class="flex gap-2 mb-4">
            <div
              v-for="(c, index) in form.color"
              :key="index"
              class="w-8 h-8 rounded-full border shadow cursor-pointer"
              :style="{ background: c }"
              @click="isEditing && selectColor(index)"
            ></div>
          </div>

          <h2 class="font-bold text-xl mb-3">Lợi ích</h2>
          <ul class="list-disc ml-5 mb-4">
            <li v-for="(benefit, idx) in form.benefits" :key="`benefit-${benefit.id || idx}`">
              <span v-if="!isEditing">{{ benefit.benefit }}</span>
              <input
                v-else
                v-model="form.benefits[idx].benefit"
                class="border rounded px-2 py-1 w-full"
              />
            </li>
          </ul>
        </div>
      </div>

      <!-- Features -->
      <div class="mt-10">
        <h2 class="text-xl font-bold mb-4">Tính năng nổi bật</h2>

        <div v-for="(group, groupIdx) in groupedFeatures" :key="`group-${groupIdx}`" class="mb-6">
          <h3 class="font-semibold mb-2">{{ group.category }}</h3>
          <ul class="list-disc ml-5">
            <li v-for="(item, itemIdx) in group.items" :key="`feature-${item.id || groupIdx}-${itemIdx}`">
              <span v-if="!isEditing">{{ item.item }}</span>
              <input
                v-else
                v-model="item.item"
                class="border rounded px-2 py-1 w-full"
              />
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-xl font-bold mb-3">Mô tả chi tiết</h2>
        <span v-if="!isEditing">{{ vehicle.description }}</span>
        <textarea
          v-else
          v-model="form.description"
          class="border rounded px-2 py-1 w-full"
          rows="4"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div v-if="isEditing" class="mt-6">
        <button
          @click="showUpdateConfirm = true"
          class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Cập nhật
        </button>
      </div>
    </div>

    <!-- Confirm Update Modal -->
    <div 
      v-if="showUpdateConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-3">Xác nhận cập nhật</h2>
        <p class="mb-4">
          Bạn có chắc chắn muốn <b>cập nhật</b> thông tin sản phẩm này không?
        </p>

        <div class="flex justify-end gap-3">
          <button 
            @click="showUpdateConfirm = false" 
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotification } from "@/composables/useNotification.js";

const { showNotification } = useNotification();

const route = useRoute();
const router = useRouter();

const vehicle = ref<any>(null);
const mainImage = ref("");
const loading = ref(true);
const isEditing = ref(false);
const nextImageId = ref(10); // ID cho ảnh mới

// Confirm modals
const showUpdateConfirm = ref(false);
const showDeleteImageConfirm = ref(false);
const imageToDelete = ref<number | null>(null);

const form = reactive<any>({
  model: "",
  version: "",
  year: 0,
  mileage: "",
  fuel_type: "",
  transmission: "",
  engine: "",
  seats: 0,
  origin: "",
  status: "",
  color: [] as string[],
  benefits: [] as any[],
  features: [] as any[],
  description: ""
});

const goBack = () => router.back();

onMounted(() => {
  loadFakeData();
});

const loadFakeData = () => {
  loading.value = true;

  vehicle.value = {
    id: 1,
    name: "VinFast VF8",
    tagline: "SUV điện thông minh – An toàn – Hiện đại",
    status: "Còn hàng",
    year: 2024,
    mileage: "0 km",
    fuel_type: "Electric",
    transmission: "Auto",
    color: ["#000", "#ffffff", "#1e90ff"],
    engine: "150kW/320Nm – Dual Motor",
    seats: 5,
    origin: "Việt Nam",
    description:
      "VinFast VF8 là mẫu SUV điện 5 chỗ với khả năng vận hành mạnh mẽ, trang bị nhiều công nghệ thông minh, an toàn đạt chuẩn châu Âu.",
    model: "VF8",
    version: "Plus",

    images: [
      { id: 1, path: "https://picsum.photos/id/1011/800/450", is_main: true },
      { id: 2, path: "https://picsum.photos/id/1015/800/450" },
      { id: 3, path: "https://picsum.photos/id/1020/800/450" }
    ],

    benefits: [
      { id: 1, benefit: "Bảo hành 10 năm" },
      { id: 2, benefit: "Miễn phí cứu hộ suốt đời" }
    ],

    features: [
      { id: 1, category: "Ngoại thất", item: "Đèn LED tự động" },
      { id: 2, category: "Ngoại thất", item: "Cảm biến trước & sau" },
      { id: 3, category: "Nội thất", item: "Màn hình 15 inch" },
      { id: 4, category: "Nội thất", item: "Ghế da cao cấp" },
      { id: 5, category: "An toàn", item: "ADAS – Tự động giữ làn" },
      { id: 6, category: "An toàn", item: "Cảnh báo va chạm" }
    ]
  };

  mainImage.value = vehicle.value.images.find((i: any) => i.is_main)?.path || vehicle.value.images[0]?.path || "";

  // copy dữ liệu sang form để edit - sử dụng JSON parse/stringify để deep clone
  form.model = vehicle.value.model;
  form.version = vehicle.value.version;
  form.year = vehicle.value.year;
  form.mileage = vehicle.value.mileage;
  form.fuel_type = vehicle.value.fuel_type;
  form.transmission = vehicle.value.transmission;
  form.engine = vehicle.value.engine;
  form.seats = vehicle.value.seats;
  form.origin = vehicle.value.origin;
  form.status = vehicle.value.status;
  form.description = vehicle.value.description;
  form.color = [...vehicle.value.color];
  form.benefits = JSON.parse(JSON.stringify(vehicle.value.benefits));
  form.features = JSON.parse(JSON.stringify(vehicle.value.features));

  loading.value = false;
};

const groupedFeatures = computed(() => {
  if (!form.features || form.features.length === 0) return [];

  const map: Record<string, any[]> = {};
  
  for (const f of form.features) {
    const category = f.category || 'Khác';
    if (!map[category]) {
      map[category] = [];
    }
    map[category].push(f);
  }
  
  return Object.entries(map).map(([category, items]) => ({
    category,
    items
  }));
});

function selectColor(index: number) {
  // ví dụ đổi màu sang đỏ khi click
  form.color[index] = "#ff0000";
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  
  if (!files || files.length === 0) return;
  
  // Xử lý từng file
  Array.from(files).forEach((file) => {
    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      showNotification('Vui lòng chỉ chọn file ảnh!', 'error');
      return;
    }
    
    // Kiểm tra kích thước (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Kích thước ảnh không được vượt quá 5MB!', 'error');
      return;
    }
    
    // Đọc file và chuyển thành base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage = {
        id: nextImageId.value++,
        path: e.target?.result as string,
        is_main: vehicle.value.images.length === 0, // Nếu chưa có ảnh nào thì đặt làm ảnh chính
        file: file // Lưu file để có thể upload lên server sau
      };
      
      vehicle.value.images.push(newImage);
      
      // Nếu là ảnh đầu tiên, set làm main image
      if (vehicle.value.images.length === 1) {
        mainImage.value = newImage.path;
      }
    };
    reader.readAsDataURL(file);
  });
  
  // Reset input để có thể chọn lại file
  input.value = '';
  
  showNotification('Đã thêm ảnh thành công!', 'success');
}

function removeImage(imageId: number) {
  imageToDelete.value = imageId;
  showDeleteImageConfirm.value = true;
}

function confirmDeleteImage() {
  if (imageToDelete.value === null) return;
  
  const index = vehicle.value.images.findIndex((img: any) => img.id === imageToDelete.value);
  if (index === -1) {
    showDeleteImageConfirm.value = false;
    imageToDelete.value = null;
    return;
  }
  
  const removedImage = vehicle.value.images[index];
  vehicle.value.images.splice(index, 1);
  
  // Nếu xóa ảnh chính, đặt ảnh đầu tiên làm ảnh chính
  if (removedImage.is_main && vehicle.value.images.length > 0) {
    vehicle.value.images[0].is_main = true;
    mainImage.value = vehicle.value.images[0].path;
  } else if (vehicle.value.images.length === 0) {
    mainImage.value = '';
  } else if (mainImage.value === removedImage.path) {
    // Nếu đang hiển thị ảnh bị xóa, chuyển sang ảnh khác
    mainImage.value = vehicle.value.images[0].path;
  }
  
  showDeleteImageConfirm.value = false;
  imageToDelete.value = null;
  showNotification('Đã xóa ảnh!', 'success');
}

function setMainImage() {
  // Tìm ảnh đang được hiển thị trong mainImage
  const currentImage = vehicle.value.images.find((img: any) => img.path === mainImage.value);
  
  if (!currentImage) return;
  
  // Bỏ đánh dấu ảnh chính cũ
  vehicle.value.images.forEach((img: any) => {
    img.is_main = false;
  });
  
  // Đặt ảnh hiện tại làm ảnh chính
  currentImage.is_main = true;
  
  showNotification('Đã đặt làm ảnh chính!', 'success');
}

function handleSubmit() {
  // fake submit -> copy form sang vehicle
  vehicle.value.model = form.model;
  vehicle.value.version = form.version;
  vehicle.value.year = form.year;
  vehicle.value.mileage = form.mileage;
  vehicle.value.fuel_type = form.fuel_type;
  vehicle.value.transmission = form.transmission;
  vehicle.value.engine = form.engine;
  vehicle.value.seats = form.seats;
  vehicle.value.origin = form.origin;
  vehicle.value.status = form.status;
  vehicle.value.description = form.description;
  vehicle.value.color = [...form.color];
  vehicle.value.benefits = JSON.parse(JSON.stringify(form.benefits));
  vehicle.value.features = JSON.parse(JSON.stringify(form.features));
  
  isEditing.value = false;
  showUpdateConfirm.value = false;

  showNotification("Cập nhật sản phẩm thành công!", "success");
}
</script>