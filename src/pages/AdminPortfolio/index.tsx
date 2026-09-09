import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PortfolioProject } from '@/types/schema';
import { portfolioApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  FolderKanban,
  Plus,
  Search,
  Star,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
  Check,
  Grid,
  List as ListIcon,
  Tag,
  Eye,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

export const AdminPortfolio = () => {
  const { t, fontClass } = useLanguage();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title_km: '',
    title_en: '',
    description_km: '',
    description_en: '',
    category: 'POS System',
    thumbnail_url: '',
    demo_url: '',
    tags: '',
    is_featured: false,
    sort_order: 1,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err) {
      console.warn('Portfolio load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title_km: '',
      title_en: '',
      description_km: '',
      description_en: '',
      category: 'POS System',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      demo_url: 'https://demo.khmerweb.com/project',
      tags: 'React, PostgreSQL, Tailwind',
      is_featured: true,
      sort_order: projects.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (p: PortfolioProject) => {
    setEditingId(p.id);
    setFormData({
      title_km: p.title_km,
      title_en: p.title_en,
      description_km: p.description_km || '',
      description_en: p.description_en || '',
      category: p.category,
      thumbnail_url: p.thumbnail_url,
      demo_url: p.demo_url || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags as any) || '',
      is_featured: p.is_featured,
      sort_order: p.sort_order || 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagArray,
    };

    if (editingId) {
      const res = await portfolioApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែគម្រោងជោគជ័យ!', 'Project updated successfully!'));
        await loadData();
        setModalOpen(false);
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await portfolioApi.create(payload);
      if (res.success) {
        toast.success(t('បានបង្កើតគម្រោងថ្មីជោគជ័យ!', 'Project created successfully!'));
        await loadData();
        setModalOpen(false);
      } else {
        toast.error(res.message || 'Create failed');
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const res = await portfolioApi.toggleFeatured(id);
    if (res.success) {
      toast.success(t('បានផ្លាស់ប្តូរ Featured Status!', 'Featured status toggled!'));
      await loadData();
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await portfolioApi.delete(deletingId);
    if (res.success) {
      toast.success(t('លុបគម្រោងរួចរាល់!', 'Project deleted!'));
      await loadData();
    }
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  // Categories list
  const categories = ['all', 'POS System', 'F&B SaaS', 'E-commerce', 'Education', 'Finance', 'Mobile App'];

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title_km.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(p.tags) && p.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredCount = projects.filter((p) => p.is_featured).length;

  return (
    <AdminLayout
      title="គ្រប់គ្រងគម្រោង Portfolio"
      titleKm="គ្រប់គ្រងគម្រោង Portfolio (Portfolio Management)"
      subtitle="បន្ថែម កែប្រែ ឬ កំណត់គម្រោងលេចធ្លោ (Featured Cases) លើគេហទំព័រ"
      subtitleKm="បន្ថែម កែប្រែ ឬ កំណត់គម្រោងលេចធ្លោ (Featured Cases) លើគេហទំព័រ"
    >
      <div className="space-y-6">
        {/* TOP SUMMARY STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('គម្រោងសរុប', 'Total Projects')}
                </span>
                <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                  {projects.length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-md shadow-primary/15">
                <FolderKanban className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('គម្រោងលេចធ្លោ (Featured)', 'Featured On Landing')}
                </span>
                <span className="text-3xl font-black font-mono text-amber-500 mt-1.5 block tracking-tight">
                  {featuredCount}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white shadow-md shadow-amber-500/15">
                <Star className="h-5 w-5 fill-amber-500 group-hover:fill-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card relative overflow-hidden border-border/70 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground font-km uppercase tracking-wider block">
                  {t('ប្រភេទគម្រោង (Categories)', 'Active Categories')}
                </span>
                <span className="text-3xl font-black font-mono text-indigo-500 mt-1.5 block tracking-tight">
                  {new Set(projects.map((p) => p.category)).size}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white shadow-md shadow-indigo-500/15">
                <Layers className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CONTROLS TOOLBAR & CATEGORY PILLS */}
        <div className="flex flex-col gap-3.5 glass-card p-4 rounded-2xl border-border/70 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder={t('ស្វែងរកតាមចំណងជើង ប្រភេទ ឬ Tag...', 'Search project title, category, tags...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 font-km text-xs rounded-xl bg-background border-border/60"
              />
            </div>

            {/* VIEW TOGGLE & ADD BUTTON */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center border border-border/60 rounded-xl p-0.5 bg-muted/40">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setViewMode('grid')}
                  title={t('មើលជាក្រឡា (Grid View)', 'Grid View')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setViewMode('table')}
                  title={t('មើលជាតារាង (Table View)', 'Table View')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleOpenAddModal}
                className="gap-2 font-km text-xs h-9 px-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold hover:scale-[1.02] transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>{t('+ បន្ថែមគម្រោងថ្មី', '+ Add Project')}</span>
              </Button>
            </div>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            {categories.map((c) => {
              const isSelected = selectedCategory === c;
              const count =
                c === 'all'
                  ? projects.length
                  : projects.filter((p) => p.category.toLowerCase() === c.toLowerCase()).length;

              return (
                <Button
                  key={c}
                  variant={isSelected ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(c)}
                  className={`h-7 px-3 text-xs rounded-xl font-km gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground bg-muted/30'
                  }`}
                >
                  <span>{c === 'all' ? t('ទាំងអស់', 'All') : c}</span>
                  <span
                    className={`text-[10px] px-1 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* GRID VIEW MODE */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <Card
                key={p.id}
                className="overflow-hidden border-border/70 glass-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group rounded-2xl hover:-translate-y-1 hover:border-primary/50"
              >
                <div>
                  {/* THUMBNAIL CONTAINER WITH ASPECT RATIO */}
                  <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                    <img
                      src={p.thumbnail_url}
                      alt={p.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="flex flex-col items-center gap-1 text-muted-foreground"><ImageIcon class="h-6 w-6 opacity-40" /><span class="text-[11px]">No Image</span></div>`;
                      }}
                    />

                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* FEATURED STAR BUTTON */}
                    <button
                      onClick={() => handleToggleFeatured(p.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
                        p.is_featured
                          ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/30'
                          : 'bg-black/40 text-white/70 hover:text-white border-white/20'
                      }`}
                      title={t('ចុចដើម្បីកំណត់ Featured', 'Click to toggle Featured')}
                    >
                      <Star className={`h-3.5 w-3.5 ${p.is_featured ? 'fill-white' : ''}`} />
                    </button>

                    {/* CATEGORY BADGE */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/70 text-white backdrop-blur-md border-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg shadow-sm">
                        {p.category}
                      </Badge>
                    </div>
                  </div>

                  {/* CONTENT BODY */}
                  <div className="p-5 space-y-3 font-km">
                    <h3 className="font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {t(p.title_km, p.title_en)}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {t(p.description_km || '', p.description_en || '')}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(p.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-muted/80 border border-border/50 px-2 py-0.5 rounded-md text-muted-foreground font-mono font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-2 text-xs font-km">
                  {p.demo_url ? (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary/80 flex items-center gap-1.5 font-semibold text-xs transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{t('មើល Demo', 'Live Demo')}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">No Demo Link</span>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => handleOpenEditModal(p)}
                      title={t('កែប្រែ', 'Edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => {
                        setDeletingId(p.id);
                        setDeleteConfirmOpen(true);
                      }}
                      title={t('លុប', 'Delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-16 bg-card/50 rounded-2xl border border-dashed border-border/80">
                <FolderKanban className="h-10 w-10 mx-auto opacity-30 text-muted-foreground mb-3" />
                <p className="text-sm font-semibold text-foreground font-km">
                  {t('រកមិនឃើញគម្រោង Portfolio ឡើយ', 'No portfolio projects found')}
                </p>
                <p className="text-xs text-muted-foreground font-km mt-1">
                  {t('សូមសាកល្បងស្វែងរកដោយពាក្យគន្លឹះផ្សេង ឬ បន្ថែមគម្រោងថ្មី។', 'Try searching with another keyword or add a new project.')}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* TABLE VIEW MODE */
          <Card className="border-border/70 shadow-sm bg-card/80 backdrop-blur-md overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase font-bold text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-5 py-3.5 font-km">{t('រូបភាព', 'Thumbnail')}</th>
                    <th className="px-5 py-3.5 font-km">{t('ចំណងជើងគម្រោង', 'Project Title')}</th>
                    <th className="px-5 py-3.5 font-km">{t('ប្រភេទ', 'Category')}</th>
                    <th className="px-5 py-3.5 font-km">{t('លេចធ្លោ (Featured)', 'Featured')}</th>
                    <th className="px-5 py-3.5 font-km text-right">{t('សកម្មភាព', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-km">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-accent/40 transition-colors">
                      <td className="px-5 py-3">
                        <img
                          src={p.thumbnail_url}
                          alt={p.title_en}
                          className="w-16 h-10 object-cover rounded-lg border border-border/60 shadow-sm"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-foreground">{t(p.title_km, p.title_en)}</div>
                        <div className="text-xs text-muted-foreground font-mono truncate max-w-xs">{p.demo_url || 'No Link'}</div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="text-xs font-semibold rounded-lg">
                          {p.category}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(p.id)}
                          className="h-8 gap-1.5 text-xs font-semibold rounded-lg"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              p.is_featured ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'
                            }`}
                          />
                          <span>{p.is_featured ? t('លេចធ្លោ (Featured)', 'Featured') : t('ធម្មតា', 'Standard')}</span>
                        </Button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleOpenEditModal(p)}
                            title={t('កែប្រែ', 'Edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => {
                              setDeletingId(p.id);
                              setDeleteConfirmOpen(true);
                            }}
                            title={t('លុប', 'Delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ADD / EDIT DIALOG MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl font-km rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                <span>
                  {editingId
                    ? t('កែប្រែព័ត៌មានគម្រោង Portfolio', 'Edit Portfolio Project')
                    : t('បន្ថែមគម្រោង Portfolio ថ្មី', 'Add New Portfolio Project')}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t('សូមបំពេញព័ត៌មានគម្រោងតាម PostgreSQL portfolio_projects Schema', 'Fill project metadata aligned with database schema')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ចំណងជើង (ភាសាខ្មែរ)', 'Title (Khmer)')}</Label>
                  <Input
                    value={formData.title_km}
                    onChange={(e) => setFormData({ ...formData, title_km: e.target.value })}
                    placeholder="ឧ. ប្រព័ន្ធគ្រប់គ្រងសាលារៀន"
                    required
                    className="rounded-xl h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ចំណងជើង (English)', 'Title (English)')}</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="e.g. School Management System"
                    required
                    className="rounded-xl h-9 text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ប្រភេទគម្រោង (Category)', 'Category')}</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-input bg-background font-km focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="POS System">POS System</option>
                    <option value="F&B SaaS">F&B SaaS</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('លំដាប់តម្រៀប (Sort Order)', 'Sort Order')}</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('តំណភ្ជាប់រូបភាព (Thumbnail URL)', 'Thumbnail Image URL')}</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('តំណភ្ជាប់ Demo URL (បើមាន)', 'Demo URL (Optional)')}</Label>
                <Input
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  placeholder="https://demo.khmerweb.com/..."
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ការពណ៌នា (ភាសាខ្មែរ)', 'Description (Khmer)')}</Label>
                  <textarea
                    value={formData.description_km}
                    onChange={(e) => setFormData({ ...formData, description_km: e.target.value })}
                    className="w-full h-18 p-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-km resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{t('ការពណ៌នា (English)', 'Description (English)')}</Label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full h-18 p-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans resize-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('បច្ចេកវិទ្យា Tags (ក្បៀស សម្រាប់បំបែក)', 'Tech Tags (Comma separated)')}</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, PostgreSQL, ABA KHQR, Tailwind"
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-accent/40 border border-border/60">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="featuredCheck" className="text-xs font-semibold cursor-pointer">
                  {t('កំណត់ជាគម្រោងលេចធ្លោ (Show in Featured Home Section)', 'Show as Featured Project on Landing')}
                </Label>
              </div>

              <DialogFooter className="border-t border-border/50 pt-3 gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl h-9">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button type="submit" className="gap-2 rounded-xl h-9 bg-primary text-primary-foreground shadow-md">
                  <Check className="h-4 w-4" />
                  <span>{editingId ? t('រក្សាទុកការកែប្រែ', 'Save Changes') : t('បង្កើតគម្រោង', 'Create Project')}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRM DIALOG */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md font-km rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-destructive font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{t('បញ្ជាក់ការលុបគម្រោង', 'Confirm Delete Project')}</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t('តើអ្នកប្រាកដជាចង់លុបគម្រោង Portfolio នេះមែនទេ? ទិន្នន័យនឹងត្រូវលុបជាអចិន្ត្រៃយ៍។', 'Are you sure you want to delete this project? This action cannot be undone.')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="rounded-xl">
                {t('បោះបង់', 'Cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
                {t('លុបចេញ', 'Yes, Delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
