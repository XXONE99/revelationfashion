import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageToStorage } from "@/lib/supabase/storage";
import UploadDropzone from "@/components/admin/UploadDropzone";
import { HeroSlide } from "@/entities/HeroSlide";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface HeroSlideFormProps {
  slide?: HeroSlide | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function HeroSlideForm({ slide, onFormSubmit, onCancel }: HeroSlideFormProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    image_url: slide?.image_url || "",
    button_text: slide?.button_text || "",
    button_link: slide?.button_link || "",
    order: slide?.order || 0,
    is_published: slide?.is_published ?? true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData({ ...formData, image_url: url })
    toast.success("Gambar berhasil diunggah.")
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (slide) {
        await HeroSlide.update(slide.id, formData);
      } else {
        await HeroSlide.create(formData);
      }
      onFormSubmit();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Gagal menyimpan slide.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Judul *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul slide"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <Textarea
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Masukkan subtitle slide"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gambar *</label>
            <div className="space-y-3">
              <UploadDropzone 
                bucket="hero"
                multiple={false}
                onUploaded={handleUploaded}
                label="Seret & lepas atau klik untuk unggah gambar slide"
              />
              {formData.image_url && (
                <div className="relative inline-block">
                  <img src={formData.image_url} alt="Preview" className="w-32 h-20 object-cover rounded" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teks Tombol</label>
            <Input
              name="button_text"
              value={formData.button_text}
              onChange={handleInputChange}
              placeholder="Lihat Produk, Hubungi Kami, dll"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Link Tombol</label>
            <Input
              name="button_link"
              value={formData.button_link}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Urutan</label>
            <Input
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
              placeholder="0"
            />
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
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving || isUploading}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {slide ? 'Update' : 'Simpan'}
            </Button>
          </div>
    </form>
  );
}

