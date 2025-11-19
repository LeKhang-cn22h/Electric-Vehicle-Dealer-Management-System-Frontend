<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Back -->
    <button @click="goBack" class="mb-4 text-blue-600 hover:underline">← Quay lại</button>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4">Đang tải...</p>
    </div>

    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500">{{ error }}</p>
      <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Quay lại
      </button>
    </div>

    <div v-else-if="vehicle">
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
        <img 
          v-if="mainImage" 
          :src="mainImage" 
          class="w-full rounded-xl shadow" 
          alt="Main Image" 
        />
        <div v-else class="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
          <span class="text-gray-500">Chưa có ảnh</span>
        </div>
        <button
          v-if="isEditing && mainImage"
          @click="setMainImage"
          class="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
        >
          Đặt làm ảnh chính
        </button>
      </div>

      <!-- Thumbnail Images -->
      <div class="flex gap-3 mb-6 flex-wrap">
        <div
          v-for="img in (vehicle.images || [])"
          :key="img.id"
          class="relative group"
        >
          <img
            :src="img.imageUrl"
            @click="mainImage = img.imageUrl"
            :class="[
              'w-24 h-20 rounded-lg cursor-pointer border-2 hover:scale-105 transition object-cover',
              img.is_main ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
            ]"
            alt="Thumbnail"
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
              <imageUrl stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="font-bold text-xl mb-3">Thông tin kỹ thuật</h2>
          <ul class="space-y-2">
            <li>
              <strong>Model:</strong>
              <span v-if="!isEditing">{{ vehicle.model }}</span>
              <input v-else v-model="form.model" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Version:</strong>
              <span v-if="!isEditing">{{ vehicle.version }}</span>
              <input v-else v-model="form.version" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Năm SX:</strong>
              <span v-if="!isEditing">{{ vehicle.year }}</span>
              <input v-else type="number" v-model.number="form.year" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Quãng đường:</strong>
              <span v-if="!isEditing">{{ vehicle.mileage }}</span>
              <input v-else v-model="form.mileage" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Nhiên liệu:</strong>
              <span v-if="!isEditing">{{ vehicle.fuel_type }}</span>
              <input v-else v-model="form.fuel_type" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Hộp số:</strong>
              <span v-if="!isEditing">{{ vehicle.transmission }}</span>
              <input v-else v-model="form.transmission" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Động cơ:</strong>
              <span v-if="!isEditing">{{ vehicle.engine }}</span>
              <input v-else v-model="form.engine" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Số ghế:</strong>
              <span v-if="!isEditing">{{ vehicle.seats }}</span>
              <input v-else type="number" v-model.number="form.seats" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Xuất xứ:</strong>
              <span v-if="!isEditing">{{ vehicle.origin }}</span>
              <input v-else v-model="form.origin" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
            <li>
              <strong>Tình trạng:</strong>
              <span v-if="!isEditing">{{ vehicle.status }}</span>
              <input v-else v-model="form.status" class="border rounded px-2 py-1 w-full ml-2"/>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="font-bold text-xl mb-3">Màu sắc</h2>
          <div class="flex gap-2 mb-4 flex-wrap">
            <div
              v-for="(c, index) in form.color"
              :key="index"
              class="w-8 h-8 rounded-full border shadow cursor-pointer"
              :style="{ background: c }"
              @click="isEditing && selectColor(index)"
            ></div>
            <button
              v-if="isEditing"
              @click="addColor"
              class="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500 flex items-center justify-center"
            >
              <span class="text-gray-500">+</span>
            </button>
          </div>

          <h2 class="font-bold text-xl mb-3">Lợi ích</h2>
          <ul class="list-disc ml-5 mb-4 space-y-1">
            <li v-for="(benefit, idx) in form.benefits" :key="`benefit-${benefit.id || idx}`" class="flex items-center gap-2">
              <span v-if="!isEditing" class="flex-1">{{ benefit.benefit }}</span>
              <input
                v-else
                v-model="form.benefits[idx].benefit"
                class="border rounded px-2 py-1 flex-1"
              />
              <button
                v-if="isEditing"
                @click="removeBenefit(idx)"
                class="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </li>
          </ul>
          <button
            v-if="isEditing"
            @click="addBenefit"
            class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            + Thêm lợi ích
          </button>
        </div>
      </div>

      <!-- Features -->
      <div class="mt-10">
        <h2 class="text-xl font-bold mb-4">Tính năng nổi bật</h2>

        <div v-for="(group, groupIdx) in groupedFeatures" :key="`group-${groupIdx}`" class="mb-6">
          <h3 class="font-semibold mb-2">{{ group.category }}</h3>
          <ul class="list-disc ml-5 space-y-1">
            <li v-for="(item, itemIdx) in group.items" :key="`feature-${item.id || groupIdx}-${itemIdx}`" class="flex items-center gap-2">
              <span v-if="!isEditing" class="flex-1">{{ item.item }}</span>
              <input
                v-else
                v-model="item.item"
                class="border rounded px-2 py-1 flex-1"
              />
              <button
                v-if="isEditing"
                @click="removeFeature(item)"
                class="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </li>
          </ul>
          <button
            v-if="isEditing"
            @click="addFeature(group.category)"
            class="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            + Thêm tính năng
          </button>
        </div>

        <button
          v-if="isEditing"
          @click="addFeatureCategory"
          class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Thêm danh mục tính năng
        </button>
      </div>

      <div class="mt-10">
        <h2 class="text-xl font-bold mb-3">Mô tả chi tiết</h2>
        <p v-if="!isEditing" class="whitespace-pre-wrap">{{ vehicle.description }}</p>
        <textarea
          v-else
          v-model="form.description"
          class="border rounded px-3 py-2 w-full"
          rows="6"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div v-if="isEditing" class="mt-6 flex gap-3">
        <button
          @click="showUpdateConfirm = true"
          class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Cập nhật
        </button>
        <button
          @click="cancelEdit"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
      </div>
    </div>

    <!-- Confirm Update Modal -->
    <div 
      v-if="showUpdateConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      @click.self="showUpdateConfirm = false"
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
      @click.self="showDeleteImageConfirm = false"
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
import { useVehicle } from '~/composables/useVehicle'

