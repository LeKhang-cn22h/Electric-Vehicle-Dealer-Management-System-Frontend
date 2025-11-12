export interface Booking {
  bookingCode: string
  customerName: string
  vehicleName: string
  color: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  phone?: string
  email?: string
  location?: string
}

export const bookings: Booking[] = [
  {
    bookingCode: 'TD100001',
    customerName: 'Nguyễn Văn A',
    vehicleName: 'VinFast VF e34',
    color: '#FFFFFF',
    date: '2025-11-15',
    time: '09:00',
    status: 'pending',
    notes: 'Không hút thuốc',
    phone: '0909123456',
    email: 'a.nguyen@example.com',
    location: 'Showroom VinFast - Quận 7'
  },
  {
    bookingCode: 'TD100002',
    customerName: 'Trần Thị B',
    vehicleName: 'VinFast VF 8',
    color: '#0000FF',
    date: '2025-11-16',
    time: '14:00',
    status: 'confirmed',
    phone: '0912345678',
    email: 'b.tran@example.com',
    location: 'Showroom VinFast - Quận 7'
  },
  {
    bookingCode: 'TD100003',
    customerName: 'Lê Văn C',
    vehicleName: 'VinFast VF 9',
    color: '#FF0000',
    date: '2025-11-17',
    time: '11:00',
    status: 'completed',
    phone: '0987654321',
    email: 'c.le@example.com',
    location: 'Showroom VinFast - Quận 7'
  }
]
