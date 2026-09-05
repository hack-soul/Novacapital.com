import React from 'react';
import { Shield, TrendingUp, Globe, Award, Users, Lock } from 'lucide-react';
import { GlassCard, SectionHeader, AnimatedCounter, Button } from '../components/ui';
import { db } from '../lib/storage';
import type { Page } from '../lib/types';

export default function AboutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const settings = db.settings.get();
  const stats = settings.statistics;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Award size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-widest">Established 2019</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-6">
            {settings.aboutTitle || 'Building Wealth Through Intelligent Crypto Investment'}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {settings.aboutContent}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {[
            { label: 'Total Investors', value: stats?.totalUsers || 48250, suffix: '+', isNum: true },
            { label: 'Countries', value: stats?.countries || 120, suffix: '+', isNum: true },
            { label: 'Years Active', value: stats?.yearsActive || 5, suffix: '', isNum: true },
          ].map(s => (
            <GlassCard key={s.label} className="p-5 text-center col-span-1">
              <div className="text-2xl font-bold text-primary font-mono">
                {s.isNum ? <AnimatedCounter target={s.value as number} suffix={s.suffix} /> : s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </GlassCard>
          ))}
          {[
            { label: 'Total Invested', value: stats?.totalInvested || '$248M+' },
            { label: 'Total Returns', value: stats?.totalReturns || '$87M+' },
            { label: 'Uptime', value: stats?.uptime || '99.9%' },
          ].map(s => (
            <GlassCard key={s.label} className="p-5 text-center col-span-1">
              <div className="text-2xl font-bold text-primary font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <GlassCard gold className="p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <TrendingUp size={22} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground font-serif mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              {settings.missionContent || 'To democratize access to professional cryptocurrency investment strategies and deliver transparent, consistent returns to investors of all backgrounds.'}
            </p>
          </GlassCard>
          <GlassCard className="p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
              <Globe size={22} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground font-serif mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              {settings.visionContent || "To become the world's most trusted digital asset investment platform, bridging traditional finance with the future of decentralized wealth."}
            </p>
          </GlassCard>
        </div>

        {/* Security */}
        <SectionHeader tag="Security" title="How We Protect Your Investment" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Lock, title: 'Cold Storage Vaults', desc: '95% of all assets stored in air-gapped cold wallets, inaccessible to online threats.', color: '#D4AF37' },
            { icon: Shield, title: 'Multi-Signature Security', desc: 'All transactions require multiple cryptographic signatures, eliminating single points of failure.', color: '#4E8FE8' },
            { icon: Award, title: 'Third-Party Audits', desc: 'Regular security audits by leading blockchain security firms ensure our systems remain airtight.', color: '#22D3A8' },
            { icon: Users, title: 'KYC/AML Compliance', desc: 'Full Know Your Customer and Anti-Money Laundering compliance in all operating jurisdictions.', color: '#9945FF' },
            { icon: Globe, title: 'SSL Encryption', desc: 'All data transmitted between you and our platform is secured with 256-bit SSL encryption.', color: '#F0C040' },
            { icon: TrendingUp, title: 'Insurance Coverage', desc: 'Investments are covered by our institutional insurance partners up to $250,000 per account.', color: '#E53935' },
          ].map(item => (
            <GlassCard key={item.title} hover className="p-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                <item.icon size={20} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-12">
          <SectionHeader tag="Our Team" title="Experts Behind Nova Capital" subtitle="A diverse team of 50+ financial professionals, blockchain engineers, and market analysts dedicated to growing your wealth." />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { name: 'Marcus Chen', role: 'Chief Executive Officer', exp: '15y in digital assets' },
            { name: 'Sophia Williams', role: 'Chief Investment Officer', exp: 'Former Goldman Sachs' },
            { name: 'David Okafor', role: 'Head of Security', exp: 'Ex-Cybersecurity Lead, NSA' },
            { name: 'Elena Petrov', role: 'Head of Quant Trading', exp: 'PhD in Financial Math' },
          ].map(m => (
            <GlassCard key={m.name} hover className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-amber-700/30 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <span className="text-2xl font-bold text-primary font-serif">{m.name[0]}</span>
              </div>
              <h4 className="font-semibold text-foreground">{m.name}</h4>
              <p className="text-xs text-primary mt-1">{m.role}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.exp}</p>
            </GlassCard>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={() => onNavigate('register')}>
            Join Nova Capital Today
          </Button>
        </div>
      </div>
    </div>
  );
}
