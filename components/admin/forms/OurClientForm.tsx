import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageToStorage } from "@/lib/supabase/storage";
import UploadDropzone from "@/components/admin/UploadDropzone";
import { OurClient } from "@/entities/OurClient";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OurClientFormProps {
  client?: OurClient | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function OurClientForm({ client, onFormSubmit, onCancel }: OurClientFormProps) {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    logo_url: client?.logo_url || "",
    is_published: client?.is_published ?? true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData({ ...formData, logo_url: url })
    toast.success("Logo berhasil diunggah.")
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (client) {
        await OurClient.update(client.id, formData);
      } else {
        await OurClient.create(formData);
      }
      onFormSubmit();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Gagal menyimpan klien.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nama Klien *</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nama perusahaan klien"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Logo Klien *</label>
        <div className="space-y-3">
          <UploadDropzone 
            bucket="clients"
            multiple={false}
            onUploaded={handleUploaded}
            label="Seret & lepas atau klik untuk unggah logo klien"
          />
          {formData.logo_url && (
            <div className="p-4 border rounded-md flex justify-center">
              <img src={formData.logo_url} alt="Logo preview" className="h-16 object-contain" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_published_client"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
        />
        <label htmlFor="is_published_client" className="text-sm">Tampilkan di website</label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving || isUploading}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {client ? 'Update Klien' : 'Simpan Klien'}
        </Button>
      </div>
    </form>
  );
}
