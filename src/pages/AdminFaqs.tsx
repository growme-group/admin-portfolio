import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FAQ } from '@/types/schema';
import { faqsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { HelpCircle, Plus, Edit, Trash2 } from 'lucide-react';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    const res = await faqsApi.delete(id);
    if (res.success) {
      toast.success(t('លុបសំណួរជោគជ័យ!', 'FAQ deleted!'));
      await loadData();
    }
  };

  return (
    <AdminLayout
      title="គ្រប់គ្រងសំណួរញឹកញាប់"
      titleKm="គ្រប់គ្រងសំណួរញឹកញាប់"
      subtitle="គ្រប់គ្រងសំណួរ និងចម្លើយ bilingual ផ្អែកលើ PostgreSQL faqs Table"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold text-sm font-km">{t('សំណួរញឹកញាប់ទាំងអស់', 'All FAQs')} ({faqs.length})</h3>
          </div>
          <Button onClick={handleOpenAdd} className="gap-2 font-km text-xs">
            <Plus className="h-4 w-4" />
            <span>{t('បន្ថែមសំណួរថ្មី', 'Add FAQ')}</span>
          </Button>
        </div>

        <div className="space-y-4">
          {faqs.map((f) => (
            <Card key={f.id} className="border-border">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{f.category}</Badge>
                  <CardTitle className="text-sm font-bold font-km">
                    {t(f.question_km, f.question_en)}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(f)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(f.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground font-km border-t border-border pt-3">
                <p><strong className="text-foreground">{t('ចម្លើយ (ខ្មែរ):', 'Answer (KM):')}</strong> {f.answer_km}</p>
                <p className="mt-1"><strong className="text-foreground">{t('ចម្លើយ (EN):', 'Answer (EN):')}</strong> {f.answer_en}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl font-km">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {editingId ? t('កែប្រែសំណួរ', 'Edit FAQ') : t('បន្ថែមសំណួរថ្មី', 'Add FAQ')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('សំណួរ (ខ្មែរ)', 'Question (KM)')}</Label>
                <Input value={formData.question_km} onChange={(e) => setFormData({ ...formData, question_km: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('សំណួរ (EN)', 'Question (EN)')}</Label>
                <Input value={formData.question_en} onChange={(e) => setFormData({ ...formData, question_en: e.target.value })} required />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('ចម្លើយ (ខ្មែរ)', 'Answer (KM)')}</Label>
                <textarea value={formData.answer_km} onChange={(e) => setFormData({ ...formData, answer_km: e.target.value })} className="w-full h-20 p-2 text-xs border rounded-md bg-background" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">{t('ចម្លើយ (EN)', 'Answer (EN)')}</Label>
                <textarea value={formData.answer_en} onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })} className="w-full h-20 p-2 text-xs border rounded-md bg-background" required />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('បោះបង់', 'Cancel')}</Button>
                <Button type="submit">{t('រក្សាទុក', 'Save FAQ')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFaqs;