const route = useRoute();
const router = useRouter();
const { showNotification } = useNotification();
const { fetchOne, loading, error } = useVehicle();

const vehicle = ref<any>(null);
const mainImage = ref("");
const isEditing = ref(false);
const nextImageId = ref(10);

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

onMounted(async () => {
  const paramId = route.params.id;
  const numId = typeof paramId === "string" ? parseInt(paramId, 10) : 0;

  if (numId > 0) {
    try {
      const data = await fetchOne(numId);
      
      if (!data) {
        showNotification("Không tìm thấy sản phẩm!", "error");
        return;
      }

      vehicle.value = data;

      // Đồng bộ form
      form.model = data.model || "";
      form.version = data.version || "";
      form.year = data.year || 0;
      form.mileage = data.mileage || "";
      form.fuel_type = data.fuel_type || "";
      form.transmission = data.transmission || "";
      form.engine = data.engine || "";
      form.seats = data.seats || 0;
      form.origin = data.origin || "";
      form.status = data.status || "";
      form.color = Array.isArray(data.color) ? [...data.color] : [];
      form.benefits = Array.isArray(data.benefits) ? JSON.parse(JSON.stringify(data.benefits)) : [];
      form.features = Array.isArray(data.features) ? JSON.parse(JSON.stringify(data.features)) : [];
      form.description = data.description || "";

      // Set main image
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        const mainImg = data.images.find((img: any) => img.is_main);
        mainImage.value = mainImg?.imageUrl || data.images[0]?.imageUrl || "";
        
        const maxId = Math.max(...data.images.map((img: any) => img.id || 0));
        nextImageId.value = maxId + 1;
      } else {
        mainImage.value = "";
      }
    } catch (err) {
      showNotification("Lỗi khi tải dữ liệu sản phẩm!", "error");
    }
  }
});

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
  const newColor = prompt("Nhập mã màu (hex):", form.color[index]);
  if (newColor) {
    form.color[index] = newColor;
  }
}

function addColor() {
  const newColor = prompt("Nhập mã màu (hex):", "#000000");
  if (newColor) {
    form.color.push(newColor);
  }
}

function addBenefit() {
  form.benefits.push({
    id: Date.now(),
    benefit: "Lợi ích mới"
  });
}

function removeBenefit(index: number) {
  form.benefits.splice(index, 1);
}

