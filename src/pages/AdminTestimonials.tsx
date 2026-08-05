import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ClientTestimonial } from '@/types/schema';
import { testimonialsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquareQuote, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const AdminTestimonials = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<ClientTestimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    logo_url: '',
    avatar_url: '',
    testimonial_km: '',
    testimonial_en: '',
    rating: 5,
    sort_order: 1,
    is_visible: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await testimonialsApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn('Testimonials load error', err);
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
      client_name: '',
      company_name: '',
      logo_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=150&q=80',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      testimonial_km: '',
      testimonial_en: '',
      rating: 5,
      sort_order: items.length + 1,
      is_visible: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ClientTestimonial) => {
    setEditingId(item.id);
    setFormData({
      client_name: item.client_name,
      company_name: item.company_name || '',
      logo_url: item.logo_url || '',
      avatar_url: item.avatar_url || '',
      testimonial_km: item.testimonial_km || '',
      testimonial_en: item.testimonial_en || '',
      rating: item.rating,
      sort_order: item.sort_order,
      is_visible: item.is_visible,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      client_name: formData.client_name,
      company_name: formData.company_name,
      logo_url: formData.logo_url,
      avatar_url: formData.avatar_url,
      testimonial_km: formData.testimonial_km,
      testimonial_en: formData.testimonial_en,
      rating: Number(formData.rating),
      sort_order: Number(formData.sort_order),
      is_visible: formData.is_visible,
    };

    if (editingId) {
      const res = await testimonialsApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែជោគជ័យ!', 'Updated!'));
        await loadData();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await testimonialsApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមជោគជ័យ!', 'Added!'));
        await loadData();
      } else {
        toast.error(res.message || 'Create failed');
      }
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const res = await testimonialsApi.delete(id);
    if (res.success) {
      toast.success(t('លុបជោគជ័យ!', 'Deleted!'));
      await loadData();
    }
  };

  return (
    <AdminLayout
      title="គ្រប់គ្រងមតិអតិថិជន"
      titleKm="គ្រប់គ្រងមតិអតិថិជន"
      subtitle="គ្រប់គ្រងការវាយតម្លៃ និងមតិអតិថិជន ផ្អែកលើ PostgreSQL client_testimonials Table"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquareQuote className="h-5 w-5 text-emerald-500" />
            <h3 className="font-bold text-sm font-km">{t('មតិអតិថិជនទាំងអស់', 'Testimonials')} ({items.length})</h3>
          </div>
          <Button onClick={handleOpenAdd} className="gap-2 font-km text-xs">
            <Plus className="h-4 w-4" />
            <span>{t('បន្ថែមមតិថ្មី', 'Add Testimonial')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold font-km">{item.client_name}</CardTitle>
                  <span className="text-xs text-muted-foreground">{item.company_name}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground font-km border-t border-border pt-3 space-y-2">
                <p>"{t(item.testimonial_km || '', item.testimonial_en || '')}"</p>
              </CardContent>
              <div className="p-3 border-t border-border flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)} className="gap-1 text-xs">
                  <Edit className="h-3.5 w-3.5" />
                  <span>{t('កែប្រែ', 'Edit')}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="gap-1 text-xs text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{t('លុប', 'Delete')}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl font-km">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {editingId ? t('កែប្រែ', 'Edit Testimonial') : t('បន្ថែមមតិអតិថិជន', 'Add Testimonial')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះអតិថិជន', 'Client Name')}</Label>
                  <Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះក្រុមហ៊ុន/ហាង', 'Company Name')}</Label>
                  <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('មតិអតិថិជន (ខ្មែរ)', 'Testimonial (KM)')}</Label>
                <textarea value={formData.testimonial_km} onChange={(e) => setFormData({ ...formData, testimonial_km: e.target.value })} className="w-full h-16 p-2 text-xs border rounded-md bg-background" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('មតិអតិថិជន (EN)', 'Testimonial (EN)')}</Label>
                <textarea value={formData.testimonial_en} onChange={(e) => setFormData({ ...formData, testimonial_en: e.target.value })} className="w-full h-16 p-2 text-xs border rounded-md bg-background" required />
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

export default AdminTestimonials;
