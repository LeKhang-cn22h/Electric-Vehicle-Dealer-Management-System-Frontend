// data/mockCars.ts
export type Car = {
  id: number
  name: string
  tagline: string
  price: number | string
  priceNote: string
  status: string
  year: number
  mileage: string
  fuelType: string
  transmission: string
  color: string
  engine: string
  seats: number
  origin: string
  images: string[]
  description: string
  features: { category: string; items: string[] }[]
  benefits: string[]
}

export const mockCars: Car[] = [
  {
    id: 1,
    name: "VinFast VF 8",
    tagline: "SUV điện hạng trung cao cấp",
    price: 1290000000,
    priceNote: "Giá đã bao gồm VAT",
    status: "Còn hàng",
    year: 2024,
    mileage: "0 km",
    fuelType: "Điện",
    transmission: "Tự động",
    color: "Trắng ngọc trai",
    engine: "150 kW (2 động cơ điện)",
    seats: 5,
    origin: "Việt Nam",
    images: [
      "/showcase/xe1.jpg",
      "/showcase/xe2.jpg",
      "/showcase/xe3.jpg",
      "/showcase/xe4.jpg"
    ],
    description:
      "VinFast VF 8 là mẫu SUV điện 5 chỗ được trang bị hệ thống an toàn tiên tiến, phạm vi hoạt động lên đến 471 km và hỗ trợ sạc nhanh chỉ trong 30 phút.",
    features: [
      {
        category: "Ngoại thất",
        items: [
          "Đèn LED toàn phần",
          "Mâm hợp kim 20 inch",
          "Cảm biến gạt mưa tự động",
          "Cửa sổ trời toàn cảnh"
        ]
      },
      {
        category: "Nội thất",
        items: [
          "Màn hình trung tâm 15.6 inch",
          "Ghế da cao cấp",
          "Điều hòa tự động 2 vùng độc lập",
          "Âm thanh 10 loa"
        ]
      }
    ],
    benefits: [
      "Tặng 1 năm sạc miễn phí",
      "Bảo hành 10 năm",
      "Miễn phí bảo dưỡng 3 năm"
    ]
  },
  {
    id: 2,
    name: "BMW 7 Series",
    tagline: "Phong cách doanh nhân",
    price: 4800000000,
    priceNote: "Chưa bao gồm VAT và phí lăn bánh",
    status: "Còn hàng",
    year: 2023,
    mileage: "10 km",
    fuelType: "Xăng",
    transmission: "Tự động 8 cấp",
    color: "Đen ánh kim",
    engine: "3.0L TwinPower Turbo",
    seats: 5,
    origin: "Đức",
    images: [
      "/showcase/xe1.jpg",
      "/showcase/xe2.jpg",
      "/showcase/xe3.jpg"
    ],
    description:
      "BMW 7 Series là mẫu sedan sang trọng bậc nhất, kết hợp giữa sự thoải mái, công nghệ hiện đại và hiệu năng vượt trội.",
    features: [
      {
        category: "Ngoại thất",
        items: ["Đèn Laser BMW", "Cửa hít tự động", "Gương chiếu hậu chống chói"]
      },
      {
        category: "Nội thất",
        items: [
          "Ghế massage",
          "Hệ thống âm thanh Bowers & Wilkins",
          "Cửa sổ trời toàn cảnh"
        ]
      }
    ],
    benefits: ["Bảo hành 5 năm", "Miễn phí bảo dưỡng 2 năm"]
  },
  {
    id: 3,
    name: "Lexus LX 600",
    tagline: "SUV đẳng cấp",
    price: 8500000000,
    priceNote: "Giá tham khảo",
    status: "Còn hàng",
    year: 2024,
    mileage: "0 km",
    fuelType: "Xăng",
    transmission: "Tự động 10 cấp",
    color: "Trắng ngọc trai",
    engine: "3.5L V6 Twin Turbo",
    seats: 7,
    origin: "Nhật Bản",
    images: ["/showcase/xe3.jpg"],
    description:
      "Lexus LX 600 mang đến trải nghiệm sang trọng, mạnh mẽ và tiện nghi hàng đầu trong phân khúc SUV full-size.",
    features: [
      { category: "Ngoại thất", items: ["Đèn LED 3 bóng", "Lưới tản nhiệt lớn"] },
      { category: "Nội thất", items: ["Da semi-aniline", "Ghế massage 4 vùng"] }
    ],
    benefits: ["Bảo hành 5 năm", "Miễn phí thay dầu 2 năm"]
  },
  {
  id: 4,
  name: "Mercedes-Benz EQS",
  tagline: "Sedan điện hạng sang đỉnh cao",
  price: 5600000000,
  priceNote: "Giá đã bao gồm VAT",
  status: "Còn hàng",
  year: 2024,
  mileage: "0 km",
  fuelType: "Điện",
  transmission: "Tự động",
  color: "Bạc ánh kim",
  engine: "385 kW (2 động cơ điện)",
  seats: 5,
  origin: "Đức",
  images: [
    "/showcase/xe1.jpg",
    "/showcase/xe2.jpg",
    "/showcase/xe3.jpg"
  ],
  description:
    "Mercedes-Benz EQS là mẫu sedan điện sang trọng mang đến sự yên tĩnh tuyệt đối, công nghệ tiên tiến và khả năng vận hành mượt mà.",
  features: [
    {
      category: "Ngoại thất",
      items: [
        "Đèn pha Digital Light",
        "Tay nắm cửa thụt thò",
        "Mâm hợp kim 21 inch"
      ]
    },
    {
      category: "Nội thất",
      items: [
        "Màn hình Hyperscreen 56 inch",
        "Ghế massage 6 chế độ",
        "Âm thanh Burmester 3D"
      ]
    }
  ],
  benefits: [
    "Bảo hành 10 năm pin điện",
    "Miễn phí sạc tại nhà 1 năm",
    "Dịch vụ cứu hộ miễn phí"
  ]
},
{
  id: 5,
  name: "Tesla Model Y",
  tagline: "SUV điện phổ thông mạnh mẽ",
  price: 1800000000,
  priceNote: "Giá tham khảo nhập khẩu",
  status: "Còn hàng",
  year: 2024,
  mileage: "0 km",
  fuelType: "Điện",
  transmission: "Tự động 1 cấp",
  color: "Đen bóng",
  engine: "258 kW (Dual Motor AWD)",
  seats: 5,
  origin: "Mỹ",
  images: [
    "/showcase/xe1.jpg",
    "/showcase/xe2.jpg",
    "/showcase/xe3.jpg"
  ],
  description:
    "Tesla Model Y mang lại khả năng tăng tốc vượt trội, không gian rộng rãi và hệ thống tự lái Autopilot tiên tiến.",
  features: [
    {
      category: "Ngoại thất",
      items: ["Cửa sổ trời toàn cảnh", "Đèn LED tự động", "Mâm 20 inch"]
    },
    {
      category: "Nội thất",
      items: ["Màn hình 15 inch cảm ứng", "Ghế sưởi toàn bộ hàng ghế", "Cập nhật OTA"]
    }
  ],
  benefits: ["Bảo hành 8 năm pin", "Miễn phí cập nhật phần mềm trọn đời"]
},
{
  id: 6,
  name: "Toyota Camry Hybrid",
  tagline: "Sedan tiết kiệm và sang trọng",
  price: 1400000000,
  priceNote: "Giá đã bao gồm VAT",
  status: "Còn hàng",
  year: 2023,
  mileage: "50 km",
  fuelType: "Xăng lai điện",
  transmission: "Tự động vô cấp e-CVT",
  color: "Xám bạc",
  engine: "2.5L Hybrid 178 HP",
  seats: 5,
  origin: "Nhật Bản",
  images: ["/showcase/camry_1.jpg", "/showcase/camry_2.jpg"],
  description:
    "Toyota Camry Hybrid là sự kết hợp hoàn hảo giữa hiệu năng, tiết kiệm nhiên liệu và sự thoải mái đặc trưng của dòng Camry.",
  features: [
    {
      category: "Ngoại thất",
      items: ["Đèn pha LED", "Gương gập điện", "Cảm biến va chạm trước/sau"]
    },
    {
      category: "Nội thất",
      items: ["Ghế da chỉnh điện 8 hướng", "Điều hòa tự động 3 vùng", "Cửa sổ trời"]
    }
  ],
  benefits: ["Bảo hành 5 năm", "Tiết kiệm nhiên liệu 25%"]
},
{
  id: 7,
  name: "Audi e-tron GT",
  tagline: "Hiệu năng điện thuần khiết",
  price: 5200000000,
  priceNote: "Giá tham khảo",
  status: "Còn hàng",
  year: 2024,
  mileage: "0 km",
  fuelType: "Điện",
  transmission: "Tự động 2 cấp",
  color: "Xanh đậm ánh kim",
  engine: "475 kW (Quattro)",
  seats: 4,
  origin: "Đức",
  images: ["/showcase/etron_1.jpg", "/showcase/etron_2.jpg"],
  description:
    "Audi e-tron GT là siêu xe điện với thiết kế thể thao, khả năng tăng tốc ấn tượng và công nghệ tiên tiến hàng đầu.",
  features: [
    {
      category: "Ngoại thất",
      items: ["Đèn ma trận LED", "Gầm thấp khí động học", "Phanh gốm hiệu suất cao"]
    },
    {
      category: "Nội thất",
      items: ["Ghế thể thao Alcantara", "Màn hình đôi 12 inch", "Âm thanh 3D Bang & Olufsen"]
    }
  ],
  benefits: [
    "Bảo hành pin 10 năm",
    "Bảo dưỡng miễn phí 3 năm",
    "Tặng bộ sạc nhanh tại nhà"
  ]
},
{
  id: 8,
  name: "Hyundai Ioniq 5",
  tagline: "Crossover điện phong cách tương lai",
  price: 1250000000,
  priceNote: "Giá niêm yết hãng",
  status: "Còn hàng",
  year: 2024,
  mileage: "0 km",
  fuelType: "Điện",
  transmission: "Tự động",
  color: "Bạc ánh kim",
  engine: "168 kW (RWD)",
  seats: 5,
  origin: "Hàn Quốc",
  images: [
    "/showcase/xe1.jpg",
    "/showcase/xe2.jpg",
    "/showcase/xe3.jpg"
  ],
  description:
    "Hyundai Ioniq 5 là mẫu crossover điện với thiết kế hiện đại, không gian nội thất rộng rãi và khả năng sạc nhanh vượt trội.",
  features: [
    {
      category: "Ngoại thất",
      items: ["Đèn LED pixel", "Cửa tay nắm ẩn", "La-zăng 20 inch"]
    },
    {
      category: "Nội thất",
      items: ["Ghế ngả Zero Gravity", "Sạc không dây", "Màn hình đôi 12.3 inch"]
    }
  ],
  benefits: [
    "Bảo hành 5 năm toàn xe",
    "Pin bảo hành 10 năm",
    "Miễn phí sạc công cộng 6 tháng"
  ]
}

]
