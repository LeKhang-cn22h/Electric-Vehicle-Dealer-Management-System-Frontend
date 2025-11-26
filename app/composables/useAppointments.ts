import { ref } from "vue";
import { appointmentsService } from "~/services/vehicles/appointment.service";
import type { 
  Appointment, 
  TestDriveSlot,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  CreateTestDriveSlotDto,
  UpdateTestDriveSlotDto
} from "~/types/appointment";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
  createTestDriveSlotSchema,
  updateTestDriveSlotSchema
} from "~/schemas/appointment.schema";

export function useAppointment() {
  // ======= STATE =======
  const loading = ref(false);
  const error = ref<string | null>(null);

  const appointments = ref<Appointment[]>([]);
  const appointment = ref<Appointment | null>(null);

  const slots = ref<TestDriveSlot[]>([]);
  const slot = ref<TestDriveSlot | null>(null);

  // HELPER: Validate với Zod
  function validateData<T>(schema: any, data: any): T {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const errors = result.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${errors}`);
    }
    
    return result.data;
  }

  // ===============================
  // CUSTOMER — HISTORY
  // ===============================
  async function fetchHistoryCustomer(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await appointmentsService.findHistoryCustomer();
      appointments.value = data;
    } catch (err: any) {
      error.value = err.message || "Lỗi tải lịch sử";
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // CUSTOMER — CREATE APPOINTMENT
  // ===============================
  async function createAppointment(payload: CreateAppointmentDto): Promise<Appointment> {
    loading.value = true;
    error.value = null;

    try {
      // ✅ VALIDATE PAYLOAD
      const validatedPayload = validateData<CreateAppointmentDto>(
        createAppointmentSchema, 
        payload
      );
      
      const data = await appointmentsService.createAC(validatedPayload);
      return data;
    } catch (err: any) {
      error.value = err.message || "Không thể tạo lịch hẹn";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // GET ONE APPOINTMENT
  // ===============================
  async function fetchAppointment(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await appointmentsService.findOneAC(id);
      appointment.value = data;
    } catch (err: any) {
      error.value = err.message || "Không thể tải lịch hẹn";
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // ADMIN — GET ALL APPOINTMENTS
  // ===============================
  async function fetchAllAppointments(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await appointmentsService.findAllAC();
      appointments.value = data;
    } catch (err: any) {
      error.value = err.message || "Không thể tải danh sách lịch hẹn";
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // UPDATE APPOINTMENT
  // ===============================
  async function updateAppointment(id: number, payload: UpdateAppointmentDto): Promise<Appointment> {
    loading.value = true;
    error.value = null;

    try {
      // ✅ VALIDATE PAYLOAD
      const validatedPayload = validateData<UpdateAppointmentDto>(
        updateAppointmentSchema, 
        payload
      );
      
      return await appointmentsService.update(id, validatedPayload);
    } catch (err: any) {
      error.value = err.message || "Không thể cập nhật lịch hẹn";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // DELETE APPOINTMENT
  // ===============================
  async function deleteAppointment(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      return await appointmentsService.remove(id);
    } catch (err: any) {
      error.value = err.message || "Không thể xóa lịch hẹn";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // TEST DRIVE SLOTS (CUSTOMER)
  // ===============================
  async function fetchSlotsCustomer(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await appointmentsService.getSlotsCustomer();
      slots.value = data;
    } catch (err: any) {
      error.value = err.message || "Không thể tải slot";
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // TEST DRIVE SLOTS (ADMIN)
  // ===============================
  async function fetchSlotsAdmin(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await appointmentsService.getSlotsAdmin();
      slots.value = data;
    } catch (err: any) {
      error.value = err.message || "Không thể tải slot admin";
    } finally {
      loading.value = false;
    }
  }

  // Get one slot
  async function fetchSlot(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await appointmentsService.getSlot(id);
      slot.value = data;
    } catch (err: any) {
      error.value = err.message || "Không thể tải slot";
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // CREATE SLOT
  // ===============================
  async function createSlot(payload: CreateTestDriveSlotDto): Promise<TestDriveSlot> {
    loading.value = true;
    error.value = null;

    try {
      // ✅ VALIDATE PAYLOAD
      const validatedPayload = validateData<CreateTestDriveSlotDto>(
        createTestDriveSlotSchema, 
        payload
      );
      
      return await appointmentsService.createSlot(validatedPayload);
    } catch (err: any) {
      error.value = err.message || "Không thể tạo slot";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===============================
  // UPDATE SLOT
  // ===============================
  async function updateSlot(id: number, payload: UpdateTestDriveSlotDto): Promise<TestDriveSlot> {
    loading.value = true;
    error.value = null;

    try {
      // ✅ VALIDATE PAYLOAD
      const validatedPayload = validateData<UpdateTestDriveSlotDto>(
        updateTestDriveSlotSchema, 
        payload
      );
      
      return await appointmentsService.updateSlot(id, validatedPayload);
    } catch (err: any) {
      error.value = err.message || "Không thể cập nhật slot";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  //mở lai slot
  async function reopenSlot(id: number): Promise<TestDriveSlot> {
    loading.value = true;
    error.value = null;
    try {
      return await appointmentsService.reopenSlot(id);
    }
    catch (err: any) {
      error.value = err.message || "Không thể mở lại slot";
      throw err;
    }
    finally {
      loading.value = false;
    }
  }
  // Remove slot
  async function removeSlot(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      return await appointmentsService.removeSlot(id);
    } catch (err: any) {
      error.value = err.message || "Không thể xóa slot";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,

    appointments,
    appointment,

    slots,
    slot,

    fetchHistoryCustomer,
    createAppointment,
    fetchAppointment,
    fetchAllAppointments,
    updateAppointment,
    deleteAppointment,

    fetchSlotsCustomer,
    fetchSlotsAdmin,
    fetchSlot,
    createSlot,
    updateSlot,
    reopenSlot,
    removeSlot,
  };
}