function addFeature(category: string) {
  form.features.push({
    id: Date.now(),
    category: category,
    item: "Tính năng mới"
  });
}

function removeFeature(item: any) {
  const index = form.features.findIndex((f: any) => f === item);
  if (index !== -1) {
    form.features.splice(index, 1);
  }
}

function addFeatureCategory() {
  const category = prompt("Nhập tên danh mục:");
  if (category) {
    form.features.push({
      id: Date.now(),
      category: category,
      item: "Tính năng mới"
    });
  }
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  
  if (!files || files.length === 0) return;
  
  // Đảm bảo vehicle.images tồn tại
  if (!vehicle.value.images) {
    vehicle.value.images = [];
  }
  
  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) {
      showNotification('Vui lòng chỉ chọn file ảnh!', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Kích thước ảnh không được vượt quá 5MB!', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage = {
        id: nextImageId.value++,
        imageUrl: e.target?.result as string,
        is_main: vehicle.value.images.length === 0,
        file: file
      };
      
      vehicle.value.images.push(newImage);
      
      if (vehicle.value.images.length === 1) {
        mainImage.value = newImage.imageUrl;
      }
    };
    reader.readAsDataURL(file);
  });
  
  input.value = '';
  showNotification('Đã thêm ảnh thành công!', 'success');
}

function removeImage(imageId: number) {
  imageToDelete.value = imageId;
  showDeleteImageConfirm.value = true;
}

function confirmDeleteImage() {
  if (imageToDelete.value === null || !vehicle.value.images) return;
  
  const index = vehicle.value.images.findIndex((img: any) => img.id === imageToDelete.value);
  if (index === -1) {
    showDeleteImageConfirm.value = false;
    imageToDelete.value = null;
    return;
  }
  
  const removedImage = vehicle.value.images[index];
  vehicle.value.images.splice(index, 1);
  
  if (removedImage.is_main && vehicle.value.images.length > 0) {
    vehicle.value.images[0].is_main = true;
    mainImage.value = vehicle.value.images[0].imageUrl;
  } else if (vehicle.value.images.length === 0) {
    mainImage.value = '';
  } else if (mainImage.value === removedImage.imageUrl) {
    mainImage.value = vehicle.value.images[0].imageUrl;
  }
  
  showDeleteImageConfirm.value = false;
  imageToDelete.value = null;
  showNotification('Đã xóa ảnh!', 'success');
}

function setMainImage() {
  if (!vehicle.value.images) return;
  
  const currentImage = vehicle.value.images.find((img: any) => img.imageUrl === mainImage.value);
  
  if (!currentImage) return;
  
  vehicle.value.images.forEach((img: any) => {
    img.is_main = false;
  });
  
  currentImage.is_main = true;
  
  showNotification('Đã đặt làm ảnh chính!', 'success');
}

function cancelEdit() {
  isEditing.value = false;
  
  // Reset form về dữ liệu gốc
  if (vehicle.value) {
    form.model = vehicle.value.model || "";
    form.version = vehicle.value.version || "";
    form.year = vehicle.value.year || 0;
    form.mileage = vehicle.value.mileage || "";
    form.fuel_type = vehicle.value.fuel_type || "";
    form.transmission = vehicle.value.transmission || "";
    form.engine = vehicle.value.engine || "";
    form.seats = vehicle.value.seats || 0;
    form.origin = vehicle.value.origin || "";
    form.status = vehicle.value.status || "";
    form.color = Array.isArray(vehicle.value.color) ? [...vehicle.value.color] : [];
    form.benefits = JSON.parse(JSON.stringify(vehicle.value.benefits || []));
    form.features = JSON.parse(JSON.stringify(vehicle.value.features || []));
    form.description = vehicle.value.description || "";
  }
}

function handleSubmit() {
  // Copy form data sang vehicle
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
  // images không cần copy vì đã cập nhật trực tiếp vào vehicle.value.images
  
  isEditing.value = false;
  showUpdateConfirm.value = false;

  showNotification("Cập nhật sản phẩm thành công!", "success");
  
  // TODO: Gọi API để cập nhật dữ liệu lên server
  // await updateVehicle(vehicle.value.id, vehicle.value);
}

definePageMeta({
  layout: "admin",
});
</script>