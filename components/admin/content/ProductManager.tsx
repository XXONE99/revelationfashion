import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ProductForm from '../forms/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProductManager() {
  type LocalProduct = {
    id: string;
    name: string;
    description?: string;
    notes?: string;
    category: 'shirt' | 'jacket' | 'pants' | 'uniform-set' | 'accessories' | string;
    images: string[];
    price?: number;
    materials_detail?: string;
    is_published: boolean;
  };

  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<LocalProduct | null>(null);

  useEffect(() => {
    // Seed data dummy lokal (tanpa koneksi Supabase)
    const seed: LocalProduct[] = [
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-1`,
        name: 'Premium Black Bomber Jacket',
        notes: 'Gathering PT Maju Jaya',
        category: 'jacket',
        description: 'Bomber premium dengan bordir logo perusahaan.',
        images: ['/premium-black-bomber-jacket-with-company-logo.jpg'],
        price: 350000,
        materials_detail: 'Bahan parasut premium, furing, zipper YKK.',
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-2`,
        name: 'Corporate Polo Shirt',
        notes: 'Seragam kantor warna solid',
        category: 'shirt',
        description: 'Polo shirt nyaman untuk kebutuhan seragam kantor.',
        images: ['/corporate-polo-shirts-various-colors-with-embroide.jpg'],
        price: 120000,
        materials_detail: 'Lacoste CVC, bordir logo.',
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-3`,
        name: 'Uniform Set Pabrik',
        notes: 'Setelan lengkap atasan & celana',
        category: 'uniform-set',
        description: 'Setelan seragam lengkap untuk kebutuhan industri.',
        images: ['/modern-textile-factory-with-workers-and-sewing-mac.jpg'],
        price: 450000,
        materials_detail: 'Drill premium, jahitan rantai, saku fungsional.',
        is_published: false,
      },
    ];
    setProducts(seed);
  }, []);

  const fetchProducts = async () => {
    // Dengan data dummy, cukup no-op agar tetap kompatibel dengan alur
    return;
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: LocalProduct) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const confirmDelete = (product: LocalProduct) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    // Hapus dari state lokal
    setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast.success(`Produk "${productToDelete.name}" berhasil dihapus.`);
      setIsConfirmOpen(false);
      setProductToDelete(null);
  };

  const handleTogglePublished = async (product: LocalProduct) => {
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: !p.is_published } : p));
      toast.success(`Status produk "${product.name}" berhasil diperbarui.`);
  };

  const handleFormSuccess = (saved: LocalProduct) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === saved.id);
      if (exists) {
        return prev.map(p => (p.id === saved.id ? saved : p));
      }
      return [saved, ...prev];
    });
    setIsFormOpen(false);
    toast.success(selectedProduct ? "Produk berhasil diperbarui." : "Produk baru berhasil ditambahkan.");
  };


  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Portofolio</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola daftar produk/portofolio yang tampil di website.</p>
      </header>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Portofolio</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada produk</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Produk Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/placeholder-300.png";
            return (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h4 className="font-bold truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(product)} title={product.is_published ? 'Sembunyikan' : 'Tampilkan'}>
                      {product.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                      <Button size="sm" onClick={() => confirmDelete(product)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
          </DialogHeader>
          <ProductForm product={selectedProduct} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus produk "{productToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
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
