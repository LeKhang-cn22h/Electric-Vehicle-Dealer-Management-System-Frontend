<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <!-- Header -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
            <h1 class="flex items-center gap-2 text-3xl font-bold text-gray-800 tracking-tight">
                <ScrollText class="w-7 h-7" />
                Danh sách đơn hàng
            </h1>
            <NuxtLink
                to="/user/orders/create"
                class="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-md"
            >
                <span class="text-lg font-bold">+</span>
                <span>Tạo đơn hàng mới</span>
            </NuxtLink>
        </header>

        <!-- Toolbar -->
        <section class="mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <OrderToolbar
                :search-query="filters.searchQuery"
                :status-filter="filters.status"
                :date-from="filters.dateFrom"
                :date-to="filters.dateTo"
                @update:search-query="filters.searchQuery = $event"
                @update:status-filter="filters.status = $event"
                @update:date-from="filters.dateFrom = $event"
                @update:date-to="filters.dateTo = $event"
                @filter-change="resetAndFetch"
            />
        </section>

        <!-- Loading -->
        <div v-if="pending" class="flex justify-center py-16">
            <div class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>

        <!-- Table -->
        <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <OrderTable :fields-name="fieldsName" :data="paginatedOrders" rowKey="id" basePath="orders" @print="handlePrint">
                <template #orderDate="{ row }">{{ formatDate(row.orderDate) }}</template>
                <template #totalAmount="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
                <template #status="{ row }">
                    <OrderStatusBadge :status="row.status" />
                </template>
            </OrderTable>
        </div>

        <!-- Empty state -->
        <div
            v-if="!pending && orders.length === 0"
            class="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm mt-6"
        >
            <p class="text-gray-500 text-lg">Không có đơn hàng nào được tìm thấy 📭</p>
        </div>

        <!-- Pagination -->
        <div v-if="!pending && orders.length > 0" class="mt-6">
            <OrderPagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
        </div>
    </div>
</template>

<script setup>
import OrderToolbar from "@/components/orders/OrderToolbar.vue";
import OrderTable from "@/components/orders/OrderTable.vue";
import OrderPagination from "@/components/orders/OrderPagination.vue";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge.vue";
import { formatCurrency, formatDate } from "@/utils/format";
import { ScrollText } from "lucide-vue-next";

const filters = reactive({
    searchQuery: "",
    status: "",
    dateFrom: "",
    dateTo: "",
});

const currentPage = ref(1);
const pageSize = 10;
const pending = ref(false);

const fieldsName = [
    { label: "Mã đơn hàng", key: "orderCode" },
    { label: "Khách hàng", key: "customerName" },
    { label: "Ngày đặt", key: "orderDate" },
    { label: "Tổng tiền", key: "totalAmount" },
    { label: "Trạng thái", key: "status" },
    { label: "Thao tác", key: "actions" },
];

const orders = ref([
    {
        id: 1,
        orderCode: "#ORD-001",
        customerName: "Nguyễn Văn A",
        orderDate: "2024-10-20",
        productName: "EV Model X - Đen",
        quantity: 1,
        totalAmount: 850000000,
        status: "delivered",
    },
    {
        id: 2,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 3,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 4,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 5,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 6,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 7,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 8,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 9,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 10,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 11,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 12,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 13,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 14,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 15,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 16,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 17,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 18,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 19,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 20,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
    {
        id: 21,
        orderCode: "#ORD-002",
        customerName: "Trần Thị B",
        orderDate: "2024-10-22",
        productName: "EV Model Y - Trắng",
        quantity: 1,
        totalAmount: 720000000,
        status: "pending",
    },
]);

const filteredOrders = computed(() => {
    if (!orders.value) return [];

    return orders.value.filter((order) => {
        // Lọc theo searchQuery (tên khách hàng hoặc mã đơn hàng)
        const searchMatch =
            !filters.searchQuery ||
            order.customerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            order.orderCode.toLowerCase().includes(filters.searchQuery.toLowerCase());

        // Lọc theo status
        const statusMatch = !filters.status || order.status === filters.status;

        // Lọc theo dateFrom
        const dateFromMatch = !filters.dateFrom || new Date(order.orderDate) >= new Date(filters.dateFrom);

        // Lọc theo dateTo (thêm thời gian để bao gồm cả ngày cuối)
        const dateToMatch = !filters.dateTo || new Date(order.orderDate) <= new Date(filters.dateTo + "T23:59:59");

        // Kết hợp tất cả điều kiện
        return searchMatch && statusMatch && dateFromMatch && dateToMatch;
    });
});

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil((filteredOrders.value.length || 0) / pageSize));

const resetAndFetch = () => {
    currentPage.value = 1;
    fetchOrders();
};

const fetchOrders = () => {
    pending.value = true;
    setTimeout(() => {
        pending.value = false;
    }, 500);
};

const changePage = (page) => {
    currentPage.value = page;
    fetchOrders();
};

const handlePrint = (order) => {
    console.log("In hóa đơn:", order);
};

onMounted(() => {
    fetchOrders();
});
</script>
