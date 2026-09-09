import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FAQ } from '@/types/schema';
import { faqsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  FolderTree,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
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

export const AdminFaqs = () => {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question_km: '',
    question_en: '',
    answer_km: '',
    answer_en: '',
    category: 'General',
    sort_order: 1,
    is_published: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await faqsApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.warn('FAQs load error', err);
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
      question_km: '',
      question_en: '',
      answer_km: '',
      answer_en: '',
      category: 'General',
      sort_order: faqs.length + 1,
      is_published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (f: FAQ) => {
    setEditingId(f.id);
    setFormData({
      question_km: f.question_km,
      question_en: f.question_en,
      answer_km: f.answer_km,
      answer_en: f.answer_en,
      category: f.category || 'General',
      sort_order: f.sort_order,
      is_published: f.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      question_km: formData.question_km,
      question_en: formData.question_en,
      answer_km: formData.answer_km,
      answer_en: formData.answer_en,
      category: formData.category,
      sort_order: Number(formData.sort_order),
      is_published: formData.is_published,
    };

    if (editingId) {
      const res = await faqsApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែសំណួរជោគជ័យ!', 'FAQ updated!'));
        await loadData();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await faqsApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមសំណួរជោគជ័យ!', 'FAQ added!'));
        await loadData();
      } else {
        toast.error(res.message || 'Create failed');
      }
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('តើអ្នកពិតជាចង់លុបសំណួរនេះមែនទេ?', 'Are you sure you want to delete this FAQ?'))) {
      return;
    }
    const res = await faqsApi.delete(id);
    if (res.success) {
      toast.success(t('លុបសំណួរជោគជ័យ!', 'FAQ deleted!'));
      await loadData();
    }
  };

  // Extract categories
  const categories = Array.from(new Set(faqs.map((f) => f.category || 'General')));

  const filteredFaqs = faqs.filter((f) => {
    const matchCat = selectedCategory === 'all' || (f.category || 'General') === selectedCategory;
    const matchSearch =
      f.question_km.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.question_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer_km.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer_en.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AdminLayout
      title="គ្រប់គ្រងសំណួរញឹកញាប់ (FAQs)"
      titleKm="គ្រប់គ្រងសំណួរញឹកញាប់ (FAQs)"
      subtitle="ចាត់ចែងសំណួរ និងចម្លើយបច្ចេកទេស bilingual សម្រាប់បង្ហាញលើគេហទំព័រ"
      subtitleKm="ចាត់ចែងសំណួរ និងចម្លើយបច្ចេកទេស bilingual សម្រាប់បង្ហាញលើគេហទំព័រ"
    >
      <div className="space-y-6">
        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('សំណួរទាំងអស់ក្នុងប្រព័ន្ធ', 'Total Questions')}
                </span>
                <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                  {faqs.length}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HelpCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground font-km">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{t('ផ្ទុកក្នុង PostgreSQL Table faqs', 'Synced with cloud database')}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('សំណួរផ្សាយជាសាធារណៈ', 'Published FAQs')}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-500 mt-1.5 block tracking-tight">
                  {faqs.filter((f) => f.is_published).length}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-km font-medium">
              <span>{t('បង្ហាញផ្ទាល់លើ Live Portal', 'Active & visible to visitors')}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('ប្រភេទទូទៅ (Categories)', 'Active Categories')}
                </span>
                <span className="text-3xl font-black font-mono text-indigo-500 mt-1.5 block tracking-tight">
                  {categories.length}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderTree className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground font-km">
              <span>{t('បែងចែកតាមប្រធានបទសេវាកម្ម', 'Segmented FAQ topics')}</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="glass-card p-3.5 rounded-2xl border border-border/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('ស្វែងរកសំណួរ ឬចម្លើយ...', 'Search questions or answers...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 font-km text-xs rounded-xl bg-background/60 border-border/70 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`h-8 px-3 rounded-xl text-xs font-semibold font-km transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {t('ទាំងអស់', 'All')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`h-8 px-3 rounded-xl text-xs font-semibold font-km transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {cat}
              </button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={loadData}
              disabled={loading}
              className="h-8 w-8 rounded-xl border-border/70 hover:bg-primary/10 hover:text-primary shrink-0"
              title={t('ផ្ទុកឡើងវិញ', 'Refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
            </Button>

            <Button
              onClick={handleOpenAdd}
              className="gap-2 font-km text-xs h-9 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold hover:scale-[1.02] transition-all shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{t('បន្ថែមសំណួរថ្មី', 'Add FAQ')}</span>
            </Button>
          </div>
        </div>

        {/* FAQS LIST */}
        <div className="space-y-3">
          {filteredFaqs.map((f, idx) => {
            const isExpanded = expandedId === f.id || idx === 0;
            return (
              <div
                key={f.id}
                className="glass-card rounded-2xl border border-border/70 shadow-sm overflow-hidden transition-all duration-200 hover:border-primary/40"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  className="py-4 px-6 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 font-mono text-xs font-black">
                      #{f.sort_order || idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="secondary"
                          className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/20"
                        >
                          {f.category || 'General'}
                        </Badge>
                        {f.is_published ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                            {t('ផ្សាយ', 'Published')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-[10px]">
                            {t('ព្រាង', 'Draft')}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-foreground font-km truncate">
                        {t(f.question_km, f.question_en)}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-primary/15 hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(f);
                      }}
                      title={t('កែប្រែ', 'Edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(f.id);
                      }}
                      title={t('លុប', 'Delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-2 border-t border-border/40 bg-muted/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-km">
                    <div className="p-3.5 rounded-xl bg-background/60 border border-border/60">
                      <div className="flex items-center gap-1.5 font-bold text-primary mb-1.5 text-[11px]">
                        <span>🇰🇭</span>
                        <span>{t('ចម្លើយជាភាសាខ្មែរ (Khmer)', 'Khmer Answer')}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{f.answer_km}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background/60 border border-border/60">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-500 mb-1.5 text-[11px]">
                        <span>🇬🇧</span>
                        <span>{t('ចម្លើយជាភាសាអង់គ្លេស (English)', 'English Answer')}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">{f.answer_en}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="glass-card rounded-2xl border border-border/70 p-12 text-center text-muted-foreground">
              <HelpCircle className="h-10 w-10 mx-auto opacity-30 mb-3 text-primary" />
              <p className="text-sm font-km font-semibold text-foreground">
                {t('មិនមានសំណួរត្រូវនឹងការស្វែងរកឡើយ', 'No FAQs matching your search')}
              </p>
              <Button onClick={handleOpenAdd} variant="outline" className="mt-4 rounded-xl font-km text-xs">
                {t('បន្ថែមសំណួរដំបូង', 'Add First FAQ')}
              </Button>
            </div>
          )}
        </div>

        {/* ADD/EDIT MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl font-km glass-card border border-border/80 shadow-2xl rounded-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>{editingId ? t('កែប្រែសំណួរ', 'Edit FAQ') : t('បន្ថែមសំណួរថ្មី', 'Add FAQ')}</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">{t('ប្រភេទ (Category)', 'Category')}</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="General, Pricing, Technical..."
                    className="rounded-xl h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">{t('លំដាប់តម្រៀប (Sort Order)', 'Sort Order')}</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="rounded-xl h-9 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span>🇰🇭</span>
                  <span>{t('សំណួរ (ភាសាខ្មែរ)', 'Question (KM)')}</span>
                </Label>
                <Input
                  value={formData.question_km}
                  onChange={(e) => setFormData({ ...formData, question_km: e.target.value })}
                  placeholder="ឧ. តើសេវាកម្មបង្កើត Web Application ចំណាយពេលប៉ុន្មាន?"
                  className="rounded-xl h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>{t('សំណួរ (English)', 'Question (EN)')}</span>
                </Label>
                <Input
                  value={formData.question_en}
                  onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
                  placeholder="e.g. How long does it take to develop a custom web app?"
                  className="rounded-xl h-9 text-xs font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span>🇰🇭</span>
                  <span>{t('ចម្លើយលម្អិត (ភាសាខ្មែរ)', 'Answer (KM)')}</span>
                </Label>
                <textarea
                  value={formData.answer_km}
                  onChange={(e) => setFormData({ ...formData, answer_km: e.target.value })}
                  className="w-full h-24 p-3 text-xs border border-input rounded-xl bg-background/80 outline-none focus:ring-2 focus:ring-primary/20 resize-none font-km"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>{t('ចម្លើយលម្អិត (English)', 'Answer (EN)')}</span>
                </Label>
                <textarea
                  value={formData.answer_en}
                  onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })}
                  className="w-full h-24 p-3 text-xs border border-input rounded-xl bg-background/80 outline-none focus:ring-2 focus:ring-primary/20 resize-none font-sans"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faq-published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="faq-published" className="text-xs font-km cursor-pointer">
                  {t('ផ្សាយជាសាធារណៈលើគេហទំព័រ (Publish to public portal)', 'Publish to public portal')}
                </Label>
              </div>

              <DialogFooter className="border-t border-border/50 pt-3 gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl h-9 text-xs font-km">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-9 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md font-km text-xs font-bold"
                >
                  {t('រក្សាទុកសំណួរ', 'Save FAQ')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFaqs;
