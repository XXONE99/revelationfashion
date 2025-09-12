import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Trash2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImageToStorage } from '@/lib/supabase/storage';
import UploadDropzone from '@/components/admin/UploadDropzone';

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
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);
  const [promptFor, setPromptFor] = useState<'title'|'description'|null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleUploadedCover = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData(prev => ({ ...prev, cover_image_url: url }))
  }
  const handleUploadedImages = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
  }

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

  const generateWithGemini = async () => {
    if (!promptFor || !aiPrompt.trim()) return;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string | undefined;
    if (!apiKey) return;
    setIsGenerating(true);
    try {
      let res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-goog-api-key': String(apiKey) },
        body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
      });
      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
        });
      }
      if (!res.ok) throw new Error('Gemini error');
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (promptFor === 'title') setFormData(prev => ({ ...prev, title: text }));
      if (promptFor === 'description') setFormData(prev => ({ ...prev, description: text }));
      setPromptFor(null);
    } finally {
      setIsGenerating(false);
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
    
      <div className="relative">
        <Input placeholder="Judul" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} onFocus={()=>setIsTitleFocused(true)} onBlur={()=>setIsTitleFocused(false)} className="pr-12" required />
        <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>{ setPromptFor('title'); setAiPrompt(''); }} className={`absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isTitleFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Wand2 className="w-4 h-4"/>
        </button>
      </div>
      <div className="relative">
        <Textarea placeholder="Deskripsi" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} onFocus={()=>setIsDescFocused(true)} onBlur={()=>setIsDescFocused(false)} />
        <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>{ setPromptFor('description'); setAiPrompt(''); }} className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isDescFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Wand2 className="w-4 h-4"/>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formData.type === 'color' ? 'Gambar Sampul (Opsional)' : 'Gambar Size Chart'}
        </label>
        {formData.cover_image_url && (
            <div className="my-2"><img src={formData.cover_image_url} alt="Cover" className="w-32 h-32 object-cover rounded-md"/></div>
        )}
        <UploadDropzone 
          bucket="catalogs"
          pathPrefix={formData.type === 'color' ? 'colors' : 'size-charts'}
          multiple={false}
          onUploaded={handleUploadedCover}
          label="Seret & lepas atau klik untuk unggah gambar sampul"
        />
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
          <UploadDropzone 
            bucket="catalogs"
            pathPrefix={formData.type === 'color' ? 'colors' : 'size-charts'}
            multiple
            onUploaded={handleUploadedImages}
            label="Seret & lepas atau klik untuk tambah gambar warna"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={isSaving || isUploading} className="bg-emerald-600 hover:bg-emerald-700">
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      {promptFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
            <div className="text-lg font-semibold mb-1">Buat {promptFor === 'title' ? 'Judul' : 'Deskripsi'} dengan AI</div>
            <div className="text-sm text-gray-500 mb-3">Tulis instruksi singkat untuk hasil yang diinginkan</div>
            <Textarea rows={5} value={aiPrompt} onChange={(e)=>setAiPrompt(e.target.value)} placeholder="Tulis prompt Anda di sini..."/>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={()=>setPromptFor(null)}>Batal</Button>
              <Button onClick={generateWithGemini} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Hasilkan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
