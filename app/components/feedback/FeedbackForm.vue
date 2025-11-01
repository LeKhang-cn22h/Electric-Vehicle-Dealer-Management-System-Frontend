<template>
   <form @submit.prevent="SendFB" class="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
    <div class="mb-4">
        <label class="block font-medium mb-2">Họ và Tên</label>
        <input v-model="form.hoTen" type="text" placeholder="Nhập họ tên của bạn"
        class="w-full border rounded-xl px-4 py-2">
    </div>
    <div class="mb-4">
        <label class="block font-medium mb-2">Email</label>
        <input v-model="form.email" type="email" placeholder="Nhập email của bạn" 
               class="border border-gray w-full rounded-xl px-4 py-2">
    </div>
    <div class="mb-4">
        <label class="block font-medium mb-2">Chọn đại lý</label>
        <select v-model="form.daiLy" class="w-full border rounded-xl px-4 py-2">
            <option disabled value="">--Chọn đại lý--</option>
            <option v-for="dl in dsDaiLy" :key="dl.id" :value="dl.ten">{{ dl.ten }}</option>
        </select>
    </div>
    <div class="mb-4">
        <label class="block font-medium mb-2">Tiêu đề</label>
        <input v-model="form.tieuDe" type="text" placeholder="Nhập tiêu đề phản hồi/khiếu nại" 
               class="border border-gray px-4 py-2 rounded-xl w-full">
    </div>
    <div class="mb-4">
        <label class="block font-medium mb-2">Nội dung</label>
        <textarea v-model="form.noiDung" placeholder="Mô tả nội dung phản hồi hoặc khiếu nại của bạn ..." 
                  class="w-full border border-gray rounded-xl px-4 py-2 h-24">
        </textarea>
    </div>
    <button type="submit" class="font-bold bg-blue-600 text-white px-20 py-2 rounded-xl hover:bg-blue-700 transition-colors mx-auto block">
        GỬI
    </button>
   </form>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    
    const thongBao = ref("");
    const emit = defineEmits(['submitted']);
    
    const form = ref({
        hoTen: "",
        email: "",
        daiLy: "",
        tieuDe: "",
        noiDung: "",
    });
    
    const dsDaiLy = ref([
        {id: 1, ten: "Đại lý 1"},
        {id: 2, ten: "Đại lý 2"},
        {id: 3, ten: "Đại lý 3"},
    ]);
    
    function SendFB() {
        console.log("Gửi phản hồi/khiếu nại:", form.value);
        
        // Emit event để parent component xử lý
        emit('submitted');
        
        setTimeout(() => {
            thongBao.value = "";
        }, 3000);
        
        // Reset form
        form.value = {
            hoTen: "",
            email: "",
            daiLy: "",
            tieuDe: "",
            noiDung: "",
        };
    }
</script>