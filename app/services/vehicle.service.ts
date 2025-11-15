import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use((config) => {
    // CHỈ thêm token nếu KHÔNG PHẢI là GET /vehicle
    const isPublicGetVehicle = config.method === 'get' && config.url?.startsWith('/vehicle');
    
    if (!isPublicGetVehicle) {
        const token = localStorage.getItem('access_token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
});

export const VehicleService = {
    // ✅ GET ALL - Không gửi token
    async getAll() {
        const res = await api.get('/vehicle');
        return res.data;
    },

    // ✅ GET ONE - Không gửi token
    async getOne(id: number) {
        const res = await api.get(`/vehicle/${id}`);
        return res.data;
    },

    // 🔒 CREATE - Có token
    async create(vehicleData: any, images: File[]) {
        const formData = new FormData();
        formData.append('vehicle', JSON.stringify(vehicleData));
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

    // 🔒 UPDATE - Có token
    async update(id: number, vehicleData: any, images?: File[]) {
        const formData = new FormData();
        formData.append('vehicle', JSON.stringify(vehicleData));

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

    // 🔒 DELETE - Có token
    async remove(id: number) {
        const res = await api.delete(`/vehicle/${id}`);
        return res.data;
    }
};