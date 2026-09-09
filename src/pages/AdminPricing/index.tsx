import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PricingPlan } from '@/types/schema';
import { pricingApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  Star,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      features: 'High Performance Landing, Mobile Optimized, Custom Domain, KHQR Checkout, Telegram Notifications',
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
      sort_order: p.sort_order || 1,
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
        toast.success(t('កែប្រែកញ្ចប់តម្លៃជោគជ័យ!', 'Plan updated successfully!'));
        await loadData();
        setModalOpen(false);
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await pricingApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមPlanថ្មីជោគជ័យ!', 'Plan added successfully!'));
        await loadData();
        setModalOpen(false);
      } else {
        toast.error(res.message || 'Create failed');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('តើអ្នកពិតជាចង់លុបកញ្ចប់តម្លៃនេះមែនទេ?', 'Are you sure you want to delete this pricing plan?'))) {
      return;
    }
    const res = await pricingApi.delete(id);
    if (res.success) {
      toast.success(t('លុបកញ្ចប់តម្លៃជោគជ័យ!', 'Plan deleted!'));
      await loadData();
    }
  };

  const popularCount = plans.filter((p) => p.is_popular).length;

  return (
    <AdminLayout
      title="គ្រប់គ្រងកញ្ចប់តម្លៃ"
      titleKm="គ្រប់គ្រងកញ្ចប់តម្លៃ (Pricing Plans)"
      subtitle="គ្រប់គ្រងកញ្ចប់សេវាប្រចាំខែ ឆ្នាំ ឬ តម្លៃបង្កើត"
      subtitleKm="គ្រប់គ្រងកញ្ចប់សេវាប្រចាំខែ ឆ្នាំ ឬ តម្លៃបង្កើត"
    >
      <div className="space-y-6">
        {/* STATS SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('កញ្ចប់តម្លៃសរុប', 'Total Plans')}
                </span>
                <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                  {plans.length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-md shadow-primary/15">
                <CreditCard className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('កញ្ចប់ពេញនិយម (Popular)', 'Popular Highlights')}
                </span>
                <span className="text-3xl font-black font-mono text-amber-500 mt-1.5 block tracking-tight">
                  {popularCount}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white shadow-md shadow-amber-500/15">
                <Star className="h-5 w-5 fill-amber-500 group-hover:fill-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('តម្លៃមធ្យម (Avg Price)', 'Average Price')}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-500 mt-1.5 block tracking-tight">
                  ${plans.length > 0 ? Math.round(plans.reduce((a, b) => a + Number(b.price), 0) / plans.length) : 0}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white shadow-md shadow-emerald-500/15">
                <Zap className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TOOLBAR */}
        <div className="flex items-center justify-between glass-card p-4 rounded-2xl border-border/70 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm font-km">
              {t('បញ្ជីកញ្ចប់តម្លៃទាំងអស់', 'Available Pricing Plans')} ({plans.length})
            </h3>
          </div>
          <Button
            onClick={handleOpenAdd}
            className="gap-2 font-km text-xs h-9 px-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold hover:scale-[1.02] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t('+ បន្ថែម Plan ថ្មី', '+ Add Plan')}</span>
          </Button>
        </div>

        {/* PRICING PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={`border-border/70 glass-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-2xl relative overflow-hidden group hover:-translate-y-1 ${
                p.is_popular
                  ? 'border-primary ring-2 ring-primary/40 shadow-primary/15'
                  : 'hover:border-emerald-500/50'
              }`}
            >
              {p.is_popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-primary to-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>POPULAR</span>
                  </div>
                </div>
              )}

              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="outline" className="text-xs font-semibold capitalize rounded-lg">
                    {p.billing_period.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-black font-km pt-3 text-foreground group-hover:text-primary transition-colors">
                  {t(p.plan_name_km, p.plan_name_en)}
                </CardTitle>
                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground font-mono tracking-tight">
                    ${p.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-km">
                    / {p.billing_period === 'one_time' ? t('ម្ដងគត់', 'one-time') : p.billing_period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 pt-4 text-xs font-km text-muted-foreground">
                <p className="leading-relaxed">
                  {t(p.description_km || '', p.description_en || '')}
                </p>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <span className="font-bold text-foreground text-[11px] block">
                    {t('មុខងាររួមបញ្ចូល (Included Features):', 'Included Features:')}
                  </span>
                  <div className="space-y-2">
                    {(p.features || []).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-foreground">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-xs">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="p-3.5 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs font-km">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Order: #{p.sort_order || 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(p)}
                    className="h-8 gap-1.5 text-xs rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>{t('កែប្រែ', 'Edit')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                    className="h-8 gap-1.5 text-xs rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('លុប', 'Delete')}</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full text-center py-16 bg-card/50 rounded-2xl border border-dashed border-border/80">
              <CreditCard className="h-10 w-10 mx-auto opacity-30 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground font-km">
                {t('មិនទាន់មានកញ្ចប់តម្លៃនៅឡើយទេ', 'No pricing plans configured yet')}
              </p>
            </div>
          )}
        </div>

        {/* ADD / EDIT PRICING PLAN MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl font-km rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>
                  {editingId
                    ? t('កែប្រែកញ្ចប់តម្លៃ', 'Edit Pricing Plan')
                    : t('បន្ថែម Plan ថ្មី', 'Add Pricing Plan')}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t('កំណត់ព័ត៌មានតម្លៃ រយៈពេល និងលក្ខណៈពិសេសរបស់កញ្ចប់', 'Configure pricing tier details, period, and features')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ឈ្មោះ Plan (ខ្មែរ)', 'Plan Name (KM)')}</Label>
                  <Input
                    value={formData.plan_name_km}
                    onChange={(e) => setFormData({ ...formData, plan_name_km: e.target.value })}
                    required
                    placeholder="ឧ. កញ្ចប់ Standard Business"
                    className="rounded-xl h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ឈ្មោះ Plan (English)', 'Plan Name (EN)')}</Label>
                  <Input
                    value={formData.plan_name_en}
                    onChange={(e) => setFormData({ ...formData, plan_name_en: e.target.value })}
                    required
                    placeholder="e.g. Standard Business"
                    className="rounded-xl h-9 text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('តម្លៃ ($)', 'Price ($)')}</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('រយៈពេល Billing Period', 'Billing Period')}</Label>
                  <select
                    value={formData.billing_period}
                    onChange={(e) => setFormData({ ...formData, billing_period: e.target.value as PricingPlan['billing_period'] })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-input bg-background font-km focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="one_time">one_time - ម្ដងគត់</option>
                    <option value="monthly">monthly - ប្រចាំខែ</option>
                    <option value="yearly">yearly - ប្រចាំឆ្នាំ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ការពណ៌នា (ខ្មែរ)', 'Description (KM)')}</Label>
                  <textarea
                    value={formData.description_km}
                    onChange={(e) => setFormData({ ...formData, description_km: e.target.value })}
                    className="w-full h-18 p-2.5 text-xs rounded-xl border border-input bg-background font-km resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ការពណ៌នា (English)', 'Description (English)')}</Label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full h-18 p-2.5 text-xs rounded-xl border border-input bg-background font-sans resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('លក្ខណៈពិសេស Features (ក្បៀស សម្រាប់បំបែក)', 'Features (Comma separated)')}</Label>
                <Input
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Landing Page, Responsive, Free Domain, Telegram Alert, KHQR"
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-accent/40 border border-border/60">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="popCheck" className="text-xs font-semibold cursor-pointer">
                  {t('កំណត់ជាកញ្ចប់ពេញនិយមបំផុត (Popular Plan Banner)', 'Set as Most Popular Plan on Landing')}
                </Label>
              </div>

              <DialogFooter className="border-t border-border/50 pt-3 gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl h-9">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button type="submit" className="rounded-xl h-9 bg-primary text-primary-foreground shadow-md">
                  {t('រក្សាទុក', 'Save Plan')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
