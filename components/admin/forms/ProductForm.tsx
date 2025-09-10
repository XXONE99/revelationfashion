import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToStorage } from "@/lib/supabase/storage";

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    const files: File[] = fileList ? Array.from(fileList) : [];
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImageToStorage({ bucket: "products", file, pathPrefix: "" });
        uploadedUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Satu atau lebih gambar gagal diunggah!");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <Input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="e.g., 150000" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi Utama</label>
        <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Deskripsi umum produk..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Detail Bahan</label>
        <Textarea name="materials_detail" value={formData.materials_detail} onChange={handleInputChange} rows={4} placeholder="Jelaskan detail bahan yang digunakan..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gambar Produk</label>
        <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {formData.images.map((image: string, index: number) => (
              <div key={index} className="relative group aspect-square">
                <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <label htmlFor="image-upload-product" className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-center bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
            {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...</> : <><Upload className="w-4 h-4" /> Unggah Gambar</>}
          </label>
          <input id="image-upload-product" type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="hidden" multiple />
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
    </form>
  );
}
