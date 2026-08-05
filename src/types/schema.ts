export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  client_name: string;
  phone_number?: string;
  email_address: string;
  message: string;
  service_interest?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'resolved' | 'archived';
  telegram_message_id?: string;
  admin_notes?: string;
  created_at: string;
}

export interface Service {
  id: string;
  title_km: string;
  title_en: string;
  description_km?: string;
  description_en?: string;
  icon_name: string;
  category: 'saas' | 'custom_build' | 'pos_package' | 'addons';
  features?: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  plan_name_km: string;
  plan_name_en: string;
  price: number;
  billing_period: 'one_time' | 'monthly' | 'yearly';
  description_km?: string;
  description_en?: string;
  features?: string[];
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  title_km: string;
  title_en: string;
  description_km?: string;
  description_en?: string;
  category: string;
  thumbnail_url: string;
  demo_url?: string;
  tags?: string[];
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  question_km: string;
  question_en: string;
  answer_km: string;
  answer_en: string;
  category?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface ClientTestimonial {
  id: string;
  client_name: string;
  company_name?: string;
  logo_url?: string;
  avatar_url?: string;
  testimonial_km?: string;
  testimonial_en?: string;
  rating: number;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SiteSettings {
  site_title_km: string;
  site_title_en: string;
  contact_phone: string;
  contact_email: string;
  address_km: string;
  address_en: string;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  telegram_config?: {
    bot_token?: string;
    chat_id?: string;
    is_enabled?: boolean;
  };
  company_info?: {
    site_title_km?: string;
    site_title_en?: string;
    contact_phone?: string;
    phone?: string;
    contact_email?: string;
    email?: string;
    address_km?: string;
    address_en?: string;
  };
  maintenance_mode: boolean;
  updated_at: string;
}
