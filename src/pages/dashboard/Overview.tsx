import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, DollarSign, ArrowRight, Clock } from 'lucide-react';
import { GlassCard, StatusBadge, Button } from '../../components/ui';
import { getCurrentSession } from '../../lib/auth';
import { db } from '../../lib/storage';
import type { Page } from '../../lib/types';
import { format } from 'date-fns';

export default function DashboardOverview({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const session = getCurrentSession()!;
  const user = db.users.find(session.userId)!;
  const investments = db.investments.forUser(session.userId);
  const deposits = db.deposits.forUser(session.userId);
  const withdrawals = db.withdrawals.forUser(session.userId);

  const activeInvestments = investments.filter(i => i.status === 'active');
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalEarnings = investments.reduce((s, i) => s + (i.currentValue - i.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your investment portfolio overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Account Balance', value: `$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#D4AF37' },
          { label: 'Total Invested', value: `$${totalInvested.toLocaleString()}`, icon: TrendingUp, color: '#4E8FE8' },
          { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, icon: ArrowUpCircle, color: '#22D3A8' },
          { label: 'Active Plans', value: activeInvestments.length.toString(), icon: Clock, color: '#9945FF' },
        ].map(s => (
          <GlassCard key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                <s.icon size={16} />
              </div>
            </div>
            <div className="text-xl font-bold text-foreground font-mono">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard gold hover className="p-5 cursor-pointer" onClick={() => onNavigate('dashboard/deposit')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ArrowDownCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Deposit Funds</div>
                <div className="text-xs text-muted-foreground">Start a new investment</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
          </div>
        </GlassCard>
        <GlassCard hover className="p-5 cursor-pointer" onClick={() => onNavigate('dashboard/withdraw')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ArrowUpCircle size={20} className="text-amber-400" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Withdraw Funds</div>
                <div className="text-xs text-muted-foreground">Request a withdrawal</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Investments */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground font-serif">Active Investments</h3>
            <button onClick={() => onNavigate('dashboard/investments')} className="text-xs text-primary hover:underline">View All</button>
          </div>
          {activeInvestments.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active investments</p>
              <Button size="sm" className="mt-3" onClick={() => onNavigate('dashboard/deposit')}>Make a Deposit</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeInvestments.slice(0, 3).map(inv => {
                const progress = Math.min(100, ((new Date().getTime() - new Date(inv.startDate).getTime()) / (new Date(inv.endDate).getTime() - new Date(inv.startDate).getTime())) * 100);
                const daysLeft = Math.max(0, Math.ceil((new Date(inv.endDate).getTime() - Date.now()) / 86400000));
                return (
                  <div key={inv.id} className="bg-muted/40 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{inv.planName} Plan</span>
                      <span className="text-xs text-primary font-mono">{inv.roi}% ROI</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="font-mono">${inv.amount.toLocaleString()}</span>
                      <span>{daysLeft}d left</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground font-serif">Recent Transactions</h3>
          </div>
          {deposits.length === 0 && withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[
                ...deposits.map(d => ({ ...d, kind: 'deposit' as const })),
                ...withdrawals.map(w => ({ ...w, kind: 'withdrawal' as const })),
              ]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.kind === 'deposit' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                        {tx.kind === 'deposit'
                          ? <ArrowDownCircle size={16} className="text-emerald-400" />
                          : <ArrowUpCircle size={16} className="text-amber-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground capitalize">{tx.kind}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-medium text-foreground">${tx.amount.toLocaleString()}</div>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
