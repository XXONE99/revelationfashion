// Mock data for Stats
let mockStats: Stats[] = [
  {
    id: "1",
    title: "Klien Puas",
    value: "500",
    suffix: "+",
    icon: "Users",
    order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Produk Terjual", 
    value: "1000",
    suffix: "+",
    icon: "Package",
    order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Kota Jangkauan",
    value: "50",
    suffix: "+",
    icon: "ShoppingCart",
    order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "Tahun Pengalaman", 
    value: "10",
    suffix: "+",
    icon: "CheckSquare",
    order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface Stats {
  id: string
  title: string
  value: string
  suffix?: string
  icon: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Stats {
  static async list(orderBy?: string): Promise<Stats[]> {
    console.log("🔍 [STATS] Fetching stats...")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let data = [...mockStats];
    
    if (orderBy === 'order') {
      data.sort((a, b) => a.order - b.order);
    } else {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    console.log("✅ [STATS] Stats fetched successfully:", data.length)
    return data;
  }

  static async get(id: string): Promise<Stats | null> {
    console.log("🔍 [STATS] Fetching stat:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stat = mockStats.find(s => s.id === id);
    
    if (!stat) {
      console.error("❌ [STATS] Stat not found:", id)
      return null
    }

    console.log("✅ [STATS] Stat fetched successfully")
    return stat
  }

  static async create(statData: Omit<Stats, "id" | "created_at" | "updated_at">): Promise<Stats> {
    console.log("🔍 [STATS] Creating stat:", statData.title)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStat: Stats = {
      ...statData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockStats.push(newStat);

    console.log("✅ [STATS] Stat created successfully:", newStat.id)
    return newStat
  }

  static async update(id: string, updates: Partial<Stats>): Promise<Stats> {
    console.log("🔍 [STATS] Updating stat:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockStats.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Stat with id ${id} not found`)
    }
    
    mockStats[index] = {
      ...mockStats[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log("✅ [STATS] Stat updated successfully")
    return mockStats[index]
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [STATS] Deleting stat:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockStats.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Stat with id ${id} not found`)
    }
    
    mockStats.splice(index, 1);

    console.log("✅ [STATS] Stat deleted successfully")
  }
}
