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
    section_name: '',
    title: '',
    content: '',
    image_url: '',
    is_published: true,
    sort_order: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        section_name: section.section_name || '',
        title: section.title || '',
        content: section.content || '',
        image_url: section.image_url || '',
        is_published: section.is_published ?? true,
        sort_order: Number(section.sort_order) || 0
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (section) {
        await AboutPage.update(section.id, formData as any);
        console.log("✅ [ABOUT PAGE FORM] About page section updated successfully");
      } else {
        await AboutPage.create(formData as any);
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


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="section_name">Nama Section</Label>
        <Input
          id="section_name"
          value={formData.section_name}
          onChange={(e) => handleInputChange('section_name', e.target.value)}
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
        <Label htmlFor="image_url">URL Gambar (opsional)</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleInputChange('image_url', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) => handleInputChange('is_published', checked)}
        />
        <Label htmlFor="is_published">Tampilkan di website</Label>
      </div>

      <div>
        <Label htmlFor="sort_order">Urutan</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => handleInputChange('sort_order', Number(e.target.value))}
          placeholder="0"
        />
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
