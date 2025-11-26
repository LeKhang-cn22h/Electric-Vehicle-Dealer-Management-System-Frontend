<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Quay lại -->
    <button @click="goBack" class="mb-6 text-blue-500 hover:underline flex items-center">
      ← Quay lại danh sách
    </button>

    <h1 class="text-3xl font-bold mb-6">Tạo hồ sơ khách hàng</h1>

    <!-- Loading state -->
    <div v-if="loading" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
      Đang xử lý...
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- ✅ Validation Errors Display -->
    <div v-if="Object.keys(validationErrors).length > 0" class="bg-red-50 border border-red-200 rounded p-4 mb-4">
      <h3 class="font-semibold text-red-700 mb-2">❌ Lỗi xác thực:</h3>
      <ul class="list-disc list-inside text-red-600 space-y-1">
        <li v-for="(msg, field) in validationErrors" :key="field">
          <strong>{{ getFieldLabel(field) }}:</strong> {{ msg }}
        </li>
      </ul>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

      <!-- Tên -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Tên khách hàng <span class="text-red-500">*</span></h2>
        <input 
          v-model="form.name" 
          class="border p-2 w-full rounded"
          :class="{ 'border-red-500': validationErrors.name }"
          placeholder="Nhập tên"
        />
        <p v-if="validationErrors.name" class="text-red-500 text-sm mt-1">
          {{ validationErrors.name }}
        </p>
      </div>

      <!-- Email -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Email</h2>
        <input 
          v-model="form.email" 
          type="email"
          class="border p-2 w-full rounded"
          :class="{ 'border-red-500': validationErrors.email }"
          placeholder="example@gmail.com"
        />
        <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
          {{ validationErrors.email }}
        </p>
      </div>

      <!-- Số điện thoại -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Số điện thoại <span class="text-red-500">*</span></h2>
        <input 
          v-model="form.phone" 
          class="border p-2 w-full rounded"
          :class="{ 'border-red-500': validationErrors.phone }"
          placeholder="0909xxxxxx (10-11 số)"
        />
        <p v-if="validationErrors.phone" class="text-red-500 text-sm mt-1">
          {{ validationErrors.phone }}
        </p>
      </div>

      <!-- Địa chỉ -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Địa chỉ</h2>
        <input 
          v-model="form.adress" 
          class="border p-2 w-full rounded"
          :class="{ 'border-red-500': validationErrors.adress }"
          placeholder="Nhập địa chỉ"
        />
        <p v-if="validationErrors.adress" class="text-red-500 text-sm mt-1">
          {{ validationErrors.adress }}
        </p>
      </div>

      <!-- Ngày sinh -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Ngày sinh</h2>
        <input 
          v-model="form.birth_day" 
          type="date" 
          class="border p-2 w-full rounded"
          :class="{ 'border-red-500': validationErrors.birth_day }"
        />
        <p v-if="validationErrors.birth_day" class="text-red-500 text-sm mt-1">
          {{ validationErrors.birth_day }}
        </p>
      </div>

      <!-- Giới tính -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Giới tính</h2>
        <select 
          v-model="form.gender"
          class="border p-2 w-full rounded"
          :class="{ 'border-red-500': validationErrors.gender }"
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <p v-if="validationErrors.gender" class="text-red-500 text-sm mt-1">
          {{ validationErrors.gender }}
        </p>
      </div>

    </div>

    <!-- Nút hành động -->
    <div class="flex gap-4">
      <button
        @click="submit"
        :disabled="loading"
        class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Đang tạo...' : 'Tạo hồ sơ' }}
      </button>

      <button
        @click="goBack"
        :disabled="loading"
        class="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
      >
        Hủy
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCustomer } from "~/composables/useCustomer";
import type { Customer } from "~/types/profile";
const router = useRouter();
const { 
  loading, 
  error, 
  validationErrors,
  create,
  clearValidationErrors
} = useCustomer();
definePageMeta({
  layout: false,
});

const { layoutName, applyLayout } = useRoleBasedLayout();
applyLayout();
const form = ref<Partial<Customer>>({
  name: "",
  email: "",
  phone: "",
  adress: "",
  birth_day: "",
  gender: "",
});

// Quay lại danh sách
const goBack = () => {
  clearValidationErrors();
  router.push("/manage_profile_customer");
};

// ✅ Helper để hiển thị tên field tiếng Việt
const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    'name': 'Tên',
    'email': 'Email',
    'phone': 'Số điện thoại',
    'adress': 'Địa chỉ',
    'birth_day': 'Ngày sinh',
    'gender': 'Giới tính',
  }
  return labels[field] || field
}

//  Submit với validation Zod
const submit = async () => {
  // Clear errors trước khi submit
  clearValidationErrors();

  try {
    console.log("📤 Dữ liệu gửi lên:", form.value);

    // Gọi create - sẽ tự validate trong composable
    await create(form.value);

    console.log(" Tạo hồ sơ thành công!");

    alert("Tạo hồ sơ khách hàng thành công!");
    
    // Redirect về danh sách
    router.push("/manage_profile_customer");
  } catch (e: any) {
    console.error(" Lỗi khi tạo:", e);
    
    // Validation errors đã được xử lý trong composable
    // Chỉ show alert nếu không phải validation error
    if (!Object.keys(validationErrors.value).length) {
      alert("Có lỗi xảy ra: " + (e.message || "Unknown error"));
    }
  }
};
</script>