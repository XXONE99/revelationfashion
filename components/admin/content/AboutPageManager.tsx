import React, { useState, useEffect } from 'react';
import { AboutContent } from '@/entities/AboutContent';
import { Value } from '@/entities/Value';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { uploadImageToStorage } from '@/lib/supabase/storage';
import { toast } from "sonner";

// --- Form untuk Nilai-Nilai Kami ---
function ValueForm({ value, onFormSubmit, onCancel }: { value: Value | null, onFormSubmit: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: value?.title || "",
    description: value?.description || "",
    icon: value?.icon || "",
    order: value?.order || 0,
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
      const url = await uploadImageToStorage({ bucket: 'services', file, pathPrefix: 'about/values' });
      setFormData({ ...formData, icon: url });
      toast.success("Ikon berhasil diunggah.");
    } catch(e) {
      toast.error("Gagal mengunggah ikon.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...formData, order: Number(formData.order), is_published: true };
    try {
      if (value) {
        await Value.update(value.id, payload);
      } else {
        await Value.create(payload);
      }
      onFormSubmit();
    } catch (e) {
       toast.error("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Input name="title" placeholder="Judul (e.g., Kualitas)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      <Textarea name="description" placeholder="Deskripsi singkat" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
      <div className="flex items-center gap-4">
        {formData.icon && <img src={formData.icon} alt="icon" className="w-10 h-10 p-2 bg-gray-100 rounded-full"/>}
        <label htmlFor="icon-upload-value" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} Unggah Ikon (SVG)
        </label>
        <input id="icon-upload-value" type="file" accept=".svg" className="hidden" onChange={handleIconUpload} />
      </div>
      <Input name="order" type="number" placeholder="Urutan" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan"}
        </Button>
      </div>
    </form>
  );
}


export default function AboutPageManager() {
  const [story, setStory] = useState<{ id?: string, title: string, content: string, image_url: string }>({ title: "", content: "", image_url: "" });
  const [values, setValues] = useState<Value[]>([]);
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  
  const [isValueFormOpen, setIsValueFormOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Value | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<Value | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const storyData = await AboutContent.filter({ section: 'story' });
    if (storyData.length > 0) {
      const storyItem = storyData[0];
      setStory({
        id: storyItem.id,
        title: storyItem.title || "",
        content: storyItem.content || "",
        image_url: storyItem.image_url || ""
      });
    }

    const valuesData = await Value.list('order');
    setValues(valuesData);
  };
  
  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingStory(true);
    try {
      const url = await uploadImageToStorage({ bucket: 'uploads', file, pathPrefix: 'about/story' });
      setStory({ ...story, image_url: url });
      toast.success("Gambar berhasil diunggah.");
    } catch(e) {
      toast.error("Gagal mengunggah gambar.");
    } finally {
      setIsUploadingStory(false);
    }
  };

  const handleSaveStory = async () => {
    setIsSavingStory(true);
    try {
      if (story.id) {
        await AboutContent.update(story.id, { ...story, section: 'story' });
      } else {
        await AboutContent.create({ ...story, section: 'story', is_active: true });
      }
      toast.success("Cerita perusahaan berhasil disimpan.");
      fetchData();
    } catch (e) {
      toast.error("Gagal menyimpan cerita perusahaan.");
    } finally {
      setIsSavingStory(false);
    }
  };

  const handleAddValue = () => {
    setSelectedValue(null);
    setIsValueFormOpen(true);
  };

  const handleEditValue = (value: Value) => {
    setSelectedValue(value);
    setIsValueFormOpen(true);
  };

  const confirmDeleteValue = (value: Value) => {
    setValueToDelete(value);
    setIsConfirmOpen(true);
  };

  const handleDeleteValue = async () => {
    if (!valueToDelete) return;
    try {
      await Value.delete(valueToDelete.id);
      toast.success(`Nilai "${valueToDelete.title}" berhasil dihapus.`);
      fetchData();
    } catch (e) {
      toast.error("Gagal menghapus nilai.");
    } finally {
      setIsConfirmOpen(false);
      setValueToDelete(null);
    }
  };
  
  const handleToggleValuePublished = async (value: Value) => {
    try {
      await Value.update(value.id, { is_published: !value.is_published });
      toast.success(`Status nilai "${value.title}" berhasil diperbarui.`);
      fetchData();
    } catch (e) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const handleValueFormSuccess = () => {
    setIsValueFormOpen(false);
    fetchData();
    toast.success(selectedValue ? "Nilai berhasil diperbarui." : "Nilai baru berhasil ditambahkan.");
  };


  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-8">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tentang Kami</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola cerita perusahaan dan nilai-nilai utama.</p>
      </header>
      {/* Story Section Manager */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Kelola Cerita Perusahaan</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input placeholder="Judul (e.g., Perjalanan Kami)" value={story.title} onChange={(e) => setStory({...story, title: e.target.value})} />
            <Textarea placeholder="Isi cerita perusahaan..." value={story.content} onChange={(e) => setStory({...story, content: e.target.value})} rows={10} />
          </div>
          <div className="space-y-4">
             <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                {story.image_url ? (
                  <img src={story.image_url} alt="preview" className="w-full h-full object-cover rounded-md"/>
                ) : (
                  <span className="text-gray-500">Pratinjau Gambar</span>
                )}
             </div>
             <label htmlFor="story-image-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
                {isUploadingStory ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} Unggah Gambar
             </label>
             <input id="story-image-upload" type="file" accept="image/*" className="hidden" onChange={handleStoryImageUpload} />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveStory} disabled={isSavingStory || isUploadingStory}>
            {isSavingStory ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan Cerita"}
          </Button>
        </div>
      </div>

      {/* Values Section Manager */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Kelola Nilai-Nilai Kami</h3>
          <Button onClick={handleAddValue} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" /> Tambah Nilai
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(v => (
            <div key={v.id} className="border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <img src={v.icon} alt={v.title} className="w-6 h-6"/>
                  </div>
                  <h4 className="font-bold flex-1">{v.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{v.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <Button variant="ghost" size="icon" onClick={() => handleToggleValuePublished(v)}>
                  {v.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditValue(v)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                  <Button size="sm" onClick={() => confirmDeleteValue(v)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Dialog open={isValueFormOpen} onOpenChange={setIsValueFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedValue ? "Edit Nilai" : "Tambah Nilai Baru"}</DialogTitle></DialogHeader>
          <ValueForm value={selectedValue} onFormSubmit={handleValueFormSuccess} onCancel={() => setIsValueFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>Yakin ingin menghapus nilai "{valueToDelete?.title}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button onClick={handleDeleteValue} className="bg-emerald-600 hover:bg-emerald-700 text-white">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}