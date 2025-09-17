import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ProjectPostForm from '../forms/ProjectPostForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

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
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('project_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Gagal memuat post');
      return;
    }
    setPosts((data || []) as unknown as LocalPost[]);
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
    const supabase = createClient();
    const { error } = await supabase.from('project_posts').delete().eq('id', postToDelete.id);
    if (error) {
      toast.error('Gagal menghapus post');
      return;
    }
    await fetchPosts();
    toast.success(`Post "${postToDelete.title}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setPostToDelete(null);
  };

  const handleTogglePublished = async (post: LocalPost) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('project_posts')
      .update({ is_published: !post.is_published })
      .eq('id', post.id);
    if (error) {
      toast.error('Gagal memperbarui status');
      return;
    }
    await fetchPosts();
    toast.success(`Status post "${post.title}" berhasil diperbarui.`);
  };

  const handleFormSuccess = async (saved: LocalPost) => {
    const supabase = createClient();
    if (selectedPost) {
      const { error } = await supabase
        .from('project_posts')
        .update({
          title: saved.title,
          excerpt: saved.excerpt,
          content: saved.content,
          category: saved.category?.toLowerCase(),
          images: saved.images,
          is_published: saved.is_published,
        })
        .eq('id', selectedPost.id);
      if (error) {
        toast.error('Gagal memperbarui post');
        return;
      }
      toast.success('Post berhasil diperbarui.');
    } else {
      const { error } = await supabase
        .from('project_posts')
        .insert({
          title: saved.title,
          excerpt: saved.excerpt,
          content: saved.content,
          category: saved.category?.toLowerCase(),
          images: saved.images,
          is_published: saved.is_published,
        });
      if (error) {
        toast.error('Gagal menambahkan post');
        return;
      }
      toast.success('Post baru berhasil ditambahkan.');
    }
    setIsFormOpen(false);
    setSelectedPost(null);
    await fetchPosts();
  };

  
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Client & Proyek</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola postingan klien dan proyek Anda.</p>
      </header>
      <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
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
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40">
              <img src={imageUrl} alt={post.title} className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h4 className="font-bold truncate">{post.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{post.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="ghost" size="icon" onClick={() => handleTogglePublished(post)}>
                    {post.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                    <Button size="sm" onClick={() => confirmDelete(post)} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
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
            <Button onClick={handleDelete} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
