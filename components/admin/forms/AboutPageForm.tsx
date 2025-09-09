import React, { useState, useEffect } from 'react';
import { AboutPage } from '@/entities/AboutPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";

interface AboutPageFormProps {
  section?: AboutPage | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function AboutPageForm({ section, onFormSubmit, onCancel }: AboutPageFormProps) {
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    images: [] as string[],
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        section: section.section || '',
        title: section.title || '',
        content: section.content || '',
        images: section.images || [],
        is_active: section.is_active ?? true
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (section) {
        await AboutPage.update(section.id, formData);
        console.log("✅ [ABOUT PAGE FORM] About page section updated successfully");
      } else {
        await AboutPage.create(formData);
        console.log("✅ [ABOUT PAGE FORM] About page section created successfully");
      }
      onFormSubmit();
    } catch (error) {
      console.error("❌ [ABOUT PAGE FORM] Error:", error);
      toast.error("Gagal menyimpan section.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUrlAdd = (url: string) => {
    if (url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const handleImageUrlRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="section">Nama Section</Label>
        <Input
          id="section"
          value={formData.section}
          onChange={(e) => handleInputChange('section', e.target.value)}
          placeholder="Masukkan nama section (contoh: company-history, team, mission)"
          required
        />
      </div>

      <div>
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Masukkan judul section"
        />
      </div>

      <div>
        <Label htmlFor="content">Konten</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Masukkan konten section"
          rows={6}
        />
      </div>

      <div>
        <Label>Gambar Section</Label>
        <div className="space-y-2">
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={image}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index] = e.target.value;
                  handleInputChange('images', newImages);
                }}
                placeholder="URL gambar"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleImageUrlRemove(index)}
              >
                Hapus
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => handleImageUrlAdd('')}
          >
            Tambah Gambar
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Aktif</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? 'Menyimpan...' : (section ? 'Update' : 'Simpan')}
        </Button>
      </div>
    </form>
  );
}
