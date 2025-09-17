import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X, Trash2, Wand2 } from 'lucide-react';
import UploadDropzone from '@/components/admin/UploadDropzone';

type LocalPost = {
  id: string;
  title: string;
  category: 'Jacket' | 'Shirt' | 'Uniform' | string;
  content: string;
  excerpt?: string;
  images: string[];
  is_published: boolean;
};

interface ProjectPostFormProps {
  post?: LocalPost | null;
  onFormSubmit: (saved: LocalPost) => void;
  onCancel: () => void;
}

export default function ProjectPostForm({ post, onFormSubmit, onCancel }: ProjectPostFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    category: (post?.category as LocalPost['category']) || 'Jacket',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    images: post?.images || [] as string[],
    is_published: post?.is_published ?? true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isExcerptFocused, setIsExcerptFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [promptFor, setPromptFor] = useState<'title'|'excerpt'|'content'|null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Konvensi: images[0] = sampul, sisanya galeri
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
    setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
  };

  const removeCover = () => {
    setFormData(prev => ({ ...prev, images: prev.images.slice(1) }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index + 1) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved: LocalPost = {
        ...(post || {}),
        ...formData,
        id: post?.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`),
      } as LocalPost;
      onFormSubmit(saved);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openPrompt = (field: 'title'|'excerpt'|'content') => {
    setPromptFor(field);
    setAiPrompt('');
  };

  const generateWithGemini = async () => {
    if (!promptFor) return;
    if (!aiPrompt.trim()) return;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string | undefined;
    if (!apiKey) return;
    setIsGenerating(true);
    try {
      let res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': String(apiKey) },
        body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
      });
      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
        });
      }
      if (!res.ok) throw new Error('Gemini error');
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (promptFor === 'title') setFormData(p => ({ ...p, title: text }));
      if (promptFor === 'excerpt') setFormData(p => ({ ...p, excerpt: text }));
      if (promptFor === 'content') setFormData(p => ({ ...p, content: text }));
      setPromptFor(null);
    } catch (e) {
      // no-op minimal feedback in this form
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Judul *</label>
            <div className="relative">
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul post"
              className="pr-12"
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
              required
            />
            <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>openPrompt('title')} className={`absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isTitleFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Wand2 className="w-4 h-4"/>
            </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as LocalPost['category']})}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jacket">Jacket</SelectItem>
                <SelectItem value="Shirt">Shirt</SelectItem>
                <SelectItem value="Uniform">Uniform</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ringkasan</label>
            <div className="relative">
            <Textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Ringkasan singkat post..."
              rows={2}
              onFocus={() => setIsExcerptFocused(true)}
              onBlur={() => setIsExcerptFocused(false)}
            />
            <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>openPrompt('excerpt')} className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isExcerptFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Wand2 className="w-4 h-4"/>
            </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Konten *</label>
            <div className="relative">
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Tulis konten lengkap post..."
              rows={6}
              onFocus={() => setIsContentFocused(true)}
              onBlur={() => setIsContentFocused(false)}
              required
            />
            <button type="button" aria-label="AI" onMouseDown={(e)=>e.preventDefault()} onClick={()=>openPrompt('content')} className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isContentFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Wand2 className="w-4 h-4"/>
            </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gambar Sampul</label>
            <div className="space-y-3">
              {coverImage ? (
                <div className="relative w-40 aspect-square">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={removeCover} className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : null}
              <UploadDropzone 
                bucket="projects"
                multiple={false}
                maxFiles={1}
                onUploaded={handleUploadedCover}
                label={coverImage ? "Ganti gambar sampul" : "Seret & lepas atau klik untuk unggah gambar sampul"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gambar Tambahan</label>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Galeri ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <UploadDropzone 
                bucket="projects"
                multiple
                onUploaded={handleUploadedGallery}
                label="Seret & lepas atau klik untuk unggah gambar tambahan"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            <label htmlFor="is_published" className="text-sm">Tampilkan di website</label>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {post ? 'Update' : 'Simpan'}
            </Button>
          </div>
          {/* Simple prompt modal */}
          {promptFor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
                <div className="text-lg font-semibold mb-1">Buat {promptFor === 'title' ? 'Judul' : promptFor === 'excerpt' ? 'Ringkasan' : 'Konten'} dengan AI</div>
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
