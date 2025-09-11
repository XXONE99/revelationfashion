import { useState, useEffect } from 'react'
import { AppSettings } from '@/entities/AppSettings'

export function useAppSettings() {
  const [appSettings, setAppSettings] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        console.log('🔍 [USE_APP_SETTINGS] Fetching app settings...')
        const settings = await AppSettings.list()
        console.log('🔍 [USE_APP_SETTINGS] Raw settings:', settings)
        
        const settingsMap: {[key: string]: string} = {}
        
        settings.forEach(setting => {
          settingsMap[setting.key] = setting.value
          console.log(`🔍 [USE_APP_SETTINGS] Mapped ${setting.key} = ${setting.value}`)
        })
        
        console.log('🔍 [USE_APP_SETTINGS] Final settings map:', settingsMap)
        setAppSettings(settingsMap)
        
        // Save logo to localStorage for favicon
        if (settingsMap.logo_url) {
          localStorage.setItem('app_logo_url', settingsMap.logo_url);
          console.log('💾 [USE_APP_SETTINGS] Saved logo to localStorage:', settingsMap.logo_url);
        }
        
        setError(null)
      } catch (err) {
        console.error('❌ [USE_APP_SETTINGS] Failed to fetch app settings:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch settings')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAppSettings()
  }, [])

  return { appSettings, isLoading, error }
}
