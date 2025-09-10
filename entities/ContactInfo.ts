import { createClient } from "@/lib/supabase/client"

export interface ContactInfoItem {
  id: string
  type: 'phone' | 'email' | 'address' | 'hours'
  value: string
  subtitle: string
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface AppSettings {
  key: string
  value: string
}

export class ContactInfo {
  static async getContactInfo(): Promise<ContactInfoItem[]> {
    console.log("🔍 [CONTACT_INFO] Fetching contact info...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("❌ [CONTACT_INFO] Error fetching contact info:", error)
      throw new Error(`Failed to fetch contact info: ${error.message}`)
    }

    console.log("✅ [CONTACT_INFO] Contact info fetched successfully:", data?.length || 0)
    return data || []
  }

  static async getAppSettings(): Promise<Record<string, string>> {
    console.log("🔍 [APP_SETTINGS] Fetching app settings...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("app_settings")
      .select("key, value")

    if (error) {
      console.error("❌ [APP_SETTINGS] Error fetching app settings:", error)
      throw new Error(`Failed to fetch app settings: ${error.message}`)
    }

    const settings: Record<string, string> = {}
    data?.forEach((item: AppSettings) => {
      settings[item.key] = item.value
    })

    console.log("✅ [APP_SETTINGS] App settings fetched successfully:", Object.keys(settings).length)
    return settings
  }

  static async getContactData(): Promise<{
    contactInfo: ContactInfoItem[]
    settings: Record<string, string>
  }> {
    try {
      const [contactInfo, settings] = await Promise.all([
        this.getContactInfo(),
        this.getAppSettings()
      ])

      return { contactInfo, settings }
    } catch (error) {
      console.error("❌ [CONTACT_DATA] Error fetching contact data:", error)
      throw error
    }
  }
}
