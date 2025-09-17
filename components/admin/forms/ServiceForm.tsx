import React, { useState, useEffect } from 'react';
import { Service } from '@/entities/Service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Wand2 } from 'lucide-react';
import { uploadImageToStorage } from '@/lib/supabase/storage';
import { toast } from "sonner";
import * as LucideIcons from 'lucide-react';
import UploadDropzone from '@/components/admin/UploadDropzone';
import { createClient } from '@/lib/supabase/client';

interface ServiceFormProps {
  service?: Service | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onFormSubmit, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    icon: service?.icon || "",
    order: service?.order || 0,
    is_published: service?.is_published ?? true
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

  // Prefill order otomatis saat create
  useEffect(() => {
    const prefillOrder = async () => {
      if (service) return; // Skip jika edit
      const supabase = createClient();
      const { data: last } = await supabase
        .from('services')
        .select('sort_order')
        .not('sort_order', 'is', null)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      let nextOrder = ((last as any)?.sort_order ?? -1) + 1;
      if (nextOrder === 0) {
        const { data: all } = await supabase.from('services').select('id');
        nextOrder = (all?.length ?? 0);
      }
      setFormData(prev => ({ ...prev, order: nextOrder }));
    };
    prefillOrder();
  }, [service]);

  // Initialize icon type based on existing value
  useEffect(() => {
    if (service?.icon) {
      if (service.icon.startsWith('lucide:')) {
        setIconType('lucide');
        setSelectedLucideIcon(service.icon.replace('lucide:', ''));
      } else {
        setIconType('upload');
      }
    }
  }, [service]);

  // Get available Lucide icons
  const getAvailableIcons = () => {
    // List of common Lucide icons - focused on services/business
    const commonIcons = [
      // Core Services
      'Users', 'User', 'UserCheck', 'UserPlus', 'UserX', 'Users2', 'UserCog',
      'Package', 'Package2', 'PackageCheck', 'PackageX', 'Box', 'Boxes',
      'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign', 'Receipt',
      'CheckSquare', 'CheckCircle', 'Check', 'X', 'XCircle', 'AlertCircle',
      
      // Business & Professional
      'Building', 'Building2', 'Briefcase', 'Handshake', 'TrendingUp', 'TrendingDown',
      'BarChart', 'BarChart3', 'PieChart', 'LineChart', 'Activity', 'Pulse',
      'Target', 'Aim', 'Crosshair', 'Zap', 'Lightbulb', 'Rocket',
      
      // Quality & Achievement
      'Award', 'Trophy', 'Medal', 'Crown', 'Star', 'Heart', 'ThumbsUp',
      'Shield', 'ShieldCheck', 'Lock', 'Key', 'Badge', 'BadgeCheck',
      
      // Technology & Digital
      'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'Database', 'Server', 'Cloud',
      'Wifi', 'Bluetooth', 'Cpu', 'HardDrive', 'MemoryStick', 'Router',
      
      // Growth & Development
      'ArrowUp', 'ArrowUpRight', 'ArrowUpLeft', 'ArrowDown', 'ArrowRight', 'ArrowLeft',
      'Growth', 'Seedling', 'TreePine', 'Flower', 'Leaf', 'Sun', 'Moon',
      
      // Communication & Service
      'MessageCircle', 'MessageSquare', 'Phone', 'Mail', 'MailOpen', 'Send',
      'Headphones', 'Mic', 'Video', 'Camera', 'Share',
      
      // Time & Schedule
      'Clock', 'Timer', 'Calendar', 'CalendarDays', 'CalendarCheck', 'CalendarX',
      'AlarmClock', 'Stopwatch', 'Hourglass',
      
      // Location & Global
      'Globe', 'Map', 'MapPin', 'Navigation', 'Compass', 'Flag', 'World',
      'Earth', 'Sun', 'Cloud', 'CloudRain', 'Wind',
      
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

  const handleIconUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData({ ...formData, icon: url })
    toast.success("Ikon berhasil diunggah.")
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, order: Number(formData.order) };
      if (service) {
        await Service.update(service.id, payload);
      } else {
        // Auto-increment order: ambil terbesar lalu +1
        const supabase = createClient();
        const { data: last } = await supabase
          .from('services')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        const nextOrder = ((last as any)?.sort_order ?? -1) + 1;
        await Service.create({ ...payload, order: nextOrder });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error("Gagal menyimpan layanan");
    } finally {
      setIsSaving(false);
    }
  };

  const generateWithGemini = async () => {
    if (!aiPrompt.trim()) return toast.error("Masukkan prompt terlebih dahulu.");
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string | undefined;
    if (!apiKey) return toast.error('API Key Gemini belum dikonfigurasi.');
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
      if (!res.ok) throw new Error('Gemini error');
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('No text');
      setFormData(prev => ({ ...prev, description: text }));
      toast.success('Deskripsi layanan berhasil dihasilkan.');
      setIsPromptOpen(false);
    } catch (e) {
      toast.error('Gagal menghasilkan deskripsi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Judul Layanan (e.g., Desain Custom)"
        value={formData.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <div className="relative">
        <Textarea
          placeholder="Deskripsi layanan..."
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
          rows={3}
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
        <label className="block text-sm font-medium">Tipe Ikon *</label>
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
              pathPrefix="icons"
              multiple={false}
              onUploaded={handleIconUploaded}
              label="Seret & lepas atau klik untuk unggah ikon (PNG/SVG/JPG)"
              accept=".png,.svg,.jpg,.jpeg"
            />
          </div>
        </div>
      )}

      <Input
        type="number"
        placeholder="Auto saat tambah"
        value={formData.order}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, order: Number(e.target.value)})}
        disabled={!!service}
      />
      {service ? <p className="text-xs text-gray-500">Urutan dikunci saat edit. Gunakan drag & drop untuk mengubah posisi.</p> : <p className="text-xs text-gray-500">Diisi otomatis ke posisi terakhir saat menyimpan.</p>}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
        />
        <label htmlFor="is_published" className="text-sm">Tampilkan di website</label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isSaving || isUploading} className="bg-emerald-600 hover:bg-emerald-700">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {service ? 'Update' : 'Simpan'}
        </Button>
      </div>

      {/* Prompt dialog for Service description */}
      <div className={`${isPromptOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
            <div className="text-lg font-semibold mb-1">Buat Deskripsi Layanan dengan AI</div>
            <div className="text-sm text-gray-500 mb-3">Tulis instruksi singkat. Contoh: "Deskripsi 1 paragraf untuk layanan konveksi cepat dan berkualitas"</div>
            <Textarea rows={5} value={aiPrompt} onChange={(e)=>setAiPrompt(e.target.value)} placeholder="Tulis prompt Anda di sini..."/>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={()=>setIsPromptOpen(false)}>Batal</Button>
              <Button onClick={generateWithGemini} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Hasilkan'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
