import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Service } from '@/types/schema';
import { servicesApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Boxes,
  Plus,
  Edit,
  Trash2,
  Globe,
  ShoppingCart,
  Cloud,
  Check,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
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

export const AdminServices = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
      features: 'High Speed, Mobile Responsive, SEO Ready, Secure API, KHQR Payment',
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
      icon_name: s.icon_name || 'Globe',
      category: s.category,
      features: (s.features || []).join(', '),
      sort_order: s.sort_order || 1,
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
        toast.success(t('កែប្រែសេវាកម្មជោគជ័យ!', 'Service updated successfully!'));
        await loadData();
        setModalOpen(false);
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await servicesApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមសេវាកម្មជោគជ័យ!', 'Service added successfully!'));
        await loadData();
        setModalOpen(false);
      } else {
        toast.error(res.message || 'Create failed');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('តើអ្នកពិតជាចង់លុបសេវាកម្មនេះមែនទេ?', 'Are you sure you want to delete this service?'))) {
      return;
    }
    const res = await servicesApi.delete(id);
    if (res.success) {
      toast.success(t('លុបសេវាកម្មជោគជ័យ!', 'Service deleted!'));
      await loadData();
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title_km.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description_km || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description_en || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeCount = services.filter((s) => s.is_active).length;

  return (
    <AdminLayout
      title="គ្រប់គ្រងសេវាកម្ម"
      titleKm="គ្រប់គ្រងសេវាកម្ម (Services Catalog)"
      subtitle="បន្ថែម កែប្រែ ឬ កំណត់បង្ហាញសេវាកម្មលើគេហទំព័រ"
      subtitleKm="បន្ថែម កែប្រែ ឬ កំណត់បង្ហាញសេវាកម្មលើគេហទំព័រ"
    >
      <div className="space-y-6">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('សេវាកម្មសរុប', 'Total Services')}
                </span>
                <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                  {services.length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-md shadow-primary/15">
                <Boxes className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('សេវាកម្មកំពុងដំណើរការ', 'Active Services')}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-500 mt-1.5 block tracking-tight">
                  {activeCount}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white shadow-md shadow-emerald-500/15">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('ប្រភេទ Category', 'Categories')}
                </span>
                <span className="text-3xl font-black font-mono text-indigo-500 mt-1.5 block tracking-tight">
                  {new Set(services.map((s) => s.category)).size}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white shadow-md shadow-indigo-500/15">
                <Layers className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 glass-card p-4 rounded-2xl border-border/70 shadow-md">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder={t('ស្វែងរកសេវាកម្ម...', 'Search services...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 font-km text-xs rounded-xl bg-background border-border/60"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenAdd}
              className="gap-2 font-km text-xs h-9 px-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold hover:scale-[1.02] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{t('+ បន្ថែមសេវាកម្មថ្មី', '+ Add Service')}</span>
            </Button>
          </div>
        </div>

        {/* SERVICES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((s) => (
            <Card
              key={s.id}
              className="border-border/70 glass-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-2xl overflow-hidden group hover:-translate-y-1 hover:border-indigo-500/50"
            >
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize text-[11px] font-semibold rounded-lg">
                    {s.category.replace('_', ' ')}
                  </Badge>
                  <Badge
                    variant={s.is_active ? 'default' : 'secondary'}
                    className={`text-[10px] font-bold rounded-full ${
                      s.is_active
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s.is_active ? t('● សកម្ម (Active)', 'Active') : t('○ មិនសកម្ម', 'Inactive')}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold font-km pt-3 text-foreground group-hover:text-primary transition-colors">
                  {t(s.title_km, s.title_en)}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3.5 flex-1 pt-4 text-xs font-km text-muted-foreground">
                <p className="leading-relaxed line-clamp-2">
                  {t(s.description_km || '', s.description_en || '')}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-foreground text-[11px] block">
                    {t('លក្ខណៈពិសេស (Features):', 'Key Features:')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(s.features || []).map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] bg-primary/5 text-primary border border-primary/15 px-2 py-0.5 rounded-md font-medium"
                      >
                        <Check className="h-3 w-3 text-primary" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="p-3.5 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs font-km">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Order: #{s.sort_order || 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(s)}
                    className="h-8 gap-1.5 text-xs rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>{t('កែប្រែ', 'Edit')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(s.id)}
                    className="h-8 gap-1.5 text-xs rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('លុប', 'Delete')}</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredServices.length === 0 && (
            <div className="col-span-full text-center py-16 bg-card/50 rounded-2xl border border-dashed border-border/80">
              <Boxes className="h-10 w-10 mx-auto opacity-30 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground font-km">
                {t('រកមិនឃើញសេវាកម្មឡើយ', 'No services found')}
              </p>
            </div>
          )}
        </div>

        {/* ADD / EDIT SERVICE MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl font-km rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Boxes className="h-5 w-5 text-primary" />
                <span>
                  {editingId
                    ? t('កែប្រែព័ត៌មានសេវាកម្ម', 'Edit Service')
                    : t('បន្ថែមសេវាកម្មថ្មី', 'Add New Service')}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t('កំណត់ឈ្មោះ ការពណ៌នា និងលក្ខណៈពិសេសរបស់សេវាកម្ម', 'Configure service details and features')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ឈ្មោះសេវាកម្ម (ខ្មែរ)', 'Title (Khmer)')}</Label>
                  <Input
                    value={formData.title_km}
                    onChange={(e) => setFormData({ ...formData, title_km: e.target.value })}
                    required
                    placeholder="ឧ. បង្កើតគេហទំព័រក្រុមហ៊ុន"
                    className="rounded-xl h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ឈ្មោះសេវាកម្ម (English)', 'Title (English)')}</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    required
                    placeholder="e.g. Corporate Web Development"
                    className="rounded-xl h-9 text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Service['category'] })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-input bg-background font-km focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="custom_build">custom_build</option>
                    <option value="pos_package">pos_package</option>
                    <option value="saas">saas</option>
                    <option value="addons">addons</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Sort Order</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ការពណ៌នា (ខ្មែរ)', 'Description (Khmer)')}</Label>
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
                  placeholder="High Speed, Responsive, SEO, Security, KHQR"
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-accent/40 border border-border/60">
                <input
                  type="checkbox"
                  id="serviceActiveCheck"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="serviceActiveCheck" className="text-xs font-semibold cursor-pointer">
                  {t('បើកដំណើរការសេវាកម្មនេះលើគេហទំព័រ (Active & Visible)', 'Enable service visibility on live website')}
                </Label>
              </div>

              <DialogFooter className="border-t border-border/50 pt-3 gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl h-9">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button type="submit" className="rounded-xl h-9 bg-primary text-primary-foreground shadow-md">
                  {t('រក្សាទុក', 'Save Service')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
