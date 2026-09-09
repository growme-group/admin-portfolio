export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backend-portfolio-web.onrender.com/api';

export interface LoginResponse {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url?: string;
    is_active: boolean;
    last_login_at?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> => {
  const token = localStorage.getItem('kw_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const resData = await response.json();

    if (!response.ok) {
      const errorMsg = Array.isArray(resData.message)
        ? resData.message.join(', ')
        : resData.message || 'Request failed';
      return { success: false, message: errorMsg };
    }

    const data = resData.data !== undefined ? resData.data : resData;
    const message = resData.message || 'Success';

    return { success: true, data, message };
  } catch (err: any) {
    console.warn('[API Fetch Error - Falling back]', err.message);
    return { success: false, message: 'Cannot connect to backend server' };
  }
};

// ------------------------------------------------------------------------------
// AUTH API
// ------------------------------------------------------------------------------
export const authApi = {
  login: async (email: string, pass: string) => {
    const res = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });

    if (res.success && res.data?.accessToken) {
      localStorage.setItem('kw_access_token', res.data.accessToken);
      localStorage.setItem('kw_refresh_token', res.data.refreshToken);
      localStorage.setItem('kw_auth_user', JSON.stringify(res.data.user));
    }

    return res;
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (_) {}
    localStorage.removeItem('kw_access_token');
    localStorage.removeItem('kw_refresh_token');
    localStorage.removeItem('kw_auth_user');
  },

  getProfile: async () => {
    return apiFetch('/auth/me');
  },
};

// ------------------------------------------------------------------------------
// PORTFOLIO API
// ------------------------------------------------------------------------------
export const portfolioApi = {
  getAll: (featuredOnly?: boolean) =>
    apiFetch(`/portfolio${featuredOnly ? '?featured=true' : ''}`),
  getOne: (id: string) => apiFetch(`/portfolio/${id}`),
  create: (dto: any) => apiFetch('/portfolio', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  toggleFeatured: (id: string) => apiFetch(`/portfolio/${id}/toggle-featured`, { method: 'PATCH' }),
  delete: (id: string) => apiFetch(`/portfolio/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// INQUIRIES API
// ------------------------------------------------------------------------------
export const inquiriesApi = {
  getAll: () => apiFetch('/inquiries'),
  getOne: (id: string) => apiFetch(`/inquiries/${id}`),
  create: (dto: any) => apiFetch('/inquiries', { method: 'POST', body: JSON.stringify(dto) }),
  updateStatus: (id: string, status: string, admin_notes?: string) =>
    apiFetch(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_notes }),
    }),
  delete: (id: string) => apiFetch(`/inquiries/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// SERVICES API
// ------------------------------------------------------------------------------
export const servicesApi = {
  getAll: (activeOnly?: boolean) =>
    apiFetch(`/services${activeOnly ? '?active=true' : ''}`),
  getOne: (id: string) => apiFetch(`/services/${id}`),
  create: (dto: any) => apiFetch('/services', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch(`/services/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  delete: (id: string) => apiFetch(`/services/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// PRICING API
// ------------------------------------------------------------------------------
export const pricingApi = {
  getAll: (activeOnly?: boolean) =>
    apiFetch(`/pricing${activeOnly ? '?active=true' : ''}`),
  getOne: (id: string) => apiFetch(`/pricing/${id}`),
  create: (dto: any) => apiFetch('/pricing', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch(`/pricing/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  delete: (id: string) => apiFetch(`/pricing/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// FAQS API
// ------------------------------------------------------------------------------
export const faqsApi = {
  getAll: (publishedOnly?: boolean) =>
    apiFetch(`/faqs${publishedOnly ? '?published=true' : ''}`),
  getOne: (id: string) => apiFetch(`/faqs/${id}`),
  create: (dto: any) => apiFetch('/faqs', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  delete: (id: string) => apiFetch(`/faqs/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// TESTIMONIALS API
// ------------------------------------------------------------------------------
export const testimonialsApi = {
  getAll: (visibleOnly?: boolean) =>
    apiFetch(`/testimonials${visibleOnly ? '?visible=true' : ''}`),
  getOne: (id: string) => apiFetch(`/testimonials/${id}`),
  create: (dto: any) => apiFetch('/testimonials', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  delete: (id: string) => apiFetch(`/testimonials/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// SETTINGS API
// ------------------------------------------------------------------------------
export const settingsApi = {
  getAll: () => apiFetch('/settings'),
  getByKey: (key: string) => apiFetch(`/settings/${key}`),
  save: (key: string, value: any, description?: string) =>
    apiFetch(`/settings/${key}`, {
      method: 'POST',
      body: JSON.stringify({ value, description }),
    }),
};

// ------------------------------------------------------------------------------
// USERS API
// ------------------------------------------------------------------------------
export const usersApi = {
  getAll: () => apiFetch('/users'),
  getOne: (id: string) => apiFetch(`/users/${id}`),
  create: (dto: any) => apiFetch('/users', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: any) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  toggleActive: (id: string) => apiFetch(`/users/${id}/toggle-active`, { method: 'PATCH' }),
  delete: (id: string) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------------------------
// UPLOAD API
// ------------------------------------------------------------------------------
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('kw_access_token');
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await response.json();
      const fileUrl = data?.data?.url || data?.url;
      if (response.ok && fileUrl) {
        return { success: true, url: fileUrl };
      }
      return { success: false, message: data.message || 'Image upload failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to upload image' };
    }
  },
};
