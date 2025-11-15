import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const VehicleService = {
    // GET ALL - Giữ nguyên
    async getAll() {
        const res = await api.get('/vehicle');
        return res.data;
    },

    //  GET ONE - Fix template literal (thiếu dấu `)
    async getOne(id: number) {
        const res = await api.get(`/vehicle/${id}`); 
        return res.data;
    },

    //  CREATE - Sửa để gửi multipart/form-data
    async create(vehicleData: any, images: File[]) {
        const formData = new FormData();

        // Append vehicle JSON
        formData.append('vehicle', JSON.stringify(vehicleData));

        // Append images
        images.forEach((file) => {
            formData.append('images', file);
        });

        const res = await api.post('/vehicle', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    },

    // UPDATE - Sửa để gửi multipart/form-data
    async update(id: number, vehicleData: any, images?: File[]) {
        const formData = new FormData();

        // append vehicle JSON
        formData.append('vehicle', JSON.stringify(vehicleData));

        // Append images 
        if (images && images.length > 0) {
            images.forEach((file) => {
                formData.append('images', file);
            });
        }

        const res = await api.put(`/vehicle/${id}`, formData, { 
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    },

    //DELETE 
    async remove(id: number) {
        const res = await api.delete(`/vehicle/${id}`);
        return res.data;
    }
};