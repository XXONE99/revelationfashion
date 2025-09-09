import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X, Trash2 } from 'lucide-react';

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
  const [isUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files[0];
    if (!file) return;
    // Dummy upload: pakai Object URL lokal
    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{post ? 'Edit Post' : 'Tambah Post Baru'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Judul *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul post"
              required
            />
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
            <Textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Ringkasan singkat post..."
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Konten *</label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Tulis konten lengkap post..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gambar</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
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
        </form>
      </CardContent>
    </Card>
  );
}
