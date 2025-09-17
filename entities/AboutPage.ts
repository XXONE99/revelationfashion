import { createClient } from "@/lib/supabase/client"

export interface AboutPage {
  id: string
  section_name: string
  title?: string
  content?: string
  image_url?: string
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export class AboutPage {
  static async list(): Promise<AboutPage[]> {
    console.log("🔍 [ABOUT PAGE] Fetching about page sections...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("about_page")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("❌ [ABOUT PAGE] Error fetching about page sections:", error)
      throw new Error(`Failed to fetch about page sections: ${error.message}`)
    }

    console.log("✅ [ABOUT PAGE] About page sections fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(sectionName: string): Promise<AboutPage | null> {
    console.log("🔍 [ABOUT PAGE] Fetching about page section:", sectionName)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("about_page")
      .select("*")
      .eq("section_name", sectionName)
      .single()

    if (error) {
      console.error("❌ [ABOUT PAGE] Error fetching about page section:", error)
      return null
    }

    console.log("✅ [ABOUT PAGE] About page section fetched successfully")
    return data
  }

  static async create(sectionData: Omit<AboutPage, "id" | "created_at" | "updated_at">): Promise<AboutPage> {
    console.log("🔍 [ABOUT PAGE] Creating about page section:", sectionData.section)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("about_page")
      .insert([sectionData])
      .select()
      .single()

    if (error) {
      console.error("❌ [ABOUT PAGE] Error creating about page section:", error)
      throw new Error(`Failed to create about page section: ${error.message}`)
    }

    console.log("✅ [ABOUT PAGE] About page section created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<AboutPage>): Promise<AboutPage> {
    console.log("🔍 [ABOUT PAGE] Updating about page section:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("about_page")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [ABOUT PAGE] Error updating about page section:", error)
      throw new Error(`Failed to update about page section: ${error.message}`)
    }

    console.log("✅ [ABOUT PAGE] About page section updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [ABOUT PAGE] Deleting about page section:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("about_page")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [ABOUT PAGE] Error deleting about page section:", error)
      throw new Error(`Failed to delete about page section: ${error.message}`)
    }

    console.log("✅ [ABOUT PAGE] About page section deleted successfully")
  }
}
