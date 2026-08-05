import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Boxes,
  CreditCard,
  HelpCircle,
  MessageSquareQuote,
  Settings,
  Users,
  LogOut,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  UserCheck
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

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  titleKm?: string;
  subtitle?: string;
  subtitleKm?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  titleKm,
  subtitle,
  subtitleKm,
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, fontClass } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      path: '/',
      labelKm: 'ផ្ទាំងគ្រប់គ្រង',
      labelEn: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      path: '/portfolio',
      labelKm: 'គ្រប់គ្រង Portfolio',
      labelEn: 'Portfolio Projects',
      icon: FolderKanban,
    },
    {
      path: '/inquiries',
      labelKm: 'សារទំនាក់ទំនង',
      labelEn: 'Customer Inquiries',
      icon: MessageSquare,
    },
    {
      path: '/services',
      labelKm: 'គ្រប់គ្រងសេវាកម្ម',
      labelEn: 'Service Catalog',
      icon: Boxes,
    },
    {
      path: '/pricing',
      labelKm: 'គ្រប់គ្រងកញ្ចប់តម្លៃ',
      labelEn: 'Pricing Plans',
      icon: CreditCard,
    },
    {
      path: '/faqs',
      labelKm: 'សំណួរញឹកញាប់',
      labelEn: 'FAQs List',
      icon: HelpCircle,
    },
    {
      path: '/testimonials',
      labelKm: 'មតិអតិថិជន',
      labelEn: 'Client Testimonials',
      icon: MessageSquareQuote,
    },
    {
      path: '/users',
      labelKm: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
      labelEn: 'Users Management',
      icon: Users,
    },
    {
      path: '/settings',
      labelKm: 'ការកំណត់ប្រព័ន្ធ',
      labelEn: 'System Settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`h-screen overflow-hidden bg-background flex text-foreground font-sans ${fontClass}`}>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* FIXED SIDEBAR NAVIGATION */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-screen bg-card border-r border-border flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* BRAND HEADER */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg shadow-md">
              K
            </div>
            <div>
              <span className="font-bold text-base block leading-tight font-km">Khmerweb Grow Pro</span>
              <span className="text-[10px] text-muted-foreground block font-medium">Standalone Admin App</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-km">{t(item.labelKm, item.labelEn)}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SITE LINK */}
        <div className="p-4 border-t border-border">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t('មើលគេហទំព័រសាធារណៈ', 'View Main Website')}</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR HEADER (Clean Bar without inline title) */}
        <header className="h-16 border-b border-border px-4 lg:px-8 bg-card/40 backdrop-blur-md shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* TOPBAR CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
              className="gap-1.5 text-xs font-semibold px-2.5 h-8 border border-border/60"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{language === 'km' ? 'ខ្មែរ (KM)' : 'English (EN)'}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 px-2 gap-2 rounded-full hover:bg-accent cursor-pointer">
                  <Avatar className="h-8 w-8 border-2 border-primary/30 shadow-sm ring-1 ring-primary/20">
                    <AvatarImage src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} alt={user?.full_name || 'Admin'} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {user?.full_name?.slice(0, 2).toUpperCase() || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <span className="text-xs font-semibold block leading-tight">{user?.full_name || 'Admin'}</span>
                    <span className="text-[10px] text-muted-foreground capitalize block">{user?.role || 'admin'}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-km">{t('ព័ត៌មានគណនី', 'Account Profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="font-km">{t('ចាកចេញ (Logout)', 'Logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* MAIN BODY AREA WITH IN-PAGE TITLE & SUBTITLE */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* PAGE TITLE & SUBTITLE HEADER IN BODY */}
          {(title || titleKm) && (
            <div className="mb-5 pb-3 border-b border-border/50">
              <h1 className="text-lg sm:text-xl font-bold text-foreground font-km tracking-tight">
                {t(titleKm || title, title)}
              </h1>
              {(subtitle || subtitleKm) && (
                <p className="text-xs text-muted-foreground mt-1 font-km leading-relaxed">
                  {t(subtitleKm || subtitle || '', subtitle || '')}
                </p>
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
