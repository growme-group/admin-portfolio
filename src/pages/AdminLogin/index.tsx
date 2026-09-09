import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Globe,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';

export const AdminLogin = () => {
  const { login } = useAuth();
  const { language, setLanguage, t, fontClass } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@khmerweb.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  // Check NestJS Backend Connectivity on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => {
        setApiOnline(res.ok);
      })
      .catch(() => {
        setApiOnline(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      const msg = t('សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់', 'Please fill in email and password');
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(t('ចូលប្រព័ន្ធជោគជ័យ!', 'Welcome back! Login Successful.'));
        navigate(from, { replace: true });
      } else {
        const errStr = res.message || t('ការចូលប្រព័ន្ធមិនបានសម្រេច', 'Invalid email or password');
        setErrorMessage(errStr);
        toast.error(errStr);
      }
    } catch (err: any) {
      const errStr = t('មិនអាចភ្ជាប់ទៅកាន់ Backend Server បានទេ', 'Cannot connect to backend server');
      setErrorMessage(errStr);
      toast.error(errStr);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none ${fontClass}`}>
      {/* Animated Aesthetic Background Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] bg-primary/25 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] bg-indigo-500/25 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-emerald-500 text-white font-extrabold flex items-center justify-center text-2xl shadow-xl shadow-primary/20">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-foreground font-km tracking-tight">Khmerweb Grow Pro</span>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-mono">
                PRO ADMIN
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground font-medium block">
              Enterprise Web System & SaaS Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Backend Connection Status Badge */}
          <Badge
            variant="outline"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full ${
              apiOnline === true
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                : apiOnline === false
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>
              {apiOnline === true
                ? 'Cloud API Live (Render)'
                : apiOnline === false
                ? 'API Disconnected'
                : 'Connecting API...'}
            </span>
          </Badge>

          {/* Language Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="gap-1.5 text-xs font-semibold rounded-xl border-border/80 hover:bg-muted"
          >
            <Globe className="h-4 w-4 text-primary" />
            <span>{language === 'km' ? 'ភាសាខ្មែរ' : 'English'}</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-700" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Login Card Center */}
      <main className="w-full max-w-md mx-auto my-auto z-10 pt-4 pb-4">
        <div className="glass-card border border-border/70 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-600 to-emerald-500" />

          {/* Header Banner */}
          <div className="space-y-2 text-center pt-8 pb-6 px-6 border-b border-border/50 bg-muted/20 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/20 to-indigo-500/20 text-primary mx-auto flex items-center justify-center mb-1 shadow-inner border border-primary/20">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-km tracking-tight text-foreground">
              {t('ចូលប្រព័ន្ធអ្នកគ្រប់គ្រង', 'Admin Portal Login')}
            </h2>
            <p className="font-km text-xs text-muted-foreground max-w-xs mx-auto">
              {t('សូមបញ្ចូលអ៊ីមែល និង ពាក្យសម្ងាត់ដើម្បីគ្រប់គ្រងប្រព័ន្ធ', 'Sign in with your administrator credentials')}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 p-6">
              {/* Error Alert Notice */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 font-km animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold font-km text-foreground">
                  {t('អ៊ីមែលគណនី (Email)', 'Email Address')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@khmerweb.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 text-xs rounded-xl bg-background/60 border-border/80 focus:ring-2 focus:ring-primary/30 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold font-km text-foreground">
                    {t('ពាក្យសម្ងាត់ (Password)', 'Password')}
                  </Label>
                  <button
                    type="button"
                    onClick={() => toast.info(t('សូមប្រើពាក្យសម្ងាត់ admin123 សម្រាប់គណនីគំរូ', 'Demo password is admin123'))}
                    className="text-[11px] font-km text-primary hover:underline"
                  >
                    {t('ភ្លេចពាក្យសម្ងាត់?', 'Forgot password?')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 text-xs rounded-xl bg-background/60 border-border/80 focus:ring-2 focus:ring-primary/30 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor="remember" className="text-xs font-km text-muted-foreground cursor-pointer">
                    {t('ចងចាំគណនីខ្ញុំ (Remember me)', 'Remember me on this device')}
                  </Label>
                </div>
              </div>

              {/* Demo Accounts Autofill Box */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground font-km flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{t('គណនីសាកល្បងលឿន (1-Click Demo Fill):', 'Quick Demo Accounts:')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] font-mono justify-start gap-1.5 rounded-xl bg-background/80 hover:border-primary/50"
                    onClick={() => fillDemo('admin@khmerweb.com', 'admin123')}
                  >
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Admin</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] font-mono justify-start gap-1.5 rounded-xl bg-background/80 hover:border-indigo-500/50"
                    onClick={() => fillDemo('editor@khmerweb.com', '123456')}
                  >
                    <KeyRound className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Editor</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Footer Action */}
            <div className="p-6 pt-0">
              <Button
                type="submit"
                className="w-full h-11 text-xs font-bold rounded-xl gap-2 font-km bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('កំពុងផ្ទៀងផ្ទាត់គណនី...', 'Authenticating with Backend...')}</span>
                  </div>
                ) : (
                  <>
                    <span>{t('ចូលប្រព័ន្ធគ្រប់គ្រង (Log In)', 'Log In to Admin Dashboard')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full text-center text-xs text-muted-foreground z-10 py-3 font-km flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto border-t border-border/40 gap-2">
        <span>© 2026 Khmerweb Grow Pro. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">API Docs (Swagger)</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
