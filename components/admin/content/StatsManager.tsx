import React, { useState, useEffect } from 'react';
import { Stats } from '@/entities/Stats';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import StatsForm from '@/components/admin/forms/StatsForm';
import { DeleteModalWrapper } from '@/components/ui/delete-modal-wrapper';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import * as LucideIcons from 'lucide-react';

export default function StatsManager() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<Stats | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const data = await Stats.list('order');
    setStats(data);
  };

  const handleAdd = () => {
    setSelectedStat(null);
    setIsFormOpen(true);
  };

  const handleEdit = (stat: Stats) => {
    setSelectedStat(stat);
    setIsFormOpen(true);
  };

  const handleDelete = async (stat: Stats) => {
    try {
      await Stats.delete(stat.id);
      fetchStats();
    } catch (error) {
      console.error("Failed to delete stat:", error);
      throw error;
    }
  };

  const handleTogglePublished = async (stat: Stats) => {
    try {
      await Stats.update(stat.id, { is_published: !stat.is_published });
      toast.success(`Status statistik "${stat.title}" berhasil diperbarui.`);
      fetchStats();
    } catch (error) {
      console.error("Failed to update stat status:", error);
      toast.error("Gagal memperbarui status statistik.");
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchStats();
    toast.success(selectedStat ? "Statistik berhasil diperbarui." : "Statistik baru berhasil ditambahkan.");
  };

  // ... (keep loading and empty state JSX)
  // Drag & Drop handlers
  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => { e.preventDefault(); setDropIndex(index); };
  const onDrop = async (index: number) => {
    if (dragIndex === null || dragIndex === index) { setDragIndex(null); setDropIndex(null); return; }
    const updated = [...stats];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setStats(updated); // optimistic
    setDragIndex(null); setDropIndex(null);
    setIsReordering(true);
    try {
      await Promise.all(updated.map((s, i) => Stats.update(s.id, { order: i } as any)));
      toast.success('Urutan statistik diperbarui');
    } catch (e) {
      toast.error('Gagal menyimpan urutan, memuat ulang');
      fetchStats();
    } finally {
      setIsReordering(false);
    }
  };
  
  return (
    <DeleteModalWrapper>
      {(openDeleteModal) => (
        <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Kelola Statistik</h3>
            <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Statistik
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Seret kartu ke posisi yang diinginkan. Notifikasi akan muncul setelah urutan tersimpan.</p>

      {stats.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada statistik</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Statistik Pertama
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          return (
            <div
              key={stat.id}
              className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 ${dragIndex === index ? 'ring-2 ring-emerald-500' : ''} ${dropIndex === index && dragIndex !== null && dragIndex !== index ? 'outline outline-2 outline-emerald-400' : ''}`}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={() => onDrop(index)}
              title="Seret untuk mengubah urutan"
            >
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {stat.icon && stat.icon.startsWith('lucide:') ? (
                      (() => {
                        const IconComponent = LucideIcons[stat.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any;
                        return IconComponent ? <IconComponent className="w-8 h-8 text-emerald-600" /> : <Users className="w-8 h-8 text-emerald-600" />;
                      })()
                    ) : stat.icon ? (
                      <img src={stat.icon} alt={stat.title} className="w-8 h-8 object-contain"/>
                    ) : (
                      <Users className="w-8 h-8 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl">{stat.value}{stat.suffix}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(stat)}>
                  {stat.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(stat)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                  <Button 
                    size="sm" 
                    onClick={() => openDeleteModal(stat.title, "statistik", () => handleDelete(stat))} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"
                  >
                    <Trash2 className="w-4 h-4 mr-1"/> Hapus
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
          )}

          {isReordering && (
            <div className="mt-3 text-sm text-gray-500">Menyimpan urutan...</div>
          )}

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedStat ? "Edit Statistik" : "Tambah Statistik Baru"}</DialogTitle>
              </DialogHeader>
              <StatsForm stat={selectedStat} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </DeleteModalWrapper>
  );
}
