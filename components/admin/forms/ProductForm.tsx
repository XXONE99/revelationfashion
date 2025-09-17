import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import UploadDropzone from "@/components/admin/UploadDropzone";

type LocalProduct = {
  id: string;
  name: string;
  notes?: string;
  category: 'shirt' | 'jacket' | 'pants' | 'uniform-set' | 'accessories' | string;
  price?: number;
  description?: string;
  materials_detail?: string;
  images: string[];
  is_published: boolean;
};

interface ProductFormProps {
  product?: LocalProduct | null;
  onFormSubmit: (saved: LocalProduct) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onFormSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<LocalProduct, 'id'>>({
    name: product?.name || "",
    notes: product?.notes || "",
    category: product?.category || "shirt",
    price: product?.price || 0,
    description: product?.description || "",
    materials_detail: product?.materials_detail || "",
    images: product?.images || [],
    is_published: product?.is_published ?? true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);
  const [isMaterialFocused, setIsMaterialFocused] = useState(false);
  const [promptFor, setPromptFor] = useState<'description'|'materials_detail'|null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mapping: images[0] sebagai sampul, sisanya adalah galeri
  const coverImage = formData.images[0] || '';
  const galleryImages = formData.images.slice(1);

  const handleUploadedCover = (urls: string[]) => {
    const url = urls[0];
    setFormData(prev => {
      const gallery = prev.images.slice(1);
      return { ...prev, images: url ? [url, ...gallery] : [...gallery] };
    });
  };

  const handleUploadedGallery = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
  };

  const removeCover = () => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.slice(1)
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index + 1)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, price: Number(formData.price) };
      onFormSubmit({
        ...(product || {}),
        ...payload,
        id: product?.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`),
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Gagal menyimpan produk!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Special formatting for price (IDR thousand separators)
    if (name === 'price') {
      const digits = value.replace(/[^0-9]/g, '');
      const num = Number(digits || '0');
      setFormData(prev => ({ ...prev, price: num }));
      (e.target as HTMLInputElement).value = new Intl.NumberFormat('id-ID').format(num);
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
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
      if (promptFor === 'description') setFormData(prev => ({ ...prev, description: text }));
      if (promptFor === 'materials_detail') setFormData(prev => ({ ...prev, materials_detail: text }));
      setPromptFor(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk *</label>
          <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Kemeja PDL Pro" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <Input name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g., Gathering Perusahaan X" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Kategori *</label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="shirt">Kemeja</SelectItem>
              <SelectItem value="jacket">Jaket</SelectItem>
              <SelectItem value="pants">Celana</SelectItem>
              <SelectItem value="uniform-set">Polo Shirt/Setelan</SelectItem>
              <SelectItem value="accessories">Aksesoris</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estimasi Harga (IDR)</label>
          <Input name="price" type="text" defaultValue={formData.price ? new Intl.NumberFormat('id-ID').format(Number(formData.price)) : ''} onChange={handleInputChange} placeholder="e.g., 150.000" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi Utama</label>
        <div className="relative">
          <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Deskripsi umum produk..." onFocus={()=>setIsDescFocused(true)} onBlur={()=>setIsDescFocused(false)} />
          <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>{ setPromptFor('description'); setAiPrompt(''); }} className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isDescFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Wand2 className="w-4 h-4"/>
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Detail Bahan</label>
        <div className="relative">
          <Textarea name="materials_detail" value={formData.materials_detail} onChange={handleInputChange} rows={4} placeholder="Jelaskan detail bahan yang digunakan..." onFocus={()=>setIsMaterialFocused(true)} onBlur={()=>setIsMaterialFocused(false)} />
          <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>{ setPromptFor('materials_detail'); setAiPrompt(''); }} className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isMaterialFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Wand2 className="w-4 h-4"/>
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gambar Sampul</label>
        <div className="space-y-4">
          {coverImage ? (
            <div className="relative w-40 aspect-square">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover rounded-md" />
              <button type="button" onClick={removeCover} className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
            </div>
          ) : null}
          <UploadDropzone 
            bucket="products"
            multiple={false}
            maxFiles={1}
            onUploaded={handleUploadedCover}
            label={coverImage ? "Ganti gambar sampul" : "Seret & lepas atau klik untuk unggah gambar sampul"}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gambar Tambahan</label>
        <div className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {galleryImages.map((image: string, index: number) => (
              <div key={index} className="relative group aspect-square">
                <img src={image} alt={`Galeri ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <UploadDropzone 
            bucket="products"
            multiple
            onUploaded={handleUploadedGallery}
            label="Seret & lepas atau klik untuk unggah gambar tambahan"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_published_product" checked={formData.is_published} onChange={(e) => setFormData(p => ({...p, is_published: e.target.checked}))} />
        <label htmlFor="is_published_product" className="text-sm">Tampilkan di website</label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving}>
          {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {product ? 'Update Produk' : 'Simpan Produk'}
        </Button>
      </div>

      {promptFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
            <div className="text-lg font-semibold mb-1">Buat {promptFor === 'description' ? 'Deskripsi Utama' : 'Detail Bahan'} dengan AI</div>
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
