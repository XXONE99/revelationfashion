// Mock data for Value
let mockValues: Value[] = [
  {
    id: "1",
    title: "Integritas",
    description: "Kami selalu berkomitmen pada kejujuran dan transparansi dalam setiap aspek bisnis kami",
    icon: "/api/placeholder/64/64",
    order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Kualitas",
    description: "Standar kualitas tinggi adalah prioritas utama dalam setiap produk yang kami hasilkan",
    icon: "/api/placeholder/64/64",
    order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Inovasi",
    description: "Kami terus berinovasi untuk memberikan solusi terbaik dan mengikuti perkembangan zaman",
    icon: "/api/placeholder/64/64",
    order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "Kepuasan Pelanggan",
    description: "Kepuasan pelanggan adalah tujuan utama yang selalu kami prioritaskan dalam melayani",
    icon: "/api/placeholder/64/64",
    order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface Value {
  id: string
  title: string
  description: string
  icon: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Value {
  static async list(orderBy?: string): Promise<Value[]> {
    console.log("🔍 [VALUE] Fetching values...")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let data = [...mockValues];
    
    if (orderBy === 'order') {
      data.sort((a, b) => a.order - b.order);
    } else {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    console.log("✅ [VALUE] Values fetched successfully:", data.length)
    return data;
  }

  static async get(id: string): Promise<Value | null> {
    console.log("🔍 [VALUE] Fetching value:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const value = mockValues.find(v => v.id === id);
    
    if (!value) {
      console.error("❌ [VALUE] Value not found:", id)
      return null
    }

    console.log("✅ [VALUE] Value fetched successfully")
    return value
  }

  static async create(valueData: Omit<Value, "id" | "created_at" | "updated_at">): Promise<Value> {
    console.log("🔍 [VALUE] Creating value:", valueData.title)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Set default is_published to true if not provided
    const dataWithDefaults = {
      ...valueData,
      is_published: valueData.is_published ?? true
    }
    
    const newValue: Value = {
      ...dataWithDefaults,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockValues.push(newValue);

    console.log("✅ [VALUE] Value created successfully:", newValue.id)
    return newValue
  }

  static async update(id: string, updates: Partial<Value>): Promise<Value> {
    console.log("🔍 [VALUE] Updating value:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockValues.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Value with id ${id} not found`)
    }
    
    mockValues[index] = {
      ...mockValues[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log("✅ [VALUE] Value updated successfully")
    return mockValues[index]
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [VALUE] Deleting value:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockValues.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Value with id ${id} not found`)
    }
    
    mockValues.splice(index, 1);

    console.log("✅ [VALUE] Value deleted successfully")
  }
}
