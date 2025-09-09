// Mock data for AboutContent
let mockAboutContent: AboutContent[] = [
  {
    id: "1",
    section: "story",
    title: "Perjalanan Kami",
    content: "Revelation Konveksi didirikan pada tahun 2013 dengan visi menjadi perusahaan konveksi terdepan di Indonesia. Kami memulai perjalanan dari sebuah workshop kecil dengan 3 orang karyawan dan kini telah berkembang menjadi perusahaan yang melayani klien di seluruh nusantara.\n\nDengan pengalaman lebih dari 10 tahun di industri garmen, kami telah memproduksi berbagai jenis pakaian mulai dari seragam sekolah, seragam kantor, hingga merchandise perusahaan. Komitmen kami adalah menghadirkan produk berkualitas tinggi dengan harga yang terjangkau.\n\nKami bangga telah melayani lebih dari 500 klien dan memproduksi lebih dari 100.000 unit pakaian. Tim profesional kami yang berpengalaman siap membantu mewujudkan kebutuhan fashion Anda dengan standar kualitas internasional.",
    image_url: "/api/placeholder/600/400",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface AboutContent {
  id: string
  section: string
  title?: string
  content?: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export class AboutContent {
  static async list(): Promise<AboutContent[]> {
    console.log("🔍 [ABOUT CONTENT] Fetching about content...")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const data = [...mockAboutContent].sort((a, b) => a.section.localeCompare(b.section));

    console.log("✅ [ABOUT CONTENT] About content fetched successfully:", data.length)
    return data;
  }

  static async filter(filters: { section?: string }): Promise<AboutContent[]> {
    console.log("🔍 [ABOUT CONTENT] Fetching about content with filters:", filters)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let data = [...mockAboutContent];

    if (filters.section) {
      data = data.filter(item => item.section === filters.section);
    }

    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log("✅ [ABOUT CONTENT] About content fetched successfully:", data.length)
    return data;
  }

  static async get(id: string): Promise<AboutContent | null> {
    console.log("🔍 [ABOUT CONTENT] Fetching about content:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const content = mockAboutContent.find(c => c.id === id);
    
    if (!content) {
      console.error("❌ [ABOUT CONTENT] About content not found:", id)
      return null
    }

    console.log("✅ [ABOUT CONTENT] About content fetched successfully")
    return content
  }

  static async create(contentData: Omit<AboutContent, "id" | "created_at" | "updated_at">): Promise<AboutContent> {
    console.log("🔍 [ABOUT CONTENT] Creating about content:", contentData.section)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newContent: AboutContent = {
      ...contentData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockAboutContent.push(newContent);

    console.log("✅ [ABOUT CONTENT] About content created successfully:", newContent.id)
    return newContent
  }

  static async update(id: string, updates: Partial<AboutContent>): Promise<AboutContent> {
    console.log("🔍 [ABOUT CONTENT] Updating about content:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockAboutContent.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`About content with id ${id} not found`)
    }
    
    mockAboutContent[index] = {
      ...mockAboutContent[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log("✅ [ABOUT CONTENT] About content updated successfully")
    return mockAboutContent[index]
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [ABOUT CONTENT] Deleting about content:", id)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockAboutContent.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`About content with id ${id} not found`)
    }
    
    mockAboutContent.splice(index, 1);

    console.log("✅ [ABOUT CONTENT] About content deleted successfully")
  }
}
