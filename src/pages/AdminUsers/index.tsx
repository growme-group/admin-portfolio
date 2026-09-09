import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { User } from '@/types/schema';
import { usersApi, uploadApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Users as UsersIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User as UserIcon,
  Camera,
  UploadCloud,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Sparkles,
  KeyRound,
  Shield,
  Eye,
  Sliders,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface CustomRole {
  id: string;
  name_km: string;
  name_en: string;
  code: string;
  description_km: string;
  permissions: string[];
  is_system?: boolean;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'services', labelKm: 'គ្រប់គ្រងសេវាកម្ម (Services)', labelEn: 'Manage Services' },
  { id: 'pricing', labelKm: 'គ្រប់គ្រងកញ្ចប់តម្លៃ (Pricing)', labelEn: 'Manage Pricing' },
  { id: 'inquiries', labelKm: 'មើលនិងឆ្លើយតបសារ (Inquiries)', labelEn: 'Manage Inquiries' },
  { id: 'faqs', labelKm: 'គ្រប់គ្រងសំណួរញឹកញាប់ (FAQs)', labelEn: 'Manage FAQs' },
  { id: 'testimonials', labelKm: 'គ្រប់គ្រងមតិអតិថិជន (Testimonials)', labelEn: 'Manage Testimonials' },
  { id: 'settings', labelKm: 'ការកំណត់ប្រព័ន្ធ (Settings)', labelEn: 'Manage Settings' },
  { id: 'users', labelKm: 'គ្រប់គ្រងអ្នកប្រើប្រាស់ (Users & Roles)', labelEn: 'Manage Users & Roles' },
];

