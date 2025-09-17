import React, { useState, useEffect } from 'react';
import { AboutContent } from '@/entities/AboutContent';
import { Value } from '@/entities/Value';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Upload, Wand2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { uploadImageToStorage } from '@/lib/supabase/storage';
import { toast } from "sonner";
import * as LucideIcons from 'lucide-react';
import UploadDropzone from '@/components/admin/UploadDropzone';

// --- Form untuk Nilai-Nilai Kami ---
function ValueForm({ value, onFormSubmit, onCancel }: { value: Value | null, onFormSubmit: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: value?.title || "",
    description: value?.description || "",
    icon: value?.icon || "",
    order: value?.order || 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [iconType, setIconType] = useState<'lucide' | 'upload'>('lucide');
  const [selectedLucideIcon, setSelectedLucideIcon] = useState<string>('');
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [isDescFocused, setIsDescFocused] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize icon type based on existing value
  useEffect(() => {
    if (value?.icon) {
      if (value.icon.startsWith('lucide:')) {
        setIconType('lucide');
        setSelectedLucideIcon(value.icon.replace('lucide:', ''));
      } else {
        setIconType('upload');
      }
    }
  }, [value]);

  const handleValueIconUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData({ ...formData, icon: url })
    toast.success("Ikon berhasil diunggah.")
  };

  // Get available Lucide icons
  const getAvailableIcons = () => {
    // List of common Lucide icons - focused on business/company values
    const commonIcons = [
      // Core Values
      'Heart', 'Star', 'Shield', 'Award', 'Trophy', 'Target', 'Zap', 'Lightbulb',
      'Check', 'Lock', 'Unlock', 'Eye', 'EyeOff', 'ThumbsUp', 'ThumbsDown',
      
      // Business & Professional
      'Building', 'Building2', 'Briefcase', 'Users', 'User', 'UserCheck', 'UserPlus',
      'Handshake', 'HandHeart', 'HandCoins', 'TrendingUp', 'BarChart', 'PieChart',
      'DollarSign', 'CreditCard', 'Receipt', 'Calculator', 'Percent',
      
      // Communication & Service
      'MessageCircle', 'MessageSquare', 'Phone', 'Mail', 'MailOpen', 'Send',
      'Headphones', 'HeadphonesIcon', 'Mic', 'Video', 'Camera', 'Share',
      
      // Quality & Innovation
      'Gem', 'Crown', 'Medal', 'Badge', 'BadgeCheck', 'CheckCircle', 'CheckSquare',
      'Sparkles', 'Wand2', 'Rocket', 'Plane', 'Car', 'Ship', 'Train',
      
      // Technology & Digital
      'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'Database', 'Server', 'Cloud',
      'Wifi', 'Bluetooth', 'Cpu', 'HardDrive', 'MemoryStick', 'Router',
      
      // Growth & Development
      'ArrowUp', 'ArrowUpRight', 'ArrowUpLeft', 'TrendingUp', 'Activity', 'Pulse',
      'Heartbeat', 'Growth', 'Seedling', 'TreePine', 'Flower', 'Leaf',
      
      // Trust & Security
      'Shield', 'ShieldCheck', 'ShieldAlert', 'ShieldX', 'Lock', 'Key', 'Fingerprint',
      'Scan', 'ScanLine', 'QrCode', 'Barcode',
      
      // Time & Schedule
      'Clock', 'Timer', 'Calendar', 'CalendarDays', 'CalendarCheck', 'CalendarX',
      'AlarmClock', 'Stopwatch', 'Hourglass',
      
      // Location & Global
      'Globe', 'Map', 'MapPin', 'Navigation', 'Compass', 'Flag', 'FlagTriangleLeft',
      'World', 'Earth', 'Sun', 'Moon', 'Cloud', 'CloudRain', 'Wind',
      
      // Tools & Resources
      'Tool', 'Wrench', 'Hammer', 'Screwdriver', 'Cog', 'Settings', 'Sliders',
      'Filter', 'Search', 'SearchX', 'ZoomIn', 'ZoomOut',
      
      // Files & Documents
      'File', 'FileText', 'FileCheck', 'FileX', 'Folder', 'FolderOpen', 'Archive',
      'Book', 'BookOpen', 'Bookmark', 'Tag', 'Tags', 'Label',
      
      // Actions & Controls
      'Plus', 'Minus', 'X', 'Check', 'AlertCircle', 'AlertTriangle', 'Info',
      'HelpCircle', 'QuestionMarkCircle', 'ExternalLink', 'Link', 'Copy',
      
      // Shapes & Symbols
      'Circle', 'Square', 'Triangle', 'Hexagon', 'Diamond', 'Pentagon',
      'Cross', 'PlusCircle', 'MinusCircle', 'XCircle', 'CheckCircle'
    ];
    
    if (iconSearchTerm) {
      return commonIcons.filter(name => 
        name.toLowerCase().includes(iconSearchTerm.toLowerCase())
      );
    }
    
    return commonIcons;
  };

  const handleLucideIconSelect = (iconName: string) => {
    setSelectedLucideIcon(iconName);
    setFormData({ ...formData, icon: `lucide:${iconName}` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...formData, order: Number(formData.order), is_published: true };
    try {
      if (value) {
        await Value.update(value.id, payload);
      } else {
        await Value.create(payload);
      }
      onFormSubmit();
    } catch (e) {
       toast.error("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateWithGeminiForValue = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Masukkan prompt terlebih dahulu.');
      return;
    }
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string | undefined;
    if (!apiKey) {
      toast.error('API Key Gemini belum dikonfigurasi.');
      return;
    }
    setIsGenerating(true);
    try {
      let res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': String(apiKey) },
        body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
      });
      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
        });
      }
      if (!res.ok) throw new Error('Gagal memanggil Gemini');
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('Tidak ada teks');
      setFormData(prev => ({ ...prev, description: text }));
      toast.success('Deskripsi berhasil dihasilkan.');
      setIsPromptOpen(false);
    } catch (e) {
      toast.error('Gagal menghasilkan deskripsi.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Input name="title" placeholder="Judul (e.g., Kualitas)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      <div className="relative">
        <Textarea
          name="description"
          placeholder="Deskripsi singkat"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          onFocus={() => setIsDescFocused(true)}
          onBlur={() => setIsDescFocused(false)}
          required
        />
        <button
          type="button"
          aria-label="Buat deskripsi dengan AI"
          onMouseDown={(e)=> e.preventDefault()}
          onClick={() => setIsPromptOpen(true)}
          className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white text-gray-700 flex items-center justify-center transition-opacity ${isDescFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Wand2 className="w-4 h-4"/>
        </button>
      </div>
      
      {/* Icon Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Tipe Ikon</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="iconType"
              value="lucide"
              checked={iconType === 'lucide'}
              onChange={(e) => setIconType(e.target.value as 'lucide' | 'upload')}
              className="text-emerald-600"
            />
            <span className="text-sm">Icon Lucide React</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="iconType"
              value="upload"
              checked={iconType === 'upload'}
              onChange={(e) => setIconType(e.target.value as 'lucide' | 'upload')}
              className="text-emerald-600"
            />
            <span className="text-sm">Upload Gambar</span>
          </label>
        </div>
      </div>

      {/* Icon Selection */}
      {iconType === 'lucide' ? (
        <div className="space-y-3">
          {/* Selected Icon Preview */}
          {formData.icon && formData.icon.startsWith('lucide:') && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-10 h-10 p-2 bg-emerald-100 rounded-full flex items-center justify-center">
                {(() => {
                  const IconComponent = LucideIcons[formData.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any;
                  return IconComponent ? <IconComponent className="w-6 h-6 text-emerald-600" /> : null;
                })()}
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Icon Terpilih</p>
                <p className="text-xs text-emerald-600">{formData.icon.replace('lucide:', '')}</p>
              </div>
            </div>
          )}
          
          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Cari icon..."
              value={iconSearchTerm}
              onChange={(e) => setIconSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Icon Grid */}
          <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {getAvailableIcons().map((iconName) => {
                const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as any;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleLucideIconSelect(iconName)}
                    className={`p-3 rounded border hover:bg-gray-100 flex flex-col items-center gap-2 transition-colors ${
                      selectedLucideIcon === iconName ? 'bg-emerald-100 border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-emerald-600" />}
                    <span className="text-xs text-center leading-tight">{iconName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {formData.icon && !formData.icon.startsWith('lucide:') && (
            <img src={formData.icon} alt="icon" className="w-10 h-10 p-2 bg-gray-100 rounded-full object-contain"/>
          )}
          <div className="flex-1">
            <UploadDropzone 
              bucket="services"
              pathPrefix="about/values"
              multiple={false}
              onUploaded={handleValueIconUploaded}
              label="Seret & lepas atau klik untuk unggah ikon (SVG/PNG/JPEG)"
              accept="image/svg+xml,image/png,image/jpeg"
            />
          </div>
        </div>
      )}
      
      <Input name="order" type="number" placeholder="Urutan" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit" disabled={isSaving || isUploading} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan"}
        </Button>
      </div>
      {/* Prompt dialog for Value description */}
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Deskripsi Nilai dengan AI</DialogTitle>
            <DialogDescription>Contoh: "Tulis deskripsi singkat (1-2 paragraf) tentang komitmen kualitas"</DialogDescription>
          </DialogHeader>
          <Textarea rows={5} value={aiPrompt} onChange={(e)=>setAiPrompt(e.target.value)} placeholder="Tulis prompt Anda di sini..."/>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsPromptOpen(false)}>Batal</Button>
            <Button onClick={generateWithGeminiForValue} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Hasilkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}


export default function AboutPageManager() {
  const [story, setStory] = useState<{ id?: string, title: string, content: string, image_url: string }>({ title: "", content: "", image_url: "" });
  const [values, setValues] = useState<Value[]>([]);
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStoryFocused, setIsStoryFocused] = useState(false);
  
  const [isValueFormOpen, setIsValueFormOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Value | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<Value | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const storyData = await AboutContent.filter({ section: 'story' });
    if (storyData.length > 0) {
      const storyItem = storyData[0];
      setStory({
        id: storyItem.id,
        title: storyItem.title || "",
        content: storyItem.content || "",
        image_url: storyItem.image_url || ""
      });
    }

    const valuesData = await Value.list('order');
    setValues(valuesData);
  };
  
  const handleStoryUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setStory({ ...story, image_url: url })
    toast.success("Gambar berhasil diunggah.")
  };

  const handleSaveStory = async () => {
    setIsSavingStory(true);
    try {
      if (story.id) {
        await AboutContent.update(story.id, { ...story, section: 'story' });
      } else {
        await AboutContent.create({ ...story, section: 'story', is_active: true });
      }
      toast.success("Cerita perusahaan berhasil disimpan.");
      fetchData();
    } catch (e) {
      toast.error("Gagal menyimpan cerita perusahaan.");
    } finally {
      setIsSavingStory(false);
    }
  };

  const generateWithGemini = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Masukkan prompt terlebih dahulu.');
      return;
    }
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error('API Key Gemini belum dikonfigurasi. Tambahkan NEXT_PUBLIC_GEMINI_API_KEY di .env.local');
      return;
    }
    setIsGenerating(true);
    try {
      // Primary attempt: latest model with header auth
      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': String(apiKey) },
        body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
      });

      // Fallback to query-param auth or older model if needed
      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }]}] })
        });
      }

      if (!res.ok) throw new Error('Gagal memanggil Gemini');
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('Tidak ada teks yang dihasilkan');
      setStory(prev => ({ ...prev, content: text }));
      toast.success('Teks berhasil dihasilkan dan dimasukkan ke isi cerita.');
      setIsPromptOpen(false);
    } catch (err) {
      toast.error('Gagal menghasilkan teks. Cek API key/billing atau coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddValue = () => {
    setSelectedValue(null);
    setIsValueFormOpen(true);
  };

  const handleEditValue = (value: Value) => {
    setSelectedValue(value);
    setIsValueFormOpen(true);
  };

  const confirmDeleteValue = (value: Value) => {
    setValueToDelete(value);
    setIsConfirmOpen(true);
  };

  const handleDeleteValue = async () => {
    if (!valueToDelete) return;
    try {
      await Value.delete(valueToDelete.id);
      toast.success(`Nilai "${valueToDelete.title}" berhasil dihapus.`);
      fetchData();
    } catch (e) {
      toast.error("Gagal menghapus nilai.");
    } finally {
      setIsConfirmOpen(false);
      setValueToDelete(null);
    }
  };
  
  const handleToggleValuePublished = async (value: Value) => {
    try {
      await Value.update(value.id, { is_published: !value.is_published });
      toast.success(`Status nilai "${value.title}" berhasil diperbarui.`);
      fetchData();
    } catch (e) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const handleValueFormSuccess = () => {
    setIsValueFormOpen(false);
    fetchData();
    toast.success(selectedValue ? "Nilai berhasil diperbarui." : "Nilai baru berhasil ditambahkan.");
  };


  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 space-y-6">
      <header className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tentang Kami</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola cerita perusahaan dan nilai-nilai utama.</p>
      </header>
      {/* Story Section Manager */}
      <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Kelola Cerita Perusahaan</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input placeholder="Judul (e.g., Perjalanan Kami)" value={story.title} onChange={(e) => setStory({...story, title: e.target.value})} />
            <div className="space-y-3">
              <span className="text-sm text-gray-600">Isi cerita perusahaan</span>
              <div className="relative">
                <Textarea
                  placeholder="Isi cerita perusahaan..."
                  value={story.content}
                  onChange={(e) => setStory({...story, content: e.target.value})}
                  rows={10}
                  onFocus={() => setIsStoryFocused(true)}
                  onBlur={() => setIsStoryFocused(false)}
                />
                <button
                  type="button"
                  aria-label="Buat dengan AI"
                  onMouseDown={(e)=> e.preventDefault()}
                  onClick={() => setIsPromptOpen(true)}
                  className={`absolute right-2 top-2 h-9 w-9 rounded-full border shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 dark:border-gray-600 flex items-center justify-center transition-opacity ${isStoryFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <Wand2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
             <div className="w-full h-48 bg-gray-100 dark:bg-gray-700/60 rounded-md flex items-center justify-center">
                {story.image_url ? (
                  <img src={story.image_url} alt="preview" className="w-full h-full object-cover rounded-md"/>
                ) : (
                  <span className="text-gray-500">Pratinjau Gambar</span>
                )}
             </div>
            <UploadDropzone 
              bucket="uploads"
              pathPrefix="about/story"
              multiple={false}
              onUploaded={handleStoryUploaded}
              label="Seret & lepas atau klik untuk unggah gambar cerita"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveStory} disabled={isSavingStory || isUploadingStory} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">
            {isSavingStory ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan Cerita"}
          </Button>
        </div>
      </div>

      {/* Values Section Manager */}
      <div className="bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Kelola Nilai-Nilai Kami</h3>
          <Button onClick={handleAddValue} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" /> Tambah Nilai
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(v => (
            <div key={v.id} className="border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    {v.icon && v.icon.startsWith('lucide:') ? (
                      (() => {
                        const IconComponent = LucideIcons[v.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any;
                        return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
                      })()
                    ) : (
                      <img src={v.icon} alt={v.title} className="w-6 h-6 object-contain"/>
                    )}
                  </div>
                  <h4 className="font-bold flex-1">{v.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{v.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <Button variant="ghost" size="icon" onClick={() => handleToggleValuePublished(v)}>
                  {v.is_published ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditValue(v)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                  <Button size="sm" onClick={() => confirmDeleteValue(v)} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black"><Trash2 className="w-4 h-4 mr-1"/> Hapus</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Dialog open={isValueFormOpen} onOpenChange={setIsValueFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedValue ? "Edit Nilai" : "Tambah Nilai Baru"}</DialogTitle></DialogHeader>
          <ValueForm value={selectedValue} onFormSubmit={handleValueFormSuccess} onCancel={() => setIsValueFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Prompt Dialog for AI */}
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Cerita dengan AI</DialogTitle>
            <DialogDescription>Masukkan instruksi singkat. Contoh: "Tulis cerita perusahaan tentang komitmen kualitas dan layanan cepat (200 kata)"</DialogDescription>
          </DialogHeader>
          <Textarea rows={6} value={aiPrompt} onChange={(e)=>setAiPrompt(e.target.value)} placeholder="Tulis prompt Anda di sini..."/>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsPromptOpen(false)}>Batal</Button>
            <Button onClick={generateWithGemini} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Hasilkan' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>Yakin ingin menghapus nilai "{valueToDelete?.title}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button onClick={handleDeleteValue} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-black">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}