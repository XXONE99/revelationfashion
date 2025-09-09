// Mock data for HeroSlide
let mockHeroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Konveksi Seragam Terpercaya",
    subtitle: "Melayani pembuatan seragam berkualitas tinggi untuk berbagai keperluan",
    image_url: "/api/placeholder/800/600",
    button_text: "Lihat Produk",
    button_link: "/portofolio",
    order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2", 
    title: "Pengiriman Seluruh Indonesia",
    subtitle: "Melayani seluruh nusantara dengan sistem pengiriman terpercaya",
    image_url: "/api/placeholder/800/600",
    button_text: "Hubungi Kami",
    button_link: "/kontak",
    order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Kualitas Premium Harga Terjangkau", 
    subtitle: "Dapatkan produk berkualitas tinggi dengan harga yang bersahabat",
    image_url: "/api/placeholder/800/600",
    button_text: "Konsultasi Gratis",
    button_link: "/kontak",
    order: 3,
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  image_url: string
  button_text?: string
  button_link?: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class HeroSlide {
  static async list(orderBy?: string): Promise<HeroSlide[]> {
    console.log("🔍 [HERO SLIDE] Fetching hero slides...")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let data = [...mockHeroSlides];
    
    if (orderBy === 'order') {
      data.sort((a, b) => a.order - b.order);
    } else {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    console.log("✅ [HERO SLIDE] Hero slides fetched successfully:", data.length)
    return data;
  }

  static async get(id: string): Promise<HeroSlide | null> {
    console.log("🔍 [HERO SLIDE] Fetching hero slide:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const slide = mockHeroSlides.find(s => s.id === id);
    
    if (!slide) {
      console.error("❌ [HERO SLIDE] Hero slide not found:", id)
      return null
    }

    console.log("✅ [HERO SLIDE] Hero slide fetched successfully")
    return slide
  }

  static async create(slideData: Omit<HeroSlide, "id" | "created_at" | "updated_at">): Promise<HeroSlide> {
    console.log("🔍 [HERO SLIDE] Creating hero slide:", slideData.title)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSlide: HeroSlide = {
      ...slideData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockHeroSlides.push(newSlide);

    console.log("✅ [HERO SLIDE] Hero slide created successfully:", newSlide.id)
    return newSlide
  }

  static async update(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide> {
    console.log("🔍 [HERO SLIDE] Updating hero slide:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockHeroSlides.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Hero slide with id ${id} not found`)
    }
    
    mockHeroSlides[index] = {
      ...mockHeroSlides[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log("✅ [HERO SLIDE] Hero slide updated successfully")
    return mockHeroSlides[index]
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [HERO SLIDE] Deleting hero slide:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockHeroSlides.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Hero slide with id ${id} not found`)
    }
    
    mockHeroSlides.splice(index, 1);

    console.log("✅ [HERO SLIDE] Hero slide deleted successfully")
  }
}
