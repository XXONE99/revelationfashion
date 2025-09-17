import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import TestimonialForm from '@/components/admin/forms/TestimonialForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

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
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Gagal memuat testimoni');
      return;
    }
    const mapped: LocalTestimonial[] = (data || []).map((row: any) => ({
      id: row.id,
      client_name: row.client_name,
      company: row.company_name || '',
      position: row.position || '',
      testimonial: row.testimonial_text || '',
      avatar_url: row.avatar_url || '',
      rating: row.rating ?? 5,
      is_published: !!row.is_published,
    }));
    setTestimonials(mapped);
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
    const supabase = createClient();
    const { error } = await supabase.from('testimonials').delete().eq('id', testimonialToDelete.id);
    if (error) {
      toast.error('Gagal menghapus testimoni');
      return;
    }
    await fetchTestimonials();
    toast.success(`Testimoni dari "${testimonialToDelete.client_name}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setTestimonialToDelete(null);
  };

  const handleTogglePublished = async (testimonial: LocalTestimonial) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('testimonials')
      .update({ is_published: !testimonial.is_published })
      .eq('id', testimonial.id);
    if (error) {
      toast.error('Gagal memperbarui status');
      return;
    }
    await fetchTestimonials();
    toast.success(`Status testimoni dari "${testimonial.client_name}" berhasil diperbarui.`);
  };

  const handleFormSuccess = async (saved: LocalTestimonial) => {
    const supabase = createClient();
    if (selectedTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update({
          client_name: saved.client_name,
          company_name: saved.company,
          position: saved.position,
          testimonial_text: saved.testimonial,
          avatar_url: saved.avatar_url,
          rating: saved.rating,
          is_published: saved.is_published,
        })
        .eq('id', selectedTestimonial.id);
      if (error) {
        toast.error('Gagal memperbarui testimoni');
        return;
      }
      toast.success('Testimoni berhasil diperbarui.');
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          client_name: saved.client_name,
          company_name: saved.company,
          position: saved.position,
          testimonial_text: saved.testimonial,
          avatar_url: saved.avatar_url,
          rating: saved.rating,
          is_published: saved.is_published,
        });
      if (error) {
        toast.error('Gagal menambahkan testimoni');
        return;
      }
      toast.success('Testimoni baru berhasil ditambahkan.');
    }
    setIsFormOpen(false);
    setSelectedTestimonial(null);
    await fetchTestimonials();
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Testimoni</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola testimoni klien yang tampil di website.</p>
      </header>
      <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
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
          <div key={testimonial.id} className="border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {testimonial.avatar_url && /^https?:\/\//i.test(testimonial.avatar_url) ? (
                  <img src={testimonial.avatar_url} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover"/>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-semibold">
                    {testimonial.client_name?.split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold">{testimonial.client_name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{testimonial.testimonial}"</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(testimonial)}>
                {testimonial.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                <Button size="sm" onClick={() => confirmDelete(testimonial)} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
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
            <Button onClick={handleDelete} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
