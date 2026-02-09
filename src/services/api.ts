// API service layer - backend agnostic
// All API calls go through this service

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

async function getAuthToken(): Promise<string | null> {
  // Get token from Supabase session
  const { supabase } = await import('@/lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ USER API ============

export interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'survey' | 'video' | 'other';
  estimated_time?: string;
  image_url?: string;
}

export interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'referral' | 'bonus';
  points: number;
  description: string;
  created_at: string;
}

export interface WalletData {
  balance: number;
  lifetime_earned: number;
  transactions: Transaction[];
}

export interface ReferralData {
  referral_code: string;
  referral_link: string;
  referral_count: number;
  bonus_points: number;
}

export interface RedeemRequest {
  points: number;
  method: string;
  details: Record<string, string>;
}

export interface Settings {
  referral_bonus_points: number;
  min_redeem_points: number;
  daily_earning_cap: number;
  survey_point_multiplier: number;
  video_ad_points: number;
}

export interface LegalContent {
  title: string;
  content: string;
  updated_at: string;
}

export const userApi = {
  // Offers
  getOffers: () => apiRequest<Offer[]>('/offers'),
  completeOffer: (offerId: string) => 
    apiRequest<{ points: number }>(`/offers/${offerId}/complete`, { method: 'POST' }),

  // Wallet
  getWallet: () => apiRequest<WalletData>('/wallet'),
  getTransactions: () => apiRequest<Transaction[]>('/transactions'),

  // Redeem
  requestRedeem: (data: RedeemRequest) => 
    apiRequest<{ id: string; status: string }>('/redeem', { method: 'POST', body: data }),

  // Profile
  getProfile: () => apiRequest<UserProfile>('/profile'),
  updateProfile: (data: Partial<UserProfile>) => 
    apiRequest<UserProfile>('/profile', { method: 'PUT', body: data }),

  // Referrals
  getReferrals: () => apiRequest<ReferralData>('/referrals'),

  // Settings (public)
  getSettings: () => apiRequest<Settings>('/settings'),

  // Legal
  getLegalContent: (slug: string) => apiRequest<LegalContent>(`/legal/${slug}`),

  // Contact
  submitContact: (data: { name: string; email: string; message: string }) =>
    apiRequest<{ success: boolean }>('/contact', { method: 'POST', body: data }),
};

// ============ ADMIN API ============

export interface Provider {
  id: string;
  name: string;
  is_enabled: boolean;
  offer_count: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  wallet_balance: number;
  status: 'active' | 'suspended';
  created_at: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  user_email: string;
  points: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  active_offers: number;
  pending_redemptions: number;
  total_points_distributed: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  country?: string;
}

export const adminApi = {
  // Dashboard
  getStats: () => apiRequest<DashboardStats>('/admin/stats'),

  // Providers
  getProviders: () => apiRequest<Provider[]>('/admin/providers'),
  toggleProvider: (providerId: string, enabled: boolean) =>
    apiRequest<Provider>(`/admin/providers/${providerId}`, { method: 'PATCH', body: { is_enabled: enabled } }),

  // Offers (read-only)
  getOffers: () => apiRequest<Offer[]>('/admin/offers'),

  // Settings
  getSettings: () => apiRequest<Settings>('/admin/settings'),
  updateSettings: (data: Partial<Settings>) =>
    apiRequest<Settings>('/admin/settings', { method: 'PUT', body: data }),

  // Legal Pages
  getLegalContent: (slug: string) => apiRequest<LegalContent>(`/admin/legal/${slug}`),
  updateLegalContent: (slug: string, content: string) =>
    apiRequest<LegalContent>(`/admin/legal/${slug}`, { method: 'PUT', body: { content } }),

  // Users
  getUsers: () => apiRequest<AdminUser[]>('/admin/users'),
  getUserDetails: (userId: string) => apiRequest<AdminUser>(`/admin/users/${userId}`),

  // Redemptions
  getRedemptions: () => apiRequest<Redemption[]>('/admin/redemptions'),
  updateRedemption: (redemptionId: string, status: 'approved' | 'rejected') =>
    apiRequest<Redemption>(`/admin/redemptions/${redemptionId}`, { method: 'PATCH', body: { status } }),
};
