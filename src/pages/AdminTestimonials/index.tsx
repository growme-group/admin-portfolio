import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ClientTestimonial } from '@/types/schema';
import { testimonialsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MessageSquareQuote,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  CheckCircle2,
  Building,
  User,
  Quote,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const [searchTerm, setSearchTerm] = useState('');
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
    if (!window.confirm(t('តើអ្នកពិតជាចង់លុបមតិអតិថិជននេះមែនទេ?', 'Are you sure you want to delete this testimonial?'))) {
      return;
    }
    const res = await testimonialsApi.delete(id);
    if (res.success) {
      toast.success(t('លុបជោគជ័យ!', 'Deleted!'));
      await loadData();
    }
  };

  const countFiveStars = items.filter((it) => it.rating >= 5).length;
  const countVisible = items.filter((it) => it.is_visible).length;

  const filteredItems = items.filter((it) => {
    const matchSearch =
      it.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (it.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (it.testimonial_km || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (it.testimonial_en || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <AdminLayout
      title="គ្រប់គ្រងមតិអតិថិជន & Feedback"
      titleKm="គ្រប់គ្រងមតិអតិថិជន & Feedback"
      subtitle="ចាត់ចែងការវាយតម្លៃ ផ្កាយ ៥ និងមតិកោតសរសើរពីដៃគូអាជីវកម្ម"
      subtitleKm="ចាត់ចែងការវាយតម្លៃ ផ្កាយ ៥ និងមតិកោតសរសើរពីដៃគូអាជីវកម្ម"
    >
      <div className="space-y-6">
        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('មតិអតិថិជនសរុប', 'Total Testimonials')}
                </span>
                <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                  {items.length}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquareQuote className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground font-km">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{t('ផ្ទុកក្នុង PostgreSQL client_testimonials', 'PostgreSQL client_testimonials table')}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('ការវាយតម្លៃផ្កាយ ៥ (5-Star)', '5-Star Reviews')}
                </span>
                <span className="text-3xl font-black font-mono text-amber-500 mt-1.5 block tracking-tight">
                  {countFiveStars}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6 fill-amber-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-km font-medium">
              <span>{t('ការពេញចិត្តកម្រិតខ្ពស់បំផុតពីអតិថិជន', 'Highest client satisfaction rate')}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('កំពុងបង្ហាញលើគេហទំព័រ', 'Visible on Site')}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-500 mt-1.5 block tracking-tight">
                  {countVisible}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-km font-medium">
              <span>{t('បង្ហាញក្នុង Slider ទំព័រដើម', 'Visible on home & landing page')}</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="glass-card p-3.5 rounded-2xl border border-border/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('ស្វែងរកតាមឈ្មោះ អតិថិជន ក្រុមហ៊ុន មតិ...', 'Search client, company or review...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 font-km text-xs rounded-xl bg-background/60 border-border/70 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={loadData}
              disabled={loading}
              className="h-9 w-9 rounded-xl border-border/70 hover:bg-primary/10 hover:text-primary shrink-0"
              title={t('ផ្ទុកឡើងវិញ', 'Refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </Button>

            <Button
              onClick={handleOpenAdd}
              className="gap-2 font-km text-xs h-9 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold hover:scale-[1.02] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{t('បន្ថែមមតិថ្មី', 'Add Testimonial')}</span>
            </Button>
          </div>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl border border-border/70 shadow-sm p-5 relative overflow-hidden group hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-indigo-500/60 to-emerald-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md">
                      <AvatarImage src={item.avatar_url || ''} alt={item.client_name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold font-sans text-sm">
                        {item.client_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-foreground font-km truncate group-hover:text-primary transition-colors">
                        {item.client_name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                        <Building className="h-3 w-3 shrink-0" />
                        <span className="truncate">{item.company_name || 'Individual Client'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500" />
                      ))}
                      <span className="text-[10px] font-mono font-bold ml-1 text-amber-600 dark:text-amber-400">
                        {item.rating}.0
                      </span>
                    </div>

                    {item.is_visible ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] py-0 px-2">
                        {t('បង្ហាញ', 'Visible')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px] py-0 px-2">
                        {t('លាក់', 'Hidden')}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="relative p-3.5 rounded-xl bg-background/50 border border-border/50 text-xs text-foreground font-km leading-relaxed mb-4">
                  <Quote className="h-4 w-4 text-primary/40 absolute top-2 right-2" />
                  <p className="italic">"{t(item.testimonial_km || '', item.testimonial_en || '')}"</p>
                  {item.testimonial_km && item.testimonial_en && (
                    <p className="mt-2 text-[11px] text-muted-foreground font-sans italic border-t border-border/40 pt-1.5">
                      "{item.testimonial_en}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Order: #{item.sort_order}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(item)}
                    className="h-8 px-2.5 rounded-lg text-xs hover:bg-primary/10 hover:text-primary gap-1 font-km"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>{t('កែប្រែ', 'Edit')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1 font-km"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('លុប', 'Delete')}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full glass-card rounded-2xl border border-border/70 p-12 text-center text-muted-foreground">
              <MessageSquareQuote className="h-10 w-10 mx-auto opacity-30 mb-3 text-primary" />
              <p className="text-sm font-km font-semibold text-foreground">
                {t('មិនមានមតិអតិថិជនត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ', 'No testimonials found')}
              </p>
              <Button onClick={handleOpenAdd} variant="outline" className="mt-4 rounded-xl font-km text-xs">
                {t('បន្ថែមមតិដំបូង', 'Add First Testimonial')}
              </Button>
            </div>
          )}
        </div>

        {/* MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl font-km glass-card border border-border/80 shadow-2xl rounded-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                <span>{editingId ? t('កែប្រែមតិអតិថិជន', 'Edit Testimonial') : t('បន្ថែមមតិអតិថិជន', 'Add Testimonial')}</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះអតិថិជន', 'Client Name')}</Label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="rounded-xl h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះក្រុមហ៊ុន/ហាង', 'Company Name')}</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="rounded-xl h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('រូបថតតំណាង (Avatar URL)', 'Avatar URL')}</Label>
                  <Input
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('កម្រិតផ្កាយ (Rating: 1 - 5)', 'Rating (1 - 5)')}</Label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background/80 text-xs font-km focus:ring-primary/20"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span>🇰🇭</span>
                  <span>{t('មតិអតិថិជន (ខ្មែរ)', 'Testimonial (KM)')}</span>
                </Label>
                <textarea
                  value={formData.testimonial_km}
                  onChange={(e) => setFormData({ ...formData, testimonial_km: e.target.value })}
                  className="w-full h-20 p-3 text-xs border border-input rounded-xl bg-background/80 outline-none focus:ring-2 focus:ring-primary/20 resize-none font-km"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>{t('មតិអតិថិជន (EN)', 'Testimonial (EN)')}</span>
                </Label>
                <textarea
                  value={formData.testimonial_en}
                  onChange={(e) => setFormData({ ...formData, testimonial_en: e.target.value })}
                  className="w-full h-20 p-3 text-xs border border-input rounded-xl bg-background/80 outline-none focus:ring-2 focus:ring-primary/20 resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testim-visible"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <Label htmlFor="testim-visible" className="text-xs font-km cursor-pointer">
                    {t('បង្ហាញលើទំព័រដើមគេហទំព័រ (Visible)', 'Show on live website')}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs font-km text-muted-foreground">{t('លំដាប់:', 'Sort Order:')}</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-20 h-8 rounded-lg text-xs font-mono text-center"
                  />
                </div>
              </div>

              <DialogFooter className="border-t border-border/50 pt-3 gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl h-9 text-xs font-km">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-9 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md font-km text-xs font-bold"
                >
                  {t('រក្សាទុក', 'Save Testimonial')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
