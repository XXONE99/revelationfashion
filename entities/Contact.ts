import { createClient } from "@/lib/supabase/client"

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export class Contact {
  static async list(): Promise<Contact[]> {
    console.log("🔍 [CONTACT] Fetching contacts...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [CONTACT] Error fetching contacts:", error)
      throw new Error(`Failed to fetch contacts: ${error.message}`)
    }

    console.log("✅ [CONTACT] Contacts fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(id: string): Promise<Contact | null> {
    console.log("🔍 [CONTACT] Fetching contact:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("❌ [CONTACT] Error fetching contact:", error)
      return null
    }

    console.log("✅ [CONTACT] Contact fetched successfully")
    return data
  }

  static async create(contactData: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact> {
    console.log("🔍 [CONTACT] Creating contact:", contactData.name)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("contacts")
      .insert([contactData])
      .select()
      .single()

    if (error) {
      console.error("❌ [CONTACT] Error creating contact:", error)
      throw new Error(`Failed to create contact: ${error.message}`)
    }

    console.log("✅ [CONTACT] Contact created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<Contact>): Promise<Contact> {
    console.log("🔍 [CONTACT] Updating contact:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("contacts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [CONTACT] Error updating contact:", error)
      throw new Error(`Failed to update contact: ${error.message}`)
    }

    console.log("✅ [CONTACT] Contact updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [CONTACT] Deleting contact:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [CONTACT] Error deleting contact:", error)
      throw new Error(`Failed to delete contact: ${error.message}`)
    }

    console.log("✅ [CONTACT] Contact deleted successfully")
  }
}
