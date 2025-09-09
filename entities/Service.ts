// Mock data for Service
let mockServices: Service[] = [
  {
    id: "1",
    title: "Kualitas Premium",
    description: "Menggunakan bahan berkualitas tinggi dan proses produksi yang terjamin untuk hasil terbaik",
    icon: "/api/placeholder/64/64",
    order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Harga Terjangkau",
    description: "Menawarkan harga yang kompetitif tanpa mengurangi kualitas produk yang kami berikan",
    icon: "/api/placeholder/64/64",
    order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Pengiriman Cepat",
    description: "Sistem logistik yang efisien untuk memastikan produk sampai tepat waktu ke seluruh Indonesia",
    icon: "/api/placeholder/64/64",
    order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "Layanan 24/7",
    description: "Tim customer service yang siap membantu Anda kapan saja dengan respon yang cepat",
    icon: "/api/placeholder/64/64",
    order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Service {
  static async list(orderBy?: string): Promise<Service[]> {
    console.log("🔍 [SERVICE] Fetching services...")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let data = [...mockServices];
    
    if (orderBy === 'order') {
      data.sort((a, b) => a.order - b.order);
    } else {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    console.log("✅ [SERVICE] Services fetched successfully:", data.length)
    return data;
  }

  static async get(id: string): Promise<Service | null> {
    console.log("🔍 [SERVICE] Fetching service:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const service = mockServices.find(s => s.id === id);
    
    if (!service) {
      console.error("❌ [SERVICE] Service not found:", id)
      return null
    }

    console.log("✅ [SERVICE] Service fetched successfully")
    return service
  }

  static async create(serviceData: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> {
    console.log("🔍 [SERVICE] Creating service:", serviceData.title)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newService: Service = {
      ...serviceData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockServices.push(newService);

    console.log("✅ [SERVICE] Service created successfully:", newService.id)
    return newService
  }

  static async update(id: string, updates: Partial<Service>): Promise<Service> {
    console.log("🔍 [SERVICE] Updating service:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockServices.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Service with id ${id} not found`)
    }
    
    mockServices[index] = {
      ...mockServices[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log("✅ [SERVICE] Service updated successfully")
    return mockServices[index]
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [SERVICE] Deleting service:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockServices.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Service with id ${id} not found`)
    }
    
    mockServices.splice(index, 1);

    console.log("✅ [SERVICE] Service deleted successfully")
  }
}
