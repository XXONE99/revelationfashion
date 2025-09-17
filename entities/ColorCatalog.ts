import { createClient } from "@/lib/supabase/client"

export interface ColorCatalog {
  id: string
  title: string
  type: 'color' | 'size'
  cover_image_url: string
  images: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export class ColorCatalog {
  static async list(): Promise<ColorCatalog[]> {
    console.log("🔍 [COLOR CATALOG] Fetching color catalogs...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("color_catalogs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [COLOR CATALOG] Error fetching color catalogs:", error)
      throw new Error(`Failed to fetch color catalogs: ${error.message}`)
    }

    console.log("✅ [COLOR CATALOG] Color catalogs fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(id: string): Promise<ColorCatalog | null> {
    console.log("🔍 [COLOR CATALOG] Fetching color catalog:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("color_catalogs")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("❌ [COLOR CATALOG] Error fetching color catalog:", error)
      return null
    }

    console.log("✅ [COLOR CATALOG] Color catalog fetched successfully")
    return data
  }

  static async create(catalogData: Omit<ColorCatalog, "id" | "created_at" | "updated_at">): Promise<ColorCatalog> {
    console.log("🔍 [COLOR CATALOG] Creating color catalog:", catalogData.title)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("color_catalogs")
      .insert([catalogData])
      .select()
      .single()

    if (error) {
      console.error("❌ [COLOR CATALOG] Error creating color catalog:", error)
      throw new Error(`Failed to create color catalog: ${error.message}`)
    }

    console.log("✅ [COLOR CATALOG] Color catalog created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<ColorCatalog>): Promise<ColorCatalog> {
    console.log("🔍 [COLOR CATALOG] Updating color catalog:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("color_catalogs")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [COLOR CATALOG] Error updating color catalog:", error)
      throw new Error(`Failed to update color catalog: ${error.message}`)
    }

    console.log("✅ [COLOR CATALOG] Color catalog updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [COLOR CATALOG] Deleting color catalog:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("color_catalogs")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [COLOR CATALOG] Error deleting color catalog:", error)
      throw new Error(`Failed to delete color catalog: ${error.message}`)
    }

    console.log("✅ [COLOR CATALOG] Color catalog deleted successfully")
  }
}
