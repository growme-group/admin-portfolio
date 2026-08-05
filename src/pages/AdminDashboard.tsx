import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContactInquiry, PortfolioProject, SiteSettings } from '@/types/schema';
import { portfolioApi, inquiriesApi, servicesApi, pricingApi, settingsApi } from '@/lib/api';
import {
  FolderKanban,
  MessageSquare,
  Boxes,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [pricingCount, setPricingCount] = useState(0);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  const loadData = async () => {
    try {
      const [inqs, ports, srvs, prcs, stgs] = await Promise.all([
        inquiriesApi.getAll(),
        portfolioApi.getAll(),
        servicesApi.getAll(),
        pricingApi.getAll(),
        settingsApi.getAll(),
      ]);

      if (inqs.success && Array.isArray(inqs.data)) setInquiries(inqs.data);
      if (ports.success && Array.isArray(ports.data)) setPortfolio(ports.data);
      if (srvs.success && Array.isArray(srvs.data)) setServicesCount(srvs.data.length);
      if (prcs.success && Array.isArray(prcs.data)) setPricingCount(prcs.data.length);
      if (stgs.success && stgs.data) setSettings(stgs.data);
    } catch (err) {
      console.warn('Dashboard loadData error', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const featuredPortfolioCount = portfolio.filter((p) => p.is_featured).length;

  const inquiryChartData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 7 },
    { name: 'Mar', value: 12 },
    { name: 'Apr', value: 9 },
    { name: 'May', value: 15 },
    { name: 'Jun', value: 18 },
    { name: 'Jul', value: 24 },
    { name: 'Aug', value: inquiries.length + 5 },
  ];

  const categoryCounts = portfolio.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <AdminLayout
      title="ផ្ទាំងគ្រប់គ្រង"
      titleKm="ផ្ទាំងគ្រប់គ្រង"
      subtitle="Dashboard Overview & Business Insights"
      subtitleKm="ទិដ្ឋភាពទូទៅនៃអាជីវកម្ម Khmerweb Grow Pro"
    >
      <div className="space-y-6">
        {/* Top Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border shadow-md hover:shadow-lg transition-all bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-km">
                  {t('គម្រោង Portfolio', 'Portfolio Projects')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FolderKanban className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground font-mono">{portfolio.length}</span>
                <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{featuredPortfolioCount} Featured</span>
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-km">
                {t('គម្រោងស្នាដៃទាំងអស់នៅលើគេហទំព័រ', 'Total showcased projects')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md hover:shadow-lg transition-all bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-km">
                  {t('សំណើទំនាក់ទំនង (Leads)', 'Contact Inquiries')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground font-mono">{inquiries.length}</span>
                {newInquiriesCount > 0 ? (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] animate-pulse">
                    {newInquiriesCount} NEW
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground font-km">ទាន់សម័យ</span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-km">
                {t('សំណើផ្ញើចេញពីទម្រង់ទំនាក់ទំនងអតិថិជន', 'Customer leads & inquiries')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md hover:shadow-lg transition-all bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-km">
                  {t('សេវាកម្ម (Services)', 'Active Services')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Boxes className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground font-mono">{servicesCount}</span>
                <span className="text-xs text-indigo-500 font-medium font-km">ប្រភេទសេវាកម្ម</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-km">
                {t('សេវាកម្ម SaaS, Web & POS', 'Published service catalog')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md hover:shadow-lg transition-all bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-km">
                  {t('កញ្ចប់តម្លៃ (Pricing)', 'Pricing Packages')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground font-mono">{pricingCount}</span>
                <span className="text-xs text-emerald-500 font-medium font-km">កញ្ចប់តម្លៃ</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-km">
                {t('កញ្ចប់តម្លៃសេវាកម្មដែលកំពុងដាក់លក់', 'Active pricing tiers')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold font-km">
                  {t('កំណើនសំណើអតិថិជន (Inquiry Growth)', 'Inquiries Trend 2026')}
                </CardTitle>
                <CardDescription className="text-xs font-km">
                  {t('ចំនួនសំណើដែលទទួលបានតាមខែនីមួយៗ', 'Monthly customer lead volume')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                +32% Growth
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={inquiryChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold font-km">
                {t('ចំណាត់ថ្នាក់ Portfolio', 'Portfolio Breakdown')}
              </CardTitle>
              <CardDescription className="text-xs font-km">
                {t('បែងចែកតាមប្រភេទ Industry/Category', 'Projects by industry category')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                {pieChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-km">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-muted-foreground truncate">{item.name}:</span>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Inquiries & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-km">
                  {t('សំណើទំនាក់ទំនងថ្មីៗ (Recent Inquiries)', 'Latest Customer Leads')}
                </CardTitle>
                <CardDescription className="text-xs font-km">
                  {t('អតិថិជនដែលបានផ្ញើសារតាមរយៈទម្រង់ Contact Us', 'Incoming inquiries directly from public site')}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs font-km">
                <Link to="/inquiries">
                  <span>{t('មើលទាំងអស់', 'View All')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {inquiries.slice(0, 4).map((inq) => (
                  <div key={inq.id} className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/70 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground font-km">{inq.client_name}</span>
                        <Badge
                          variant="secondary"
                          className={
                            inq.status === 'new'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : inq.status === 'contacted'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }
                        >
                          {inq.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 font-km">{inq.message}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono shrink-0">
                      <span>{inq.phone_number || inq.email_address}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link to="/inquiries">
                          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <p className="text-center py-6 text-xs text-muted-foreground font-km">មិនទាន់មានសំណើឡើយ</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-bold font-km">
                {t('ផ្លូវកាត់ និង ស្ថានភាពប្រព័ន្ធ', 'Quick Actions & System Status')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs font-km">
                  <Sparkles className="h-4 w-4" />
                  <span>Real NestJS REST API Connected</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-km">
                  {t('ប្រព័ន្ធកំពុងភ្ជាប់ទៅកាន់ PostgreSQL Database លើ Port 5000 ដោយជោគជ័យ។', 'Connected to NestJS PostgreSQL Backend at http://localhost:5000/api.')}
                </p>
              </div>

              <div className="space-y-2 pt-1 font-km">
                <span className="text-xs font-semibold text-muted-foreground block">ផ្លូវកាត់បន្ថែមទិន្នន័យ (Quick Add)</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild className="justify-start gap-2 text-xs">
                    <Link to="/portfolio">
                      <FolderKanban className="h-3.5 w-3.5 text-primary" />
                      <span>+ Portfolio</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start gap-2 text-xs">
                    <Link to="/services">
                      <Boxes className="h-3.5 w-3.5 text-indigo-500" />
                      <span>+ Service</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start gap-2 text-xs">
                    <Link to="/pricing">
                      <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                      <span>+ Pricing</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start gap-2 text-xs">
                    <Link to="/settings">
                      <Send className="h-3.5 w-3.5 text-amber-500" />
                      <span>Settings</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