export const AdminUsers = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // User Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'EDITOR',
    avatar_url: '',
    is_active: true,
  });

  // Roles Management State
  const [rolesList, setRolesList] = useState<CustomRole[]>([
    {
      id: 'role-admin',
      name_km: 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Administrator)',
      name_en: 'Administrator',
      code: 'ADMIN',
      description_km: 'មានសិទ្ធិពេញលេញលើគ្រប់មុខងារ និងការកំណត់ទាំងអស់ក្នុងប្រព័ន្ធ',
      permissions: ['services', 'pricing', 'inquiries', 'faqs', 'testimonials', 'settings', 'users'],
      is_system: true,
    },
    {
      id: 'role-editor',
      name_km: 'អ្នកកែសម្រួលមាតិកា (Content Editor)',
      name_en: 'Content Editor',
      code: 'EDITOR',
      description_km: 'មានសិទ្ធិគ្រប់គ្រងមាតិកា សេវាកម្ម តម្លៃ សំណួរញឹកញាប់ និងសារទំនាក់ទំនង',
      permissions: ['services', 'pricing', 'inquiries', 'faqs', 'testimonials'],
      is_system: true,
    },
    {
      id: 'role-viewer',
      name_km: 'អ្នកមើលទិន្នន័យ (Viewer)',
      name_en: 'Viewer',
      code: 'VIEWER',
      description_km: 'មានសិទ្ធិមើលទិន្នន័យរបាយការណ៍ តែមិនអាចកែប្រែ ឬ លុបទិន្នន័យបានទេ',
      permissions: ['services', 'pricing', 'faqs', 'testimonials'],
      is_system: true,
    },
  ]);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name_km: '',
    name_en: '',
    code: '',
    description_km: '',
    permissions: [] as string[],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.warn('Users load error', err);
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
      full_name: '',
      email: '',
      password: '',
      role: 'EDITOR',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role: (user.role || 'EDITOR').toUpperCase(),
      avatar_url: user.avatar_url || '',
      is_active: user.is_active !== false,
    });
    setModalOpen(true);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, avatar_url: res.url || '' }));
        toast.success(t('បានអាប់ឡូតរូប Avatar ជោគជ័យ!', 'Avatar uploaded successfully!'));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            setFormData((prev) => ({ ...prev, avatar_url: dataUrl }));
            toast.success(t('បានអាប់ឡូតរូប Avatar ថ្មី!', 'Avatar preview set!'));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role.toUpperCase(),
      avatar_url: formData.avatar_url,
      is_active: formData.is_active,
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    if (editingId) {
      const res = await usersApi.update(editingId, payload);
      if (res.success) {
        toast.success(t('កែប្រែអ្នកប្រើប្រាស់ជោគជ័យ!', 'User updated successfully!'));
        await loadData();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } else {
      if (!formData.password) {
        toast.error(t('សូមបញ្ចូលពាក្យសម្ងាត់', 'Password is required for new user'));
        return;
      }
      const res = await usersApi.create(payload);
      if (res.success) {
        toast.success(t('បន្ថែមអ្នកប្រើប្រាស់ជោគជ័យ!', 'User created successfully!'));
        await loadData();
      } else {
        toast.error(res.message || 'Create failed');
      }
    }

    setModalOpen(false);
  };

  const handleQuickAssignRole = async (userId: string, newRole: string) => {
    const res = await usersApi.update(userId, { role: newRole });
    if (res.success) {
      toast.success(t(`បានផ្លាស់ប្តូរ Role ទៅជា "${newRole}" ជោគជ័យ!`, `Role assigned to "${newRole}" successfully!`));
      await loadData();
    } else {
      toast.error(res.message || 'Role assignment failed');
    }
  };

  const handleToggleActive = async (id: string) => {
    const res = await usersApi.toggleActive(id);
    if (res.success) {
      toast.success(t('បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពអ្នកប្រើប្រាស់!', 'User active status updated!'));
      await loadData();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(t(`តើអ្នកប្រាកដជាចង់លុបអ្នកប្រើប្រាស់ "${name}" មែនទេ?`, `Delete user "${name}"?`))) {
      const res = await usersApi.delete(id);
      if (res.success) {
        toast.success(t('លុបអ្នកប្រើប្រាស់ជោគជ័យ!', 'User deleted successfully!'));
        await loadData();
      } else {
        toast.error(res.message || 'Delete failed');
      }
    }
  };

  // Add Custom Role Handler
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.name_km || !newRoleForm.code) {
      toast.error(t('សូមបញ្ចូលឈ្មោះ និង Code Role', 'Please enter Role name and Code'));
      return;
    }

    const createdRole: CustomRole = {
      id: `role-${Date.now()}`,
      name_km: newRoleForm.name_km,
      name_en: newRoleForm.name_en || newRoleForm.name_km,
      code: newRoleForm.code.toUpperCase().replace(/\s+/g, '_'),
      description_km: newRoleForm.description_km || 'Role ផ្ទាល់ខ្លួនបង្កើតដោយ Admin',
      permissions: newRoleForm.permissions,
      is_system: false,
    };

    setRolesList((prev) => [...prev, createdRole]);
    toast.success(t(`បានបង្កើត Role ថ្មី "${createdRole.code}" ជោគជ័យ!`, `New role "${createdRole.code}" created successfully!`));
    setRoleModalOpen(false);
    setNewRoleForm({ name_km: '', name_en: '', code: '', description_km: '', permissions: [] });
  };

  const togglePermission = (permId: string) => {
    setNewRoleForm((prev) => {
      const exists = prev.permissions.includes(permId);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== permId) };
      }
      return { ...prev, permissions: [...prev.permissions, permId] };
    });
  };

  const filteredUsers = usersList.filter((u) => {
    const roleUpper = (u.role || 'EDITOR').toUpperCase();
    const matchesRole = roleFilter === 'all' || roleUpper === roleFilter;
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const activeCount = usersList.filter((u) => u.is_active !== false).length;
  const adminCount = usersList.filter((u) => (u.role || '').toUpperCase() === 'ADMIN').length;

  return (
    <AdminLayout
      title="គ្រប់គ្រងអ្នកប្រើប្រាស់ & Roles"
      titleKm="គ្រប់គ្រងអ្នកប្រើប្រាស់ & Roles"
      subtitle="ចាត់ចែងគណនីបុគ្គលិក កំណត់សិទ្ធិ Permissions និង Assign Role ក្នុងប្រព័ន្ធ"
      subtitleKm="ចាត់ចែងគណនីបុគ្គលិក កំណត់សិទ្ធិ Permissions និង Assign Role ក្នុងប្រព័ន្ធ"
    >
      <div className="space-y-6">
        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileUpload}
        />

        {/* TAB BUTTONS WITH GLASS-CARD PILLS */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-km transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                : 'glass-card text-muted-foreground hover:text-foreground border border-border/60'
            }`}
          >
            <UsersIcon className="h-4 w-4" />
            <span>{t('បញ្ជីអ្នកប្រើប្រាស់ (Users List)', 'Users Management')}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white/20">
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-km transition-all ${
              activeTab === 'roles'
                ? 'bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                : 'glass-card text-muted-foreground hover:text-foreground border border-border/60'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>{t('គ្រប់គ្រង Roles & Permissions', 'Roles & Permissions')}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white/20">
              {rolesList.length}
            </span>
          </button>
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* TOP STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground font-km block">
                      {t('អ្នកប្រើប្រាស់សរុប', 'Total System Users')}
                    </span>
                    <span className="text-3xl font-black font-mono text-foreground mt-1.5 block tracking-tight">
                      {usersList.length}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground font-km">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{t('គណនីទាំងអស់ក្នុង PostgreSQL users table', 'All accounts in database')}</span>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground font-km block">
                      {t('គណនីសកម្ម (Active)', 'Active Users')}
                    </span>
                    <span className="text-3xl font-black font-mono text-emerald-500 mt-1.5 block tracking-tight">
                      {activeCount}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-km font-medium">
                  <span>{t('មានសិទ្ធិចូលប្រើប្រាស់ Admin Portal', 'Can sign in to portal')}</span>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-border/70 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground font-km block">
                      {t('គណនី Administrators', 'System Administrators')}
                    </span>
                    <span className="text-3xl font-black font-mono text-indigo-500 mt-1.5 block tracking-tight">
                      {adminCount}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-km font-medium">
                  <span>{t('សិទ្ធិពេញលេញលើគ្រប់ទិន្នន័យ', 'Full system superuser privileges')}</span>
                </div>
              </div>
            </div>

            {/* FILTER & ACTIONS TOOLBAR */}
            <div className="glass-card p-3.5 rounded-2xl border border-border/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('ស្វែងរកតាមឈ្មោះ ឬ អ៊ីមែល...', 'Search user name or email...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 font-km text-xs rounded-xl bg-background/60 border-border/70 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-9 px-3 text-xs rounded-xl border border-border/70 bg-background/80 font-km focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="all">{t('គ្រប់ Roles ទាំងអស់', 'All Roles')}</option>
                    {rolesList.map((r) => (
                      <option key={r.id} value={r.code}>
                        {r.code}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <span>{t('បន្ថែមអ្នកប្រើប្រាស់ថ្មី', 'Add New User')}</span>
                </Button>
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="glass-card border border-border/70 rounded-2xl shadow-sm overflow-hidden">
              <div className="py-4 px-6 border-b border-border/50 flex flex-row items-center justify-between bg-muted/20">
                <div>
                  <h3 className="text-sm font-bold font-km text-foreground flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-primary" />
                    <span>{t('បញ្ជីអ្នកប្រើប្រាស់ប្រព័ន្ធ', 'System Users List')}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-km mt-0.5">
                    {t(`មានចំនួនសរុប ${filteredUsers.length} នាក់`, `${filteredUsers.length} total users registered`)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-km border-collapse">
                  <thead className="bg-muted/40 text-[11px] uppercase font-bold text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="py-3.5 px-6">{t('អ្នកប្រើប្រាស់', 'User Profile')}</th>
                      <th className="py-3.5 px-4">{t('Assign Role (សិទ្ធិ)', 'Assign Role')}</th>
                      <th className="py-3.5 px-4">{t('ស្ថានភាព', 'Status')}</th>
                      <th className="py-3.5 px-4">{t('ចូលប្រព័ន្ធចុងក្រោយ', 'Last Login')}</th>
                      <th className="py-3.5 px-6 text-right">{t('សកម្មភាព', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-km">
                    {filteredUsers.map((u) => {
                      const roleUpper = (u.role || 'EDITOR').toUpperCase();
                      return (
                        <tr key={u.id} className="hover:bg-primary/5 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-primary/20 shadow-sm">
                                <AvatarImage src={u.avatar_url || ''} />
                                <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-indigo-500/20 text-primary font-bold text-xs font-sans">
                                  {u.full_name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-bold text-foreground block text-sm group-hover:text-primary transition-colors">
                                  {u.full_name}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-mono block mt-0.5">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* ASSIGN ROLE DROPDOWN */}
                          <td className="py-4 px-4">
                            <select
                              value={roleUpper}
                              onChange={(e) => handleQuickAssignRole(u.id, e.target.value)}
                              className="h-8 px-2.5 text-xs font-mono font-bold rounded-xl border border-primary/30 bg-primary/10 text-primary focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                            >
                              {rolesList.map((r) => (
                                <option key={r.id} value={r.code}>
                                  {r.code} ({r.name_en})
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(u.id)}
                              className="cursor-pointer transition-transform active:scale-95"
                            >
                              {u.is_active !== false ? (
                                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {t('សកម្ម', 'Active')}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground text-[10px] gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  {t('ផ្អាក', 'Inactive')}
                                </Badge>
                              )}
                            </button>
                          </td>

                          <td className="py-4 px-4 font-mono text-xs text-muted-foreground">
                            {u.last_login_at
                              ? new Date(u.last_login_at).toLocaleDateString()
                              : 'Never'}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEdit(u)}
                                className="h-8 px-2.5 text-xs gap-1 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>{t('កែប្រែ', 'Edit')}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(u.id, u.full_name)}
                                className="h-8 px-2.5 text-xs gap-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{t('លុប', 'Delete')}</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROLES & PERMISSIONS MANAGEMENT */}
        {activeTab === 'roles' && (
          <div className="space-y-6 font-km">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('គ្រប់គ្រងប្រព័ន្ធ Roles & Permissions', 'System Roles & Permissions')}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('កំណត់សិទ្ធិប្រើប្រាស់ និង បង្កើត Role ផ្ទាល់ខ្លួនសម្រាប់អ្នកប្រើប្រាស់', 'Manage permissions and add custom roles')}
                </p>
              </div>

              <Button
                onClick={() => setRoleModalOpen(true)}
                className="gap-2 text-xs font-km h-9 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold"
              >
                <Plus className="h-4 w-4" />
                <span>{t('បង្កើត Role ថ្មី', 'Add Custom Role')}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rolesList.map((role) => (
                <div
                  key={role.id}
                  className="glass-card rounded-2xl border border-border/70 shadow-sm relative overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-emerald-500" />
                  <div className="p-5 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={role.code === 'ADMIN' ? 'default' : 'secondary'}
                        className="font-mono text-xs uppercase bg-primary/10 text-primary border-primary/20"
                      >
                        {role.code}
                      </Badge>
                      {role.is_system && (
                        <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Lock className="h-3 w-3" />
                          System Role
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-foreground pt-3">{role.name_km}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{role.description_km}</p>
                  </div>


                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD / EDIT USER MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl font-km glass-card border border-border/80 shadow-2xl rounded-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <span>
                  {editingId
                    ? t('កែប្រែព័ត៌មានអ្នកប្រើប្រាស់ & Role', 'Edit System User & Assign Role')
                    : t('បន្ថែមអ្នកប្រើប្រាស់ថ្មី & Assign Role', 'Add New System User & Assign Role')}
                </span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះពេញ (Full Name)', 'Full Name')}</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Sok Dara"
                      className="pl-9 h-9 text-xs rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('អាសយដ្ឋានអ៊ីមែល (Email)', 'Email Address')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="dara@khmerweb.com"
                      className="pl-9 h-9 text-xs rounded-xl font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    {editingId ? t('ពាក្យសម្ងាត់ថ្មី (ទុកទទេបើមិនប្តូរ)', 'New Password (Optional)') : t('ពាក្យសម្ងាត់ (Password)', 'Password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-9 h-9 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('Assign Role (សិទ្ធិប្រើប្រាស់)', 'Assign Role')}</Label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-input bg-background/80 font-mono font-bold focus:outline-none"
                  >
                    {rolesList.map((r) => (
                      <option key={r.id} value={r.code}>
                        {r.code} - {r.name_km}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">{t('តំណភ្ជាប់ Avatar URL', 'Avatar Image URL')}</Label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <UploadCloud className="h-3 w-3" />
                    <span>{t('អាប់ឡូតរូបពីម៉ាស៊ីន', 'Upload Image File')}</span>
                  </button>
                </div>
                <Input
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="h-9 text-xs rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="user_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="user_active" className="text-xs cursor-pointer font-km">
                  {t('កំណត់គណនីជា 🟢 Active Status', 'Set User as Active')}
                </Label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border/50">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="text-xs rounded-xl font-km">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  className="gap-2 font-km text-xs rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md font-bold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{editingId ? t('រក្សាទុកការកែប្រែ', 'Save Changes') : t('បង្កើតគណនីថ្មី', 'Create User')}</span>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ADD CUSTOM ROLE MODAL */}
        <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
          <DialogContent className="max-w-2xl font-km glass-card border border-border/80 shadow-2xl rounded-2xl">
            <DialogHeader className="border-b border-border/50 pb-3">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>{t('បង្កើត Custom Role ថ្មី', 'Create New Custom Role')}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateRole} className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះ Role (ភាសាខ្មែរ)', 'Role Name (Khmer)')}</Label>
                  <Input
                    value={newRoleForm.name_km}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, name_km: e.target.value })}
                    placeholder="អ្នកគ្រប់គ្រង SEO"
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('Role Code (អក្សរធំ)', 'Role Code')}</Label>
                  <Input
                    value={newRoleForm.code}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, code: e.target.value })}
                    placeholder="SEO_MANAGER"
                    className="h-9 text-xs rounded-xl font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('ការពណ៌នាពី Role', 'Role Description')}</Label>
                <Input
                  value={newRoleForm.description_km}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description_km: e.target.value })}
                  placeholder="សិទ្ធិគ្រប់គ្រងមាតិកា SEO វិបសាយ និង ព័ត៌មានក្រុមហ៊ុន..."
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              {/* PERMISSIONS CHECKBOX LIST */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-bold text-foreground block">
                  {t('ជ្រើសរើសសិទ្ធិ Permissions សម្រាប់ Role ថ្មីនេះ:', 'Select Granted Permissions:')}
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-muted/20 p-3 rounded-2xl border border-border/60">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const checked = newRoleForm.permissions.includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                          checked
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-xs">{perm.labelKm}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border/50">
                <Button type="button" variant="ghost" onClick={() => setRoleModalOpen(false)} className="text-xs rounded-xl font-km">
                  {t('បោះបង់', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  className="gap-2 font-km text-xs rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md font-bold"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t('បង្កើត Role ថ្មី', 'Create Custom Role')}</span>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
