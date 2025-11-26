import { z } from 'zod';

// ===== INTERFACES =====

export interface FeedbackSummary {
  id: number;
  title: string;
  created_at: string;
  status: 'pending' | 'resolved' | 'Hidden';
}

export interface Feedback {
  id: number;
  title: string;
  content: string;
  status: 'pending' | 'resolved' | 'Hidden';
  customer_uid?: string | null;
  admin_uid?: string | null;
  reply?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FeedbackListResponse {
  data: FeedbackSummary[];
  nextCursor: number | null;
}

// ===== ZOD SCHEMAS =====

// Schema cho Create Feedback (khớp với CreateFeedbackDto)
export const CreateFeedbackSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề không được để trống")
    .max(200, "Tiêu đề không được quá 200 ký tự")
    .trim(),
  
  content: z.string()
    .min(1, "Nội dung không được để trống")
    .max(2000, "Nội dung không được quá 2000 ký tự")
    .trim(),
  
  status: z.enum(['pending', 'resolved'], {
    message: "Trạng thái phải là pending hoặc resolved"
  }).default('pending'),
});

// Schema cho Update Feedback (khớp với UpdateFeedbackDto)
export const UpdateFeedbackSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề không được để trống")
    .max(200, "Tiêu đề không được quá 200 ký tự")
    .trim()
    .optional(),
  
  content: z.string()
    .min(1, "Nội dung không được để trống")
    .max(2000, "Nội dung không được quá 2000 ký tự")
    .trim()
    .optional(),
  
  reply: z.string()
    .max(2000, "Phản hồi không được quá 2000 ký tự")
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['pending', 'resolved', 'Hidden'], {
    message: "Trạng thái phải là pending, resolved hoặc Hidden"
  }).optional(),
});

// Schema cho Reply Feedback
export const ReplyFeedbackSchema = z.object({
  reply: z.string()
    .min(1, "Nội dung phản hồi không được để trống")
    .max(2000, "Nội dung phản hồi không được quá 2000 ký tự")
    .trim(),
  
  status: z.enum(['pending', 'resolved'], {
    message: "Trạng thái phải là pending hoặc resolved"
  }),
});

// Schema cho toggle status (nếu cần)
export const ToggleStatusSchema = z.object({
  status: z.enum(['pending', 'resolved', 'Hidden'], {
    message: "Trạng thái phải là pending, resolved hoặc Hidden"
  }),
});

// ===== EXPORTED TYPES =====

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
export type UpdateFeedbackInput = z.infer<typeof UpdateFeedbackSchema>;
export type ReplyFeedbackInput = z.infer<typeof ReplyFeedbackSchema>;
export type ToggleStatusInput = z.infer<typeof ToggleStatusSchema>;