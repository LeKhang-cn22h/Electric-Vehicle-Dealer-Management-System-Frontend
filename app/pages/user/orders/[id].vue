<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <header class="mb-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Chi tiết đơn hàng #{{ orderId }}</h1>
                        <p class="text-gray-600 mt-1">Thông tin chi tiết của đơn hàng</p>
                    </div>
                    <button @click="goBack" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        ← Quay lại danh sách
                    </button>
                </div>
                <button
                    v-if="userRole === 'dealer_manager'"
                    class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    @click="handleSubmit"
                    :disabled="order?.status !== 'pending'"
                >
                    {{ order?.status === "pending" ? "Xác nhận" : "Đã xử lý" }}
                </button>
                <span
                    v-else
                    class="mt-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium"
                    :class="order?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'"
                >
                    {{ order?.status === "pending" ? "Chờ xác nhận" : "Đã xử lý" }}
                </span>
            </header>

            <!-- Loading -->
            <div v-if="pending" class="flex justify-center py-20">
                <div class="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>

            <!-- Nội dung chi tiết -->
            <div v-else-if="order" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
                <!-- Thông tin khách hàng -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Khách hàng</h2>
                    <p><strong>Tên:</strong> {{ order.customer?.name }}</p>
                    <p><strong>Số điện thoại:</strong> {{ order.customer?.phone }}</p>
                    <p><strong>Email:</strong> {{ order.customer?.email }}</p>
                    <p><strong>Địa chỉ:</strong> {{ order.customer.adress }}</p>
                </section>

                <!-- Sản phẩm -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Sản phẩm</h2>
                    <table class="w-full border border-gray-200 rounded-lg">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="text-left px-4 py-2">Tên sản phẩm</th>
                                <th class="text-left px-4 py-2">Số lượng</th>
                                <th class="text-left px-4 py-2">Đơn giá</th>
                                <th class="text-left px-4 py-2">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in order.vehicles" :key="item.id" class="border-t">
                                <td class="px-4 py-2">{{ item.name }}</td>
                                <td class="px-4 py-2">
                                    {{ order.items.find((i) => i.product_id === item.id)?.quantity || 0 }}
                                </td>
                                <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                                <td class="px-4 py-2">
                                    {{
                                        formatCurrency(
                                            (order.items.find((i) => i.product_id === item.id)?.quantity || 0) *
                                                (item.price ? item.price : 0)
                                        )
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- Khuyến mãi -->
                <section v-if="order.promotions?.length">
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Khuyến mãi</h2>
                    <ul class="list-disc list-inside text-gray-700">
                        <li v-for="promo in order.promotions" :key="promo.id">
                            {{ promo.code }} — Giảm
                            {{
                                promo.discountType === "amount" ? formatCurrency(promo.discountValue) : promo.discountValue + "%"
                            }}
                        </li>
                    </ul>
                </section>

                <!-- Thanh toán -->
                <section>
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Thanh toán</h2>

                    <p>
                        <strong>Phương thức:</strong>
                        {{
                            order.payment_method === "cash"
                                ? "Tiền mặt"
                                : order.payment_method === "bank_transfer"
                                ? "Chuyển khoản"
                                : "Trả góp"
                        }}
                    </p>

                    <p>
                        <strong>Trạng thái thanh toán:</strong>
                        {{
                            order.payment_status === "paid"
                                ? "Đã thanh toán"
                                : order.payment_status === "partial"
                                ? "Thanh toán một phần"
                                : "Chưa thanh toán"
                        }}
                    </p>

                    <p>
                        <strong>Số tiền thanh toán:</strong>
                        {{ formatCurrency(order.payment_amount ?? order.total_amount) }}
                    </p>

                    <!-- Thông tin chi tiết trả góp -->
                    <!-- <div
            v-if="order.payment_method === 'installment'"
            class="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 space-y-1"
          >
            <p>
              <strong>Trả trước:</strong>
              {{ formatCurrency(order.down_payment || 0) }}
            </p>

            <p>
              <strong>Kỳ hạn:</strong>
              {{ order.term || 0 }} tháng
            </p>

            <p v-if="remainingAmount">
              <strong>Số tiền còn lại cần góp:</strong>
              {{ formatCurrency(remainingAmount) }}
            </p>

            <p v-if="monthlyInstallment">
              <strong>Dự kiến trả mỗi tháng (chưa tính lãi):</strong>
              {{ formatCurrency(monthlyInstallment) }}
            </p>
          </div> -->
                </section>

                <!-- Tổng kết đơn hàng -->
                <section class="border-t pt-4 mt-6 space-y-2 text-gray-700">
                    <div
                        v-if="order.payment_method === 'installment'"
                        class="bg-blue-50 border border-blue-200 rounded p-4 space-y-1 text-sm"
                    >
                        <p>
                            <strong>Trả trước:</strong>
                            {{ formatCurrency(order.down_payment || 0) }}
                        </p>
                        <p>
                            <strong>Số tiền còn lại cần góp:</strong>
                            {{ formatCurrency(order.total_amount - (order.down_payment || 0)) }}
                        </p>
                        <p v-if="order.term">
                            <strong>Góp mỗi tháng:</strong>
                            {{ formatCurrency((order.total_amount - (order.down_payment || 0)) / order.term) }}
                            × {{ order.term }} tháng
                        </p>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-700">Tổng tiền đơn hàng:</span>
                        <span class="font-medium text-blue-600 text-lg">
                            {{ formatCurrency(order.total_amount) }}
                        </span>
                    </div>

                    <div
                        v-if="order.payment_method === 'installment'"
                        class="flex justify-between items-center text-sm text-gray-700"
                    >
                        <span>Còn lại cần góp:</span>
                        <span class="font-medium text-red-500">
                            {{ formatCurrency(order.total_amount - (order.down_payment || 0)) }}
                        </span>
                    </div>
                </section>

                <div class="flex justify-end mt-4" v-if="(order as Record<string, any>)?.invoice_id">
                    <div class="flex justify-end mt-4" v-if="hasInvoice">
                        <button
                            @click="goToInvoice"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium"
                        >
                            <Icon name="mdi:file-document-outline" size="18" />
                            Xem hóa đơn
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-16 text-gray-500">Không tìm thấy đơn hàng nào</div>
        </div>
        <ConfirmModal
            v-model:show="showModal"
            title="Xác nhận tạo hợp đồng"
            message="Bạn có chắc chắn muốn <b>tạo</b> hợp đồng mới này không?"
            confirmText="Xác nhận"
            cancelText="Hủy"
            @confirm="handleConfirm"
        />
        <StatusModal
            :visible="visible"
            :loading="loadingContract"
            :error="errorContract"
            @update:visible="(val: boolean) => (visible = val)"
            @update:loading="(val: boolean) => (loadingContract = val)"
            @update:error="(val: string | null) => (errorContract = val)"
            @close="goToListContractDetail"
        />
    </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/utils/format";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import StatusModal from "~/components/shared/StatusModal.vue";
import { useBilling, type BillItemPayload, type CreateBillPayload } from "~/composables/useBilling";

definePageMeta({
    layout: false,
});

const { applyLayout } = useRoleBasedLayout();
applyLayout();

const route = useRoute();
const router = useRouter();
const orderId = route.params.id as string;
const userRole = useCookie<string>("role");
// Trạng thái
const { attachInvoice, fetchOne, order, update } = useOrders();
const { loading: loadingContract, error: errorContract, create } = useContract();

const { createBill, getBill, ensureInstallmentSchedule } = useBilling();
const pending = ref(true);
watch(
    () => order.value,
    () => {
        console.log("order", order.value);
    }
);

const remainingAmount = computed(() => {
    const o = order.value as any;
    if (!o) return 0;
    if (o.payment_method !== "installment") return 0;

    const total = o.payment_amount ?? o.total_amount ?? 0;
    const down = o.down_payment ?? 0;

    return Math.max(total - down, 0);
});

const monthlyInstallment = computed(() => {
    const o = order.value as any;
    if (!o) return 0;
    if (o.payment_method !== "installment") return 0;

    const term = o.term ?? 0;
    if (!term || term <= 0) return 0;

    return Math.ceil(remainingAmount.value / term);
});

// const goToInvoice = () => {
//   const invoiceId =
//     (order.value as any)?.invoice_id || (order.value as any)?.invoiceId;

//   if (!invoiceId) {
//     alert("Đơn hàng này chưa có hóa đơn");
//     return;
//   }

//   router.push(`/user/invoices/${invoiceId}`);
// };

// Lấy dữ liệu từ API
onMounted(async () => {
    try {
        await fetchOne(orderId);
    } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
        pending.value = false;
    }
});
function addMonthsVNISO(months: number) {
    const now = new Date();
    const nowVN = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

    nowVN.setMonth(nowVN.getMonth() + months);

    // Gửi ISO cho @IsDateString() – chuẩn nhất
    return nowVN.toISOString(); // "2025-11-24T09:30:00.000Z"
}

const createOrder = async () => {
    const dealerId = localStorage.getItem("dealer_id");

    if (!order.value) {
        throw new Error("Không có dữ liệu đơn hàng");
    }
    if (!dealerId) {
        throw new Error("Không tìm thấy dealer_id trong localStorage");
    }

    const body: any = {
        orderId: order.value.id,
        dealerId: dealerId,
        startDate: addMonthsVNISO(0),
        endDate: addMonthsVNISO(order.value.term ? order.value.term : 0),
    };

    console.log("body create contract", body);
    const res = await create(body);
    return res;
};

const HARD_DEALER_ID = "00000000-0000-0000-0000-000000000001";
const HARD_DEALER_NAME = "EV Dealer";
const HARD_DEALER_ADDRESS = "Tô Ký, Quận 12, TP.HCM";

const mapOrderToBillPayload = (orderData: any): CreateBillPayload => {
    // Lấy dealer_id
    const dealer_id: string = orderData.dealerId || orderData.dealer_id || localStorage.getItem("dealer_id") || HARD_DEALER_ID;

    // Lấy customer_id
    const customer_id: number = orderData.customerId ?? orderData.customer_id ?? orderData.customer?.id;

    if (!dealer_id) {
        throw new Error("dealer_id không hợp lệ hoặc không tồn tại");
    }

    if (!customer_id) {
        throw new Error("customer_id không hợp lệ hoặc không tồn tại");
    }

    const dealerName = (orderData.dealer && orderData.dealer.name) || localStorage.getItem("dealer_name") || HARD_DEALER_NAME;

    const dealerAddress =
        (orderData.dealer && orderData.dealer.address) || localStorage.getItem("dealer_address") || HARD_DEALER_ADDRESS;

    //  Map items: order.items + order.vehicles
    const items: BillItemPayload[] = (orderData.items || []).map((item: any) => {
        const vehicle = (orderData.vehicles || []).find((v: any) => v.id === item.product_id);

        const qty = item.quantity ?? item.qty ?? 1;
        const priceVnd = item.unit_price_vnd ?? item.price_vnd ?? vehicle?.price ?? 0;

        return {
            product_code: vehicle?.code ?? vehicle?.modelCode ?? String(item.product_id),
            description: vehicle?.name ?? item.product_name ?? "Sản phẩm",
            qty,
            unit_price_cents: priceVnd * 100, // VND -> cents
            tax_rate_code: item.tax_rate_code ?? "VAT10",
        };
    });

    return {
        customer_id,
        dealer_id,
        currency: "VND",
        issue_now: true,
        meta: {
            order_id: orderData.id,
            payment_method: orderData.paymentMethod ?? orderData.payment_method,
            total_amount: orderData.totalAmount ?? orderData.total_amount,
            customer: {
                name: orderData.customer?.name,
                phone: orderData.customer?.phone,
                email: orderData.customer?.email,
                address: orderData.customer?.adress,
            },
            term: orderData.term || 0,
            downPayment: orderData.down_payment || orderData.downPayment || 0,
            is_installment: (orderData.paymentMethod ?? orderData.payment_method) === "installment",
            dealer: {
                id: dealer_id,
                name: dealerName,
                address: dealerAddress,
            },
        },
        items,
    };
};

function goBack() {
    router.back();
}
function goToListContractDetail() {
    router.push("/user/orders");
}
const showModal = ref(false);

const handleSubmit = () => {
    showModal.value = true;
};

const handleConfirm = async () => {
    showModal.value = false;

    if (!order.value) {
        alert("Không có dữ liệu đơn hàng");
        return;
    }

    try {
        loadingContract.value = true;
        errorContract.value = null;

        console.log("Bắt đầu flow xác nhận đơn hàng (tạo hợp đồng + hóa đơn)");
        await createOrder();
        const billPayload = mapOrderToBillPayload(order.value);
        console.log("billPayload gửi lên /billing/bills:", billPayload);

        const idempotencyKey = `order-${order.value.id}`;
        const billRes: any = await createBill(billPayload, idempotencyKey);
        console.log("Tạo hóa đơn thành công:", billRes);

        const invoiceId = billRes?.id;
        if (!invoiceId) {
            throw new Error("Không nhận được invoiceId từ Billing Service");
        }
        await attachInvoice(String(order.value.id), billRes.id);
        console.log("Gắn invoice vào order thành công");

        if (order.value.payment_method === "installment") {
            await ensureInstallmentSchedule(invoiceId);
        }

        // Cập nhật State local để UI đổi màu Badge ngay lập tức mà không cần reload
        if (order.value) {
            order.value = {
                ...order.value,
                payment_status: "paid",
                invoice_id: billRes.id,
            };
        }

        console.log("Cập nhật trạng thái và gắn invoice thành công");

        visible.value = true;
    } catch (err: any) {
        console.error("Lỗi khi tạo hợp đồng / hóa đơn:", err);
        errorContract.value = err?.data?.message || err?.message || "Có lỗi xảy ra trong quá trình tạo hợp đồng / hóa đơn";
    } finally {
        loadingContract.value = false;
    }
};
const hasInvoice = computed(() => {
    const o = order.value as any;
    return !!(o?.invoice_id || o?.invoiceId);
});

const getInvoiceId = () => {
    const o = order.value as any;
    return o?.invoice_id || o?.invoiceId || null;
};
const goToInvoice = () => {
    const invoiceId = getInvoiceId();

    if (!invoiceId) {
        alert("Đơn hàng này chưa có hóa đơn");
        return;
    }

    router.push(`/user/invoices/${invoiceId}`);
};

const visible = ref(false);

watch(
    () => loadingContract.value,
    () => {
        if (loadingContract.value) visible.value = true;
    }
);
</script>
