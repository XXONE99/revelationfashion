import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ContactInfo {
  phone: string
  email: string
  address: string
  hours: string
  whatsapp_number: string
  instagram_url: string
  tiktok_url: string
  facebook_url: string
}

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    hours: '',
    whatsapp_number: '',
    instagram_url: '',
    tiktok_url: '',
    facebook_url: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('🔍 [USE_CONTACT_INFO] Fetching contact info...')
        const supabase = createClient()
        
        // Fetch contact_info table
        const { data: infos, error: infosError } = await supabase
          .from('contact_info')
          .select('*')
          .order('sort_order', { ascending: true })

        if (infosError) {
          console.error('❌ [USE_CONTACT_INFO] Error fetching contact_info:', infosError)
          throw infosError
        }

        // Fetch app_settings for social media and whatsapp
        const { data: settings, error: settingsError } = await supabase
          .from('app_settings')
          .select('key,value')

        if (settingsError) {
          console.error('❌ [USE_CONTACT_INFO] Error fetching app_settings:', settingsError)
          throw settingsError
        }

        console.log('🔍 [USE_CONTACT_INFO] Raw contact_info:', infos)
        console.log('🔍 [USE_CONTACT_INFO] Raw app_settings:', settings)

        // Map contact_info data
        const contactMapping: Record<string, string> = {
          phone: '',
          email: '',
          address: '',
          hours: ''
        }

        if (infos) {
          infos.forEach((row: any) => {
            contactMapping[row.type] = row.value || ''
            console.log(`🔍 [USE_CONTACT_INFO] Mapped ${row.type} = ${row.value}`)
          })
        }

        // Map app_settings data
        const getVal = (k: string) => settings?.find(s => s.key === k)?.value || ''
        const globalSettings = {
          whatsapp_number: getVal('whatsapp_number'),
          instagram_url: getVal('instagram_url'),
          tiktok_url: getVal('tiktok_url'),
          facebook_url: getVal('facebook_url')
        }

        console.log('🔍 [USE_CONTACT_INFO] Global settings:', globalSettings)

        const finalContactInfo: ContactInfo = {
          phone: contactMapping.phone,
          email: contactMapping.email,
          address: contactMapping.address,
          hours: contactMapping.hours,
          whatsapp_number: globalSettings.whatsapp_number,
          instagram_url: globalSettings.instagram_url,
          tiktok_url: globalSettings.tiktok_url,
          facebook_url: globalSettings.facebook_url
        }

        console.log('🔍 [USE_CONTACT_INFO] Final contact info:', finalContactInfo)
        setContactInfo(finalContactInfo)
        setError(null)
      } catch (err) {
        console.error('❌ [USE_CONTACT_INFO] Failed to fetch contact info:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch contact info')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchContactInfo()
  }, [])

  return { contactInfo, isLoading, error }
}
