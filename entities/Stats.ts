import { createClient } from "@/lib/supabase/client"

export interface Stats {
  id: string
  title: string
  value: string
  suffix?: string
  icon: string
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Stats {
  static async list(orderBy?: string): Promise<Stats[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .order(orderBy === 'order' ? 'sort_order' : 'created_at', { ascending: orderBy === 'order' })
    if (error) throw new Error(`Failed to fetch stats: ${error.message}`)
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      value: row.value,
      suffix: row.suffix ?? '',
      icon: row.icon,
      order: row.sort_order ?? 0,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async get(id: string): Promise<Stats | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('stats').select('*').eq('id', id).single()
    if (error) return null
    return {
      id: data.id,
      title: data.title,
      value: data.value,
      suffix: data.suffix ?? '',
      icon: data.icon,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(statData: Omit<Stats, "id" | "created_at" | "updated_at">): Promise<Stats> {
    const supabase = createClient()
    const payload = {
      title: statData.title,
      value: statData.value,
      suffix: statData.suffix,
      icon: statData.icon,
      sort_order: statData.order ?? 0,
      is_published: statData.is_published,
    }
    const { data, error } = await supabase.from('stats').insert(payload).select('*').single()
    if (error) throw new Error(`Failed to create stat: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      value: data.value,
      suffix: data.suffix ?? '',
      icon: data.icon,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<Stats>): Promise<Stats> {
    const supabase = createClient()
    const payload: any = {
      title: updates.title,
      value: updates.value,
      suffix: updates.suffix,
      icon: updates.icon,
      sort_order: updates.order,
      is_published: updates.is_published,
      updated_at: new Date().toISOString(),
    }
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const { data, error } = await supabase.from('stats').update(payload).eq('id', id).select('*').single()
    if (error) throw new Error(`Failed to update stat: ${error.message}`)
    return {
      id: data.id,
      title: data.title,
      value: data.value,
      suffix: data.suffix ?? '',
      icon: data.icon,
      order: data.sort_order ?? 0,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('stats').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete stat: ${error.message}`)
  }
}
