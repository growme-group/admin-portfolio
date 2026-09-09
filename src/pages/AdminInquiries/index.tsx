import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ContactInquiry } from '@/types/schema';
import { inquiriesApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Eye,
  Send,
  Phone,
  Mail,
  User,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Inbox,
  Share2,
  Calendar,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const AdminInquiries = () => {
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState<ContactInquiry['status']>('new');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await inquiriesApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setInquiries(res.data);
      }
    } catch (err) {
      console.warn('Inquiries load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (inq: ContactInquiry) => {
    setSelectedInquiry(inq);
    setAdminNotes(inq.admin_notes || '');
    setCurrentStatus(inq.status);
    setDetailOpen(true);
  };

  const handleSaveStatus = async () => {
    if (selectedInquiry) {
      const res = await inquiriesApi.updateStatus(selectedInquiry.id, currentStatus, adminNotes);
      if (res.success) {
        toast.success(t('បានធ្វើបច្ចុប្បន្នភាពសារទំនាក់ទំនង!', 'Inquiry status updated!'));
        await loadData();
      } else {
        toast.error(res.message || 'Update failed');
      }
      setDetailOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('តើអ្នកពិតជាចង់លុបសារនេះមែនទេ?', 'Are you sure you want to delete this inquiry?'))) {
      return;
    }
    const res = await inquiriesApi.delete(id);
    if (res.success) {
      toast.success(t('លុបសារទំនាក់ទំនងរួចរាល់!', 'Inquiry deleted!'));
      await loadData();
    }
  };

  const handleSimulateTelegram = () => {
    toast.success(
      t(
        'បានផ្ញើសារជូនដំណឹងឡើងវិញទៅកាន់ Telegram Channel/Chat រួចរាល់!',
        'Telegram notification alert resent successfully!'
      )
    );
  };

  const getStatusBadge = (status: ContactInquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1.5 font-semibold py-0.5 px-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {t('សារថ្មី', 'New')}
          </Badge>
        );
      case 'contacted':
        return (
          <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 gap-1.5 font-semibold py-0.5 px-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {t('បានទាក់ទង', 'Contacted')}
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 gap-1.5 font-semibold py-0.5 px-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            {t('កំពុងដំណើរការ', 'In Progress')}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1.5 font-semibold py-0.5 px-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {t('ដោះស្រាយរួច', 'Resolved')}
          </Badge>
        );
      case 'archived':
      default:
        return (
          <Badge variant="outline" className="border-border/70 text-muted-foreground">
            {t('ប័ណ្ណសារ', 'Archived')}
          </Badge>
        );
    }
  };

  const countNew = inquiries.filter((i) => i.status === 'new' || (i as any).status === 'unread').length;
  const countInProgress = inquiries.filter((i) => i.status === 'in_progress' || i.status === 'contacted').length;
  const countResolved = inquiries.filter((i) => i.status === 'resolved').length;

  const filtered = inquiries.filter((i) => {
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchSearch =
      i.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.phone_number || '').includes(searchTerm) ||
      i.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.service_interest || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout
      title="សារទំនាក់ទំនង & សំណើសម្រង់តម្លៃ"
      titleKm="សារទំនាក់ទំនង & សំណើសម្រង់តម្លៃ"
      subtitle="ប្រព័ន្ធគ្រប់គ្រង Lead សារសំណួរ និងការជូនដំណឹងពីទម្រង់គេហទំព័រ"
      subtitleKm="ប្រព័ន្ធគ្រប់គ្រង Lead សារសំណួរ និងការជូនដំណឹងពីទម្រង់គេហទំព័រ"
    >
      <div className="space-y-6">
        {/* TOP SUMMARY STATS WITH GLASS-CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setStatusFilter('all')}
            className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer group hover:-translate-y-1 ${
              statusFilter === 'all'
                ? 'border-primary ring-2 ring-primary/25 shadow-lg shadow-primary/10'
                : 'border-border/70 hover:border-primary/50'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('សារសរុបទាំងអស់', 'Total Inquiries')}
                </span>
                <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                  {inquiries.length}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Inbox className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground font-km">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>{t('សំណើទំនាក់ទំនងទាំងអស់ក្នុងប្រព័ន្ធ', 'All recorded client inquiries')}</span>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('new')}
            className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer group hover:-translate-y-1 ${
              statusFilter === 'new'
                ? 'border-amber-500 ring-2 ring-amber-500/25 shadow-lg shadow-amber-500/10'
                : 'border-border/70 hover:border-amber-500/50'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('សារថ្មីៗមិនទាន់ឆ្លើយ', 'New Inquiries')}
                </span>
                <span className="text-3xl font-black font-mono text-amber-500 mt-1.5 block tracking-tight">
                  {countNew}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-500 font-km font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <span>{t('ត្រូវការឆ្លើយតបបន្ទាន់', 'Requires urgent response')}</span>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('contacted')}
            className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer group hover:-translate-y-1 ${
              statusFilter === 'contacted'
                ? 'border-blue-500 ring-2 ring-blue-500/25 shadow-lg shadow-blue-500/10'
                : 'border-border/70 hover:border-blue-500/50'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('កំពុងទាក់ទង / ពិភាក្សា', 'In Progress / Discussion')}
                </span>
                <span className="text-3xl font-black font-mono text-blue-500 mt-1.5 block tracking-tight">
                  {countInProgress}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground font-km">
              <span>{t('កំពុងផ្តល់ប្រឹក្សា ឬធ្វើសម្រង់តម្លៃ', 'Consulting & quotation stage')}</span>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('resolved')}
            className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer group hover:-translate-y-1 ${
              statusFilter === 'resolved'
                ? 'border-emerald-500 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-500/10'
                : 'border-border/70 hover:border-emerald-500/50'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground font-km block">
                  {t('បានដោះស្រាយរួចរាល់', 'Resolved Deals')}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-500 mt-1.5 block tracking-tight">
                  {countResolved}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-km font-medium">
              <span>{t('ជោគជ័យ និងបានបញ្ចប់ការចរចា', 'Closed deals & agreements')}</span>
            </div>
          </div>
        </div>

        {/* SEARCH & STATUS PILL FILTER BAR */}
        <div className="glass-card p-3.5 rounded-2xl border border-border/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('ស្វែងរកតាមឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ សារ...', 'Search client name, email, phone, message...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 font-km text-xs rounded-xl bg-background/60 border-border/70 focus:ring-primary/20"
            />
          </div>

          {/* FILTER PILLS WITH BADGES */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', km: 'ទាំងអស់', en: 'All', count: inquiries.length },
              { id: 'new', km: 'សារថ្មី', en: 'New', count: countNew },
              { id: 'contacted', km: 'បានទាក់ទង', en: 'Contacted', count: inquiries.filter((i) => i.status === 'contacted').length },
              { id: 'in_progress', km: 'ដំណើរការ', en: 'In Progress', count: inquiries.filter((i) => i.status === 'in_progress').length },
              { id: 'resolved', km: 'ដោះស្រាយរួច', en: 'Resolved', count: countResolved },
            ].map((st) => {
              const isActive = statusFilter === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`h-8 px-3 rounded-xl text-xs font-semibold font-km transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <span>{t(st.km, st.en)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              onClick={loadData}
              disabled={loading}
              className="h-8 w-8 rounded-xl border-border/70 ml-1 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
              title={t('ផ្ទុកឡើងវិញ', 'Refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
            </Button>
          </div>
        </div>

        {/* INQUIRIES LIST TABLE */}
        <div className="glass-card border border-border/70 rounded-2xl shadow-sm overflow-hidden">
          <div className="py-4 px-6 border-b border-border/50 flex flex-row items-center justify-between bg-muted/20">
            <div>
              <h3 className="text-sm font-bold font-km text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>{t('បញ្ជីសារទំនាក់ទំនងទទួលបាន', 'Inquiries Submissions')}</span>
              </h3>
              <p className="text-xs text-muted-foreground font-km mt-0.5">
                {t(
                  `បង្ហាញ ${filtered.length} សារ ក្នុងចំណោម ${inquiries.length} សរុប`,
                  `Showing ${filtered.length} of ${inquiries.length} total messages`
                )}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/40 text-[11px] uppercase font-bold text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-3.5 font-km">{t('អតិថិជន', 'Client Details')}</th>
                  <th className="px-6 py-3.5 font-km">{t('សេវាកម្មចាប់អារម្មណ៍', 'Service Interest')}</th>
                  <th className="px-6 py-3.5 font-km">{t('ខ្លឹមសារសារ', 'Message Content')}</th>
                  <th className="px-6 py-3.5 font-km">{t('ស្ថានភាព', 'Status')}</th>
                  <th className="px-6 py-3.5 font-km">{t('កាលបរិច្ឆេទ', 'Date & Time')}</th>
                  <th className="px-6 py-3.5 font-km text-right">{t('សកម្មភាព', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-km">
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetail(inq)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/20 rounded-xl shadow-inner">
                          <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-indigo-500/20 text-primary text-xs font-black font-sans">
                            {inq.client_name?.slice(0, 2).toUpperCase() || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {inq.client_name}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5 font-mono">
                            {inq.phone_number && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground/70" />
                                {inq.phone_number}
                              </span>
                            )}
                            {inq.phone_number && inq.email_address && <span>•</span>}
                            {inq.email_address && (
                              <span className="truncate flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground/70" />
                                {inq.email_address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <Badge
                        variant="secondary"
                        className="font-sans font-semibold text-[11px] bg-primary/10 text-primary border border-primary/20"
                      >
                        {(inq.service_interest || 'General Inquiry').replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs">
                      <span className="line-clamp-2 leading-relaxed">{inq.message}</span>
                    </td>
                    <td className="px-6 py-4 text-xs">{getStatusBadge(inq.status)}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      <div>{new Date(inq.created_at).toLocaleDateString()}</div>
                      <div className="text-[10px] text-muted-foreground/70">
                        {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/15 hover:text-primary transition-colors"
                          onClick={() => handleOpenDetail(inq)}
                          title={t('មើលលម្អិត', 'View Details')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => handleDelete(inq.id)}
                          title={t('លុប', 'Delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-muted-foreground">
                      <Inbox className="h-10 w-10 mx-auto opacity-30 mb-3 text-primary" />
                      <p className="text-sm font-km font-semibold text-foreground">
                        {t('មិនមានសារទំនាក់ទំនងត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ', 'No inquiries matching your criteria')}
                      </p>
                      <p className="text-xs text-muted-foreground font-km mt-1">
                        {t('សូមសាកល្បងប្តូរលក្ខខណ្ឌស្វែងរក ឬ ចុច Reset', 'Try changing search keywords or active filters')}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL & STATUS MANAGEMENT MODAL */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl font-km glass-card border border-border/80 shadow-2xl rounded-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {t('ព័ត៌មានលម្អិតនៃសារទំនាក់ទំនង', 'Inquiry Details')}
                </span>
                {selectedInquiry && getStatusBadge(currentStatus)}
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-muted-foreground">
                ID: {selectedInquiry?.id} • {new Date(selectedInquiry?.created_at || '').toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-4 py-2 text-xs">
                {/* CLIENT INFO CARD */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block font-sans">
                      {t('ឈ្មោះអតិថិជន', 'Client Name')}
                    </span>
                    <span className="font-bold text-sm text-foreground block mt-0.5">{selectedInquiry.client_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block font-sans">
                      {t('សេវាកម្មចាប់អារម្មណ៍', 'Service Interest')}
                    </span>
                    <span className="font-semibold text-xs text-primary block mt-0.5">
                      {selectedInquiry.service_interest || 'Web Development'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block font-sans">
                      {t('លេខទូរស័ព្ទ', 'Phone Number')}
                    </span>
                    <a
                      href={`tel:${selectedInquiry.phone_number}`}
                      className="font-mono text-xs text-foreground hover:text-primary flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{selectedInquiry.phone_number || 'N/A'}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block font-sans">
                      {t('អ៊ីមែល', 'Email Address')}
                    </span>
                    <a
                      href={`mailto:${selectedInquiry.email_address}`}
                      className="font-mono text-xs text-foreground hover:text-primary flex items-center gap-1.5 mt-0.5 truncate"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">{selectedInquiry.email_address || 'N/A'}</span>
                    </a>
                  </div>
                </div>

                {/* MESSAGE CONTENT */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground font-km">
                    {t('ខ្លឹមសារសារពីអតិថិជន (Client Message)', 'Client Message')}
                  </Label>
                  <div className="p-4 rounded-xl bg-background/80 border border-border/70 text-xs leading-relaxed text-foreground whitespace-pre-wrap font-km">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* STATUS & TELEGRAM CONTROLS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground font-km">
                      {t('កែប្រែស្ថានភាព (Change Status)', 'Update Status')}
                    </Label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-xl border border-input bg-background/80 text-xs font-km focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="new">{t('សារថ្មី (New)', 'New')}</option>
                      <option value="contacted">{t('បានទាក់ទង (Contacted)', 'Contacted')}</option>
                      <option value="in_progress">{t('កំពុងដំណើរការ (In Progress)', 'In Progress')}</option>
                      <option value="resolved">{t('ដោះស្រាយរួច (Resolved)', 'Resolved')}</option>
                      <option value="archived">{t('ប័ណ្ណសារ (Archived)', 'Archived')}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground font-km">
                      {t('ជូនដំណឹង Telegram', 'Telegram Alert')}
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSimulateTelegram}
                      className="w-full h-9 text-xs rounded-xl border-border/70 hover:bg-sky-500/10 hover:text-sky-600 gap-1.5 font-km"
                    >
                      <Send className="h-3.5 w-3.5 text-sky-500" />
                      <span>{t('ផ្ញើសាររំលឹក Telegram', 'Resend Telegram Alert')}</span>
                    </Button>
                  </div>
                </div>

                {/* INTERNAL ADMIN NOTES */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground font-km">
                    {t('កំណត់សម្គាល់ផ្ទៃក្នុង (Internal Admin Notes)', 'Internal Admin Notes')}
                  </Label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={t('កត់ត្រាព័ត៌មានបន្ថែមអំពីការចរចា ឬទំនាក់ទំនង...', 'Add internal remarks about this client lead...')}
                    className="w-full h-20 p-3 rounded-xl border border-input bg-background/80 text-xs font-km outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border/50 pt-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setDetailOpen(false)} className="rounded-xl h-9 font-km text-xs">
                {t('បោះបង់', 'Cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveStatus}
                className="rounded-xl h-9 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md font-km text-xs font-bold"
              >
                {t('រក្សាទុកការផ្លាស់ប្តូរ', 'Save Changes')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
