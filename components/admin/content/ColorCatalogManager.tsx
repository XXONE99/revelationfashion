import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ColorCatalogForm from '../forms/ColorCatalogForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ColorCatalogManager() {
  type LocalCatalog = {
    id: string;
    title: string;
    cover_image_url?: string;
    images: string[];
    description?: string;
    type: 'color' | 'size_chart' | string;
    is_published: boolean;
  };

  const [catalogs, setCatalogs] = useState<LocalCatalog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<LocalCatalog | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState<LocalCatalog | null>(null);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('color_catalogs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Gagal memuat katalog');
      return;
    }
    setCatalogs((data || []) as unknown as LocalCatalog[]);
  };

  const handleAdd = () => {
    setSelectedCatalog(null);
    setIsFormOpen(true);
  };

  const handleEdit = (catalog: LocalCatalog) => {
    setSelectedCatalog(catalog);
    setIsFormOpen(true);
  };

  const confirmDelete = (catalog: LocalCatalog) => {
    setCatalogToDelete(catalog);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!catalogToDelete) return;
    const supabase = createClient();
    const { error } = await supabase.from('color_catalogs').delete().eq('id', catalogToDelete.id);
    if (error) {
      toast.error('Gagal menghapus katalog');
      return;
    }
    await fetchCatalogs();
    toast.success(`Katalog "${catalogToDelete.title}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setCatalogToDelete(null);
  };

  const handleTogglePublished = async (catalog: LocalCatalog) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('color_catalogs')
      .update({ is_published: !catalog.is_published })
      .eq('id', catalog.id);
    if (error) {
      toast.error('Gagal memperbarui status');
      return;
    }
    await fetchCatalogs();
    toast.success(`Status katalog "${catalog.title}" berhasil diperbarui.`);
  };

  const handleFormSuccess = async (saved: LocalCatalog) => {
    const supabase = createClient();
    if (selectedCatalog) {
      const { error } = await supabase
        .from('color_catalogs')
        .update({
          title: saved.title,
          description: saved.description,
          cover_image_url: saved.cover_image_url,
          images: saved.images,
          type: saved.type,
          is_published: saved.is_published,
        })
        .eq('id', selectedCatalog.id);
      if (error) {
        toast.error('Gagal memperbarui katalog');
        return;
      }
      toast.success('Katalog berhasil diperbarui.');
    } else {
      const { error } = await supabase
        .from('color_catalogs')
        .insert({
          title: saved.title,
          description: saved.description,
          cover_image_url: saved.cover_image_url,
          images: saved.images,
          type: saved.type,
          is_published: saved.is_published,
        });
      if (error) {
        toast.error('Gagal menambahkan katalog');
        return;
      }
      toast.success('Katalog baru berhasil ditambahkan.');
    }
    setIsFormOpen(false);
    setSelectedCatalog(null);
    await fetchCatalogs();
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Katalog Warna</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola katalog warna dan size chart.</p>
      </header>
      <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
       <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Katalog Warna & Size Chart</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Katalog
        </Button>
      </div>

       {catalogs.length === 0 ? (
         <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada katalog</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Katalog Pertama
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {catalogs.map((catalog) => (
          <div key={catalog.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40">
            <img src={catalog.cover_image_url || "/placeholder-300.png"} alt={catalog.title} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h4 className="font-bold truncate">{catalog.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{catalog.type === 'color' ? 'Katalog Warna' : 'Size Chart'}</p>
              <div className="flex justify-between items-center mt-4">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(catalog)}>
                  {catalog.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(catalog)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                  <Button size="sm" onClick={() => confirmDelete(catalog)} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCatalog ? "Edit Katalog" : "Tambah Katalog Baru"}</DialogTitle>
          </DialogHeader>
          <ColorCatalogForm catalog={selectedCatalog} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus katalog "{catalogToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button onClick={handleDelete} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
