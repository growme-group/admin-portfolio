import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Service } from '@/types/schema';
import { servicesApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Boxes, Plus, Edit, Trash2, Globe, ShoppingCart, Cloud, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const AdminServices = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_km: '',
    title_en: '',
    description_km: '',
    description_en: '',
    icon_name: 'Globe',
    category: 'custom_build' as Service['category'],
    features: '',
    sort_order: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await servicesApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      console.warn('Services load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title_km: '',
      title_en: '',
      description_km: '',
      description_en: '',
      icon_name: 'Globe',
      category: 'custom_build',
      features: 'High Speed, Responsive, SEO, Security',
      sort_order: services.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingId(s.id);
    setFormData({
      title_km: s.title_km,
      title_en: s.title_en,
      description_km: s.description_km || '',
      description_en: s.description_en || '',
      icon_name: s.icon_name,
      category: s.category,
      features: (s.features || []).join(', '),
      sort_order: s.sort_order,
      is_active: s.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_km: formData.title_km,
      title_en: formData.title_en,
      description_km: formData.description_km,
      description_en: formData.description_en,
      icon_name: formData.icon_name,
      category: formData.category,
      features: formData.features.split(',').map((f) => f.trim()).filter((f) => f.length > 0),
      sort_order: Number(formData.sort_order),
      is_active: formData.is_active,
    };

    if (editingId) {
      const res = await servicesApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែសេវាកម្មជោគជ័យ!', 'Service updated!'));
        await loadData();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await servicesApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមសេវាកម្មជោគជ័យ!', 'Service added!'));
        await loadData();
      } else {
        toast.error(res.message || 'Create failed');
      }
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const res = await servicesApi.delete(id);
    if (res.success) {
      toast.success(t('លុបសេវាកម្មជោគជ័យ!', 'Service deleted!'));
      await loadData();
    }
  };

  return (
    <AdminLayout
      title="គ្រប់គ្រងសេវាកម្ម"
      titleKm="គ្រប់គ្រងសេវាកម្ម"
      subtitle="បន្ថែម កែប្រែ ឬ កំណត់បង្ហាញសេវាកម្ម ផ្អែកលើ PostgreSQL services Table"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Boxes className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-sm font-km">{t('បញ្ជីសេវាកម្មទាំងអស់', 'Services List')} ({services.length})</h3>
          </div>
          <Button onClick={handleOpenAdd} className="gap-2 font-km text-xs">
            <Plus className="h-4 w-4" />
            <span>{t('បន្ថែមសេវាកម្មថ្មី', 'Add New Service')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card key={s.id} className="border-border flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {s.category}
                  </Badge>
                  <Badge variant={s.is_active ? 'default' : 'secondary'}>
                    {s.is_active ? t('សកម្ម', 'Active') : t('មិនសកម្ម', 'Inactive')}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold font-km pt-2">
                  {t(s.title_km, s.title_en)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 text-xs font-km text-muted-foreground">
                <p>{t(s.description_km || '', s.description_en || '')}</p>

                <div className="space-y-1 pt-2">
                  <span className="font-semibold text-foreground block">{t('លក្ខណៈពិសេស:', 'Features:')}</span>
                  <div className="flex flex-wrap gap-1">
                    {(s.features || []).map((f, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        ✓ {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-border flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(s)} className="gap-1 text-xs">
                  <Edit className="h-3.5 w-3.5" />
                  <span>{t('កែប្រែ', 'Edit')}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="gap-1 text-xs text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{t('លុប', 'Delete')}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl font-km">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {editingId ? t('កែប្រែសេវាកម្ម', 'Edit Service') : t('បន្ថែមសេវាកម្មថ្មី', 'Add New Service')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះសេវាកម្ម (ខ្មែរ)', 'Title (KM)')}</Label>
                  <Input value={formData.title_km} onChange={(e) => setFormData({ ...formData, title_km: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះសេវាកម្ម (EN)', 'Title (EN)')}</Label>
                  <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Service['category'] })}
                    className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background font-km"
                  >
                    <option value="custom_build">custom_build</option>
                    <option value="pos_package">pos_package</option>
                    <option value="saas">saas</option>
                    <option value="addons">addons</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Sort Order</Label>
                  <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ការពណ៌នា (ខ្មែរ)', 'Description (KM)')}</Label>
                  <textarea value={formData.description_km} onChange={(e) => setFormData({ ...formData, description_km: e.target.value })} className="w-full h-16 p-2 text-xs border rounded-md bg-background" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ការពណ៌នា (EN)', 'Description (EN)')}</Label>
                  <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="w-full h-16 p-2 text-xs border rounded-md bg-background" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('លក្ខណៈពិសេស Features (ក្បៀស សម្រាប់បំបែក)', 'Features (Comma separated)')}</Label>
                <Input value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('បោះបង់', 'Cancel')}</Button>
                <Button type="submit">{t('រក្សាទុក', 'Save')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
