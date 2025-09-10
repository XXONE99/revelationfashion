import { createClient } from "@/lib/supabase/client"

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Service {
  static async list(orderBy?: string): Promise<Service[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order(orderBy === 'order' ? 'sort_order' : 'created_at', { ascending: orderBy === 'order' })
    if (error) throw new Error(`Failed to fetch services: ${error.message}`)
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      order: row.sort_order ?? 0,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async get(id: string): Promise<Service | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
    if (error) return null
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(serviceData: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> {
    const supabase = createClient()
    const payload = {
      title: serviceData.title,
      description: serviceData.description,
      icon: serviceData.icon,
      sort_order: serviceData.order ?? 0,
      is_published: serviceData.is_published,
    }
    const { data, error } = await supabase.from('services').insert(payload).select('*').single()
    if (error) throw new Error(`Failed to create service: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<Service>): Promise<Service> {
    const supabase = createClient()
    const payload: any = {
      title: updates.title,
      description: updates.description,
      icon: updates.icon,
      sort_order: updates.order,
      is_published: updates.is_published,
      updated_at: new Date().toISOString(),
    }
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const { data, error } = await supabase.from('services').update(payload).eq('id', id).select('*').single()
    if (error) throw new Error(`Failed to update service: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete service: ${error.message}`)
  }
}
