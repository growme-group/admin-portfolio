import React, { useState, useEffect, useMemo } from 'react';
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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Search,
  X,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { inquiriesApi } from '@/lib/api';

export interface NavGroupItem {
  path: string;
  labelKm: string;
  labelEn: string;
  subKm?: string;
  subEn?: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export interface NavGroup {
  id: string;
  titleKm: string;
  titleEn: string;
  items: NavGroupItem[];
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [unreadInquiries, setUnreadInquiries] = useState<number>(0);

  // Fetch unread inquiries count for badge
  useEffect(() => {
    let isMounted = true;
    const fetchInquiriesCount = async () => {
      try {
        const res = await inquiriesApi.getAll();
        if (isMounted && res.success && Array.isArray(res.data)) {
          const count = res.data.filter(
            (item: any) => item.status === 'new' || item.status === 'unread'
          ).length;
          setUnreadInquiries(count);
        }
      } catch {
        // Silently catch in dev
      }
    };
    fetchInquiriesCount();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        id: 'overview',
        titleKm: 'ទិដ្ឋភាពទូទៅ',
        titleEn: 'Overview',
        items: [
          {
            path: '/',
            labelKm: 'ផ្ទាំងគ្រប់គ្រង',
            labelEn: 'Dashboard',
            subKm: 'សង្ខេបស្ថិតិ & ទិន្នន័យ',
            subEn: 'Analytics & Overview',
            icon: LayoutDashboard,
          },
        ],
      },
      {
        id: 'content',
        titleKm: 'គ្រប់គ្រងមាតិកា',
        titleEn: 'Content & Services',
        items: [
          {
            path: '/portfolio',
            labelKm: 'ស្នាដៃ Portfolio',
            labelEn: 'Portfolio Projects',
            subKm: 'គ្រប់គ្រងគម្រោងទាំងអស់',
            subEn: 'Showcase & Case Studies',
            icon: FolderKanban,
          },
          {
            path: '/services',
            labelKm: 'សេវាកម្ម',
            labelEn: 'Services Catalog',
            subKm: 'កាតាឡុកសេវាកម្ម',
            subEn: 'Offerings & Features',
            icon: Boxes,
          },
          {
            path: '/pricing',
            labelKm: 'កញ្ចប់តម្លៃ',
            labelEn: 'Pricing Plans',
            subKm: 'ផែនការតម្លៃ & កញ្ចប់',
            subEn: 'Subscription Tiers',
            icon: CreditCard,
          },
          {
            path: '/testimonials',
            labelKm: 'មតិអតិថិជន',
            labelEn: 'Client Reviews',
            subKm: 'មតិកែលម្អ & ការវាយតម្លៃ',
            subEn: 'Testimonials & Ratings',
            icon: MessageSquareQuote,
          },
          {
            path: '/faqs',
            labelKm: 'សំណួរញឹកញាប់',
            labelEn: 'FAQ Library',
            subKm: 'សំណួរ និងចម្លើយ',
            subEn: 'Questions & Answers',
            icon: HelpCircle,
          },
        ],
      },
      {
        id: 'inquiries',
        titleKm: 'ទំនាក់ទំនង',
        titleEn: 'Communication',
        items: [
          {
            path: '/inquiries',
            labelKm: 'សារទំនាក់ទំនង',
            labelEn: 'Customer Messages',
            subKm: 'សារពីអតិថិជន',
            subEn: 'Contact Submissions',
            icon: MessageSquare,
            badge: unreadInquiries > 0 ? unreadInquiries : undefined,
            badgeColor: 'bg-emerald-500 text-white',
          },
        ],
      },
      {
        id: 'system',
        titleKm: 'ប្រព័ន្ធ & សុវត្ថិភាព',
        titleEn: 'System & Admin',
        items: [
          {
            path: '/users',
            labelKm: 'អ្នកប្រើប្រាស់',
            labelEn: 'Users & Roles',
            subKm: 'គ្រប់គ្រងសិទ្ធិ & គណនី',
            subEn: 'Access Management',
            icon: Users,
          },

          {
            path: '/settings',
            labelKm: 'ការកំណត់ប្រព័ន្ធ',
            labelEn: 'System Settings',
            subKm: 'SEO, ឡូហ្គោ & ប្រព័ន្ធ',
            subEn: 'Configuration & SEO',
            icon: Settings,
          },
        ],
      },
    ],
    [unreadInquiries]
  );

