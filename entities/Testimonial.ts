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
    return (data || []).map((row: any) => ({
      id: row.id,
      client_name: row.client_name,
      company: row.company_name ?? "",
      testimonial: row.testimonial_text ?? "",
      avatar_url: row.avatar_url ?? undefined,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
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
    return {
      id: data.id,
      client_name: data.client_name,
      company: data.company_name ?? "",
      testimonial: data.testimonial_text ?? "",
      avatar_url: data.avatar_url ?? undefined,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(testimonialData: Omit<Testimonial, "id" | "created_at" | "updated_at">): Promise<Testimonial> {
    console.log("🔍 [TESTIMONIAL] Creating testimonial:", testimonialData.client_name)
    const supabase = createClient()
    
    const payload = {
      client_name: testimonialData.client_name,
      company_name: (testimonialData as any).company,
      testimonial_text: (testimonialData as any).testimonial,
      avatar_url: testimonialData.avatar_url,
      is_published: testimonialData.is_published,
    }
    const { data, error } = await supabase
      .from("testimonials")
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error("❌ [TESTIMONIAL] Error creating testimonial:", error)
      throw new Error(`Failed to create testimonial: ${error.message}`)
    }

    console.log("✅ [TESTIMONIAL] Testimonial created successfully:", data.id)
    return {
      id: data.id,
      client_name: data.client_name,
      company: data.company_name ?? "",
      testimonial: data.testimonial_text ?? "",
      avatar_url: data.avatar_url ?? undefined,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    console.log("🔍 [TESTIMONIAL] Updating testimonial:", id)
    const supabase = createClient()
    
    const mappedUpdates: any = {
      updated_at: new Date().toISOString(),
    }
    if (updates.client_name !== undefined) mappedUpdates.client_name = updates.client_name
    if ((updates as any).company !== undefined) mappedUpdates.company_name = (updates as any).company
    if ((updates as any).testimonial !== undefined) mappedUpdates.testimonial_text = (updates as any).testimonial
    if (updates.avatar_url !== undefined) mappedUpdates.avatar_url = updates.avatar_url
    if (updates.is_published !== undefined) mappedUpdates.is_published = updates.is_published

    const { data, error } = await supabase
      .from("testimonials")
      .update(mappedUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [TESTIMONIAL] Error updating testimonial:", error)
      throw new Error(`Failed to update testimonial: ${error.message}`)
    }

    console.log("✅ [TESTIMONIAL] Testimonial updated successfully")
    return {
      id: data.id,
      client_name: data.client_name,
      company: data.company_name ?? "",
      testimonial: data.testimonial_text ?? "",
      avatar_url: data.avatar_url ?? undefined,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
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
