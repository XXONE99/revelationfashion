import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ProjectPostForm from '../forms/ProjectPostForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProjectPostManager() {
  type LocalPost = {
    id: string;
    title: string;
    category: 'Jacket' | 'Shirt' | 'Uniform' | string;
    content: string;
    excerpt?: string;
    images: string[];
    is_published: boolean;
  };

  const [posts, setPosts] = useState<LocalPost[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<LocalPost | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<LocalPost | null>(null);

  useEffect(() => {
    // Seed dummy posts
    const seed: LocalPost[] = [
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-p1`,
        title: 'Produksi Jaket Bomber PT XYZ',
        category: 'Jacket',
        content: 'Pembuatan jaket bomber untuk event perusahaan.',
        excerpt: 'Jaket bomber bordir logo untuk karyawan.',
        images: ['/premium-black-bomber-jacket-with-company-logo.jpg'],
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-p2`,
        title: 'Seragam Polo Bank ABC',
        category: 'Shirt',
        content: 'Produksi polo shirt untuk frontliner.',
        excerpt: 'Bahan nyaman dan breathable.',
        images: ['/corporate-polo-shirts-various-colors-with-embroide.jpg'],
        is_published: true,
      },
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-p3`,
        title: 'Seragam Pabrik Setelan',
        category: 'Uniform',
        content: 'Setelan seragam industri standar keselamatan.',
        excerpt: 'Drill premium, kuat dan tahan lama.',
        images: ['/modern-textile-factory-with-workers-and-sewing-mac.jpg'],
        is_published: false,
      },
    ];
    setPosts(seed);
  }, []);

  const fetchPosts = async () => {
    // No-op for dummy mode
    return;
  };

  const handleAdd = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: LocalPost) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const confirmDelete = (post: LocalPost) => {
    setPostToDelete(post);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
    toast.success(`Post "${postToDelete.title}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setPostToDelete(null);
  };

  const handleTogglePublished = async (post: LocalPost) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_published: !p.is_published } : p));
    toast.success(`Status post "${post.title}" berhasil diperbarui.`);
  };

  const handleFormSuccess = (saved: LocalPost) => {
    setPosts(prev => {
      const exists = prev.some(p => p.id === saved.id);
      if (exists) return prev.map(p => (p.id === saved.id ? saved : p));
      return [saved, ...prev];
    });
    setIsFormOpen(false);
    toast.success(selectedPost ? "Post berhasil diperbarui." : "Post baru berhasil ditambahkan.");
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Client & Proyek</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola postingan klien dan proyek Anda.</p>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
       <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Kelola Client & Proyek</h3>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Post
        </Button>
      </div>

      {posts.length === 0 ? (
         <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">Belum ada post</p>
          <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Post Pertama
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const imageUrl = post.images && post.images.length > 0 ? post.images[0] : "/placeholder-300.png";
          return (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <img src={imageUrl} alt={post.title} className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h4 className="font-bold truncate">{post.title}</h4>
                <p className="text-sm text-gray-500 capitalize">{post.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(post)}>
                    {post.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                    <Button size="sm" onClick={() => confirmDelete(post)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
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
            <DialogTitle>{selectedPost ? "Edit Post" : "Tambah Post Baru"}</DialogTitle>
          </DialogHeader>
          <ProjectPostForm post={selectedPost} onFormSubmit={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus post "{postToDelete?.title}"?
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
