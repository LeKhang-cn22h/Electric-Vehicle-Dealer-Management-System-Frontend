export interface TestDriveSlot {
  id: number;
  vehicle_id: number;
  slot_start: string; // ISO date string
  slot_end: string; // ISO date string
  max_customers: number;
  booked_customers: number;
  status: 'available' | 'full' | 'cancelled' | 'completed' |'open' | 'hidden';
  created_at?: string;
  updated_at?: string;
  
  // Relations (optional)
  vehicle?: any; // hoặc import Vehicle type
  appointments?: Appointment[];
}

export interface Appointment {
  id: number;
  customer_uid: string;
  test_drive_slot_id: number;
  status: 'confirm' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  
  // Relations (optional)
  customer?: any; // hoặc import User type
  test_drive_slot?: TestDriveSlot;
}

// DTO Interfaces for API calls
export interface CreateAppointmentDto {
  test_drive_slot_id: number;
  status?: string;
}

export interface UpdateAppointmentDto {
  customer_uid?: string;
  test_drive_slot_id?: number;
  status?: string;
}

export interface CreateTestDriveSlotDto {
  vehicle_id: number;
  slot_start: string;
  slot_end: string;
  max_customers?: number;
  status?: string;
}

export interface UpdateTestDriveSlotDto {
  vehicle_id?: number;
  slot_start?: string;
  slot_end?: string;
  max_customers?: number;
  booked_customers?: number;
  status?: string;
}

// Filter/Query interfaces
export interface AppointmentFilters {
  status?: string;
  customer_uid?: string;
  date?: string;
}

export interface SlotFilters {
  vehicle_id?: number;
  date?: string;
  status?: string;
}