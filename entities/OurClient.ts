// Mock data for OurClient
let mockOurClients: OurClient[] = [
  {
    id: "1",
    name: "PT Indofood Sukses Makmur",
    logo_url: "/api/placeholder/120/80",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Bank Central Asia",
    logo_url: "/api/placeholder/120/80",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "PT Telkom Indonesia",
    logo_url: "/api/placeholder/120/80",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    name: "BUMN Pertamina",
    logo_url: "/api/placeholder/120/80",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    name: "PT Astra International",
    logo_url: "/api/placeholder/120/80",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "6",
    name: "PT Bank Mandiri",
    logo_url: "/api/placeholder/120/80",
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface OurClient {
  id: string
  name: string
  logo_url: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export class OurClient {
  static async list(): Promise<OurClient[]> {
    console.log("🔍 [OUR CLIENT] Fetching our clients...")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const data = [...mockOurClients].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log("✅ [OUR CLIENT] Our clients fetched successfully:", data.length)
    return data;
  }

  static async get(id: string): Promise<OurClient | null> {
    console.log("🔍 [OUR CLIENT] Fetching our client:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const client = mockOurClients.find(c => c.id === id);
    
    if (!client) {
      console.error("❌ [OUR CLIENT] Our client not found:", id)
      return null
    }

    console.log("✅ [OUR CLIENT] Our client fetched successfully")
    return client
  }

  static async create(clientData: Omit<OurClient, "id" | "created_at" | "updated_at">): Promise<OurClient> {
    console.log("🔍 [OUR CLIENT] Creating our client:", clientData.name)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newClient: OurClient = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockOurClients.push(newClient);

    console.log("✅ [OUR CLIENT] Our client created successfully:", newClient.id)
    return newClient
  }

  static async update(id: string, updates: Partial<OurClient>): Promise<OurClient> {
    console.log("🔍 [OUR CLIENT] Updating our client:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockOurClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Our client with id ${id} not found`)
    }
    
    mockOurClients[index] = {
      ...mockOurClients[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log("✅ [OUR CLIENT] Our client updated successfully")
    return mockOurClients[index]
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [OUR CLIENT] Deleting our client:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockOurClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Our client with id ${id} not found`)
    }
    
    mockOurClients.splice(index, 1);

    console.log("✅ [OUR CLIENT] Our client deleted successfully")
  }
}
