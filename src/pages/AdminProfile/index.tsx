import React, { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usersApi, uploadApi } from '@/lib/api';
import {
  UserCheck,
  ShieldCheck,
  KeyRound,
  Mail,
  User as UserIcon,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UploadCloud,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.full_name || 'Admin Khmerweb');
  const [email, setEmail] = useState(user?.email || 'admin@khmerweb.com');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  ];

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
        toast.success(t('បានអាប់ឡូតរូបថត Avatar និង រក្សាទុកក្នុង DB ជោគជ័យ!', 'Avatar uploaded and saved to DB successfully!'));
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error(t('សូមបញ្ចូលឈ្មោះពេញ និង អ៊ីមែល', 'Please fill in full name and email'));
      return;
    }

    setSavingProfile(true);
    try {
      updateUser({ full_name: fullName, email, avatar_url: avatarUrl });
      await syncUserToDb(avatarUrl, fullName, email);
      toast.success(t('ធ្វើបច្ចុប្បន្នភាពព័ត៌មានគណនីក្នុង DB ជោគជ័យ!', 'Profile updated in DB successfully!'));
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error(t('សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន', 'Please enter current password'));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ', 'New password must be at least 6 characters'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាឡើយ', 'Confirm password does not match'));
      return;
    }

    setChangingPass(true);
    try {
      if (user?.id && !user.id.startsWith('usr-')) {
        const res = await usersApi.update(user.id, {
          password: newPassword,
        });
        if (res.success) {
          toast.success(t('ផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ!', 'Password changed successfully!'));
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          toast.error(res.message || 'Password update failed');
        }
      } else {
        toast.success(t('ផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ!', 'Password changed successfully!'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error('Password change failed');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <AdminLayout
      title="ការកំណត់គណនី (Profile Settings)"
      titleKm="ការកំណត់គណនីផ្ទាល់ខ្លួន"
      subtitle="គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន អាប់ឡូតរូបថតតំណាង Avatar និង ផ្លាស់ប្តូរពាក្យសម្ងាត់សុវត្ថិភាព"
      subtitleKm="គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន អាប់ឡូតរូបថតតំណាង Avatar និង ផ្លាស់ប្តូរពាក្យសម្ងាត់សុវត្ថិភាព"
    >
      <div className="max-w-5xl space-y-6">
        {/* HIDDEN FILE INPUT FOR AVATAR UPLOAD */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />

        {/* TOP PROFILE HERO CARD */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border/70 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-600 to-emerald-500" />
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-2xl ring-2 ring-primary/40">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-3xl">
                  {fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* UPLOAD CAMERA BUTTON OVERLAY */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
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
                <Badge
                  variant="default"
                  className="bg-primary/10 text-primary border border-primary/20 text-xs uppercase font-mono px-3 py-0.5"
                >
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
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ស្ថានភាព: 🟢 សកម្ម (Active User)</span>
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="gap-2 text-xs font-km rounded-xl h-9 border-border/70 hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
            >
              <UploadCloud className="h-4 w-4 text-primary" />
              <span>{uploadingAvatar ? t('កំពុងអាប់ឡូត...', 'Uploading...') : t('ប្តូររូបភាព Avatar', 'Change Avatar')}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: EDIT PROFILE FORM */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-border/70 shadow-sm overflow-hidden">
            <div className="border-b border-border/50 p-5 bg-muted/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-inner">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-km text-foreground">
                  {t('ព័ត៌មានគណនីផ្ទាល់ខ្លួន', 'Personal Details')}
                </h3>
                <p className="text-xs font-km text-muted-foreground mt-0.5">
                  {t('ធ្វើបច្ចុប្បន្នភាពឈ្មោះ អ៊ីមែល និង រូបភាព Avatar', 'Update your personal profile information')}
                </p>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-km">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('ឈ្មោះពេញ (Full Name)', 'Full Name')}</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-10 text-xs rounded-xl bg-background/60 border-border/70"
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
                      className="pl-10 h-10 text-xs rounded-xl font-mono bg-background/60 border-border/70"
                      placeholder="admin@khmerweb.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('តំណភ្ជាប់រូបថត (Avatar URL)', 'Avatar Image URL')}</Label>
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="h-10 text-xs rounded-xl font-mono bg-background/60 border-border/70"
                  />
                </div>

                {/* SAMPLE AVATARS PICKER */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs text-muted-foreground font-km block">
                    {t('ឬជ្រើសរើសរូបថតគំរូរហ័ស:', 'Or choose a sample avatar:')}
                  </Label>
                  <div className="flex items-center gap-3">
                    {sampleAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          avatarUrl === url
                            ? 'border-primary ring-2 ring-primary/40 scale-105 shadow-md'
                            : 'border-border/60 hover:border-primary/50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`sample-${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="gap-2 text-xs font-km h-10 px-5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-md shadow-primary/25 font-bold hover:scale-[1.02] transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingProfile ? t('កំពុងរក្សាទុក...', 'Saving...') : t('រក្សាទុកព័ត៌មានគណនី', 'Save Profile')}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: SECURITY & PASSWORD CHANGE */}
          <div className="glass-card rounded-2xl border border-border/70 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="border-b border-border/50 p-5 bg-muted/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-inner">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-km text-foreground">
                    {t('ពាក្យសម្ងាត់ & សុវត្ថិភាព', 'Security & Password')}
                  </h3>
                  <p className="text-xs font-km text-muted-foreground mt-0.5">
                    {t('ផ្លាស់ប្តូរពាក្យសម្ងាត់ការពារគណនី', 'Change access credentials')}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-km">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ពាក្យសម្ងាត់បច្ចុប្បន្ន', 'Current Password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 pr-10 h-10 text-xs rounded-xl font-mono bg-background/60 border-border/70"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t('ពាក្យសម្ងាត់ថ្មី', 'New Password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 h-10 text-xs rounded-xl font-mono bg-background/60 border-border/70"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
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
                        className="pl-10 h-10 text-xs rounded-xl font-mono bg-background/60 border-border/70"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground space-y-1">
                    <span className="font-bold text-foreground block">{t('លក្ខខណ្ឌសុវត្ថិភាព:', 'Security Guidelines:')}</span>
                    <p>• {t('យ៉ាងតិច ៦ តួអក្សរឡើងទៅ', 'At least 6 characters long')}</p>
                    <p>• {t('គួរបញ្ចូលទាំងអក្សរធំ តូច និងលេខ', 'Mix uppercase, lowercase & numbers')}</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={changingPass}
                    className="w-full gap-2 text-xs font-km h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md font-bold hover:scale-[1.01] transition-all"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>{changingPass ? t('កំពុងប្តូរ...', 'Updating...') : t('ផ្លាស់ប្តូរពាក្យសម្ងាត់', 'Update Password')}</span>
                  </Button>
                </form>
              </div>
            </div>

            <div className="p-4 border-t border-border/50 bg-muted/10 text-center">
              <span className="text-[11px] text-muted-foreground font-mono flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Session Encrypted with JWT & bcrypt
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
