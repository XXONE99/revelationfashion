import { createClient } from "@/lib/supabase/client"

export interface ProjectPost {
  id: string
  title: string
  description?: string
  excerpt?: string
  content?: string
  category: string
  images: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export class ProjectPost {
  static async list(): Promise<ProjectPost[]> {
    console.log("🔍 [PROJECT POST] Fetching project posts...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("project_posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [PROJECT POST] Error fetching project posts:", error)
      throw new Error(`Failed to fetch project posts: ${error.message}`)
    }

    console.log("✅ [PROJECT POST] Project posts fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(id: string): Promise<ProjectPost | null> {
    console.log("🔍 [PROJECT POST] Fetching project post:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("project_posts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("❌ [PROJECT POST] Error fetching project post:", error)
      return null
    }

    console.log("✅ [PROJECT POST] Project post fetched successfully")
    return data
  }

  static async create(postData: Omit<ProjectPost, "id" | "created_at" | "updated_at">): Promise<ProjectPost> {
    console.log("🔍 [PROJECT POST] Creating project post:", postData.title)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("project_posts")
      .insert([postData])
      .select()
      .single()

    if (error) {
      console.error("❌ [PROJECT POST] Error creating project post:", error)
      throw new Error(`Failed to create project post: ${error.message}`)
    }

    console.log("✅ [PROJECT POST] Project post created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<ProjectPost>): Promise<ProjectPost> {
    console.log("🔍 [PROJECT POST] Updating project post:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("project_posts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [PROJECT POST] Error updating project post:", error)
      throw new Error(`Failed to update project post: ${error.message}`)
    }

    console.log("✅ [PROJECT POST] Project post updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [PROJECT POST] Deleting project post:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("project_posts")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [PROJECT POST] Error deleting project post:", error)
      throw new Error(`Failed to delete project post: ${error.message}`)
    }

    console.log("✅ [PROJECT POST] Project post deleted successfully")
  }
}
