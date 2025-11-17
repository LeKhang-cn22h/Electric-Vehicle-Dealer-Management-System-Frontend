<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Quay lại -->
    <button @click="goBack" class="mb-6 text-blue-500 hover:underline flex items-center">
      ← Quay lại danh sách
    </button>

    <h1 class="text-3xl font-bold mb-6">Tạo hồ sơ khách hàng</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

      <!-- Tên -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Tên khách hàng</h2>
        <input 
          v-model="form.name" 
          class="border p-2 w-full rounded"
          placeholder="Nhập tên"
        />
      </div>

      <!-- Email -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Email</h2>
        <input 
          v-model="form.email" 
          class="border p-2 w-full rounded"
          placeholder="example@gmail.com"
        />
      </div>

      <!-- Số điện thoại -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Số điện thoại</h2>
        <input 
          v-model="form.phone" 
          class="border p-2 w-full rounded"
          placeholder="0909xxxxxx"
        />
      </div>

      <!-- Địa chỉ -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Địa chỉ</h2>
        <input 
          v-model="form.address" 
          class="border p-2 w-full rounded"
          placeholder="Nhập địa chỉ"
        />
      </div>

      <!-- Ngày sinh -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Ngày sinh</h2>
        <input 
          v-model="form.birthDate" 
          type="date" 
          class="border p-2 w-full rounded"
        />
      </div>

      <!-- Giới tính -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Giới tính</h2>
        <select 
          v-model="form.gender"
          class="border p-2 w-full rounded"
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

    </div>

    <!-- Nút hành động -->
    <div class="flex gap-4">
      <button
        @click="submit"
        class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Tạo hồ sơ
      </button>

      <button
        @click="goBack"
        class="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
      >
        Hủy
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

// Router
const router = useRouter();

// Form dữ liệu
const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  birthDate: "",
  gender: "",
  status: true,               // mặc định là Hoạt động
  createdAt: new Date().toISOString().slice(0, 10),  // auto set ngày tạo
});

// Quay lại danh sách
const goBack = () => router.push("/manage_profile_customer");

// Validate đơn giản
const validate = () => {
  if (!form.value.name) return "Vui lòng nhập tên";
  if (!form.value.email) return "Vui lòng nhập email";
  if (!form.value.phone) return "Vui lòng nhập số điện thoại";
  return null;
};

// Submit tạo hồ sơ
const submit = () => {
  const error = validate();
  if (error) {
    alert(error);
    return;
  }

  // Sau này thay bằng API createCustomer
  console.log("Dữ liệu gửi lên:", form.value);

  alert("Tạo hồ sơ khách hàng thành công!");

  router.push("/manage_profile_customer");
};
</script>
