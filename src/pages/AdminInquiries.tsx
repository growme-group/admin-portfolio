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
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">{t('ថ្មី', 'New')}</Badge>;
      case 'contacted':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">{t('បានទាក់ទង', 'Contacted')}</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">{t('កំពុងដំណើរការ', 'In Progress')}</Badge>;
      case 'resolved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{t('ដោះស្រាយរួច', 'Resolved')}</Badge>;
      case 'archived':
        return <Badge variant="outline">{t('ប័ណ្ណសារ', 'Archived')}</Badge>;
    }
  };

  const filtered = inquiries.filter((i) => {
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchSearch =
      i.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.phone_number || '').includes(searchTerm) ||
      i.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout
      title="សារទំនាក់ទំនង"
      titleKm="សារទំនាក់ទំនង"
      subtitle="តាមដានសារ និងសំណើសម្រង់តម្លៃពីអតិថិជន ផ្អែកលើ PostgreSQL contact_inquiries Table"
    >
      <div className="space-y-6">
        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('ស្វែងរកតាមឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ...', 'Search client name, email, phone...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 font-km text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs rounded-md border border-input bg-background font-km focus:outline-none"
              >
                <option value="all">{t('គ្រប់ស្ថានភាពទាំងអស់', 'All Statuses')}</option>
                <option value="new">{t('សារថ្មី (New)', 'New')}</option>
                <option value="contacted">{t('បានទាក់ទង (Contacted)', 'Contacted')}</option>
                <option value="in_progress">{t('កំពុងដំណើរការ (In Progress)', 'In Progress')}</option>
                <option value="resolved">{t('ដោះស្រាយរួច (Resolved)', 'Resolved')}</option>
                <option value="archived">{t('ប័ណ្ណសារ (Archived)', 'Archived')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* INQUIRIES LIST TABLE */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-km flex items-center justify-between">
              <span>{t('បញ្ជីសារទំនាក់ទំនងទទួលបាន', 'Inquiries List')} ({filtered.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-km">{t('អតិថិជន', 'Client Info')}</th>
                    <th className="px-4 py-3 font-km">{t('សេវាកម្មដែលចាប់អារម្មណ៍', 'Service Interest')}</th>
                    <th className="px-4 py-3 font-km">{t('សារសង្ខេប', 'Message Preview')}</th>
                    <th className="px-4 py-3 font-km">{t('ស្ថានភាព', 'Status')}</th>
                    <th className="px-4 py-3 font-km">{t('កាលបរិច្ឆេទ', 'Date')}</th>
                    <th className="px-4 py-3 font-km text-right">{t('សកម្មភាព', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inq) => (
                    <tr key={inq.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-foreground font-km">{inq.client_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 font-mono">
                          <span>{inq.phone_number}</span>
                          <span>•</span>
                          <span>{inq.email_address}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <Badge variant="secondary" className="capitalize">
                          {(inq.service_interest || 'General').replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-xs truncate font-km">
                        {inq.message}
                      </td>
                      <td className="px-4 py-3.5 text-xs">{getStatusBadge(inq.status)}</td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground font-mono">
                        {new Date(inq.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDetail(inq)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(inq.id)}
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
          </CardContent>
        </Card>

        {/* DETAIL MODAL */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-3xl font-km">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center justify-between">
                <span>{t('ព័ត៌មានលម្អិតនៃសារទំនាក់ទំនង', 'Inquiry Details')}</span>
                {selectedInquiry && getStatusBadge(currentStatus)}
              </DialogTitle>
              <DialogDescription className="text-xs">
                ID: {selectedInquiry?.id} • {new Date(selectedInquiry?.created_at || '').toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-4 py-2 text-xs">
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    <span>{selectedInquiry.client_name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground font-mono pt-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{selectedInquiry.phone_number || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{selectedInquiry.email_address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>{t('ខ្លឹមសារសារ (Message Content):', 'Client Message:')}</span>
                  </Label>
                  <div className="p-3 bg-card border border-border rounded-lg leading-relaxed text-foreground font-km text-xs">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('កែប្រែស្ថានភាព (Update Status):', 'Update Status:')}</Label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as ContactInquiry['status'])}
                    className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background font-km focus:outline-none"
                  >
                    <option value="new"> new - សារថ្មី</option>
                    <option value="contacted"> contacted - បានទាក់ទង</option>
                    <option value="in_progress"> in_progress - កំពុងដំណើរការ</option>
                    <option value="resolved"> resolved - ដោះស្រាយរួច</option>
                    <option value="archived"> archived - ប័ណ្ណសារ</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ចំណាំរបស់អ្នកគ្រប់គ្រង (Admin Notes):', 'Admin Internal Notes:')}</Label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={t('បញ្ចូលចំណាំផ្ទៃក្នុងសម្រាប់ក្រុមការងារ...', 'Enter internal follow-up notes...')}
                    className="w-full h-20 p-2.5 text-xs rounded-md border border-input bg-background focus:outline-none font-km"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleSimulateTelegram} className="gap-1.5 text-xs">
                <Send className="h-3.5 w-3.5 text-blue-500" />
                <span>{t('ផ្ញើ Telegram Alert ឡើងវិញ', 'Resend Telegram Alert')}</span>
              </Button>
              <Button type="button" onClick={handleSaveStatus} className="text-xs">
                {t('រក្សាទុក', 'Save Updates')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
