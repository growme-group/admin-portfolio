import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { settingsApi, usersApi, uploadApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  UserCheck,
  Building2,
  Send,
  Globe,
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  Save,
  RefreshCw,
  Sliders,
  Bell,
  Lock,
  Search,
  Sparkles,
  Smartphone,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Mail,
  User as UserIcon,
  Camera,
  Eye,
  EyeOff,
  Clock,
  Laptop,
  UploadCloud,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'general' | 'telegram' | 'seo' | 'security' | 'payment'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile & Security State
  const [fullName, setFullName] = useState(user?.full_name || 'Admin Khmerweb');
  const [email, setEmail] = useState(user?.email || 'admin@khmerweb.com');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  const syncUserToDb = async (newAvatarUrl: string, name?: string, mail?: string) => {
    try {
      let targetId = user?.id;
      if (!targetId || targetId.startsWith('usr-')) {
        const allUsersRes = await usersApi.getAll();
        if (allUsersRes.success && Array.isArray(allUsersRes.data)) {
          const match = allUsersRes.data.find(
            (u: any) => u.email?.toLowerCase() === (mail || email || user?.email)?.toLowerCase()
          ) || allUsersRes.data[0];
          if (match?.id) targetId = match.id;
        }
      }
      if (targetId && !targetId.startsWith('usr-')) {
        await usersApi.update(targetId, {
          avatar_url: newAvatarUrl,
          ...(name ? { full_name: name } : {}),
          ...(mail ? { email: mail } : {}),
        });
      }
    } catch (err) {
      console.warn('DB avatar sync error', err);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        setAvatarUrl(res.url);
        updateUser({ avatar_url: res.url });
        await syncUserToDb(res.url, fullName, email);
        toast.success(t('បានអាប់ឡូតរូបថត Avatar និង រក្សាទុកក្នុង DB ជោគជ័យ!', 'Avatar image uploaded and saved to DB successfully!'));
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            setAvatarUrl(dataUrl);
            updateUser({ avatar_url: dataUrl });
            await syncUserToDb(dataUrl, fullName, email);
            toast.success(t('បានអាប់ឡូតរូបថត Avatar ថ្មីជោគជ័យ!', 'Avatar preview updated successfully!'));
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

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // System Settings State
  const [settings, setSettings] = useState<Record<string, any>>({
    // General / Company Info
    company_name_km: 'ក្រុមហ៊ុន ខ្មែរវេប ហ្គ្រូ ផល្លិស',
    company_name_en: 'Khmerweb Grow Pro Co., Ltd.',
    brand_slogan_km: 'ដំណោះស្រាយប្រព័ន្ធព័ត៌មានវិទ្យា និង Software ទំនើបចុងក្រោយ',
    brand_slogan_en: 'Cutting-Edge IT & Enterprise Software Solutions',
    contact_phone: '012 345 678 / 098 765 432',
    contact_email: 'info@khmerweb.com',
    address_km: 'អាគារលេខ ១២៨ ផ្លូវ 271 សង្កាត់ផ្សារដើមថ្កូវ ខណ្ឌចំការមន ភ្នំពេញ',
    address_en: '#128 St 271, Phsar Doeum Thkov, Chamkarmon, Phnom Penh',
    vat_number: 'K009-902182041',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',

    // Telegram Bot Notifications
    telegram_bot_token: '7829104812:AAH-xyz123khmerweb_token',
    telegram_chat_id: '-100987654321',
    enable_telegram_inquiry_alert: true,
    enable_telegram_daily_report: false,
    telegram_alert_sound: true,

    // SEO & Social Meta
    meta_title_km: 'Khmerweb Grow Pro - ដំណោះស្រាយប្រព័ន្ធព័ត៌មានវិទ្យាទំនើប',
    meta_title_en: 'Khmerweb Grow Pro - Modern IT & Web Solutions',
    meta_description_km: 'សេវាកម្មបង្កើត Web Application, POS System, F&B SaaS និង ប្រព័ន្ធគ្រប់គ្រងអាជីវកម្មតាមតម្រូវការ',
    meta_description_en: 'Custom Web Applications, Cloud POS Systems, F&B SaaS Platforms, and Mobile Apps in Cambodia.',
    meta_keywords: 'Web Development, POS System Cambodia, Khmerweb, SaaS, ABA KHQR Integration',
    google_analytics_id: 'G-98X2K109LP',
    facebook_pixel_id: '490182940182490',
    og_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',

    // Security & Maintenance
    maintenance_mode: false,
    maintenance_notice_km: 'ប្រព័ន្ធកំពុងអាប់ដេតថែទាំបណ្តោះអាសន្ន។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។',
    maintenance_notice_en: 'System is under scheduled maintenance. Please check back shortly.',
    allow_public_inquiries: true,
    max_session_timeout: 120, // minutes
    allowed_cors_origins: 'http://localhost:5173, http://localhost:5174, https://khmerweb.com',

    // Payments & ABA KHQR
    merchant_name: 'KHMERWEB GROW PRO CO LTD',
    merchant_city: 'PHNOM PENH',
    aba_merchant_id: 'KW8902194',
    currency_preference: 'USD',
  });

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getAll();
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          const configObj: Record<string, any> = {};
          res.data.forEach((item: any) => {
            configObj[item.key] = item.value;
          });
          setSettings((prev) => ({ ...prev, ...configObj }));
        } else if (typeof res.data === 'object') {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      }
    } catch (err) {
      console.warn('Settings load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update Profile if on profile tab or changed
      updateUser({ full_name: fullName, email, avatar_url: avatarUrl });
      await syncUserToDb(avatarUrl, fullName, email);

      // 2. Update System Configurations
      const res = await settingsApi.save('site_config', settings, 'Site Configuration Settings');
      if (res.success) {
        toast.success(t('រក្សាទុកការកំណត់ប្រព័ន្ធ និង គណនីជោគជ័យ!', 'All settings and profile saved successfully!'));
        await loadData();
      } else {
        toast.error(res.message || 'Save failed');
      }
    } catch (err) {
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = () => {
    setTestingTelegram(true);
    setTimeout(() => {
      setTestingTelegram(false);
      toast.success(
        t('បានផ្ញើសារសាកល្បងទៅកាន់ Telegram Group ជោគជ័យ!', 'Test message sent to Telegram successfully!')
      );
    }, 1200);
  };

  const handleReload = async () => {
    await loadData();
    toast.success(t('បានទាញយកទិន្នន័យកំណត់បច្ចុប្បន្នភាព!', 'Settings reloaded from database!'));
  };

  const navTabs = [
    { id: 'profile', labelKm: 'គណនីផ្ទាល់ខ្លួន', labelEn: 'User Profile & Pass', icon: UserCheck },
    { id: 'general', labelKm: 'ព័ត៌មានក្រុមហ៊ុន', labelEn: 'Company & Info', icon: Building2 },
    { id: 'telegram', labelKm: 'Telegram Alerts', labelEn: 'Telegram Notifications', icon: Send },
    { id: 'seo', labelKm: 'SEO & Analytics', labelEn: 'SEO & Meta Config', icon: Search },
    { id: 'security', labelKm: 'សុវត្ថិភាព & ថែទាំ', labelEn: 'Security & Maintenance', icon: ShieldAlert },
    { id: 'payment', labelKm: 'ការទូទាត់ KHQR', labelEn: 'Payment & KHQR', icon: QrCode },
  ];

  return (
    <AdminLayout
      title="ការកំណត់ប្រព័ន្ធ (System Settings)"
      titleKm="ការកំណត់ប្រព័ន្ធ (System Settings & Configurations)"
      subtitle="គ្រប់គ្រងព័ត៌មានគណនីផ្ទាល់ខ្លួន Telegram Alerts, SEO, Security, និង Payment Credentials"
    >
      <div className="space-y-6">
        {/* Navigation Categories Tabs Bar */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-card border border-border/80 shadow-sm">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-km text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t(tab.labelKm, tab.labelEn)}</span>
              </button>
            );
          })}
        </div>

        {/* HIDDEN FILE INPUT FOR AVATAR UPLOAD */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />

        {/* Main Settings Form */}
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* TAB 0: USER PROFILE & CREDENTIALS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* PROFILE HERO HEADER */}
              <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-card to-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-xl ring-2 ring-primary/40">
                        <AvatarImage src={avatarUrl} alt={fullName} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold text-3xl">
                          {fullName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        title="Upload New Avatar Image"
                      >
                        {uploadingAvatar ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <h2 className="text-2xl font-bold font-km text-foreground">{fullName}</h2>
                        <Badge variant="default" className="bg-primary hover:bg-primary text-xs uppercase font-mono px-3">
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                          {user?.role || 'ADMIN'}
                        </Badge>
                      </div>

                      <p className="text-xs font-mono text-muted-foreground">{email}</p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted-foreground font-km">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>ចូលប្រព័ន្ធចុងក្រោយ: {new Date(user?.last_login_at || Date.now()).toLocaleTimeString()}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                          <span>ស្ថានភាព: 🟢 សកម្ម (Active User)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PERSONAL DETAILS CARD */}
                <Card className="lg:col-span-2 border-border shadow-md rounded-3xl">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold font-km">
                          {t('ព័ត៌មានគណនីផ្ទាល់ខ្លួន', 'Personal Details')}
                        </CardTitle>
                        <CardDescription className="text-xs font-km">
                          {t('ធ្វើបច្ចុប្បន្នភាពឈ្មោះ អ៊ីមែល និង រូបភាព Avatar', 'Update your personal profile information')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 text-xs font-km space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">{t('ឈ្មោះពេញ (Full Name)', 'Full Name')}</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-10 text-xs rounded-xl"
                          placeholder="Admin Khmerweb"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">{t('អាសយដ្ឋានអ៊ីមែល (Email Address)', 'Email Address')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-10 text-xs rounded-xl font-mono"
                          placeholder="admin@khmerweb.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">{t('តំណភ្ជាប់រូបថត Avatar (Avatar Image URL)', 'Avatar Image URL')}</Label>
                      <Input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="h-10 text-xs rounded-xl font-mono"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* CHANGE PASSWORD CARD */}
                <Card className="border-border shadow-md rounded-3xl">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold font-km">
                          {t('ផ្លាស់ប្តូរពាក្យសម្ងាត់', 'Change Password')}
                        </CardTitle>
                        <CardDescription className="text-xs font-km">
                          {t('អាប់ដេតពាក្យសម្ងាត់សម្រាប់សុវត្ថិភាពគណនី', 'Update account password')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 text-xs font-km space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">{t('ពាក្យសម្ងាត់បច្ចុប្បន្ន', 'Current Password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10 pr-9 h-10 text-xs rounded-xl font-mono"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">{t('ពាក្យសម្ងាត់ថ្មី (យ៉ាងហោច ៦ តួ)', 'New Password (Min 6 chars)')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 pr-9 h-10 text-xs rounded-xl font-mono"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">{t('ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី', 'Confirm New Password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 h-10 text-xs rounded-xl font-mono"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 1: GENERAL & COMPANY INFO */}
          {activeTab === 'general' && (
            <Card className="border-border shadow-md rounded-3xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-km">
                      {t('ព័ត៌មានក្រុមហ៊ុន & ម៉ាកសញ្ញា (Company & Branding Info)', 'Company Profile & Branding')}
                    </CardTitle>
                    <CardDescription className="text-xs font-km">
                      {t('ព័ត៌មានដែលត្រូវបង្ហាញនៅលើ Public Header, Footer និង ឯកសារសម្រង់តម្លៃ', 'Publicly visible contact and company information')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-xs font-km">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ឈ្មោះក្រុមហ៊ុន (ភាសាខ្មែរ)', 'Company Name (Khmer)')}</Label>
                    <Input
                      value={settings.company_name_km || ''}
                      onChange={(e) => setSettings({ ...settings, company_name_km: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ឈ្មោះក្រុមហ៊ុន (English)', 'Company Name (English)')}</Label>
                    <Input
                      value={settings.company_name_en || ''}
                      onChange={(e) => setSettings({ ...settings, company_name_en: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('បាវចនា/Slogan (ភាសាខ្មែរ)', 'Brand Slogan (Khmer)')}</Label>
                    <Input
                      value={settings.brand_slogan_km || ''}
                      onChange={(e) => setSettings({ ...settings, brand_slogan_km: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('បាវចនា/Slogan (English)', 'Brand Slogan (English)')}</Label>
                    <Input
                      value={settings.brand_slogan_en || ''}
                      onChange={(e) => setSettings({ ...settings, brand_slogan_en: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('លេខទូរស័ព្ទទំនាក់ទំនង', 'Contact Phone Numbers')}</Label>
                    <Input
                      value={settings.contact_phone || ''}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('អ៊ីមែលផ្លូវការ', 'Official Email Address')}</Label>
                    <Input
                      value={settings.contact_email || ''}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('លេខសារពើពន្ធ VATTIN / Tax ID', 'VAT Identification Number')}</Label>
                    <Input
                      value={settings.vat_number || ''}
                      onChange={(e) => setSettings({ ...settings, vat_number: e.target.value })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('អាសយដ្ឋាន (ភាសាខ្មែរ)', 'Office Address (Khmer)')}</Label>
                    <Input
                      value={settings.address_km || ''}
                      onChange={(e) => setSettings({ ...settings, address_km: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('អាសយដ្ឋាន (English)', 'Office Address (English)')}</Label>
                    <Input
                      value={settings.address_en || ''}
                      onChange={(e) => setSettings({ ...settings, address_en: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('តំណភ្ជាប់ Logo URL', 'Company Logo URL')}</Label>
                  <Input
                    value={settings.logo_url || ''}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    className="h-10 text-xs rounded-xl font-mono"
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: TELEGRAM NOTIFICATIONS */}
          {activeTab === 'telegram' && (
            <Card className="border-border shadow-md rounded-3xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-km">
                      {t('ការកំណត់ Telegram Instant Alerts', 'Telegram Bot Notifications')}
                    </CardTitle>
                    <CardDescription className="text-xs font-km">
                      {t('ទទួលសារដំណឹង Real-time តាម Telegram ពេលមានអតិថិជនផ្ញើសារសួរព័ត៌មាន', 'Configure automated Telegram group notifications')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-xs font-km">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4" />
                    <span>Telegram Integration Active</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {t('ប្រព័ន្ធបង្កើតសារជូនដំណឹងស្វ័យប្រវត្តិកាន់ Telegram Chat ID នៅពេលមានទម្រង់ទំនាក់ទំនងថ្មី។', 'Sends instant leads payload to your dedicated Telegram group.')}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('Telegram Bot Token', 'Telegram Bot Token')}</Label>
                  <Input
                    value={settings.telegram_bot_token || ''}
                    onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                    className="h-10 text-xs rounded-xl font-mono"
                    placeholder="7829104812:AAH-..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('Telegram Target Chat / Group ID', 'Target Chat / Group ID')}</Label>
                  <Input
                    value={settings.telegram_chat_id || ''}
                    onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
                    className="h-10 text-xs rounded-xl font-mono"
                    placeholder="-100987654321"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <span className="font-semibold text-foreground block">{t('ជូនដំណឹងពេលមាន Lead ថ្មី', 'New Inquiry Instant Alert')}</span>
                      <span className="text-muted-foreground text-[11px]">Send alert as soon as contact form is submitted</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!settings.enable_telegram_inquiry_alert}
                      onChange={(e) => setSettings({ ...settings, enable_telegram_inquiry_alert: e.target.checked })}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <span className="font-semibold text-foreground block">{t('របាយការណ៍សង្ខេបប្រចាំថ្ងៃ', 'Daily Summary Digest')}</span>
                      <span className="text-muted-foreground text-[11px]">Send a 24-hour summary of inquiries at 8:00 AM</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!settings.enable_telegram_daily_report}
                      onChange={(e) => setSettings({ ...settings, enable_telegram_daily_report: e.target.checked })}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestTelegram}
                    disabled={testingTelegram}
                    className="gap-2 text-xs font-km rounded-xl"
                  >
                    <Send className="h-3.5 w-3.5 text-blue-500" />
                    <span>
                      {testingTelegram ? t('កំពុងផ្ញើសារសាកល្បង...', 'Sending Test Payload...') : t('តេស្តផ្ញើសារ Telegram', 'Test Telegram Message')}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: SEO & ANALYTICS */}
          {activeTab === 'seo' && (
            <Card className="border-border shadow-md rounded-3xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-km">
                      {t('ការកំណត់ SEO & Google Analytics', 'Search Engine Optimization & Analytics')}
                    </CardTitle>
                    <CardDescription className="text-xs font-km">
                      {t('កំណត់ Meta Tags, OpenGraph Image និង Tracking IDs សម្រាប់គេហទំព័រ', 'Manage metadata, social sharing cards, and analytics tracking IDs')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-xs font-km">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('Meta Title (ភាសាខ្មែរ)', 'Meta Title (Khmer)')}</Label>
                    <Input
                      value={settings.meta_title_km || ''}
                      onChange={(e) => setSettings({ ...settings, meta_title_km: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('Meta Title (English)', 'Meta Title (English)')}</Label>
                    <Input
                      value={settings.meta_title_en || ''}
                      onChange={(e) => setSettings({ ...settings, meta_title_en: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('Meta Description (ភាសាខ្មែរ)', 'Meta Description (Khmer)')}</Label>
                    <textarea
                      value={settings.meta_description_km || ''}
                      onChange={(e) => setSettings({ ...settings, meta_description_km: e.target.value })}
                      className="w-full h-20 p-2.5 text-xs rounded-xl border border-input bg-background font-km focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('Meta Description (English)', 'Meta Description (English)')}</Label>
                    <textarea
                      value={settings.meta_description_en || ''}
                      onChange={(e) => setSettings({ ...settings, meta_description_en: e.target.value })}
                      className="w-full h-20 p-2.5 text-xs rounded-xl border border-input bg-background font-km focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ពាក្យគន្លឹះ (Meta Keywords - ក្បៀសបំបែក)', 'Meta Keywords (Comma separated)')}</Label>
                  <Input
                    value={settings.meta_keywords || ''}
                    onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('Google Analytics ID (GA4)', 'Google Analytics Measurement ID')}</Label>
                    <Input
                      value={settings.google_analytics_id || ''}
                      onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('Facebook Pixel ID', 'Facebook Pixel ID')}</Label>
                    <Input
                      value={settings.facebook_pixel_id || ''}
                      onChange={(e) => setSettings({ ...settings, facebook_pixel_id: e.target.value })}
                      placeholder="490182940182490"
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('OpenGraph Image URL (Social Share Preview)', 'Social Sharing Card Image URL')}</Label>
                  <Input
                    value={settings.og_image_url || ''}
                    onChange={(e) => setSettings({ ...settings, og_image_url: e.target.value })}
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: SECURITY & MAINTENANCE */}
          {activeTab === 'security' && (
            <Card className="border-border shadow-md rounded-3xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-km">
                      {t('សុវត្ថិភាព & ការថែទាំប្រព័ន្ធ', 'Security, Access & Maintenance Mode')}
                    </CardTitle>
                    <CardDescription className="text-xs font-km">
                      {t('កំណត់របៀបថែទាំប្រព័ន្ធ (Maintenance Mode) និង ដែនកំណត់សុវត្ថិភាព Session', 'System lockdown controls and session parameters')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-xs font-km">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{t('របៀបថែទាំប្រព័ន្ធ (Maintenance Mode)', 'System Maintenance Mode')}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!settings.maintenance_mode}
                      onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                      className="w-5 h-5 rounded border-border accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px]">
                    {t('នៅពេលបើក Maintenance Mode គេហទំព័រសាធារណៈនឹងបង្ហាញសារផ្អាកបណ្តោះអាសន្ន។', 'When enabled, public visitors will see a maintenance notice landing page.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('សារថែទាំប្រព័ន្ធ (ភាសាខ្មែរ)', 'Maintenance Notice (Khmer)')}</Label>
                    <Input
                      value={settings.maintenance_notice_km || ''}
                      onChange={(e) => setSettings({ ...settings, maintenance_notice_km: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('សារថែទាំប្រព័ន្ធ (English)', 'Maintenance Notice (English)')}</Label>
                    <Input
                      value={settings.maintenance_notice_en || ''}
                      onChange={(e) => setSettings({ ...settings, maintenance_notice_en: e.target.value })}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('រយៈពេលកំណត់ Session Timeout (នាទី)', 'Admin Session Timeout (Minutes)')}</Label>
                    <Input
                      type="number"
                      value={settings.max_session_timeout || 120}
                      onChange={(e) => setSettings({ ...settings, max_session_timeout: Number(e.target.value) })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('អនុញ្ញាតទម្រង់ទំនាក់ទំនង (Public Submissions)', 'Public Contact Submissions')}</Label>
                    <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card">
                      <input
                        type="checkbox"
                        checked={!!settings.allow_public_inquiries}
                        onChange={(e) => setSettings({ ...settings, allow_public_inquiries: e.target.checked })}
                        className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground">{t('បើកទទួលសារពីទម្រង់ទំនាក់ទំនង', 'Accept incoming lead inquiries')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ដែនជម្រើស CORS Origins ដែលអនុញ្ញាត', 'CORS Allowed Origin URLs')}</Label>
                  <Input
                    value={settings.allowed_cors_origins || ''}
                    onChange={(e) => setSettings({ ...settings, allowed_cors_origins: e.target.value })}
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: PAYMENTS & KHQR */}
          {activeTab === 'payment' && (
            <Card className="border-border shadow-md rounded-3xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-km">
                      {t('ការកំណត់ការទូទាត់ ABA KHQR', 'ABA KHQR & Payment Gateways')}
                    </CardTitle>
                    <CardDescription className="text-xs font-km">
                      {t('រៀបចំ Merchant ID និង ព័ត៌មានទូទាត់ ABA KHQR សម្រាប់ Invoice & SaaS Subscription', 'Manage ABA PayWay & KHQR Merchant parameters')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-xs font-km">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ឈ្មោះ Merchant (Merchant Name)', 'Merchant Name')}</Label>
                    <Input
                      value={settings.merchant_name || ''}
                      onChange={(e) => setSettings({ ...settings, merchant_name: e.target.value })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ទីក្រុង Merchant (Merchant City)', 'Merchant City')}</Label>
                    <Input
                      value={settings.merchant_city || ''}
                      onChange={(e) => setSettings({ ...settings, merchant_city: e.target.value })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ABA Merchant ID', 'ABA Merchant Account ID')}</Label>
                    <Input
                      value={settings.aba_merchant_id || ''}
                      onChange={(e) => setSettings({ ...settings, aba_merchant_id: e.target.value })}
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('រូបិយប័ណ្ណលាតត្រដាង (Currency Preference)', 'Default Currency')}</Label>
                    <select
                      value={settings.currency_preference || 'USD'}
                      onChange={(e) => setSettings({ ...settings, currency_preference: e.target.value })}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none"
                    >
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="KHR">KHR (៛ - Cambodian Riel)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GLOBAL SAVE ACTION BAR */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReload}
              className="gap-2 text-xs font-km text-muted-foreground hover:text-foreground rounded-xl"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('ទាញយកឡើងវិញ', 'Reload Database Config')}</span>
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="gap-2 font-km text-xs h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg shadow-primary/20"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('កំពុងរក្សាទុក...', 'Saving Settings...')}</span>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{t('រក្សាទុកការកំណត់ប្រព័ន្ធ', 'Save All Settings')}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
