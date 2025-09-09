import React, { useState, useEffect } from 'react';
import { OurClient } from '@/entities/OurClient';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import OurClientForm from '../forms/OurClientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function OurClientManager() {
  const [clients, setClients] = useState<OurClient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<OurClient | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<OurClient | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const data = await OurClient.list();
    setClients(data);
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: OurClient) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const confirmDelete = (client: OurClient) => {
    setClientToDelete(client);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    try {
      await OurClient.delete(clientToDelete.id);
      toast.success(`Klien "${clientToDelete.name}" berhasil dihapus.`);
      fetchClients();
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error("Gagal menghapus klien.");
    } finally {
      setIsConfirmOpen(false);
      setClientToDelete(null);
    }
  };

  const handleTogglePublished = async (client: OurClient) => {
    try {
      await OurClient.update(client.id, { is_published: !client.is_published });
      toast.success(`Status klien "${client.name}" berhasil diperbarui.`);
      fetchClients();
    } catch (error) {
      console.error("Failed to update client status:", error);
      toast.error("Gagal memperbarui status klien.");
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchClients();
    toast.success(selectedClient ? "Klien berhasil diperbarui." : "Klien baru berhasil ditambahkan.");
  };

  // ... (keep loading and empty state JSX)
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Klien Kami</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Klien
        </Button>
      </div>
      
      {clients.length === 0 ? (
         <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada klien</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Klien Pertama
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-shadow">
            <img src={client.logo_url} alt={client.name} className="h-16 w-full object-contain mb-3"/>
            <h4 className="font-semibold text-sm truncate w-full">{client.name}</h4>
            <div className="flex justify-between items-center mt-3 w-full">
              <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(client)}>
                {client.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
              </Button>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => handleEdit(client)}><Edit className="w-4 h-4"/></Button>
                <Button size="icon" onClick={() => confirmDelete(client)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Trash2 className="w-4 h-4"/></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClient ? "Edit Klien" : "Tambah Klien Baru"}</DialogTitle>
          </DialogHeader>
          <OurClientForm client={selectedClient} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus klien "{clientToDelete?.name}"?
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
