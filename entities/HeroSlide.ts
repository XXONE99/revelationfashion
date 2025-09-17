import { createClient } from "@/lib/supabase/client"

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
    const supabase = createClient()
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order(orderBy === 'order' ? 'sort_order' : 'created_at', { ascending: orderBy === 'order' })
    if (error) {
      throw new Error(`Failed to fetch hero slides: ${error.message}`)
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      image_url: row.image_url,
      button_text: row.button_text,
      button_link: row.button_url,
      order: row.sort_order ?? 0,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async get(id: string): Promise<HeroSlide | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('hero_slides').select('*').eq('id', id).single()
    if (error) return null
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      image_url: data.image_url,
      button_text: data.button_text,
      button_link: data.button_url,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(slideData: Omit<HeroSlide, "id" | "created_at" | "updated_at">): Promise<HeroSlide> {
    const supabase = createClient()
    const payload = {
      title: slideData.title,
      subtitle: slideData.subtitle,
      image_url: slideData.image_url,
      button_text: slideData.button_text,
      button_url: slideData.button_link,
      sort_order: slideData.order ?? 0,
      is_published: slideData.is_published,
    }
    const { data, error } = await supabase.from('hero_slides').insert(payload).select('*').single()
    if (error) throw new Error(`Failed to create hero slide: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      image_url: data.image_url,
      button_text: data.button_text,
      button_link: data.button_url,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide> {
    const supabase = createClient()
    const payload: any = {
      title: updates.title,
      subtitle: updates.subtitle,
      image_url: updates.image_url,
      button_text: updates.button_text,
      button_url: updates.button_link,
      sort_order: updates.order,
      is_published: updates.is_published,
      updated_at: new Date().toISOString(),
    }
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const { data, error } = await supabase.from('hero_slides').update(payload).eq('id', id).select('*').single()
    if (error) throw new Error(`Failed to update hero slide: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      image_url: data.image_url,
      button_text: data.button_text,
      button_link: data.button_url,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete hero slide: ${error.message}`)
  }
}
