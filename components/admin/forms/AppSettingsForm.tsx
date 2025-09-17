import React, { useState, useEffect } from 'react';
import { AppSettings } from '@/entities/AppSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

interface AppSettingsFormProps {
  setting?: AppSettings | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

export default function AppSettingsForm({ setting, onFormSubmit, onCancel }: AppSettingsFormProps) {
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (setting) {
      setFormData({
        key: setting.key || '',
        value: setting.value || '',
        description: setting.description || ''
      });
    }
  }, [setting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (setting) {
        await AppSettings.update(setting.id, formData);
        console.log("✅ [APP SETTINGS FORM] App setting updated successfully");
      } else {
        await AppSettings.create(formData);
        console.log("✅ [APP SETTINGS FORM] App setting created successfully");
      }
      onFormSubmit();
    } catch (error) {
      console.error("❌ [APP SETTINGS FORM] Error:", error);
      toast.error("Gagal menyimpan setting.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="key">Key Setting</Label>
        <Input
          id="key"
          value={formData.key}
          onChange={(e) => handleInputChange('key', e.target.value)}
          placeholder="Masukkan key setting (contoh: company_name, phone, email)"
          required
        />
      </div>

      <div>
        <Label htmlFor="value">Value Setting</Label>
        <Textarea
          id="value"
          value={formData.value}
          onChange={(e) => handleInputChange('value', e.target.value)}
          placeholder="Masukkan value setting"
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Masukkan deskripsi setting (opsional)"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? 'Menyimpan...' : (setting ? 'Update' : 'Simpan')}
        </Button>
      </div>
    </form>
  );
}
