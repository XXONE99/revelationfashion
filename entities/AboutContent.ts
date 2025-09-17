import { createClient } from "@/lib/supabase/client"

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
    const supabase = createClient()
    const { data, error } = await supabase
      .from('about_page')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw new Error(`Failed to fetch about content: ${error.message}`)
    return (data || []).map((row: any) => ({
      id: row.id,
      section: row.section_name,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      is_active: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async filter(filters: { section?: string }): Promise<AboutContent[]> {
    const supabase = createClient()
    let query = supabase.from('about_page').select('*')
    if (filters.section) query = query.eq('section_name', filters.section)
    const { data, error } = await query.order('sort_order', { ascending: true })
    if (error) throw new Error(`Failed to fetch about content: ${error.message}`)
    return (data || []).map((row: any) => ({
      id: row.id,
      section: row.section_name,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      is_active: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async get(id: string): Promise<AboutContent | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('about_page').select('*').eq('id', id).single()
    if (error) return null
    return {
      id: data.id,
      section: data.section_name,
      title: data.title,
      content: data.content,
      image_url: data.image_url,
      is_active: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(contentData: Omit<AboutContent, "id" | "created_at" | "updated_at">): Promise<AboutContent> {
    const supabase = createClient()
    const payload = {
      section_name: contentData.section,
      title: contentData.title,
      content: contentData.content,
      image_url: contentData.image_url,
      is_published: contentData.is_active,
      sort_order: 0,
    }
    const { data, error } = await supabase.from('about_page').insert(payload).select('*').single()
    if (error) throw new Error(`Failed to create about content: ${error.message}`)
    return {
      id: data.id,
      section: data.section_name,
      title: data.title,
      content: data.content,
      image_url: data.image_url,
      is_active: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<AboutContent>): Promise<AboutContent> {
    const supabase = createClient()
    const payload: any = {
      section_name: updates.section,
      title: updates.title,
      content: updates.content,
      image_url: updates.image_url,
      is_published: updates.is_active,
      updated_at: new Date().toISOString(),
    }
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const { data, error } = await supabase.from('about_page').update(payload).eq('id', id).select('*').single()
    if (error) throw new Error(`Failed to update about content: ${error.message}`)
    return {
      id: data.id,
      section: data.section_name,
      title: data.title,
      content: data.content,
      image_url: data.image_url,
      is_active: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('about_page').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete about content: ${error.message}`)
  }
}
