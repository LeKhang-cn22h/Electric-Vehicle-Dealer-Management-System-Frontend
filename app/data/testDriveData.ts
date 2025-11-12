export interface Vehicle {
  id: string
  name: string
  model: string
  image: string
  price: string // optional, có thể chưa có giá
}

export const vehicles: Vehicle[] = [
  { id: '1', name: 'VinFast VF e34', model: 'SUV Điện', image: '/images/xeototrang.jpg', price: '' },
  { id: '2', name: 'VinFast VF 8', model: 'SUV Điện', image: '/images/xeototim.jpg', price: '' },
  { id: '3', name: 'VinFast VF 9', model: 'SUV Điện', image: '/images/xeotoxanh.jpg', price: '' }
]


export interface TimeSlot {
  time: string
  available: boolean
}

export const defaultTimeSlots: TimeSlot[] = [
  { time: '08:00', available: true }, { time: '09:00', available: true },
  { time: '10:00', available: false }, { time: '11:00', available: true },
  { time: '13:00', available: true }, { time: '14:00', available: true },
  { time: '15:00', available: false }, { time: '16:00', available: true }
]
