// ✅ FILE: schemas/appointment.schema.ts

import { z } from 'zod';

// ============================================
// TEST DRIVE SLOT SCHEMAS
// ============================================

export const createTestDriveSlotSchema = z.object({
  vehicle_id: z.number().int().positive('Vehicle ID phải là số dương'),
  slot_start: z.string().datetime('Slot start phải là ISO date string'),
  slot_end: z.string().datetime('Slot end phải là ISO date string'),
  max_customers: z.number().int().positive().optional().default(5),
  status: z.enum(['open', 'hidden', 'cancelled']).optional().default('open'),
}).refine(
  (data) => new Date(data.slot_end) > new Date(data.slot_start),
  {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['slot_end'],
  }
);

export const updateTestDriveSlotSchema = z.object({
  vehicle_id: z.number().int().positive().optional(),
  slot_start: z.string().datetime().optional(),
  slot_end: z.string().datetime().optional(),
  max_customers: z.number().int().positive().optional(),
  booked_customers: z.number().int().min(0).optional(),
  status: z.enum(['open', 'hidden', 'cancelled']).optional(),
}).partial() 
.refine(
  (data) => {
    if (data.slot_start && data.slot_end) {
      return new Date(data.slot_end) > new Date(data.slot_start);
    }
    return true;
  },
  {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['slot_end'],
  }
);

// ============================================
// APPOINTMENT SCHEMAS
// ============================================

export const createAppointmentSchema = z.object({
  test_drive_slot_id: z.number().int().positive('Slot ID phải là số dương'),
  status: z.enum(['confirm', 'completed', 'cancelled']).optional().default('confirm'),
});

export const updateAppointmentSchema = z.object({
  customer_uid: z.string().optional(),
  test_drive_slot_id: z.number().int().positive().optional(),
  status: z.enum(['confirm', 'completed', 'cancelled']).optional(),
}).partial(); 
// ============================================
// FILTER SCHEMAS
// ============================================

export const appointmentFiltersSchema = z.object({
  status: z.enum(['confirm', 'completed', 'cancelled']).optional(),
  customer_uid: z.string().optional(),
  date: z.string().datetime().optional(),
});

export const slotFiltersSchema = z.object({
  vehicle_id: z.number().int().positive().optional(),
  date: z.string().datetime().optional(),
  status: z.enum(['open', 'hidden', 'cancelled']).optional(),
});

// ============================================
// TYPE EXPORTS (inferred from schemas)
// ============================================

export type CreateTestDriveSlotInput = z.infer<typeof createTestDriveSlotSchema>;
export type UpdateTestDriveSlotInput = z.infer<typeof updateTestDriveSlotSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type AppointmentFiltersInput = z.infer<typeof appointmentFiltersSchema>;
export type SlotFiltersInput = z.infer<typeof slotFiltersSchema>;