export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  balance: number;
  totalInvested: number;
  totalEarnings: number;
  phone?: string;
  country?: string;
  createdAt: string;
  verified: boolean;
  status: 'active' | 'suspended';
}

export interface Plan {
  id: string;
  name: string;
  minDeposit: number;
  maxDeposit: number;
  roi: number;
  duration: number;
  description: string;
  status: 'active' | 'inactive';
  features: string[];
  badge?: string;
  popular?: boolean;
}

export interface CryptoWallet {
  id: string;
  name: string;
  symbol: string;
  network?: string;
  walletAddress: string;
  enabled: boolean;
  coingeckoId: string;
  icon: string;
  color: string;
}

export interface Deposit {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  crypto: string;
  cryptoSymbol: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  proofUrl?: string;
  txHash?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  crypto: string;
  cryptoSymbol: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  depositId: string;
  amount: number;
  roi: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  expectedReturn: number;
  currentValue: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoText: string;
  telegram: string;
  whatsapp: string;
  email: string;
  address: string;
  aboutTitle: string;
  aboutContent: string;
  missionContent: string;
  visionContent: string;
  statistics: {
    totalUsers: number;
    totalInvested: string;
    totalReturns: string;
    yearsActive: number;
    countries: number;
    uptime: string;
  };
  banners: { title: string; subtitle: string; image: string }[];
  faqs: FAQ[];
}

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  sparkline_in_7d?: { price: number[] };
}

export type Page =
  | 'home' | 'about' | 'plans' | 'faq' | 'contact'
  | 'login' | 'register'
  | 'dashboard' | 'dashboard/deposit' | 'dashboard/withdraw'
  | 'dashboard/deposits' | 'dashboard/withdrawals' | 'dashboard/investments'
  | 'dashboard/notifications' | 'dashboard/profile' | 'dashboard/settings'
  | 'admin' | 'admin/users' | 'admin/deposits' | 'admin/withdrawals'
  | 'admin/plans' | 'admin/cryptos' | 'admin/settings' | 'admin/faqs';
