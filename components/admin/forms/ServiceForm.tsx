import React, { useState } from 'react';
import { Service } from '@/entities/Service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import { UploadFile } from '@/integrations/Core';
import { toast } from "sonner";

interface ServiceFormProps {
  service?: Service | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onFormSubmit, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    icon: service?.icon || "",
    order: service?.order || 0,
    is_published: service?.is_published ?? true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'image/svg+xml') {
      toast.error("Harap unggah file dengan format SVG.");
      return;
    }
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData({ ...formData, icon: file_url });
      toast.success("Ikon berhasil diunggah.");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Gagal mengunggah ikon.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, order: Number(formData.order) };
      if (service) {
        await Service.update(service.id, payload);
        toast.success("Layanan berhasil diperbarui.");
      } else {
        await Service.create(payload);
        toast.success("Layanan baru berhasil disimpan.");
      }
      onFormSubmit();
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error("Gagal menyimpan layanan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Judul Layanan (e.g., Desain Custom)"
        value={formData.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <Textarea
        placeholder="Deskripsi layanan..."
        value={formData.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
        rows={3}
        required
      />

      <div className="flex items-center gap-4">
        {formData.icon && (
          <img src={formData.icon} alt="icon" className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
        )}
        <label htmlFor="icon-upload" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
          Unggah Ikon (SVG)
        </label>
        <input id="icon-upload" type="file" accept=".svg" className="hidden" onChange={handleIconUpload} />
      </div>

      <Input
        type="number"
        placeholder="Urutan tampil"
        value={formData.order}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, order: Number(e.target.value)})}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
        />
        <label htmlFor="is_published" className="text-sm">Tampilkan di website</label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isSaving || isUploading} className="bg-emerald-600 hover:bg-emerald-700">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {service ? 'Update' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
