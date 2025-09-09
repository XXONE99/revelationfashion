import { createClient } from "@/lib/supabase/client"

export interface Testimonial {
  id: string
  client_name: string
  company: string
  testimonial: string
  avatar_url?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Testimonial {
  static async list(): Promise<Testimonial[]> {
    console.log("🔍 [TESTIMONIAL] Fetching testimonials...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [TESTIMONIAL] Error fetching testimonials:", error)
      throw new Error(`Failed to fetch testimonials: ${error.message}`)
    }

    console.log("✅ [TESTIMONIAL] Testimonials fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(id: string): Promise<Testimonial | null> {
    console.log("🔍 [TESTIMONIAL] Fetching testimonial:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("❌ [TESTIMONIAL] Error fetching testimonial:", error)
      return null
    }

    console.log("✅ [TESTIMONIAL] Testimonial fetched successfully")
    return data
  }

  static async create(testimonialData: Omit<Testimonial, "id" | "created_at" | "updated_at">): Promise<Testimonial> {
    console.log("🔍 [TESTIMONIAL] Creating testimonial:", testimonialData.client_name)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("testimonials")
      .insert([testimonialData])
      .select()
      .single()

    if (error) {
      console.error("❌ [TESTIMONIAL] Error creating testimonial:", error)
      throw new Error(`Failed to create testimonial: ${error.message}`)
    }

    console.log("✅ [TESTIMONIAL] Testimonial created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    console.log("🔍 [TESTIMONIAL] Updating testimonial:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("testimonials")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [TESTIMONIAL] Error updating testimonial:", error)
      throw new Error(`Failed to update testimonial: ${error.message}`)
    }

    console.log("✅ [TESTIMONIAL] Testimonial updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [TESTIMONIAL] Deleting testimonial:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [TESTIMONIAL] Error deleting testimonial:", error)
      throw new Error(`Failed to delete testimonial: ${error.message}`)
    }

    console.log("✅ [TESTIMONIAL] Testimonial deleted successfully")
  }
}
