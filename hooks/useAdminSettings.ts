import { useState, useEffect } from 'react';
import { AppSettings } from '@/entities/AppSettings';

interface AdminSettings {
  app_name: string;
  app_subtitle: string;
  logo_url: string;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>({
    app_name: 'Revelation',
    app_subtitle: 'Konveksi Seragam',
    logo_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const appSettings = await AppSettings.list();
        console.log('🔍 [ADMIN SETTINGS] Loading app settings:', appSettings);
        
        if (appSettings.length > 0) {
          // Create a map of settings by key
          const settingsMap = appSettings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
          }, {} as Record<string, string>);
          
          console.log('🔍 [ADMIN SETTINGS] Settings map:', settingsMap);
          
          const newSettings = {
            app_name: settingsMap.app_name || 'Revelation',
            app_subtitle: settingsMap.app_subtitle || 'Konveksi Seragam',
            logo_url: settingsMap.logo_url || ''
          };
          
          setSettings(newSettings);
          console.log('✅ [ADMIN SETTINGS] Settings loaded successfully:', newSettings);
        } else {
          console.log('⚠️ [ADMIN SETTINGS] No settings found in database');
        }
        
        // Save logo to localStorage for favicon
        if (newSettings.logo_url) {
          localStorage.setItem('app_logo_url', newSettings.logo_url);
          console.log('💾 [ADMIN SETTINGS] Saved logo to localStorage:', newSettings.logo_url);
        }
        
        // Check localStorage as fallback for logo
        const storedLogo = localStorage.getItem('app_logo_url');
        if (storedLogo && !newSettings.logo_url) {
          console.log('🔍 [ADMIN SETTINGS] Using stored logo from localStorage:', storedLogo);
          setSettings(prev => ({ ...prev, logo_url: storedLogo }));
        }
      } catch (error) {
        console.error("❌ [ADMIN SETTINGS] Failed to fetch settings:", error);
        setError(error instanceof Error ? error.message : 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetch: () => {
      const fetchSettings = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const appSettings = await AppSettings.list();
          console.log('🔍 [ADMIN SETTINGS] Refetching app settings:', appSettings);
          
          if (appSettings.length > 0) {
            const settingsMap = appSettings.reduce((acc, setting) => {
              acc[setting.key] = setting.value;
              return acc;
            }, {} as Record<string, string>);
            
            const newSettings = {
              app_name: settingsMap.app_name || 'Revelation',
              app_subtitle: settingsMap.app_subtitle || 'Konveksi Seragam',
              logo_url: settingsMap.logo_url || ''
            };
            
            setSettings(newSettings);
            console.log('✅ [ADMIN SETTINGS] Settings refetched successfully:', newSettings);
          }
        } catch (error) {
          console.error("❌ [ADMIN SETTINGS] Failed to refetch settings:", error);
          setError(error instanceof Error ? error.message : 'Failed to load settings');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSettings();
    }
  };
}
