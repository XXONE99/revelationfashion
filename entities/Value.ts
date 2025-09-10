import { createClient } from "@/lib/supabase/client"

export interface Value {
  id: string
  title: string
  description: string
  icon: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Value {
  static async list(orderBy?: string): Promise<Value[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('about_values')
      .select('*')
      .order(orderBy === 'order' ? 'sort_order' : 'created_at', { ascending: orderBy === 'order' })
    if (error) throw new Error(`Failed to fetch values: ${error.message}`)
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon_url,
      order: row.sort_order ?? 0,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async get(id: string): Promise<Value | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('about_values').select('*').eq('id', id).single()
    if (error) return null
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon_url,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(valueData: Omit<Value, "id" | "created_at" | "updated_at">): Promise<Value> {
    const supabase = createClient()
    const payload = {
      title: valueData.title,
      description: valueData.description,
      icon_url: valueData.icon,
      sort_order: valueData.order ?? 0,
      is_published: valueData.is_published ?? true,
    }
    const { data, error } = await supabase.from('about_values').insert(payload).select('*').single()
    if (error) throw new Error(`Failed to create value: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon_url,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<Value>): Promise<Value> {
    const supabase = createClient()
    const payload: any = {
      title: updates.title,
      description: updates.description,
      icon_url: updates.icon,
      sort_order: updates.order,
      is_published: updates.is_published,
      updated_at: new Date().toISOString(),
    }
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const { data, error } = await supabase.from('about_values').update(payload).eq('id', id).select('*').single()
    if (error) throw new Error(`Failed to update value: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon_url,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('about_values').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete value: ${error.message}`)
  }
}
