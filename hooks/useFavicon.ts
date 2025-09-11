import { useEffect } from 'react';
import { useAppSettings } from './useAppSettings';

export function useFavicon() {
  const { appSettings, isLoading } = useAppSettings();

  useEffect(() => {
    if (isLoading || !appSettings.logo_url) return;

    console.log('🔍 [FAVICON] Setting favicon from app settings:', appSettings.logo_url);
    
    // Update favicon
    const updateFavicon = (rel: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = appSettings.logo_url;
    };

    // Update all favicon types
    updateFavicon('icon');
    updateFavicon('shortcut icon');
    updateFavicon('apple-touch-icon');
    
    // Update page title if needed
    if (appSettings.app_name) {
      document.title = `${appSettings.app_name} - ${appSettings.app_subtitle || 'Konveksi Bandung'}`;
    }

  }, [appSettings.logo_url, appSettings.app_name, appSettings.app_subtitle, isLoading]);
}
