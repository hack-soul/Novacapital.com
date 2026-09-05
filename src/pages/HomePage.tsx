import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, TrendingUp, Globe, Zap, CheckCircle, Send, MessageCircle, Mail, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { AnimatedCounter, GlassCard, SectionHeader, Button } from '../components/ui';
import { db } from '../lib/storage';
import { fetchMarketData, formatPrice, formatMarketCap } from '../lib/cryptoApi';
import type { Page, CoinData, Plan } from '../lib/types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

function PlanCard({ plan, onNavigate }: { plan: Plan; onNavigate: (p: Page) => void }) {
  return (
    <GlassCard
      gold={plan.popular}
      className={`p-6 flex flex-col gap-5 relative overflow-hidden ${plan.popular ? 'ring-1 ring-primary/40' : ''}`}
    >
      {plan.badge && (
        <div className="absolute top-4 right-4 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
          {plan.badge}
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold text-foreground font-serif mb-1">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold text-primary font-mono">{plan.roi}%</span>
        <span className="text-muted-foreground mb-1">ROI / {plan.duration}d</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Min. Deposit</div>
          <div className="text-sm font-semibold text-foreground font-mono">${plan.minDeposit.toLocaleString()}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Max. Deposit</div>
          <div className="text-sm font-semibold text-foreground font-mono">${plan.maxDeposit.toLocaleString()}</div>
        </div>
      </div>
      <ul className="space-y-2">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
            <CheckCircle size={14} className="text-primary flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        variant={plan.popular ? 'primary' : 'outline'}
        className="w-full mt-auto"
        onClick={() => onNavigate('register')}
      >
        Start Investing <ArrowRight size={16} />
      </Button>
    </GlassCard>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-medium text-foreground pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-primary flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [marketData, setMarketData] = useState<CoinData[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const settings = db.settings.get();
  const plans = db.plans.active().slice(0, 4);
  const faqs = settings.faqs?.slice(0, 6) || [];

  useEffect(() => {
    fetchMarketData().then(d => { setMarketData(d); setLoadingMarket(false); });
    const iv = setInterval(() => fetchMarketData().then(setMarketData), 60000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
              <Star size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Trusted by 48,000+ Investors</span>
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight font-serif mb-6">
              Grow Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-400">
                Crypto
              </span>{' '}
              Wealth
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Professional cryptocurrency investment management with institutional-grade security and consistent returns. Earn up to 50% ROI.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => onNavigate('register')}>
                Start Investing Now <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('plans')}>
                View Plans
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[
                { label: 'Min. Investment', value: '$100' },
                { label: 'Max ROI', value: '50%' },
                { label: 'Uptime', value: '99.9%' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-primary font-mono">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <GlassCard gold className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
                  <div className="text-3xl font-bold text-foreground font-mono">$24,850.00</div>
                </div>
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
                  +12.4% ↑
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { name: 'Elite Plan', amount: '$15,000', roi: '25%', prog: 75, color: '#D4AF37' },
                  { name: 'Growth Plan', amount: '$6,200', roi: '12%', prog: 55, color: '#4E8FE8' },
                  { name: 'Starter Plan', amount: '$3,650', roi: '5%', prog: 90, color: '#22D3A8' },
                ].map(p => (
                  <div key={p.name} className="bg-muted/40 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-foreground font-medium">{p.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-foreground">{p.amount}</span>
                        <span className="text-xs text-emerald-400">{p.roi}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p.prog}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={() => onNavigate('register')}>
                Open Your Account
              </Button>
            </GlassCard>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-[#030810]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: 'Investors', value: settings.statistics?.totalUsers || 48250, suffix: '+' },
              { label: 'Countries', value: settings.statistics?.countries || 120, suffix: '+' },
              { label: 'Years Active', value: settings.statistics?.yearsActive || 5, suffix: '' },
            ].map(s => (
              <div key={s.label} className="text-center col-span-1">
                <div className="text-3xl font-bold text-primary font-mono">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
            {[
              { label: 'Total Invested', value: settings.statistics?.totalInvested || '$248M+' },
              { label: 'Total Returns', value: settings.statistics?.totalReturns || '$87M+' },
              { label: 'Uptime', value: settings.statistics?.uptime || '99.9%' },
            ].map(s => (
              <div key={s.label} className="text-center col-span-1">
                <div className="text-3xl font-bold text-primary font-mono">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Why Nova Capital"
            title="The Smart Way to Invest in Crypto"
            subtitle="We combine institutional expertise, advanced technology, and transparent processes to deliver consistent returns for our investors."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Military-Grade Security', desc: 'Multi-sig cold wallets, SSL encryption, and regular third-party audits protect every dollar you invest.' },
              { icon: TrendingUp, title: 'Consistent High Returns', desc: 'Our algorithmic trading strategies deliver ROI between 5% and 50% — consistently outperforming the market.' },
              { icon: Zap, title: 'Fast Activations', desc: 'Deposits reviewed and activated within 24 hours. Your money starts working for you immediately.' },
              { icon: Globe, title: 'Global Access', desc: 'Invest from anywhere in the world, 24/7. We accept 11 major cryptocurrencies with instant transfers.' },
              { icon: CheckCircle, title: 'Transparent Process', desc: 'Full visibility into your investments, earnings, and transaction history from your personal dashboard.' },
              { icon: Star, title: 'Dedicated Support', desc: 'Our 24/7 support team is available via Telegram, WhatsApp, and email to assist with any questions.' },
            ].map(item => (
              <GlassCard key={item.title} hover className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-24 bg-[#030810]/50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Investment Plans"
            title="Choose Your Path to Wealth"
            subtitle="From starter to ultra-premium — every plan is designed to maximise your returns at every investment level."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => <PlanCard key={plan.id} plan={plan} onNavigate={onNavigate} />)}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" onClick={() => onNavigate('plans')}>
              View All Plans <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="How It Works"
            title="Start Investing in 4 Simple Steps"
            subtitle="Our streamlined process gets your investment active in as little as 24 hours."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Register a free account with your email and basic details in under 2 minutes.' },
              { step: '02', title: 'Choose a Plan', desc: 'Browse our investment plans and select the one that matches your goals and budget.' },
              { step: '03', title: 'Make a Deposit', desc: 'Send your chosen cryptocurrency to our wallet address and upload your payment proof.' },
              { step: '04', title: 'Earn Returns', desc: 'Watch your investment grow. Withdraw your principal + returns when the plan matures.' },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                <GlassCard className="p-6 h-full">
                  <div className="text-5xl font-bold text-primary/20 font-mono mb-4">{s.step}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </GlassCard>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-primary/30">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market */}
      <section className="py-24 bg-[#030810]/50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Live Market"
            title="Real-Time Crypto Prices"
            subtitle="Live market data refreshed every 60 seconds."
          />
          {loadingMarket ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-4 text-muted-foreground font-medium">#</th>
                    <th className="text-left px-5 py-4 text-muted-foreground font-medium">Coin</th>
                    <th className="text-right px-5 py-4 text-muted-foreground font-medium">Price</th>
                    <th className="text-right px-5 py-4 text-muted-foreground font-medium">24h Change</th>
                    <th className="text-right px-5 py-4 text-muted-foreground font-medium hidden md:table-cell">Market Cap</th>
                    <th className="text-right px-5 py-4 text-muted-foreground font-medium hidden lg:table-cell">Volume (24h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {marketData.map(coin => {
                    const pos = coin.price_change_percentage_24h >= 0;
                    return (
                      <tr key={coin.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4 text-muted-foreground font-mono">{coin.market_cap_rank}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="font-medium text-foreground">{coin.name}</div>
                              <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-medium text-foreground">{formatPrice(coin.current_price)}</td>
                        <td className={`px-5 py-4 text-right font-mono font-medium ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pos ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-muted-foreground hidden md:table-cell">{formatMarketCap(coin.market_cap)}</td>
                        <td className="px-5 py-4 text-right font-mono text-muted-foreground hidden lg:table-cell">{formatMarketCap(coin.total_volume)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground mt-4">Market Data Powered by CoinGecko • Auto-refreshes every 60 seconds</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader
            tag="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about investing with Nova Capital."
          />
          <div className="space-y-3">
            {faqs.map(faq => <FAQItem key={faq.id} q={faq.question} a={faq.answer} />)}
          </div>
          <div className="text-center mt-8">
            <Button variant="ghost" onClick={() => onNavigate('faq')}>View All FAQs <ArrowRight size={16} /></Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-[#030810]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeader
            tag="Get In Touch"
            title="Have Questions? We're Here 24/7"
            subtitle="Our expert team is ready to help you start your investment journey."
          />
          <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto mb-10">
            {[
              { icon: Send, label: 'Telegram', value: '@novacapital_help', href: settings.telegram, color: '#2AABEE' },
              { icon: MessageCircle, label: 'WhatsApp', value: '+1 555 000 0001', href: settings.whatsapp, color: '#25D366' },
              { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}`, color: '#D4AF37' },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
                  <c.icon size={22} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
          <Button size="lg" onClick={() => onNavigate('register')}>
            Start Investing Today <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </div>
  );
}
