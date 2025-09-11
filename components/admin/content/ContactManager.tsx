import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { createClient } from "@/lib/supabase/client";

type InfoItem = {
  id?: string;
  type: 'phone' | 'email' | 'address' | 'hours';
  value?: string;
  subtitle?: string;
};

export default function ContactManager() {
  const [contactInfo, setContactInfo] = useState<Record<string, InfoItem>>({
    phone: { type: 'phone', value: '', subtitle: '' },
    email: { type: 'email', value: '', subtitle: '' },
    address: { type: 'address', value: '', subtitle: '' },
    hours: { type: 'hours', value: '', subtitle: '' },
  });
  const [globalSettings, setGlobalSettings] = useState({
    whatsapp_number: '',
    google_maps_embed_url: '',
    instagram_url: '',
    tiktok_url: '',
    facebook_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      // contact_info
      const { data: infos } = await supabase
        .from('contact_info')
        .select('*')
        .order('sort_order', { ascending: true });
      const mapping: Record<string, InfoItem> = {
        phone: { type: 'phone' },
        email: { type: 'email' },
        address: { type: 'address' },
        hours: { type: 'hours' }
      };
      (infos || []).forEach((row: any) => {
        mapping[row.type] = { id: row.id, type: row.type, value: row.value, subtitle: row.subtitle };
      });
      setContactInfo(mapping);

      // app_settings
      const { data: settings } = await supabase
        .from('app_settings')
        .select('key,value');
      const getVal = (k: string) => settings?.find(s => s.key === k)?.value || '';
      setGlobalSettings({
        whatsapp_number: getVal('whatsapp_number'),
        google_maps_embed_url: getVal('google_maps_embed_url'),
        instagram_url: getVal('instagram_url'),
        tiktok_url: getVal('tiktok_url'),
        facebook_url: getVal('facebook_url')
      });
    };
    load();
  }, []);

  const handleInputChange = (type: keyof typeof contactInfo, field: 'value' | 'subtitle', value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };
  
  const handleGlobalChange = (field: keyof typeof globalSettings, value: string) => {
    setGlobalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      // Upsert contact_info
      const entries = Object.values(contactInfo) as InfoItem[];
      for (const entry of entries) {
        if (!entry.value && !entry.subtitle) continue;
        if (entry.id) {
          await supabase.from('contact_info').update({ value: entry.value, subtitle: entry.subtitle }).eq('id', entry.id);
        } else {
          await supabase.from('contact_info').insert({ type: entry.type, value: entry.value, subtitle: entry.subtitle, is_published: true });
        }
      }
      // Upsert app_settings keys
      const upserts = [
        { key: 'whatsapp_number', value: globalSettings.whatsapp_number },
        { key: 'google_maps_embed_url', value: globalSettings.google_maps_embed_url },
        { key: 'instagram_url', value: globalSettings.instagram_url },
        { key: 'tiktok_url', value: globalSettings.tiktok_url },
        { key: 'facebook_url', value: globalSettings.facebook_url },
      ];
      for (const item of upserts) {
        await supabase.from('app_settings').upsert({ key: item.key, value: item.value }, { onConflict: 'key' });
      }
      toast.success('Informasi kontak berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to save contact info:', error);
      toast.error('Gagal menyimpan informasi!');
    } finally {
      setIsSaving(false);
    }
  };
  
  const InfoCard = ({ type, title }: { type: keyof typeof contactInfo; title: string }) => (
    <div className="space-y-2">
      <label className="font-medium">{title}</label>
      <Input
        value={contactInfo[type]?.value || ''}
        onChange={(e) => handleInputChange(type, 'value', e.target.value)}
        placeholder={`Masukkan ${title.toLowerCase()}`}
      />
      <Input
        value={contactInfo[type]?.subtitle || ''}
        onChange={(e) => handleInputChange(type, 'subtitle', e.target.value)}
        placeholder="Keterangan tambahan"
        className="text-sm text-gray-500 dark:text-gray-400"
      />
    </div>
  );


  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Informasi Kontak</h1>
        <p className="text-sm md:text-base text-muted-foreground">Atur informasi kontak dan peta lokasi yang tampil di website.</p>
      </header>
      <Card className="dark:bg-gray-800/80 border dark:border-white/10">
        <CardHeader>
          <CardTitle>Kelola Informasi Kontak</CardTitle>
          <CardDescription>Atur semua informasi yang ditampilkan di halaman kontak.</CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard type="phone" title="Telepon" />
            <InfoCard type="email" title="Email" />
            <InfoCard type="address" title="Alamat" />
            <InfoCard type="hours" title="Jam Operasional" />
          </div>
          
          <Card className="dark:bg-gray-900/40 border dark:border-white/10">
            <CardHeader>
                <CardTitle className="text-lg">Pengaturan Global</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium">Nomor WhatsApp</label>
                  <Input value={globalSettings.whatsapp_number} onChange={(e) => handleGlobalChange('whatsapp_number', e.target.value)} placeholder="6281234567890"/>
                </div>
                <div>
                  <label className="font-medium">Google Maps Embed URL</label>
                  <Input value={globalSettings.google_maps_embed_url} onChange={(e) => handleGlobalChange('google_maps_embed_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..."/>
                  <p className="text-xs text-muted-foreground mt-1">Tip: Buka Google Maps → Bagikan → Sematkan peta → Salin URL <code>&lt;iframe src="..."&gt;</code> bagian src.</p>
                </div>
              </div>
              
              {/* Social Media Settings */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Sosial Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium">Instagram URL</label>
                    <Input 
                      value={globalSettings.instagram_url} 
                      onChange={(e) => handleGlobalChange('instagram_url', e.target.value)} 
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="font-medium">TikTok URL</label>
                    <Input 
                      value={globalSettings.tiktok_url} 
                      onChange={(e) => handleGlobalChange('tiktok_url', e.target.value)} 
                      placeholder="https://tiktok.com/@username"
                    />
                  </div>
                  <div>
                    <label className="font-medium">Facebook URL</label>
                    <Input 
                      value={globalSettings.facebook_url} 
                      onChange={(e) => handleGlobalChange('facebook_url', e.target.value)} 
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">URL sosial media akan ditampilkan di footer website.</p>
              </div>
              <div>
                <label className="font-medium mb-2 block">Pratinjau Peta</label>
                <div className="rounded-lg overflow-hidden border dark:border-white/10">
                  <iframe
                    src={globalSettings.google_maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.674338612005!2d106.827153!3d-6.175392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2f2c5dfcf%3A0x2a18f9b2c2b9a7a!2sMonas!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
}
