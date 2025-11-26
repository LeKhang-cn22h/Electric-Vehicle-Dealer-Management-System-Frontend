import { ref } from "vue";
import { FeedbackService } from "~/services/customer/feedback.service";
import { 
  CreateFeedbackSchema, 
  UpdateFeedbackSchema,
  ReplyFeedbackSchema,
  ToggleStatusSchema 
} from "~/types/feedback";
import type {
  Feedback,
  FeedbackSummary,
  CreateFeedbackInput,
  UpdateFeedbackInput,
  ReplyFeedbackInput,
} from "~/types/feedback";
import { ZodError } from "zod";

export function useFeedback() {
  // ===== STATE =====
  const feedbacks = ref<FeedbackSummary[]>([]);
  
  const feedback = ref<Feedback>({
    id: 0,
    title: '',
    content: '',
    status: 'pending',
    customer_uid: null,
    admin_uid: null,
    reply: null,
    created_at: '',
    updated_at: ''
  });
  
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Validation errors state
  const validationErrors = ref<Record<string, string>>({});

  // ===== HELPER FUNCTIONS =====
  
  // Helper function để xử lý Zod errors
  const handleZodError = (zodError: ZodError) => {
    validationErrors.value = {};
    zodError.issues.forEach((issue) => {
      const field = issue.path.join('.');
      validationErrors.value[field] = issue.message;
    });
  };

  // Helper function để clear validation errors
  const clearValidationErrors = () => {
    validationErrors.value = {};
  };

  // ===== FETCH LIST =====
  
  // Lấy tất cả feedbacks (cho Admin)
  const fetchAll = async (params?: { status?: string; customer_uid?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await FeedbackService.findAll(params);
      feedbacks.value = res.data;
      return res.data;
    } catch (e: any) {
      error.value = e.message || "Error fetching feedbacks";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Lấy feedbacks của user hiện tại
  const fetchAllUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await FeedbackService.findAllUser();
      feedbacks.value = res.data;
      return res.data;
    } catch (e: any) {
      error.value = e.message || "Error fetching user feedbacks";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== FETCH DETAIL =====
  const fetchOne = async (id: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const res = await FeedbackService.findOne(numId);
      feedback.value = res.data;
      return feedback.value;
    } catch (e: any) {
      error.value = e.message || "Error fetching feedback";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Lấy feedbacks theo customer UID
  const fetchByCustomer = async (uid: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await FeedbackService.getFeedbacksByCustomer(uid);
      feedbacks.value = res.data;
      return res.data;
    } catch (e: any) {
      error.value = e.message || "Error fetching customer feedbacks";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== CREATE =====
  const create = async (data: Partial<CreateFeedbackInput>) => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      // Validate trước khi gửi
      const validatedData = CreateFeedbackSchema.parse(data);
      
      console.log(" Validated data (create):", validatedData);
      
      const res = await FeedbackService.createFeedback(validatedData);
      return res.data;
    } catch (e: any) {
      // Xử lý validation errors
      if (e.name === 'ZodError') {
        handleZodError(e as ZodError);
        error.value = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        console.error(" Validation errors (create):", validationErrors.value);
      } else {
        error.value = e.message || "Error creating feedback";
        console.error(" Create error:", e);
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== UPDATE =====
  const update = async (id: number, data: Partial<UpdateFeedbackInput>) => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      // Validate trước khi gửi
      const validatedData = UpdateFeedbackSchema.parse(data);
      
      console.log(" Validated data (update):", validatedData);
      
      const res = await FeedbackService.updateFeedback(id, validatedData);
      
      // Cập nhật feedback.value sau khi update thành công
      if (feedback.value.id === id) {
        feedback.value = { ...feedback.value, ...res.data };
      }
      return res.data;
    } catch (e: any) {
      // Xử lý validation errors
      if (e.name === 'ZodError') {
        handleZodError(e as ZodError);
        error.value = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        console.error(" Validation errors (update):", validationErrors.value);
      } else {
        error.value = e.message || "Error updating feedback";
        console.error(" Update error:", e);
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== REPLY =====
  const reply = async (id: number, data: ReplyFeedbackInput) => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      // Validate trước khi gửi
      const validatedData = ReplyFeedbackSchema.parse(data);
      
      console.log(" Validated data (reply):", validatedData);
      
      const res = await FeedbackService.replyFeedback(id, validatedData);
      
      // Cập nhật feedback.value sau khi reply thành công
      if (feedback.value.id === id) {
        feedback.value = { ...feedback.value, ...res.data };
      }
      return res.data;
    } catch (e: any) {
      // Xử lý validation errors
      if (e.name === 'ZodError') {
        handleZodError(e as ZodError);
        error.value = "Dữ liệu phản hồi không hợp lệ. Vui lòng kiểm tra lại.";
        console.error(" Validation errors (reply):", validationErrors.value);
      } else {
        error.value = e.message || "Error replying to feedback";
        console.error(" Reply error:", e);
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // ===== UPDATE STATUS =====
  const updateStatus = async (id: number, status: 'pending' | 'resolved' | 'Hidden') => {
    loading.value = true;
    error.value = null;
    clearValidationErrors();
    
    try {
      // Validate status
      const validatedData = ToggleStatusSchema.parse({ status });
      
      console.log(" Validated status:", validatedData);
      
      const res = await FeedbackService.updateFeedback(id, validatedData);
      
      if (feedback.value.id === id) {
        feedback.value = { ...feedback.value, ...res.data };
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

  // ===== DELETE =====
  const remove = async (id: number) => {
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

  // ===== RESET STATE =====
  const reset = () => {
    feedbacks.value = [];
    feedback.value = {
      id: 0,
      title: '',
      content: '',
      status: 'pending',
      customer_uid: null,
      admin_uid: null,
      reply: null,
      created_at: '',
      updated_at: ''
    };
    error.value = null;
    clearValidationErrors(); 
  };

  return {
    // state
    feedbacks,
    feedback,
    loading,
    error,
    validationErrors, 

    // methods
    fetchAll,
    fetchAllUser,
    fetchOne,
    fetchByCustomer,
    create,
    update,
    reply,
    updateStatus, 
    remove,
    reset,
    clearValidationErrors, 
  };
}