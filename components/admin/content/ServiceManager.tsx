import React, { useState, useEffect } from 'react';
import { Service } from '@/entities/Service';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ServiceForm from '../forms/ServiceForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import * as LucideIcons from 'lucide-react';

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const data = await Service.list('order');
    setServices(data);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const confirmDelete = (service: Service) => {
    setServiceToDelete(service);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await Service.delete(serviceToDelete.id);
      toast.success(`Layanan "${serviceToDelete.title}" berhasil dihapus.`);
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Gagal menghapus layanan.");
    } finally {
      setIsConfirmOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleTogglePublished = async (service: Service) => {
    try {
      await Service.update(service.id, { is_published: !service.is_published });
      toast.success(`Status layanan "${service.title}" berhasil diperbarui.`);
      fetchServices();
    } catch (error) {
      console.error("Failed to update service status:", error);
      toast.error("Gagal memperbarui status layanan.");
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchServices();
    toast.success(selectedService ? "Layanan berhasil diperbarui." : "Layanan baru berhasil ditambahkan.");
  };
  // Drag & Drop handlers
  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => { e.preventDefault(); setDropIndex(index); };
  const onDrop = async (index: number) => {
    if (dragIndex === null || dragIndex === index) { setDragIndex(null); setDropIndex(null); return; }
    const updated = [...services];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setServices(updated);
    setDragIndex(null); setDropIndex(null);
    setIsReordering(true);
    try {
      await Promise.all(updated.map((s, i) => Service.update(s.id, { order: i } as any)));
      toast.success('Urutan layanan diperbarui');
    } catch (e) {
      toast.error('Gagal menyimpan urutan, memuat ulang');
      fetchServices();
    } finally {
      setIsReordering(false);
    }
  };

  // ... (keep loading and empty state JSX)

  return (
    <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Layanan (Mengapa Memilih Kami)</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Seret kartu ke posisi yang diinginkan. Notifikasi akan muncul setelah urutan tersimpan.</p>

      {services.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada layanan</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Layanan Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 ${dragIndex === index ? 'ring-2 ring-emerald-500' : ''} ${dropIndex === index && dragIndex !== null && dragIndex !== index ? 'outline outline-2 outline-emerald-400' : ''}`}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={() => onDrop(index)}
              title="Seret untuk mengubah urutan"
            >
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    {service.icon.startsWith('lucide:') ? (
                      (() => {
                        const IconComponent = LucideIcons[service.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any;
                        return IconComponent ? <IconComponent className="w-6 h-6 text-emerald-600" /> : <Eye className="w-6 h-6 text-emerald-600" />;
                      })()
                    ) : (
                      <img src={service.icon} alt={service.title} className="w-6 h-6 object-contain"/>
                    )}
                  </div>
                  <h4 className="font-bold flex-1">{service.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(service)}>
                  {service.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                  <Button size="sm" onClick={() => confirmDelete(service)} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
                </div>
              </div>
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
            <DialogTitle>{selectedService ? "Edit Layanan" : "Tambah Layanan Baru"}</DialogTitle>
          </DialogHeader>
          <ServiceForm service={selectedService} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus layanan "{serviceToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button onClick={handleDelete} className="bg-emerald-600 hover:bg-emerald-700 text-white">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
