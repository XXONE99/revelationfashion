import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ColorCatalogForm from '../forms/ColorCatalogForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

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
    // Seed dummy lokal
    const seed: LocalCatalog[] = [
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-c1`,
        title: 'Katalog Warna Polo Shirt',
        description: 'Warna-warna populer untuk bahan polo shirt.',
        cover_image_url: '/polo-shirt-color-catalog-various-colors.jpg',
        images: ['/placeholder-8s19j.png', '/placeholder-q46hn.png', '/placeholder-03gdr.png'],
        type: 'color',
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-c2`,
        title: 'Size Chart Varsity Jacket',
        description: 'Panduan ukuran lengkap untuk varsity.',
        cover_image_url: '/red-and-white-varsity-jacket-size-chart.jpg',
        images: [],
        type: 'size_chart',
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-c3`,
        title: 'Size Chart Bomber Jacket',
        description: 'Detail ukuran bomber jacket.',
        cover_image_url: '/detailed-red-and-white-varsity-jacket-size-chart.jpg',
        images: [],
        type: 'size_chart',
        is_published: false,
      },
    ];
    setCatalogs(seed);
  }, []);

  const fetchCatalogs = async () => {
    // No-op untuk dummy mode
    return;
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
    setCatalogs(prev => prev.filter(c => c.id !== catalogToDelete.id));
    toast.success(`Katalog "${catalogToDelete.title}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setCatalogToDelete(null);
  };

  const handleTogglePublished = async (catalog: LocalCatalog) => {
    setCatalogs(prev => prev.map(c => c.id === catalog.id ? { ...c, is_published: !c.is_published } : c));
    toast.success(`Status katalog "${catalog.title}" berhasil diperbarui.`);
  };

  const handleFormSuccess = (saved: LocalCatalog) => {
    setCatalogs(prev => {
      const exists = prev.some(c => c.id === saved.id);
      if (exists) return prev.map(c => (c.id === saved.id ? saved : c));
      return [saved, ...prev];
    });
    setIsFormOpen(false);
    toast.success(selectedCatalog ? "Katalog berhasil diperbarui." : "Katalog baru berhasil ditambahkan.");
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Katalog Warna</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola katalog warna dan size chart.</p>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
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
          <div key={catalog.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <img src={catalog.cover_image_url || "/placeholder-300.png"} alt={catalog.title} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h4 className="font-bold truncate">{catalog.title}</h4>
              <p className="text-sm text-gray-500 capitalize">{catalog.type === 'color' ? 'Katalog Warna' : 'Size Chart'}</p>
              <div className="flex justify-between items-center mt-4">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(catalog)}>
                  {catalog.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(catalog)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                  <Button size="sm" onClick={() => confirmDelete(catalog)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
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
            <Button onClick={handleDelete} className="bg-emerald-600 hover:bg-emerald-700 text-white">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
