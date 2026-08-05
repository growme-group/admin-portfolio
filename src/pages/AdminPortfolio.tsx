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
      tags: (p.tags || []).join(', '),
      is_featured: p.is_featured,
      sort_order: p.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_km || !formData.title_en || !formData.thumbnail_url) {
      toast.error(t('សូមបញ្ចូលចំណងជើង និង រូបភាពតំណាង', 'Please provide title and thumbnail URL'));
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      title_km: formData.title_km,
      title_en: formData.title_en,
      description_km: formData.description_km,
      description_en: formData.description_en,
      category: formData.category,
      thumbnail_url: formData.thumbnail_url,
      demo_url: formData.demo_url,
      tags: tagsArray,
      is_featured: formData.is_featured,
      sort_order: Number(formData.sort_order),
    };

    if (editingId) {
      const res = await portfolioApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែគម្រោង Portfolio ជោគជ័យ!', 'Portfolio project updated successfully!'));
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      const res = await portfolioApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមគម្រោង Portfolio ថ្មីជោគជ័យ!', 'New portfolio project added successfully!'));
      } else {
        toast.error(res.message || 'Create failed');
      }
    }

    setModalOpen(false);
    await loadData();
  };

  const handleToggleFeatured = async (id: string) => {
    const res = await portfolioApi.toggleFeatured(id);
    if (res.success) {
      toast.success(t('បានធ្វើបច្ចុប្បន្នភាពស្ថានភាព Featured!', 'Updated featured status!'));
      await loadData();
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      const res = await portfolioApi.delete(deletingId);
      if (res.success) {
        toast.success(t('លុបគម្រោងជោគជ័យ!', 'Project deleted successfully!'));
        await loadData();
      }
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Categories list
  const categories = ['all', 'POS System', 'F&B SaaS', 'E-commerce', 'Education', 'Finance', 'Mobile App'];

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title_km.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="គ្រប់គ្រងគម្រោង Portfolio"
      titleKm="គ្រប់គ្រងគម្រោង Portfolio (Portfolio Management)"
      subtitle="បន្ថែម កែប្រែ ឬ កំណត់គម្រោងលេចធ្លោ (Featured Cases) ផ្អែកលើ PostgreSQL portfolio_projects Table"
    >
      <div className="space-y-6">
        {/* HEADER TOP CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('ស្វែងរកតាមឈ្មោះគម្រោង ឬ ប្រភេទ...', 'Search project title or category...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 font-km text-xs"
              />
            </div>

            {/* CATEGORY FILTER DROPDOWN */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 px-3 text-xs rounded-md border border-input bg-background font-km focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? t('គ្រប់ប្រភេទទាំងអស់', 'All Categories') : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VIEW MODE TOGGLER & ADD BUTTON */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('table')}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleOpenAddModal} className="gap-2 font-km text-xs">
              <Plus className="h-4 w-4" />
              <span>{t('បន្ថែមគម្រោងថ្មី', 'Add Project')}</span>
            </Button>
          </div>
        </div>

        {/* STATS OVERVIEW MINI ROW */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold font-km">
            <FolderKanban className="h-4 w-4" />
            <span>
              {t('គម្រោងសរុប:', 'Total Projects:')} {projects.length}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold font-km">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>
              {t('គម្រោង Featured លើ Landing Page:', 'Featured Projects:')} {projects.filter((p) => p.is_featured).length}
            </span>
          </div>
        </div>

        {/* GRID VIEW MODE */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <Card
                key={p.id}
                className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* THUMBNAIL CONTAINER */}
                  <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                    <img
                      src={p.thumbnail_url}
                      alt={p.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-xs text-muted-foreground">Image Unavailable</span>`;
                      }}
                    />

                    {/* FEATURED BADGE */}
                    <button
                      onClick={() => handleToggleFeatured(p.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border transition-all ${
                        p.is_featured
                          ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                          : 'bg-black/40 text-white/70 hover:text-white border-white/20'
                      }`}
                      title={t('ចុចដើម្បីកំណត់ Featured', 'Click to toggle Featured')}
                    >
                      <Star className={`h-4 w-4 ${p.is_featured ? 'fill-white' : ''}`} />
                    </button>

                    {/* CATEGORY BADGE */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/60 text-white backdrop-blur-md border-0 text-[11px]">
                        {p.category}
                      </Badge>
                    </div>
                  </div>

                  {/* CONTENT BODY */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground font-km leading-tight group-hover:text-primary transition-colors">
                        {t(p.title_km, p.title_en)}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground font-km line-clamp-2 leading-relaxed">
                      {t(p.description_km || '', p.description_en || '')}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(p.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-2 text-xs">
                  {p.demo_url ? (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{t('មើល Demo', 'Live Demo')}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">No Demo URL</span>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEditModal(p)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setDeletingId(p.id);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* TABLE VIEW MODE */
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-km">{t('រូបភាព', 'Thumbnail')}</th>
                    <th className="px-4 py-3 font-km">{t('ចំណងជើងគម្រោង', 'Project Title')}</th>
                    <th className="px-4 py-3 font-km">{t('ប្រភេទ', 'Category')}</th>
                    <th className="px-4 py-3 font-km">{t('លេចធ្លោ (Featured)', 'Featured')}</th>
                    <th className="px-4 py-3 font-km text-right">{t('សកម្មភាព', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <img
                          src={p.thumbnail_url}
                          alt={p.title_en}
                          className="w-16 h-10 object-cover rounded-md border border-border"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground font-km">{t(p.title_km, p.title_en)}</div>
                        <div className="text-xs text-muted-foreground font-mono">{p.demo_url || 'No Link'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{p.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(p.id)}
                          className="h-8 gap-1.5 text-xs font-semibold"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              p.is_featured ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'
                            }`}
                          />
                          <span>{p.is_featured ? t('បង្ហាញ', 'Featured') : t('ធម្មតា', 'Standard')}</span>
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenEditModal(p)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setDeletingId(p.id);
                              setDeleteConfirmOpen(true);
                            }}
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
          <DialogContent className="max-w-3xl font-km">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingId
                  ? t('កែប្រែព័ត៌មានគម្រោង Portfolio', 'Edit Portfolio Project')
                  : t('បន្ថែមគម្រោង Portfolio ថ្មី', 'Add New Portfolio Project')}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t('សូមបំពេញព័ត៌មានគម្រោងតាម PostgreSQL portfolio_projects Schema', 'Fill project metadata aligned with database schema')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ចំណងជើង (ភាសាខ្មែរ)', 'Title (Khmer)')}</Label>
                  <Input
                    value={formData.title_km}
                    onChange={(e) => setFormData({ ...formData, title_km: e.target.value })}
                    placeholder="ឧ. ប្រព័ន្ធគ្រប់គ្រងសាលារៀន"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ចំណងជើង (English)', 'Title (English)')}</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="e.g. School Management System"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ប្រភេទគម្រោង (Category)', 'Category')}</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-9 px-3 text-sm rounded-md border border-input bg-background font-km focus:outline-none"
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
                  <Label className="text-xs font-semibold">{t('លំដាប់តម្រៀប (Sort Order)', 'Sort Order')}</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('តំណភ្ជាប់រូបភាព (Thumbnail URL)', 'Thumbnail Image URL')}</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('តំណភ្ជាប់ Demo URL (បើមាន)', 'Demo URL (Optional)')}</Label>
                <Input
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  placeholder="https://demo.khmerweb.com/..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ការពណ៌នា (ភាសាខ្មែរ)', 'Description (Khmer)')}</Label>
                  <textarea
                    value={formData.description_km}
                    onChange={(e) => setFormData({ ...formData, description_km: e.target.value })}
                    className="w-full h-20 p-2.5 text-xs rounded-md border border-input bg-background focus:outline-none font-km"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ការពណ៌នា (English)', 'Description (English)')}</Label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full h-20 p-2.5 text-xs rounded-md border border-input bg-background focus:outline-none font-km"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('បច្ចេកវិទ្យា Tags (ក្បៀស សម្រាប់បំបែក)', 'Tech Tags (Comma separated)')}</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, PostgreSQL, ABA KHQR, Tailwind"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featuredCheck" className="text-xs font-semibold cursor-pointer">
                  {t('កំណត់ជាគម្រោងលេចធ្លោ (Show in Featured Home Section)', 'Show as Featured Project on Landing')}
                </Label>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button type="submit" className="gap-2">
                  <Check className="h-4 w-4" />
                  <span>{editingId ? t('រក្សាទុកការកែប្រែ', 'Save Changes') : t('បង្កើតគម្រោង', 'Create Project')}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRM DIALOG */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md font-km">
            <DialogHeader>
              <DialogTitle className="text-destructive font-bold">
                {t('បញ្ជាក់ការលុបគម្រោង', 'Confirm Delete Project')}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t('តើអ្នកប្រាកដជាចង់លុបគម្រោង Portfolio នេះមែនទេ? ទិន្នន័យនឹងត្រូវលុបជាអចិន្ត្រៃយ៍។', 'Are you sure you want to delete this project? This action cannot be undone.')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                {t('បោះបង់', 'Cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
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
