import { createClient } from "@/lib/supabase/client"

export interface OurClient {
  id: string
  name: string
  logo_url: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export class OurClient {
  static async list(): Promise<OurClient[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('our_clients')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw new Error(`Failed to fetch clients: ${error.message}`)
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      logo_url: row.logo_url,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  static async get(id: string): Promise<OurClient | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('our_clients').select('*').eq('id', id).single()
    if (error) return null
    return {
      id: data.id,
      name: data.name,
      logo_url: data.logo_url,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async create(clientData: Omit<OurClient, "id" | "created_at" | "updated_at">): Promise<OurClient> {
    const supabase = createClient()
    const { data, error } = await supabase.from('our_clients').insert({
      name: clientData.name,
      logo_url: clientData.logo_url,
      is_published: clientData.is_published,
    }).select('*').single()
    if (error) throw new Error(`Failed to create client: ${error.message}`)
    return {
      id: data.id,
      name: data.name,
      logo_url: data.logo_url,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async update(id: string, updates: Partial<OurClient>): Promise<OurClient> {
    const supabase = createClient()
    const payload: any = {
      name: updates.name,
      logo_url: updates.logo_url,
      is_published: updates.is_published,
      updated_at: new Date().toISOString(),
    }
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const { data, error } = await supabase.from('our_clients').update(payload).eq('id', id).select('*').single()
    if (error) throw new Error(`Failed to update client: ${error.message}`)
    return {
      id: data.id,
      name: data.name,
      logo_url: data.logo_url,
      is_published: data.is_published,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('our_clients').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete client: ${error.message}`)
  }
}
