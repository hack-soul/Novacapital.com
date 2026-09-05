import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { GlassCard, Button, SectionHeader } from '../components/ui';
import { db } from '../lib/storage';
import type { Page } from '../lib/types';

export default function PlansPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const plans = db.plans.all();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          tag="Investment Plans"
          title="Plans Built for Every Investor"
          subtitle="Whether you are starting with $100 or $100,000 — we have a plan tailored to your investment goals with transparent returns and zero hidden fees."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map(plan => (
            <GlassCard key={plan.id} gold={plan.popular} className={`p-6 flex flex-col gap-5 relative overflow-hidden ${plan.popular ? 'ring-1 ring-primary/40' : ''} ${plan.status === 'inactive' ? 'opacity-50' : ''}`}>
              {plan.badge && (
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  {plan.badge}
                </div>
              )}
              {plan.status === 'inactive' && (
                <div className="absolute top-4 left-4 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">Inactive</div>
              )}
              <div>
                <h3 className="text-xl font-bold text-foreground font-serif mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary font-mono leading-none mb-1">{plan.roi}%</div>
                <div className="text-sm text-muted-foreground">Return on Investment in {plan.duration} days</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Minimum</div>
                  <div className="text-sm font-bold text-foreground font-mono">${plan.minDeposit.toLocaleString()}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Maximum</div>
                  <div className="text-sm font-bold text-foreground font-mono">${plan.maxDeposit.toLocaleString()}</div>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Duration</div>
                <div className="text-sm font-semibold text-foreground">{plan.duration} Days</div>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full mt-auto"
                disabled={plan.status === 'inactive'}
                onClick={() => onNavigate('register')}
              >
                {plan.status === 'inactive' ? 'Unavailable' : 'Invest Now'} <ArrowRight size={16} />
              </Button>
            </GlassCard>
          ))}
        </div>

        {/* ROI Calculator */}
        <GlassCard gold className="p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground font-serif mb-2 text-center">Returns Calculator</h3>
          <p className="text-muted-foreground text-sm text-center mb-6">Estimate your returns based on the plan you choose.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground font-medium">Plan</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">$1,000 inv.</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">$5,000 inv.</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">$10,000 inv.</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {plans.filter(p => p.status === 'active').map(p => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 text-right font-mono text-emerald-400">${(1000 * (1 + p.roi / 100)).toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-emerald-400">${(5000 * (1 + p.roi / 100)).toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-emerald-400">${(10000 * (1 + p.roi / 100)).toLocaleString()}</td>
                    <td className="py-3 text-right text-muted-foreground">{p.duration}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">Values shown are total returns including principal. Past performance is not indicative of future results.</p>
        </GlassCard>

        <div className="text-center mt-12">
          <Button size="lg" onClick={() => onNavigate('register')}>
            Open Your Account <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
