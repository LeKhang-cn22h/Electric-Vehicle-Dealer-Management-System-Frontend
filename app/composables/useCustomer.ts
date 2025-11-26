import { ref } from "vue";
import { CustomerService } from "~/services/customer/profile-customer.service";
import { FeedbackService } from "~/services/customer/feedback.service";
import { 
  CreateCustomerSchema, 
  UpdateCustomerSchema,
  ToggleStatusSchema 
} from "~/types/profile";
import type {
  Customer,
  CustomerSummary,
  AutoLinkPayload,
  Feedback,
  
} from "~/types/profile";
import { ZodError } from "zod";
import type { FeedbackSummary } from "~/types/feedback";
export function useCustomer() {
  // ===== STATE =====
  const customers = ref<CustomerSummary[]>([]);
  
  const customer = ref<Customer>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    birth_day: '',
    gender: '',
    adress: '',
    status: true,
    created_at: '',
    updated_at: ''
  });
  
const feedbacks = ref<Feedback[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  //Validation errors state
  const validationErrors = ref<Record<string, string>>({});

  // Helper function để xử lý Zod errors
   const handleZodError = (zodError: ZodError) => {
    validationErrors.value = {};
    zodError.issues.forEach((issue) => {
      const field = issue.path.join('.');
      validationErrors.value[field] = issue.message;
    });
  };

  //THÊM: Helper function để clear validation errors
  const clearValidationErrors = () => {
    validationErrors.value = {};
  };

  // ===== FETCH LIST =====
  const fetchAll = async () => {
  // ===== FETCH LIST =====
  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await CustomerService.findAll();
      customers.value = res.data;
      return res.data;
    } catch (e: any) {
      error.value = e.message || "Error fetching customers";
      throw e;
      error.value = e.message || "Error fetching customers";
      throw e;
    } finally {
      loading.value = false;
      loading.value = false;
    }
  };

  // ===== FETCH DETAIL =====
  const fetchOne = async (id: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const res = await CustomerService.findOne(numId);
      customer.value = res.data;
      return customer.value;
    } catch (e: any) {
      error.value = e.message || "Error fetching customer";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== CREATE =====
  const create = async (data: Partial<Customer>) => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      //Validate trước khi gửi
      const validatedData = CreateCustomerSchema.parse(data);
      
      console.log("✅ Validated data (create):", validatedData);
      
      const res = await CustomerService.createProfile(validatedData);
      return res.data;
    } catch (e: any) {
      //Xử lý validation errors
      if (e.name === 'ZodError') {
        handleZodError(e as ZodError);
        error.value = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        console.error(" Validation errors (create):", validationErrors.value);
      } else {
        error.value = e.message || "Error creating customer";
        console.error(" Create error:", e);
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== UPDATE =====
  const update = async (id: number, data: Partial<Customer>) => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      //Validate trước khi gửi
      const validatedData = UpdateCustomerSchema.parse(data);
      
      console.log("✅ Validated data (update):", validatedData);
      
      const res = await CustomerService.updateProfile(id, validatedData);
      
      // Cập nhật customer.value sau khi update thành công
      if (customer.value.id === id) {
        customer.value = { ...customer.value, ...res.data };
      }
      return res.data;
    } catch (e: any) {
      //Xử lý validation errors
      if (e.name === 'ZodError') {
        handleZodError(e as ZodError);
        error.value = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        console.error(" Validation errors (update):", validationErrors.value);
      } else {
        error.value = e.message || "Error updating customer";
        console.error(" Update error:", e);
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  //THÊM: Method riêng cho toggle status
  const updateStatus = async (id: number, status: boolean) => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      //Validate status
      const validatedData = ToggleStatusSchema.parse({ status });
      
      console.log("✅ Validated status:", validatedData);
      
      const res = await CustomerService.updateProfile(id, validatedData);
      
      if (customer.value.id === id) {
        customer.value = { ...customer.value, ...res.data };
      }
      return res.data;
    } catch (e: any) {
      if (e.name === 'ZodError') {
        handleZodError(e as ZodError);
        error.value = "Trạng thái không hợp lệ";
        console.error(" Validation errors (status):", validationErrors.value);
      } else {
        error.value = e.message || "Error updating status";
        console.error(" Status update error:", e);
      }
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
const fetchAllFeedbacks = async (params?: { status?: string; customer_uid?: string }) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await FeedbackService.findAll(params);
const feedbacks = ref<(Feedback | FeedbackSummary)[]>([]);
    return res.data;
  } catch (e: any) {
    error.value = e.message || "Error fetching feedbacks";
    throw e;
  } finally {
    loading.value = false;
  }
};

const fetchAllUserFeedbacks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await FeedbackService.findAllUser();
const feedbacks = ref<(Feedback | FeedbackSummary)[]>([]);
    return res.data;
  } catch (e: any) {
    error.value = e.message || "Error fetching user feedbacks";
    throw e;
  } finally {
    loading.value = false;
  }
};

const fetchFeedbacksByCustomer = async (uid: string) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await FeedbackService.getFeedbacksByCustomer(uid);
const feedbacks = ref<(Feedback | FeedbackSummary)[]>([]);
    return res.data;
  } catch (e: any) {
    error.value = e.message || "Error fetching customer feedbacks";
    throw e;
  } finally {
    loading.value = false;
  }
};

const createFeedback = async (data: Partial<Feedback>) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await FeedbackService.createFeedback(data);
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
    const res = await FeedbackService.replyFeedback(id, { reply });
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
    const res = await FeedbackService.deleteFeedback(id);
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
    customer.value = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      birth_day: '',
      gender: '',
      adress: '',
      status: true,
      created_at: '',
      updated_at: ''
    };
    feedbacks.value = [];
    error.value = null;
    clearValidationErrors(); 
  };

  return {
  // state
  customers,
  customer,
  feedbacks,
  loading,
  error,
  validationErrors, 

  // methods
  fetchAll,
  fetchOne,
  create,
  update,
  updateStatus, 
  remove,
  
  // Feedback methods
  fetchAllFeedbacks,
  fetchAllUserFeedbacks,        
  fetchFeedbacksByCustomer,     
  createFeedback,
  replyFeedback,
  deleteFeedback,
  
  autoLinkProfile,
  reset,
  clearValidationErrors, 
};
}
}