import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PricingPlan } from '@/types/schema';
import { pricingApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, Plus, Edit, Trash2, Check, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const AdminPricing = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    plan_name_km: '',
    plan_name_en: '',
    price: 199,
    billing_period: 'one_time' as PricingPlan['billing_period'],
    description_km: '',
    description_en: '',
    features: '',
    is_popular: false,
    sort_order: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await pricingApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setPlans(res.data);
      }
    } catch (err) {
      console.warn('Pricing load error', err);
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
      plan_name_km: '',
      plan_name_en: '',
      price: 199,
      billing_period: 'one_time',
      description_km: '',
      description_en: '',
      features: 'Landing Page, Responsive, Free Domain, Telegram Alert',
      is_popular: false,
      sort_order: plans.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PricingPlan) => {
    setEditingId(p.id);
    setFormData({
      plan_name_km: p.plan_name_km,
      plan_name_en: p.plan_name_en,
      price: p.price,
      billing_period: p.billing_period,
      description_km: p.description_km || '',
      description_en: p.description_en || '',
      features: (p.features || []).join(', '),
      is_popular: p.is_popular,
      sort_order: p.sort_order,
      is_active: p.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      plan_name_km: formData.plan_name_km,
      plan_name_en: formData.plan_name_en,
      price: Number(formData.price),
      billing_period: formData.billing_period,
      description_km: formData.description_km,
      description_en: formData.description_en,
      features: formData.features.split(',').map((f) => f.trim()).filter((f) => f.length > 0),
      is_popular: formData.is_popular,
      sort_order: Number(formData.sort_order),
      is_active: formData.is_active,
    };

    if (editingId) {
      const res = await pricingApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែកញ្ចប់តម្លៃជោគជ័យ!', 'Plan updated!'));
        await loadData();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await pricingApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមPlanថ្មីជោគជ័យ!', 'Plan added!'));
        await loadData();
      } else {
        toast.error(res.message || 'Create failed');
      }
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const res = await pricingApi.delete(id);
    if (res.success) {
      toast.success(t('លុបកញ្ចប់តម្លៃជោគជ័យ!', 'Plan deleted!'));
      await loadData();
    }
  };

  return (
    <AdminLayout
      title="គ្រប់គ្រងកញ្ចប់តម្លៃ"
      titleKm="គ្រប់គ្រងកញ្ចប់តម្លៃ"
      subtitle="គ្រប់គ្រងកញ្ចប់សេវាប្រចាំខែ ឆ្នាំ ឬ តម្លៃបង្កើត ផ្អែកលើ PostgreSQL pricing_plans Table"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-sm font-km">{t('បញ្ជីកញ្ចប់តម្លៃទាំងអស់', 'Pricing Plans')} ({plans.length})</h3>
          </div>
          <Button onClick={handleOpenAdd} className="gap-2 font-km text-xs">
            <Plus className="h-4 w-4" />
            <span>{t('បន្ថែម Plan ថ្មី', 'Add New Plan')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.id} className={`border-border flex flex-col justify-between ${p.is_popular ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={p.is_popular ? 'default' : 'outline'}>
                    {p.is_popular ? t('★ ពេញនិយមបំផុត', '★ Most Popular') : p.billing_period}
                  </Badge>
                  <span className="text-xl font-bold text-primary font-mono">${p.price}</span>
                </div>
                <CardTitle className="text-base font-bold font-km pt-2">
                  {t(p.plan_name_km, p.plan_name_en)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 text-xs font-km text-muted-foreground">
                <p>{t(p.description_km || '', p.description_en || '')}</p>
                <div className="space-y-1.5 pt-2 border-t border-border">
                  {(p.features || []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t border-border flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(p)} className="gap-1 text-xs">
                  <Edit className="h-3.5 w-3.5" />
                  <span>{t('កែប្រែ', 'Edit')}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="gap-1 text-xs text-destructive">
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
                {editingId ? t('កែប្រែកញ្ចប់តម្លៃ', 'Edit Pricing Plan') : t('បន្ថែម Plan ថ្មី', 'Add Pricing Plan')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះ Plan (ខ្មែរ)', 'Plan Name (KM)')}</Label>
                  <Input value={formData.plan_name_km} onChange={(e) => setFormData({ ...formData, plan_name_km: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះ Plan (EN)', 'Plan Name (EN)')}</Label>
                  <Input value={formData.plan_name_en} onChange={(e) => setFormData({ ...formData, plan_name_en: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('តម្លៃ ($)', 'Price ($)')}</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('រយៈពេល Billing Period', 'Billing Period')}</Label>
                  <select
                    value={formData.billing_period}
                    onChange={(e) => setFormData({ ...formData, billing_period: e.target.value as PricingPlan['billing_period'] })}
                    className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background font-km"
                  >
                    <option value="one_time">one_time - ម្ដងគត់</option>
                    <option value="monthly">monthly - ប្រចាំខែ</option>
                    <option value="yearly">yearly - ប្រចាំឆ្នាំ</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('លក្ខណៈពិសេស Features (ក្បៀស សម្រាប់បំបែក)', 'Features (Comma separated)')}</Label>
                <Input value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                />
                <Label htmlFor="popCheck" className="text-xs font-semibold cursor-pointer">
                  {t('កំណត់ជាកញ្ចប់ពេញនិយមបំផុត (Popular Plan)', 'Set as Most Popular Plan')}
                </Label>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('បោះបង់', 'Cancel')}</Button>
                <Button type="submit">{t('រក្សាទុក', 'Save Plan')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
