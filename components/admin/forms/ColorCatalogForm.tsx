import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImageToStorage } from '@/lib/supabase/storage';

type LocalCatalog = {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  images: string[];
  type: 'color' | 'size_chart' | string;
  is_published: boolean;
};

interface ColorCatalogFormProps {
  catalog?: LocalCatalog | null;
  onFormSubmit: (saved: LocalCatalog) => void;
  onCancel: () => void;
}

export default function ColorCatalogForm({ catalog, onFormSubmit, onCancel }: ColorCatalogFormProps) {
  const [formData, setFormData] = useState({
    title: catalog?.title || "",
    description: catalog?.description || "",
    cover_image_url: catalog?.cover_image_url || "",
    images: catalog?.images || [],
    type: (catalog?.type as 'color' | 'size_chart') || 'color',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (catalog) {
      setFormData({
        title: catalog.title,
        description: catalog.description || "",
        cover_image_url: catalog.cover_image_url || "",
        images: catalog.images || [],
        type: (catalog.type as 'color' | 'size_chart') || 'color',
      });
    }
  }, [catalog]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'images') => {
    const fileList = e.target.files;
    const file = fileList && fileList[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToStorage({ bucket: 'catalogs', file, pathPrefix: formData.type === 'color' ? 'colors' : 'size-charts' });
      if (field === 'cover') {
        setFormData(prev => ({ ...prev, cover_image_url: url }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Gagal mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved: LocalCatalog = {
        ...(catalog || {}),
        ...formData,
        id: catalog?.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`),
        is_published: catalog?.is_published ?? true,
      } as LocalCatalog;
      onFormSubmit(saved);
    } catch (error) {
      console.error('Failed to save catalog:', error);
      toast.error('Gagal menyimpan katalog.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'color' | 'size_chart'})}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih Tipe Konten" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="color">Katalog Warna</SelectItem>
          <SelectItem value="size_chart">Size Chart</SelectItem>
        </SelectContent>
      </Select>
    
      <Input placeholder="Judul" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      <Textarea placeholder="Deskripsi" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formData.type === 'color' ? 'Gambar Sampul (Opsional)' : 'Gambar Size Chart'}
        </label>
        {formData.cover_image_url && (
            <div className="my-2"><img src={formData.cover_image_url} alt="Cover" className="w-32 h-32 object-cover rounded-md"/></div>
        )}
        <label htmlFor="cover-upload" className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} Unggah Gambar Sampul
        </label>
        <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover')} />
      </div>

      {formData.type === 'color' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Warna</label>
          <div className="grid grid-cols-3 gap-4 mb-2">
              {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                      <img src={img} alt={`img-${index}`} className="w-full h-24 object-cover rounded-md" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-emerald-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3"/>
                      </button>
                  </div>
              ))}
          </div>
          <label htmlFor="images-upload" className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} Tambah Gambar Warna
          </label>
          <input id="images-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'images')} />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={isSaving || isUploading} className="bg-emerald-600 hover:bg-emerald-700">
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
