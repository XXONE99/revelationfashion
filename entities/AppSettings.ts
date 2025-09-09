import { createClient } from "@/lib/supabase/client"

export interface AppSettings {
  id: string
  key: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

export class AppSettings {
  static async list(): Promise<AppSettings[]> {
    console.log("🔍 [APP SETTINGS] Fetching app settings...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .order("key", { ascending: true })

    if (error) {
      console.error("❌ [APP SETTINGS] Error fetching app settings:", error)
      throw new Error(`Failed to fetch app settings: ${error.message}`)
    }

    console.log("✅ [APP SETTINGS] App settings fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(key: string): Promise<AppSettings | null> {
    console.log("🔍 [APP SETTINGS] Fetching app setting:", key)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .eq("key", key)
      .single()

    if (error) {
      console.error("❌ [APP SETTINGS] Error fetching app setting:", error)
      return null
    }

    console.log("✅ [APP SETTINGS] App setting fetched successfully")
    return data
  }

  static async create(settingData: Omit<AppSettings, "id" | "created_at" | "updated_at">): Promise<AppSettings> {
    console.log("🔍 [APP SETTINGS] Creating app setting:", settingData.key)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("app_settings")
      .insert([settingData])
      .select()
      .single()

    if (error) {
      console.error("❌ [APP SETTINGS] Error creating app setting:", error)
      throw new Error(`Failed to create app setting: ${error.message}`)
    }

    console.log("✅ [APP SETTINGS] App setting created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<AppSettings>): Promise<AppSettings> {
    console.log("🔍 [APP SETTINGS] Updating app setting:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("app_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [APP SETTINGS] Error updating app setting:", error)
      throw new Error(`Failed to update app setting: ${error.message}`)
    }

    console.log("✅ [APP SETTINGS] App setting updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [APP SETTINGS] Deleting app setting:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("app_settings")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [APP SETTINGS] Error deleting app setting:", error)
      throw new Error(`Failed to delete app setting: ${error.message}`)
    }

    console.log("✅ [APP SETTINGS] App setting deleted successfully")
  }
}
