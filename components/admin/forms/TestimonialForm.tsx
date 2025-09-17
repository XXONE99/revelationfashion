import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Upload, Wand2 } from "lucide-react";
import { uploadImageToStorage } from "@/lib/supabase/storage";
import UploadDropzone from "@/components/admin/UploadDropzone";
import { getInitialsFromName } from "@/lib/utils";

type LocalTestimonial = {
  id: string;
  client_name: string;
  company?: string;
  position?: string;
  testimonial: string;
  avatar_url?: string;
  rating?: number;
  is_published: boolean;
};

interface TestimonialFormProps {
  testimonial?: LocalTestimonial | null;
  onFormSubmit: (saved: LocalTestimonial) => void;
  onCancel: () => void;
}

export default function TestimonialForm({ testimonial, onFormSubmit, onCancel }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    client_name: testimonial?.client_name || "",
    company: testimonial?.company || "",
    position: testimonial?.position || "",
    testimonial: testimonial?.testimonial || "",
    avatar_url: testimonial?.avatar_url || "",
    rating: testimonial?.rating || 5,
    is_published: testimonial?.is_published ?? true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTestimonialFocused, setIsTestimonialFocused] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAvatarUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData(prev => ({ ...prev, avatar_url: url }))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved: LocalTestimonial = {
        ...(testimonial || {}),
        ...formData,
        id: testimonial?.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`),
      } as LocalTestimonial;
      onFormSubmit(saved);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateWithGemini = async () => {
    if (!aiPrompt.trim()) return;
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
      setFormData(prev => ({ ...prev, testimonial: text }));
      setIsPromptOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Klien *</label>
              <Input
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Perusahaan *</label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="PT. Contoh Perusahaan"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Jabatan</label>
            <Input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="CEO, Manager, dll"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar (URL)</label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  placeholder="https://... (opsional, atau unggah file)"
                />
                <div className="min-w-[260px]">
                  <UploadDropzone 
                    bucket="testimonials"
                    multiple={false}
                    onUploaded={handleAvatarUploaded}
                    label="Seret & lepas atau klik untuk unggah avatar"
                  />
                </div>
              </div>
              <div className="mt-2">
                {formData.avatar_url && /^https?:\/\//i.test(formData.avatar_url) ? (
                  <img src={formData.avatar_url} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
                    {getInitialsFromName(formData.client_name)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <Select value={String(formData.rating)} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">⭐ (1)</SelectItem>
                <SelectItem value="2">⭐⭐ (2)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Testimoni *</label>
            <div className="relative">
              <Textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                placeholder="Tulis testimoni klien..."
                rows={4}
                onFocus={()=>setIsTestimonialFocused(true)}
                onBlur={()=>setIsTestimonialFocused(false)}
                required
              />
              <button
                type="button"
                aria-label="Buat testimoni dengan AI"
                onMouseDown={(e)=>e.preventDefault()}
                onClick={()=>setIsPromptOpen(true)}
                className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isTestimonialFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <Wand2 className="w-4 h-4"/>
              </button>
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
              {testimonial ? 'Update' : 'Simpan'}
            </Button>
          </div>

          {isPromptOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
                <div className="text-lg font-semibold mb-1">Buat Testimoni dengan AI</div>
                <div className="text-sm text-gray-500 mb-3">Contoh: "Testimoni 2-3 kalimat tentang layanan konveksi yang cepat dan berkualitas"</div>
                <Textarea rows={5} value={aiPrompt} onChange={(e)=>setAiPrompt(e.target.value)} placeholder="Tulis prompt Anda di sini..."/>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={()=>setIsPromptOpen(false)}>Batal</Button>
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
