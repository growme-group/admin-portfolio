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

                {/* UPLOAD CAMERA BUTTON OVERLAY */}
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

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-km">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="gap-2 text-xs font-km rounded-xl h-8 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>{uploadingAvatar ? t('កំពុងអាប់ឡូត...', 'Uploading...') : t('ជ្រើសរើសរូបថត Avatar', 'Upload Avatar Image')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: EDIT PROFILE FORM */}
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
            <CardContent className="pt-6">
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-km">
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
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">{t('តំណភ្ជាប់រូបថត Avatar (Avatar Image URL)', 'Avatar Image URL')}</Label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <UploadCloud className="h-3 w-3" />
                      <span>{t('អាប់ឡូតរូបថ្មី', 'Browse File')}</span>
                    </button>
                  </div>
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="h-10 text-xs rounded-xl font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="gap-2 font-km text-xs h-10 px-6 rounded-xl bg-primary hover:bg-primary/90"
                  >
                    {savingProfile ? (
                      <span>{t('កំពុងរក្សាទុក...', 'Saving...')}</span>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{t('រក្សាទុកព័ត៌មាន', 'Save Profile')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT: CHANGE PASSWORD FORM */}
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
            <CardContent className="pt-6">
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-km">
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

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={changingPass}
                    className="w-full gap-2 font-km text-xs h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {changingPass ? (
                      <span>{t('កំពុងផ្លាស់ប្តូរ...', 'Updating...')}</span>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        <span>{t('ប្តូរពាក្យសម្ងាត់', 'Update Password')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
