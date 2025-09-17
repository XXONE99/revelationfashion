import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Save, X } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { uploadImageToStorage } from "@/lib/supabase/storage";
import { toast } from 'sonner';
import UploadDropzone from "@/components/admin/UploadDropzone";

export default function AppSettingsManager() {
  const [settings, setSettings] = useState<{ 
    id: string | null; 
    app_name: string; 
    app_subtitle: string; 
    logo_url: string;
  }>({ 
    id: null, 
    app_name: '', 
    app_subtitle: '', 
    logo_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('app_settings').select('id,key,value');
      console.log('🔍 [APP SETTINGS] Loading data from database:', data);
      
      if (!data) {
        console.log('❌ [APP SETTINGS] No data found in database');
        return;
      }
      
      const getVal = (k: string) => {
        const value = data.find(s => s.key === k)?.value || '';
        console.log(`🔍 [APP SETTINGS] Key ${k}:`, value);
        return value;
      };
      
      const loadedSettings = {
        id: data[0]?.id || null,
        app_name: getVal('app_name'),
        app_subtitle: getVal('app_subtitle'),
        logo_url: getVal('logo_url'),
      };
      
      console.log('🔍 [APP SETTINGS] Loaded settings:', loadedSettings);
      setSettings(loadedSettings);
    };
    load();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveLogo = async () => {
    if (!settings.logo_url) return;
    
    console.log('🗑️ [LOGO REMOVE] Removing logo:', settings.logo_url);
    
    try {
      const supabase = createClient();
      // Extract file path from URL
      const urlParts = settings.logo_url.split('/storage/v1/object/public/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: deleteError } = await supabase.storage
          .from('uploads')
          .remove([filePath]);
        
        if (deleteError) {
          console.error('❌ [LOGO REMOVE] Failed to delete logo:', deleteError);
        } else {
          console.log('✅ [LOGO REMOVE] Logo deleted successfully');
        }
      }
      
      setSettings(prev => ({ ...prev, logo_url: '' }));
    } catch (error) {
      console.error('❌ [LOGO REMOVE] Error removing logo:', error);
    }
  };

  const handleLogoUploaded = async (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    try {
      if (settings.logo_url) {
        const supabase = createClient();
        const urlParts = settings.logo_url.split('/storage/v1/object/public/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from('uploads').remove([filePath]);
        }
      }
    } catch {}
    setSettings(prev => ({ ...prev, logo_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    console.log('🔍 [SAVE SETTINGS] Saving app settings:', settings);
    
    try {
      const supabase = createClient();
      const upserts = [
        { key: 'app_name', value: settings.app_name },
        { key: 'app_subtitle', value: settings.app_subtitle },
        { key: 'logo_url', value: settings.logo_url },
      ];
      
      console.log('🔍 [SAVE SETTINGS] Upserting data:', upserts);
      
      for (const item of upserts) {
        const { error } = await supabase.from('app_settings').upsert({ key: item.key, value: item.value }, { onConflict: 'key' });
        if (error) {
          console.error(`❌ [SAVE SETTINGS] Error saving ${item.key}:`, error);
        } else {
          console.log(`✅ [SAVE SETTINGS] Successfully saved ${item.key}:`, item.value);
        }
      }
      toast.success('Pengaturan aplikasi berhasil disimpan!');
    } catch (error) {
      console.error("❌ [SAVE SETTINGS] Failed to save app settings:", error);
      toast.error('Gagal menyimpan pengaturan aplikasi!');
    } finally {
      setIsSaving(false);
    }
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Pengaturan Aplikasi</h1>
        <p className="text-sm md:text-base text-muted-foreground">Atur nama, subtitle, dan logo aplikasi yang tampil di website.</p>
      </header>
      <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="app_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Aplikasi</label>
          <Input id="app_name" name="app_name" value={settings.app_name} onChange={handleInputChange} placeholder="e.g., Revelation" />
      </div>

        <div>
          <label htmlFor="app_subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle Aplikasi</label>
          <Input id="app_subtitle" name="app_subtitle" value={settings.app_subtitle} onChange={handleInputChange} placeholder="e.g., Konveksi Seragam" />
        </div>

        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Aplikasi</label>
          <div className="flex items-center gap-4 mt-2">
            {settings.logo_url ? (
              <div className="relative">
                <img 
                  src={settings.logo_url} 
                  alt="Logo" 
                  className="w-16 h-16 rounded-full object-cover bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-white/20" 
                  onError={(e) => {
                    console.error('❌ [LOGO DISPLAY] Failed to load logo image:', settings.logo_url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                  title="Hapus Logo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400 dark:text-gray-300" />
              </div>
            )}
            <div className="flex-1">
              <UploadDropzone 
                bucket="uploads"
                pathPrefix="logos"
                multiple={false}
                onUploaded={handleLogoUploaded}
                label={settings.logo_url ? 'Seret & lepas atau klik untuk ganti logo' : 'Seret & lepas atau klik untuk unggah logo'}
              />
            </div>
          </div>
          {/* {settings.logo_url && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Logo URL: {settings.logo_url}
            </p>
          )} */}
        </div>


        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || isUploading} className="bg-emerald-600 hover:bg-emerald-700">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan Pengaturan
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
