import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';

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
    google_maps_embed_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Seed dummy data
    const seed = {
      phone: { id: 'cf-1', type: 'phone', value: '021-1234-5678', subtitle: 'Senin-Jumat 09.00-17.00' },
      email: { id: 'cf-2', type: 'email', value: 'cs@revelation.co.id', subtitle: 'Respon < 1x24 jam' },
      address: { id: 'cf-3', type: 'address', value: 'Jl. Mawar No. 123, Jakarta', subtitle: 'Gudang & Workshop' },
      hours: { id: 'cf-4', type: 'hours', value: 'Senin - Sabtu', subtitle: '09.00 - 17.00 WIB' },
    } as Record<string, InfoItem>;
    setContactInfo(seed);
    setGlobalSettings({ whatsapp_number: '6281234567890', google_maps_embed_url: '' });
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
      // Simulasi simpan sukses
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
        className="text-sm text-gray-500"
      />
    </div>
  );


  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Informasi Kontak</h1>
        <p className="text-sm md:text-base text-muted-foreground">Atur informasi kontak dan peta lokasi yang tampil di website.</p>
      </header>
      <Card>
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
          
          <Card>
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
              <div>
                <label className="font-medium mb-2 block">Pratinjau Peta</label>
                <div className="rounded-lg overflow-hidden border">
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
