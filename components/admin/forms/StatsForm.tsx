import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stats } from "@/entities/Stats";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

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
    icon: stat?.icon || "Users",
    order: stat?.order || 0,
    is_published: stat?.is_published ?? true
  });
  const [isSaving, setIsSaving] = useState(false);

  const iconOptions = [
    { value: "Users", label: "Users (👥)" },
    { value: "Package", label: "Package (📦)" },
    { value: "ShoppingCart", label: "Shopping Cart (🛒)" },
    { value: "CheckSquare", label: "Check Square (✅)" }
  ];

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
        toast.success("Statistik berhasil diperbarui.");
      } else {
        await Stats.create(payload);
        toast.success("Statistik baru berhasil disimpan.");
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{stat ? 'Edit Statistik' : 'Tambah Statistik Baru'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
              type="number"
              value={formData.value}
              onChange={handleInputChange}
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

          <div>
            <label className="block text-sm font-medium mb-2">Icon *</label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Urutan</label>
            <Input
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
              placeholder="0"
            />
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
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {stat ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
