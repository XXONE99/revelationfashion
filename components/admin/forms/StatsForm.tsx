import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stats } from "@/entities/Stats";
import { Loader2, Upload } from "lucide-react";
import { uploadImageToStorage } from '@/lib/supabase/storage';
import { toast } from "sonner";
import * as LucideIcons from 'lucide-react';
import UploadDropzone from '@/components/admin/UploadDropzone';
import { createClient } from '@/lib/supabase/client';

interface StatsFormProps {
  stat?: Stats | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function StatsForm({ stat, onFormSubmit, onCancel }: StatsFormProps) {
  const [formData, setFormData] = useState({
    title: stat?.title || "",
    value: stat?.value || 0,
    suffix: stat?.suffix || "",
    icon: stat?.icon || "",
    order: stat?.order || 0,
    is_published: stat?.is_published ?? true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [iconType, setIconType] = useState<'lucide' | 'upload'>('lucide');
  const [selectedLucideIcon, setSelectedLucideIcon] = useState<string>('');
  const [iconSearchTerm, setIconSearchTerm] = useState('');

  // Prefill order otomatis saat create
  useEffect(() => {
    const prefillOrder = async () => {
      if (stat) return; // Skip jika edit
      const supabase = createClient();
      const { data: last } = await supabase
        .from('stats')
        .select('sort_order')
        .not('sort_order', 'is', null)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      let nextOrder = ((last as any)?.sort_order ?? -1) + 1;
      if (nextOrder === 0) {
        const { data: all } = await supabase.from('stats').select('id');
        nextOrder = (all?.length ?? 0);
      }
      setFormData(prev => ({ ...prev, order: nextOrder }));
    };
    prefillOrder();
  }, [stat]);

  // Initialize icon type based on existing value
  useEffect(() => {
    if (stat?.icon) {
      if (stat.icon.startsWith('lucide:')) {
        setIconType('lucide');
        setSelectedLucideIcon(stat.icon.replace('lucide:', ''));
      } else {
        setIconType('upload');
      }
    }
  }, [stat]);

  const handleIconUploaded = (urls: string[]) => {
    const url = urls[0]
    if (!url) return
    setFormData({ ...formData, icon: url })
    toast.success("Ikon berhasil diunggah.")
  };

  // Get available Lucide icons
  const getAvailableIcons = () => {
    // List of common Lucide icons - focused on statistics/business metrics
    const commonIcons = [
      // Core Statistics
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        value: String(formData.value),
        order: Number(formData.order)
      };
      if (stat) {
        await Stats.update(stat.id, payload);
      } else {
        // Auto-increment order
        const supabase = createClient();
        const { data: last } = await supabase
          .from('stats')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        const nextOrder = ((last as any)?.sort_order ?? -1) + 1;
        await Stats.create({ ...payload, order: nextOrder });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Gagal menyimpan statistik.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Judul *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Client, Project, Orders, dll"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nilai *</label>
            <Input
              name="value"
              type="text"
              value={new Intl.NumberFormat('id-ID').format(Number(formData.value || 0))}
              onChange={(e)=>{
                const digits = e.target.value.replace(/[^0-9]/g,'');
                setFormData({...formData, value: Number(digits || '0')});
              }}
              placeholder="77"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Suffix</label>
            <Input
              name="suffix"
              value={formData.suffix}
              onChange={handleInputChange}
              placeholder="+ atau % (opsional)"
            />
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
                  pathPrefix="stats/icons"
                  multiple={false}
                  onUploaded={handleIconUploaded}
                  label="Seret & lepas atau klik untuk unggah ikon (SVG/PNG/JPEG)"
                  accept="image/svg+xml,image/png,image/jpeg"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Urutan</label>
            <Input
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
              placeholder="Auto saat tambah"
              disabled={!!stat}
            />
            {stat ? <p className="text-xs text-gray-500 mt-1">Urutan dikunci saat edit. Gunakan drag & drop untuk mengubah posisi.</p> : <p className="text-xs text-gray-500 mt-1">Diisi otomatis ke posisi terakhir saat menyimpan.</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            <label htmlFor="is_published" className="text-sm">Tampilkan di website</label>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving || isUploading}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {stat ? 'Update' : 'Simpan'}
            </Button>
          </div>
    </form>
  );
}
