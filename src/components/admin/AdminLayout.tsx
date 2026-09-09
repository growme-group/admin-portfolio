import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Globe,
  Sun,
  Moon,
  Menu,
  UserCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  PanelLeft,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  titleKm?: string;
  subtitle?: string;
  subtitleKm?: string;
  hideHeader?: boolean;
  headerAction?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  titleKm,
  subtitle,
  subtitleKm,
  hideHeader = false,
  headerAction,
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, fontClass } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('kw_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('kw_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`h-screen overflow-hidden bg-background flex text-foreground font-sans ${fontClass}`}>
      {/* REDESIGNED ADMIN SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR HEADER */}
        <header className="h-16 border-b border-border/70 px-4 lg:px-6 bg-card/60 backdrop-blur-xl shrink-0 flex items-center justify-between gap-4 z-10 transition-all">
          {/* LEFT: MOBILE TOGGLE & BREADCRUMB */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Open Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-9 w-9 rounded-xl border-border/60"
              onClick={() => setMobileOpen(true)}
              aria-label="បើកម៉ឺនុយ (Open Menu)"
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => setCollapsed((prev) => !prev)}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>

            {/* BREADCRUMB */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-km">
              <Link
                to="/"
                className="hover:text-foreground font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Admin</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              <span className="font-bold text-foreground truncate max-w-[200px]">
                {t(titleKm || title || '', title || '')}
              </span>
            </div>
          </div>

          {/* RIGHT: TOPBAR CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-2.5">




            {/* LANGUAGE SELECTOR */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
              className="gap-1.5 text-xs font-semibold px-2.5 h-8 rounded-lg border border-border/60 hover:bg-accent/80 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{language === 'km' ? 'ខ្មែរ (KM)' : 'English (EN)'}</span>
            </Button>

            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg border border-border/60 hover:bg-accent/80 transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 animate-in spin-in-90 duration-300" />
              )}
            </Button>

            <div className="h-5 w-px bg-border/60 hidden sm:block mx-0.5" />

            {/* USER PROFILE DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 px-2 gap-2 rounded-full hover:bg-accent/80 border border-transparent hover:border-border/60 cursor-pointer transition-all"
                >
                  <Avatar className="h-7 w-7 border-2 border-primary/40 shadow-sm ring-1 ring-primary/20">
                    <AvatarImage
                      src={
                        user?.avatar_url ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={user?.full_name || 'Admin'}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {user?.full_name?.slice(0, 2).toUpperCase() || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <span className="text-xs font-semibold block leading-tight truncate max-w-[120px]">
                      {user?.full_name || 'Admin User'}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
                      {user?.role || 'Administrator'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-1.5 shadow-xl border border-border/80">
                <DropdownMenuLabel className="font-normal p-2 bg-muted/40 rounded-lg mb-1">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold leading-none">{user?.full_name || 'Admin'}</p>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0 h-4">
                        {user?.role || 'Admin'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@khmerweb.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2.5 cursor-pointer py-2 rounded-lg font-km text-xs"
                  onClick={() => navigate('/profile')}
                >
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>{t('ព័ត៌មានគណនីផ្ទាល់ខ្លួន', 'My Account Profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2.5 cursor-pointer py-2 rounded-lg font-km text-xs"
                  onClick={() => navigate('/settings')}
                >
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  <span>{t('ការកំណត់ប្រព័ន្ធទូទៅ', 'System Settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2.5 cursor-pointer py-2 rounded-lg font-km text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('ចាកចេញពីប្រព័ន្ធ (Logout)', 'Sign Out')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* MAIN BODY AREA WITH IN-PAGE TITLE & SUBTITLE */}
        <main className="flex-1 p-4 lg:p-7 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/20 ambient-mesh">
          {/* PAGE TITLE & SUBTITLE HEADER IN BODY */}
          {!hideHeader && (title || titleKm) && (
            <div className="mb-6 pb-3 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground font-km tracking-tight flex items-center gap-2">
                  <span>{t(titleKm || title || '', title || '')}</span>
                </h1>
                {(subtitle || subtitleKm) && (
                  <p className="text-xs text-muted-foreground mt-1 font-km leading-relaxed max-w-3xl">
                    {t(subtitleKm || subtitle || '', subtitle || '')}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="flex-shrink-0 flex items-center gap-2">
                  {headerAction}
                </div>
              )}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