  // Filter items if searching
  const filteredNavGroups = useMemo(() => {
    if (!searchQuery.trim()) return navGroups;
    const query = searchQuery.toLowerCase();
    return navGroups
      .map((group) => {
        const matchingItems = group.items.filter(
          (item) =>
            item.labelKm.toLowerCase().includes(query) ||
            item.labelEn.toLowerCase().includes(query) ||
            (item.subKm && item.subKm.toLowerCase().includes(query)) ||
            (item.subEn && item.subEn.toLowerCase().includes(query))
        );
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  }, [navGroups, searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <TooltipProvider delayDuration={150}>
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen bg-card/95 backdrop-blur-xl border-r border-border/70 flex flex-col shrink-0 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
          collapsed ? 'lg:w-20' : 'w-72 lg:w-72'
        }`}
      >
        {/* BRAND HEADER */}
        <div className="h-16 px-4 border-b border-border/60 flex items-center justify-between gap-2 bg-gradient-to-r from-card to-card/50">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            {/* LOGO ICON */}
            <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-sky-500 text-white font-black text-lg shadow-lg shadow-primary/25 ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
              <span>K</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
            </div>

            {/* BRAND TEXT (Expanded only) */}
            {!collapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-foreground truncate font-sans">
                    Khmerweb
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary/15 text-primary border border-primary/20">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-km truncate">
                  ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ
                </span>
              </div>
            )}
          </Link>

          {/* DESKTOP COLLAPSE TOGGLE BUTTON */}
          <div className="hidden lg:flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
                  aria-label={collapsed ? 'ពង្រីក Sidebar (Expand)' : 'បង្រួម Sidebar (Collapse)'}
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-km text-xs">
                {collapsed ? t('ពង្រីកផ្ទាំងចំហៀង', 'Expand Sidebar') : t('បង្រួមផ្ទាំងចំហៀង', 'Collapse Sidebar')}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* SEARCH BAR (Expanded only) */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ស្វែងរកម៉ឺនុយ...', 'Filter menu...')}
                className="w-full h-8 pl-8 pr-7 text-xs rounded-lg bg-muted/50 hover:bg-muted/80 focus:bg-background border border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60 transition-all outline-none font-km"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* NAVIGATION GROUPS CONTAINER */}
        <div className="flex-1 px-3 py-3 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
          {filteredNavGroups.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground font-km">
              {t('រកមិនឃើញម៉ឺនុយទេ', 'No menu found')}
            </div>
          ) : (
            filteredNavGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                {/* SECTION HEADER */}
                {!collapsed ? (
                  <div className="px-2.5 pb-1 pt-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 font-sans">
                    <span>{t(group.titleKm, group.titleEn)}</span>
                  </div>
                ) : (
                  <div className="my-2 border-t border-border/40 mx-2" />
                )}

                {/* NAV ITEMS */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path);

                    const linkContent = (
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          collapsed
                            ? 'justify-center p-2.5 mx-auto w-11 h-11'
                            : 'px-3 py-2.5 w-full'
                        } ${
                          isActive
                            ? 'bg-gradient-to-r from-primary via-primary/95 to-indigo-600 text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/70'
                        }`}
                      >
                        {/* ACTIVE GLOW PILL INDICATOR */}
                        {isActive && !collapsed && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white shadow-sm" />
                        )}

                        {/* ICON */}
                        <div
                          className={`shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                            isActive
                              ? 'text-white'
                              : 'text-muted-foreground group-hover:text-primary'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* EXPANDED TEXT CONTENT */}
                        {!collapsed && (
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                            <div className="flex flex-col min-w-0 text-left">
                              <span className="truncate leading-tight font-km text-xs sm:text-[13px]">
                                {t(item.labelKm, item.labelEn)}
                              </span>
                              {item.subKm && (
                                <span
                                  className={`truncate text-[10px] ${
                                    isActive
                                      ? 'text-white/80 font-normal'
                                      : 'text-muted-foreground/60'
                                  }`}
                                >
                                  {t(item.subKm, item.subEn || '')}
                                </span>
                              )}
                            </div>

                            {/* ITEM BADGE */}
                            {item.badge !== undefined && (
                              <span
                                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full shadow-sm shrink-0 ${
                                  isActive
                                    ? 'bg-white text-primary'
                                    : item.badgeColor || 'bg-primary text-primary-foreground'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {/* COLLAPSED BADGE DOT */}
                        {collapsed && item.badge !== undefined && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-card animate-pulse" />
                        )}
                      </Link>
                    );

                    if (collapsed) {
                      return (
                        <Tooltip key={item.path}>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="flex flex-col gap-0.5 py-1.5 px-3 font-km bg-popover text-popover-foreground border shadow-xl"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">
                                {t(item.labelKm, item.labelEn)}
                              </span>
                              {item.badge !== undefined && (
                                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.subKm && (
                              <span className="text-[10px] text-muted-foreground">
                                {t(item.subKm, item.subEn || '')}
                              </span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <div key={item.path}>{linkContent}</div>;
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* SIDEBAR FOOTER WIDGETS */}
        <div className="p-3 border-t border-border/60 bg-gradient-to-b from-card/30 to-card shrink-0">

          {/* USER PROFILE MINI CARD IN SIDEBAR */}
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-card hover:bg-accent/50 border border-border/50 transition-colors">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 min-w-0 flex-1 group"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 shadow-sm">
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
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-card rounded-full" />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {user?.full_name || 'Admin User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semibold">
                    {user?.role || 'Administrator'}
                  </span>
                </div>
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-km text-xs">
                  {t('ចាកចេញ (Logout)', 'Logout')}
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-11 h-11 mx-auto rounded-xl hover:bg-accent/80 transition-colors relative"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 shadow-sm">
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
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-card rounded-full" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-km text-xs">
                {user?.full_name || 'Admin Profile'} ({user?.role || 'admin'})
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AdminSidebar;
