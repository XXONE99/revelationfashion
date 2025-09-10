import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadImageToStorage } from "@/lib/supabase/storage";

export default function AppSettingsManager() {
  const [settings, setSettings] = useState<{ 
    id: string | null; 
    app_name: string; 
    app_subtitle: string; 
    logo_url: string;
    instagram_url: string;
    tiktok_url: string;
    facebook_url: string;
  }>({ 
    id: null, 
    app_name: '', 
    app_subtitle: '', 
    logo_url: '',
    instagram_url: '',
    tiktok_url: '',
    facebook_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('app_settings').select('id,key,value');
      if (!data) return;
      const getVal = (k: string) => data.find(s => s.key === k)?.value || '';
      setSettings({
        id: data[0]?.id || null,
        app_name: getVal('app_name'),
        app_subtitle: getVal('app_subtitle'),
        logo_url: getVal('logo_url'),
        instagram_url: getVal('instagram_url'),
        tiktok_url: getVal('tiktok_url'),
        facebook_url: getVal('facebook_url'),
      });
    };
    load();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    const file = fileList && fileList[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToStorage({ bucket: 'uploads', file, pathPrefix: 'logos' });
      setSettings(prev => ({ ...prev, logo_url: url }));
    } catch (error) {
      console.error("Failed to upload logo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const supabase = createClient();
      const upserts = [
        { key: 'app_name', value: settings.app_name },
        { key: 'app_subtitle', value: settings.app_subtitle },
        { key: 'logo_url', value: settings.logo_url },
        { key: 'instagram_url', value: settings.instagram_url },
        { key: 'tiktok_url', value: settings.tiktok_url },
        { key: 'facebook_url', value: settings.facebook_url },
      ];
      for (const item of upserts) {
        await supabase.from('app_settings').upsert({ key: item.key, value: item.value }, { onConflict: 'key' });
      }
      setSuccessMessage('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error("Failed to save app settings:", error);
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
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      
      {successMessage && (
        <Alert className="mb-4 border-green-500 text-green-700">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Sukses!</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="app_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
          <Input id="app_name" name="app_name" value={settings.app_name} onChange={handleInputChange} placeholder="e.g., Revelation" />
      </div>

        <div>
          <label htmlFor="app_subtitle" className="block text-sm font-medium text-gray-700 mb-1">Subtitle Aplikasi</label>
          <Input id="app_subtitle" name="app_subtitle" value={settings.app_subtitle} onChange={handleInputChange} placeholder="e.g., Konveksi Seragam" />
        </div>

        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">Logo Aplikasi</label>
          <div className="flex items-center gap-4 mt-2">
            {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="w-16 h-16 rounded-full object-cover bg-gray-100" />}
            <label htmlFor="logo-upload" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
              {settings.logo_url ? 'Ganti Logo' : 'Unggah Logo'}
            </label>
            <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosial Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <Input 
                id="instagram_url" 
                name="instagram_url" 
                value={settings.instagram_url} 
                onChange={handleInputChange} 
                placeholder="https://instagram.com/username" 
              />
            </div>
            <div>
              <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
              <Input 
                id="tiktok_url" 
                name="tiktok_url" 
                value={settings.tiktok_url} 
                onChange={handleInputChange} 
                placeholder="https://tiktok.com/@username" 
              />
            </div>
            <div>
              <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <Input 
                id="facebook_url" 
                name="facebook_url" 
                value={settings.facebook_url} 
                onChange={handleInputChange} 
                placeholder="https://facebook.com/username" 
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">URL sosial media akan ditampilkan di footer website.</p>
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
