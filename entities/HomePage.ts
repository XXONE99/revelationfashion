import { createClient } from "@/lib/supabase/client"

export interface HomePage {
  id: string
  section: string
  title?: string
  content?: string
  images?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export class HomePage {
  static async list(): Promise<HomePage[]> {
    console.log("🔍 [HOME PAGE] Fetching home page sections...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("home_page")
      .select("*")
      .order("section", { ascending: true })

    if (error) {
      console.error("❌ [HOME PAGE] Error fetching home page sections:", error)
      throw new Error(`Failed to fetch home page sections: ${error.message}`)
    }

    console.log("✅ [HOME PAGE] Home page sections fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(section: string): Promise<HomePage | null> {
    console.log("🔍 [HOME PAGE] Fetching home page section:", section)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("home_page")
      .select("*")
      .eq("section", section)
      .single()

    if (error) {
      console.error("❌ [HOME PAGE] Error fetching home page section:", error)
      return null
    }

    console.log("✅ [HOME PAGE] Home page section fetched successfully")
    return data
  }

  static async create(sectionData: Omit<HomePage, "id" | "created_at" | "updated_at">): Promise<HomePage> {
    console.log("🔍 [HOME PAGE] Creating home page section:", sectionData.section)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("home_page")
      .insert([sectionData])
      .select()
      .single()

    if (error) {
      console.error("❌ [HOME PAGE] Error creating home page section:", error)
      throw new Error(`Failed to create home page section: ${error.message}`)
    }

    console.log("✅ [HOME PAGE] Home page section created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<HomePage>): Promise<HomePage> {
    console.log("🔍 [HOME PAGE] Updating home page section:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("home_page")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [HOME PAGE] Error updating home page section:", error)
      throw new Error(`Failed to update home page section: ${error.message}`)
    }

    console.log("✅ [HOME PAGE] Home page section updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [HOME PAGE] Deleting home page section:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("home_page")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [HOME PAGE] Error deleting home page section:", error)
      throw new Error(`Failed to delete home page section: ${error.message}`)
    }

    console.log("✅ [HOME PAGE] Home page section deleted successfully")
  }
}
