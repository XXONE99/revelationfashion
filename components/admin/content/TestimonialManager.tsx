import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import TestimonialForm from '@/components/admin/forms/TestimonialForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TestimonialManager() {
  type LocalTestimonial = {
    id: string;
    client_name: string;
    company?: string;
    position?: string;
    testimonial: string;
    avatar_url?: string;
    rating?: number;
    is_published: boolean;
  };

  const [testimonials, setTestimonials] = useState<LocalTestimonial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<LocalTestimonial | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<LocalTestimonial | null>(null);

  useEffect(() => {
    // Seed dummy data lokal
    const seed: LocalTestimonial[] = [
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-t1`,
        client_name: 'Andi Pratama',
        company: 'PT Maju Jaya',
        position: 'Manager Operasional',
        testimonial: 'Kualitas jahitan rapi dan pengiriman tepat waktu. Sangat rekomendasi!',
        avatar_url: '/professional-man-in-white-shirt-smiling.jpg',
        rating: 5,
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-t2`,
        client_name: 'Siti Lestari',
        company: 'CV Prima',
        position: 'HRD',
        testimonial: 'Seragam nyaman dipakai dan sesuai brief. Komunikasi responsif.',
        avatar_url: '/placeholder-user.jpg',
        rating: 4,
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-t3`,
        client_name: 'Budi Santoso',
        company: 'Astra',
        position: 'Supervisor',
        testimonial: 'Material berkualitas dan harga kompetitif.',
        avatar_url: '/professional-man-in-corporate-uniform-smiling.jpg',
        rating: 5,
        is_published: false,
      },
    ];
    setTestimonials(seed);
  }, []);

  const fetchTestimonials = async () => {
    // No-op untuk mode dummy
    return;
  };

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setIsFormOpen(true);
  };

  const handleEdit = (testimonial: LocalTestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const confirmDelete = (testimonial: LocalTestimonial) => {
    setTestimonialToDelete(testimonial);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete.id));
    toast.success(`Testimoni dari "${testimonialToDelete.client_name}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setTestimonialToDelete(null);
  };

  const handleTogglePublished = async (testimonial: LocalTestimonial) => {
    setTestimonials(prev => prev.map(t => t.id === testimonial.id ? { ...t, is_published: !t.is_published } : t));
    toast.success(`Status testimoni dari "${testimonial.client_name}" berhasil diperbarui.`);
  };

  const handleFormSuccess = (saved: LocalTestimonial) => {
    setTestimonials(prev => {
      const exists = prev.some(t => t.id === saved.id);
      if (exists) return prev.map(t => (t.id === saved.id ? saved : t));
      return [saved, ...prev];
    });
    setIsFormOpen(false);
    toast.success(selectedTestimonial ? "Testimoni berhasil diperbarui." : "Testimoni baru berhasil ditambahkan.");
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Testimoni</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola testimoni klien yang tampil di website.</p>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Testimoni</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Testimoni
        </Button>
      </div>

      {testimonials.length === 0 ? (
         <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada testimoni</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Testimoni Pertama
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={testimonial.avatar_url || `https://ui-avatars.com/api/?name=${testimonial.client_name}&background=random`} alt={testimonial.client_name} className="w-12 h-12 rounded-full"/>
                <div>
                  <h4 className="font-bold">{testimonial.client_name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">"{testimonial.testimonial}"</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(testimonial)}>
                {testimonial.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                <Button size="sm" onClick={() => confirmDelete(testimonial)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTestimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}</DialogTitle>
          </DialogHeader>
          <TestimonialForm testimonial={selectedTestimonial} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus testimoni dari "{testimonialToDelete?.client_name}"?
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
