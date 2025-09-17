import React, { useState, useEffect } from 'react';
import { HeroSlide } from '@/entities/HeroSlide';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import HeroSlideForm from '@/components/admin/forms/HeroSlideForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function HeroSlideManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const data = await HeroSlide.list('order');
    setSlides(data);
  };

  const handleAdd = () => {
    setSelectedSlide(null);
    setIsFormOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsFormOpen(true);
  };

  const confirmDelete = (slide: HeroSlide) => {
    setSlideToDelete(slide);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!slideToDelete) return;
    try {
      await HeroSlide.delete(slideToDelete.id);
      toast.success(`Slide "${slideToDelete.title}" berhasil dihapus.`);
      fetchSlides();
    } catch (error) {
      console.error("Failed to delete slide:", error);
      toast.error("Gagal menghapus slide.");
    } finally {
      setIsConfirmOpen(false);
      setSlideToDelete(null);
    }
  };

  // Drag & Drop handlers
  const onDragStart = (index: number) => {
    setDragIndex(index)
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    setDropIndex(index)
  }
  const onDrop = async (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null); setDropIndex(null); return
    }
    const updated = [...slides]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    // Optimistic update
    setSlides(updated)
    setDragIndex(null); setDropIndex(null)
    // Persist new order
    setIsReordering(true)
    try {
      await Promise.all(updated.map((s, i) => HeroSlide.update(s.id, { order: i } as any)))
      toast.success('Urutan slide diperbarui')
    } catch (e) {
      toast.error('Gagal menyimpan urutan, memuat ulang daftar')
      fetchSlides()
    } finally {
      setIsReordering(false)
    }
  }

  const handleTogglePublished = async (slide: HeroSlide) => {
    try {
      await HeroSlide.update(slide.id, { is_published: !slide.is_published });
      toast.success(`Status slide "${slide.title}" berhasil diperbarui.`);
      fetchSlides();
    } catch (error) {
      console.error("Failed to update slide status:", error);
      toast.error("Gagal memperbarui status slide.");
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchSlides();
    toast.success(selectedSlide ? "Slide berhasil diperbarui." : "Slide baru berhasil ditambahkan.");
  };

  // ... (keep loading and empty state JSX)

  return (
    <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Hero Slides</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Slide
        </Button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Seret kartu ke posisi yang diinginkan. Notifikasi akan muncul setelah urutan tersimpan.</p>

       {slides.length === 0 ? (
         <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada slide</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Slide Pertama
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 ${dragIndex === index ? 'ring-2 ring-emerald-500' : ''} ${dropIndex === index && dragIndex !== null && dragIndex !== index ? 'outline outline-2 outline-emerald-400' : ''}`}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={() => onDrop(index)}
            title="Seret untuk mengubah urutan"
          >
            <img src={slide.image_url} alt={slide.title} className="w-full h-48 object-cover"/>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h4 className="font-bold truncate">{slide.title}</h4>
              <p className="text-sm truncate">{slide.subtitle}</p>
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" className="bg-white/80 hover:bg-white text-gray-800" onClick={() => handleTogglePublished(slide)}>
                {slide.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
              </Button>
              <Button size="icon" className="bg-white/80 hover:bg-white text-gray-800" onClick={() => handleEdit(slide)}><Edit className="w-4 h-4"/></Button>
              <Button size="icon" onClick={() => confirmDelete(slide)} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"><Trash2 className="w-4 h-4"/></Button>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 rounded px-2 py-0.5">#{index+1}</div>
          </div>
        ))}
      </div>
      )}

      {isReordering && (
        <div className="mt-3 text-sm text-gray-500">Menyimpan urutan...</div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSlide ? "Edit Slide" : "Tambah Slide Baru"}</DialogTitle>
          </DialogHeader>
          <HeroSlideForm slide={selectedSlide} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus slide "{slideToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button onClick={handleDelete} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
