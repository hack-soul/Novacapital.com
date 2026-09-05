import type {
  User, Plan, CryptoWallet, Deposit, Withdrawal,
  Investment, Notification, SiteSettings
} from './types';

const KEYS = {
  USERS: 'nc_users',
  PLANS: 'nc_plans',
  CRYPTOS: 'nc_cryptos',
  DEPOSITS: 'nc_deposits',
  WITHDRAWALS: 'nc_withdrawals',
  INVESTMENTS: 'nc_investments',
  NOTIFICATIONS: 'nc_notifications',
  SETTINGS: 'nc_settings',
  SEEDED: 'nc_seeded',
};

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getObj<T>(key: string, defaultVal: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function initSeed() {
  if (localStorage.getItem(KEYS.SEEDED)) return;

  const users: User[] = [
    {
      id: 'admin-001',
      email: 'admin@novacapital.com',
      name: 'Nova Admin',
      password: 'Admin@123',
      role: 'admin',
      balance: 0,
      totalInvested: 0,
      totalEarnings: 0,
      phone: '+1 555 000 0001',
      country: 'United States',
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      verified: true,
      status: 'active',
    },
    {
      id: 'user-001',
      email: 'john@example.com',
      name: 'John Carter',
      password: 'User@123',
      role: 'user',
      balance: 4850,
      totalInvested: 10000,
      totalEarnings: 3200,
      phone: '+1 555 100 2003',
      country: 'United States',
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      verified: true,
      status: 'active',
    },
    {
      id: 'user-002',
      email: 'sarah@example.com',
      name: 'Sarah Mitchell',
      password: 'User@123',
      role: 'user',
      balance: 2100,
      totalInvested: 5000,
      totalEarnings: 950,
      phone: '+44 7700 900123',
      country: 'United Kingdom',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      verified: true,
      status: 'active',
    },
  ];

  const plans: Plan[] = [
    {
      id: 'plan-starter',
      name: 'Starter',
      minDeposit: 100,
      maxDeposit: 999,
      roi: 5,
      duration: 7,
      description: 'Perfect entry point for new investors. Stable weekly returns with minimal risk.',
      status: 'active',
      features: ['5% ROI in 7 days', 'Instant activation', '24/7 support', 'Secure vault storage'],
    },
    {
      id: 'plan-growth',
      name: 'Growth',
      minDeposit: 1000,
      maxDeposit: 4999,
      roi: 12,
      duration: 14,
      description: 'Accelerated growth for intermediate investors seeking higher returns.',
      status: 'active',
      features: ['12% ROI in 14 days', 'Priority support', 'Weekly reports', 'Portfolio analytics'],
      badge: 'Popular',
      popular: true,
    },
    {
      id: 'plan-elite',
      name: 'Elite',
      minDeposit: 5000,
      maxDeposit: 24999,
      roi: 25,
      duration: 30,
      description: 'Premium plan for serious investors targeting substantial monthly returns.',
      status: 'active',
      features: ['25% ROI in 30 days', 'Dedicated account manager', 'Daily analytics', 'VIP withdrawals'],
      badge: 'Premium',
    },
    {
      id: 'plan-black',
      name: 'Black Diamond',
      minDeposit: 25000,
      maxDeposit: 500000,
      roi: 50,
      duration: 60,
      description: 'Exclusive ultra-high-yield plan for institutional and high-net-worth investors.',
      status: 'active',
      features: ['50% ROI in 60 days', 'Private wealth desk', 'Tax optimization', 'Insurance coverage'],
      badge: 'Exclusive',
    },
  ];

  // Updated cryptocurrency wallets
  const cryptos: CryptoWallet[] = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      walletAddress: 'bc1q9es2p9wmr3as38l27daqpggr9e6te08utrjcm2',
      enabled: true,
      coingeckoId: 'bitcoin',
      icon: '₿',
      color: '#F7931A',
      network: 'Bitcoin',
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      walletAddress: '0x061b010e58eeae2e2faCF8989Df61762BE58f38B',
      enabled: true,
      coingeckoId: 'ethereum',
      icon: 'Ξ',
      color: '#627EEA',
      network: 'ERC20',
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      walletAddress: 'Ee8MKt16bLATF1Z3nHhbj49TFrCSyTKSvZArHyEekTL7',
      enabled: true,
      coingeckoId: 'solana',
      icon: '◎',
      color: '#9945FF',
      network: 'Solana',
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      walletAddress: '0x061b010e58eeae2e2faCF8989Df61762BE58f38B',
      enabled: true,
      coingeckoId: 'binancecoin',
      icon: 'B',
      color: '#F3BA2F',
      network: 'BEP20',
    },
    {
      id: 'usdt-erc20',
      name: 'USDT ERC20',
      symbol: 'USDT',
      walletAddress: '0x061b010e58eeae2e2faCF8989Df61762BE58f38B',
      enabled: true,
      coingeckoId: 'tether',
      icon: '₮',
      color: '#26A17B',
      network: 'ERC20',
    },
    {
      id: 'usdt-trc20',
      name: 'USDT TRC20',
      symbol: 'USDT',
      walletAddress: 'TAag7NS4HSLDkR4uJJ3kRmTepYUTKKSTax',
      enabled: true,
      coingeckoId: 'tether',
      icon: '₮',
      color: '#26A17B',
      network: 'TRC20',
    },
    {
      id: 'usdc',
      name: 'USDC',
      symbol: 'USDC',
      walletAddress: '0x061b010e58eeae2e2faCF8989Df61762BE58f38B',
      enabled: true,
      coingeckoId: 'usd-coin',
      icon: '$',
      color: '#2775CA',
      network: 'ERC20',
    },
    {
      id: 'xrp',
      name: 'XRP',
      symbol: 'XRP',
      walletAddress: 'rwH8kGeK88X7ed4zsc4uVLFDCN9SgzVoKm',
      enabled: true,
      coingeckoId: 'ripple',
      icon: 'X',
      color: '#00AAE4',
      network: 'XRP Ledger',
    },
    {
      id: 'ltc',
      name: 'Litecoin',
      symbol: 'LTC',
      walletAddress: '0x061b010e58eeae2e2faCF8989Df61762BE58f38B',
      enabled: true,
      coingeckoId: 'litecoin',
      icon: 'Ł',
      color: '#BFBBBB',
      network: 'Litecoin',
    },
    {
      id: 'doge',
      name: 'Dogecoin',
      symbol: 'DOGE',
      walletAddress: '0x061b010e58eeae2e2faCF8989Df61762BE58f38B',
      enabled: true,
      coingeckoId: 'dogecoin',
      icon: 'Ð',
      color: '#C2A633',
      network: 'Dogecoin',
    },
    {
      id: 'trx',
      name: 'TRON',
      symbol: 'TRX',
      walletAddress: 'TAag7NS4HSLDkR4uJJ3kRmTepYUTKKSTax',
      enabled: true,
      coingeckoId: 'tron',
      icon: 'T',
      color: '#EF0027',
      network: 'TRC20',
    },
  ];

  const deposits: Deposit[] = [
    {
      id: 'dep-001',
      userId: 'user-001',
      userName: 'John Carter',
      userEmail: 'john@example.com',
      planId: 'plan-elite',
      planName: 'Elite',
      crypto: 'Bitcoin',
      cryptoSymbol: 'BTC',
      amount: 5000,
      status: 'approved',
      txHash: '4a5b6c7d8e9f0a1b2c3d',
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 39 * 86400000).toISOString(),
    },
    {
      id: 'dep-002',
      userId: 'user-001',
      userName: 'John Carter',
      userEmail: 'john@example.com',
      planId: 'plan-growth',
      planName: 'Growth',
      crypto: 'Ethereum',
      cryptoSymbol: 'ETH',
      amount: 2000,
      status: 'approved',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 19 * 86400000).toISOString(),
    },
    {
      id: 'dep-003',
      userId: 'user-002',
      userName: 'Sarah Mitchell',
      userEmail: 'sarah@example.com',
      planId: 'plan-growth',
      planName: 'Growth',
      crypto: 'USDT TRC20',
      cryptoSymbol: 'USDT',
      amount: 1500,
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  const withdrawals: Withdrawal[] = [
    {
      id: 'wit-001',
      userId: 'user-001',
      userName: 'John Carter',
      userEmail: 'john@example.com',
      crypto: 'Bitcoin',
      cryptoSymbol: 'BTC',
      amount: 800,
      walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      status: 'approved',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'wit-002',
      userId: 'user-002',
      userName: 'Sarah Mitchell',
      userEmail: 'sarah@example.com',
      crypto: 'USDT TRC20',
      cryptoSymbol: 'USDT',
      amount: 350,
      walletAddress: 'TGj1Ej1qRzL9Cq9yCh8v1kNuEMcXyMvS4',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const startDate1 = new Date(Date.now() - 40 * 86400000).toISOString();
  const endDate1 = new Date(Date.now() + 20 * 86400000).toISOString();

  const investments: Investment[] = [
    {
      id: 'inv-001',
      userId: 'user-001',
      planId: 'plan-elite',
      planName: 'Elite',
      depositId: 'dep-001',
      amount: 5000,
      roi: 25,
      duration: 30,
      startDate: startDate1,
      endDate: endDate1,
      status: 'active',
      expectedReturn: 6250,
      currentValue: 5625,
    },
    {
      id: 'inv-002',
      userId: 'user-001',
      planId: 'plan-growth',
      planName: 'Growth',
      depositId: 'dep-002',
      amount: 2000,
      roi: 12,
      duration: 14,
      startDate: new Date(Date.now() - 20 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      status: 'active',
      expectedReturn: 2240,
      currentValue: 2120,
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-001',
      userId: 'user-001',
      title: 'Deposit Approved',
      message: 'Your deposit of $5,000 (Elite Plan) has been approved and your investment is now active.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 39 * 86400000).toISOString(),
    },
    {
      id: 'notif-002',
      userId: 'user-001',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal of $800 in BTC has been processed successfully.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
  ];

  const settings: SiteSettings = {
    siteName: 'Nova Capital',
    siteTagline: 'Invest Smarter. Grow Faster.',
    logoText: 'NOVA',
    telegram: 'https://t.me/novacapital_help',
    whatsapp: 'https://wa.me/15550000001',
    email: 'novacapital99@outlook.com',
    address: '350 Fifth Avenue, New York, NY 10118, USA',

    aboutTitle: 'Building Wealth Through Intelligent Crypto Investment',

    aboutContent:
      'Nova Capital is a premier cryptocurrency investment firm founded in 2019. We leverage advanced algorithmic trading, institutional-grade security, and deep market expertise to deliver consistent returns for our investors worldwide. Our team of 50+ financial professionals and blockchain experts manage over $250 million in assets across global crypto markets.',

    missionContent:
      'To democratize access to professional cryptocurrency investment strategies and deliver transparent, consistent returns to investors of all backgrounds.',

    visionContent:
      'To become the world\'s most trusted digital asset investment platform, bridging traditional finance with the future of decentralized wealth.',

    statistics: {
      totalUsers: 48250,
      totalInvested: '$248M+',
      totalReturns: '$87M+',
      yearsActive: 5,
      countries: 120,
      uptime: '99.9%',
    },

    banners: [
      {
        title: 'Invest in the Future of Finance',
        subtitle: 'Earn up to 50% ROI with our premium crypto investment plans',
        image: '',
      },
      {
        title: 'Trusted by 48,000+ Investors',
        subtitle: 'Join the elite community of crypto wealth builders',
        image: '',
      },
    ],

    faqs: [
      {
        id: 'faq-1',
        question: 'How do I start investing with Nova Capital?',
        answer:
          'Simply register an account, select an investment plan that suits your goals, choose your preferred cryptocurrency, send funds to our provided wallet address, and submit your payment proof. Our team will activate your investment within 24 hours.',
        order: 1,
      },
      {
        id: 'faq-2',
        question: 'What cryptocurrencies do you accept?',
        answer:
          'We accept BTC, ETH, USDT (TRC20 & ERC20), BNB, SOL, XRP, TRX, LTC, DOGE, and USDC. More currencies may be added over time based on market demand.',
        order: 2,
      },
      {
        id: 'faq-3',
        question: 'How are returns calculated?',
        answer:
          'Returns are calculated based on your chosen plan\'s ROI percentage applied to your principal. For example, a $1,000 investment in our Growth Plan (12% ROI) returns $1,120 after 14 days — your $1,000 principal plus $120 profit.',
        order: 3,
      },
      {
        id: 'faq-4',
        question: 'When can I withdraw my funds?',
        answer:
          'You can request a withdrawal once your investment plan matures. Withdrawals are manually reviewed and typically processed within 24-48 business hours. Your earnings are credited to your account balance upon plan completion.',
        order: 4,
      },
      {
        id: 'faq-5',
        question: 'Is my investment secure?',
        answer:
          'Security is our top priority. We employ multi-signature cold storage, institutional-grade encryption, and regular third-party security audits. Your funds are insured up to $250,000 through our partner insurance providers.',
        order: 5,
      },
      {
        id: 'faq-6',
        question: 'Can I have multiple active investments?',
        answer:
          'Yes! You can run multiple investments simultaneously across different plans. There is no limit to the number of active investments per account, allowing you to diversify your portfolio strategy.',
        order: 6,
      },
      {
        id: 'faq-7',
        question: 'What happens if I need support?',
        answer:
          'Our support team is available 24/7 via Telegram, WhatsApp, and email. Premium plan investors receive a dedicated account manager for personalized assistance.',
        order: 7,
      },
      {
        id: 'faq-8',
        question: 'How do I submit payment proof?',
        answer:
          'After sending funds to our wallet address, take a screenshot of your transaction confirmation, then upload it in the deposit form on your dashboard. Include the transaction ID/hash for faster verification.',
        order: 8,
      },
    ],
  };

  set(KEYS.USERS, users);
  set(KEYS.PLANS, plans);
  set(KEYS.CRYPTOS, cryptos);
  set(KEYS.DEPOSITS, deposits);
  set(KEYS.WITHDRAWALS, withdrawals);
  set(KEYS.INVESTMENTS, investments);
  set(KEYS.NOTIFICATIONS, notifications);

  localStorage.setItem(
    KEYS.SETTINGS,
    JSON.stringify(settings)
  );

  localStorage.setItem(KEYS.SEEDED, '1');
}

// Users
export const db = {
  users: {
    all: () => get<User>(KEYS.USERS),

    find: (id: string) =>
      get<User>(KEYS.USERS).find(u => u.id === id),

    findByEmail: (email: string) =>
      get<User>(KEYS.USERS).find(
        u => u.email.toLowerCase() === email.toLowerCase()
      ),

    create: (data: Omit<User, 'id' | 'createdAt'>) => {
      const users = get<User>(KEYS.USERS);

      const user: User = {
        ...data,
        id: uid(),
        createdAt: new Date().toISOString(),
      };

      set(KEYS.USERS, [...users, user]);

      return user;
    },

    update: (id: string, data: Partial<User>) => {
      const users = get<User>(KEYS.USERS).map(u =>
        u.id === id ? { ...u, ...data } : u
      );

      set(KEYS.USERS, users);
    },

    delete: (id: string) =>
      set(
        KEYS.USERS,
        get<User>(KEYS.USERS).filter(u => u.id !== id)
      ),
  },

  plans: {
    all: () => get<Plan>(KEYS.PLANS),

    active: () =>
      get<Plan>(KEYS.PLANS).filter(
        p => p.status === 'active'
      ),

    find: (id: string) =>
      get<Plan>(KEYS.PLANS).find(p => p.id === id),

    create: (data: Omit<Plan, 'id'>) => {
      const plans = get<Plan>(KEYS.PLANS);

      const plan: Plan = {
        ...data,
        id: uid(),
      };

      set(KEYS.PLANS, [...plans, plan]);

      return plan;
    },

    update: (id: string, data: Partial<Plan>) => {
      set(
        KEYS.PLANS,
        get<Plan>(KEYS.PLANS).map(p =>
          p.id === id ? { ...p, ...data } : p
        )
      );
    },

    delete: (id: string) =>
      set(
        KEYS.PLANS,
        get<Plan>(KEYS.PLANS).filter(p => p.id !== id)
      ),
  },

  cryptos: {
    all: () => get<CryptoWallet>(KEYS.CRYPTOS),

    enabled: () =>
      get<CryptoWallet>(KEYS.CRYPTOS).filter(
        c => c.enabled
      ),

    find: (id: string) =>
      get<CryptoWallet>(KEYS.CRYPTOS).find(
        c => c.id === id
      ),

    update: (
      id: string,
      data: Partial<CryptoWallet>
    ) => {
      set(
        KEYS.CRYPTOS,
        get<CryptoWallet>(KEYS.CRYPTOS).map(c =>
          c.id === id ? { ...c, ...data } : c
        )
      );
    },

    create: (
      data: Omit<CryptoWallet, 'id'>
    ) => {
      const list = get<CryptoWallet>(KEYS.CRYPTOS);

      const item: CryptoWallet = {
        ...data,
        id: uid(),
      };

      set(KEYS.CRYPTOS, [...list, item]);

      return item;
    },

    delete: (id: string) =>
      set(
        KEYS.CRYPTOS,
        get<CryptoWallet>(KEYS.CRYPTOS).filter(
          c => c.id !== id
        )
      ),
  },

  deposits: {
    all: () => get<Deposit>(KEYS.DEPOSITS),

    forUser: (userId: string) =>
      get<Deposit>(KEYS.DEPOSITS).filter(
        d => d.userId === userId
      ),

    find: (id: string) =>
      get<Deposit>(KEYS.DEPOSITS).find(
        d => d.id === id
      ),

    create: (
      data: Omit<
        Deposit,
        'id' | 'createdAt' | 'updatedAt'
      >
    ) => {
      const list = get<Deposit>(KEYS.DEPOSITS);

      const now = new Date().toISOString();

      const item: Deposit = {
        ...data,
        id: uid(),
        createdAt: now,
        updatedAt: now,
      };

      set(KEYS.DEPOSITS, [...list, item]);

      return item;
    },

    update: (
      id: string,
      data: Partial<Deposit>
    ) => {
      set(
        KEYS.DEPOSITS,
        get<Deposit>(KEYS.DEPOSITS).map(d =>
          d.id === id
            ? {
                ...d,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
    },
  },

  withdrawals: {
    all: () => get<Withdrawal>(KEYS.WITHDRAWALS),

    forUser: (userId: string) =>
      get<Withdrawal>(KEYS.WITHDRAWALS).filter(
        w => w.userId === userId
      ),

    find: (id: string) =>
      get<Withdrawal>(KEYS.WITHDRAWALS).find(
        w => w.id === id
      ),

    create: (
      data: Omit<
        Withdrawal,
        'id' | 'createdAt' | 'updatedAt'
      >
    ) => {
      const list = get<Withdrawal>(KEYS.WITHDRAWALS);

      const now = new Date().toISOString();

      const item: Withdrawal = {
        ...data,
        id: uid(),
        createdAt: now,
        updatedAt: now,
      };

      set(KEYS.WITHDRAWALS, [...list, item]);

      return item;
    },

    update: (
      id: string,
      data: Partial<Withdrawal>
    ) => {
      set(
        KEYS.WITHDRAWALS,
        get<Withdrawal>(KEYS.WITHDRAWALS).map(w =>
          w.id === id
            ? {
                ...w,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : w
        )
      );
    },
  },

  investments: {
    all: () =>
      get<Investment>(KEYS.INVESTMENTS),

    forUser: (userId: string) =>
      get<Investment>(KEYS.INVESTMENTS).filter(
        i => i.userId === userId
      ),

    create: (
      data: Omit<Investment, 'id'>
    ) => {
      const list =
        get<Investment>(KEYS.INVESTMENTS);

      const item: Investment = {
        ...data,
        id: uid(),
      };

      set(KEYS.INVESTMENTS, [...list, item]);

      return item;
    },

    update: (
      id: string,
      data: Partial<Investment>
    ) => {
      set(
        KEYS.INVESTMENTS,
        get<Investment>(KEYS.INVESTMENTS).map(i =>
          i.id === id
            ? { ...i, ...data }
            : i
        )
      );
    },
  },

  notifications: {
    forUser: (userId: string) =>
      get<Notification>(KEYS.NOTIFICATIONS).filter(
        n => n.userId === userId
      ),

    unreadCount: (userId: string) =>
      get<Notification>(KEYS.NOTIFICATIONS).filter(
        n =>
          n.userId === userId &&
          !n.read
      ).length,

    create: (
      data: Omit<
        Notification,
        'id' | 'createdAt'
      >
    ) => {
      const list =
        get<Notification>(KEYS.NOTIFICATIONS);

      const item: Notification = {
        ...data,
        id: uid(),
        createdAt: new Date().toISOString(),
      };

      set(
        KEYS.NOTIFICATIONS,
        [...list, item]
      );

      return item;
    },

    markRead: (id: string) => {
      set(
        KEYS.NOTIFICATIONS,
        get<Notification>(
          KEYS.NOTIFICATIONS
        ).map(n =>
          n.id === id
            ? { ...n, read: true }
            : n
        )
      );
    },

    markAllRead: (userId: string) => {
      set(
        KEYS.NOTIFICATIONS,
        get<Notification>(
          KEYS.NOTIFICATIONS
        ).map(n =>
          n.userId === userId
            ? { ...n, read: true }
            : n
        )
      );
    },
  },

  settings: {
    get: () =>
      getObj<SiteSettings>(
        KEYS.SETTINGS,
        {} as SiteSettings
      ),

    update: (
      data: Partial<SiteSettings>
    ) => {
      const current =
        getObj<SiteSettings>(
          KEYS.SETTINGS,
          {} as SiteSettings
        );

      localStorage.setItem(
        KEYS.SETTINGS,
        JSON.stringify({
          ...current,
          ...data,
        })
      );
    },
  },
};
