import { ref } from "vue";
import { CustomerService } from "~/services/customer/profile-customer.service";
import type {
Customer,
CustomerSummary,
CustomerListResponse,
AutoLinkPayload,
AutoLinkResponse,
Feedback,
FeedbackListResponse,
} from "~/types/profile";

export function useCustomer() {
// ===== STATE =====
const customers = ref<CustomerSummary[]>([]);
const customer = ref<Customer | null>(null);
const feedbacks = ref<Feedback[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// ===== FETCH LIST =====
const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await CustomerService.findAll();
        customers.value = res.data;  // OK, kiểu đúng
        return res.data;
    } catch (e: any) {
        error.value = e.message || "Error fetching customers";
        throw e;
    } finally {
        loading.value = false;
    }
};




// ===== FETCH DETAIL =====
const fetchOne = async (id: number) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.findOne(id);
customer.value = res.data;
return customer.value;
} catch (e: any) {
error.value = e.message || "Error fetching customer";
throw e;
} finally {
loading.value = false;
}
};

// ===== CRUD =====
const create = async (data: Partial<Customer>) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.createProfile(data);
return res.data;
} catch (e: any) {
error.value = e.message || "Error creating customer";
throw e;
} finally {
loading.value = false;
}
};

const update = async (id: number, data: Partial<Customer>) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.updateProfile(id, data);
return res.data;
} catch (e: any) {
error.value = e.message || "Error updating customer";
throw e;
} finally {
loading.value = false;
}
};

const remove = async (id: number) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.deleteProfile(id);
return res.data;
} catch (e: any) {
error.value = e.message || "Error deleting customer";
throw e;
} finally {
loading.value = false;
}
};

// ===== FEEDBACK =====
const fetchAllFeedbacks = async () => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.getAllFeedbacks();
feedbacks.value = res.data.data || [];
return res.data;
} catch (e: any) {
error.value = e.message || "Error fetching feedbacks";
throw e;
} finally {
loading.value = false;
}
};

const createFeedback = async (data: Partial<Feedback>) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.createFeedback(data);
return res.data;
} catch (e: any) {
error.value = e.message || "Error creating feedback";
throw e;
} finally {
loading.value = false;
}
};

const replyFeedback = async (id: number, reply: string) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.replyFeedback(id, { reply });
return res.data;
} catch (e: any) {
error.value = e.message || "Error replying feedback";
throw e;
} finally {
loading.value = false;
}
};

const deleteFeedback = async (id: number) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.deleteFeedback(id);
return res.data;
} catch (e: any) {
error.value = e.message || "Error deleting feedback";
throw e;
} finally {
loading.value = false;
}
};

// ===== AUTO LINK =====
const autoLinkProfile = async (payload: AutoLinkPayload) => {
loading.value = true;
error.value = null;
try {
const res = await CustomerService.autoLinkProfile(payload);
if (res.data.customer) customer.value = res.data.customer as Customer;
return res.data;
} catch (e: any) {
error.value = e.message || "Error auto-linking profile";
throw e;
} finally {
loading.value = false;
}
};

// ===== RESET STATE =====
const reset = () => {
customers.value = [];
customer.value = null;
feedbacks.value = [];
error.value = null;
};

return {
// state
customers,
customer,
feedbacks,
loading,
error,

// methods
fetchAll,
fetchOne,
create,
update,
remove,
fetchAllFeedbacks,
createFeedback,
replyFeedback,
deleteFeedback,
autoLinkProfile,
reset,
};
}
