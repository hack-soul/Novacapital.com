import React from 'react';
import { Users, DollarSign, ArrowDownCircle, ArrowUpCircle, TrendingUp, Clock } from 'lucide-react';
import { GlassCard, Table, Tr, Td, StatusBadge } from '../../components/ui';
import { db } from '../../lib/storage';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const users = db.users.all().filter(u => u.role === 'user');
  const deposits = db.deposits.all();
  const withdrawals = db.withdrawals.all();
  const investments = db.investments.all();

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const totalDeposited = deposits.filter(d => d.status === 'approved').reduce((s, d) => s + d.amount, 0);
  const totalWithdrawn = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);

  const recentDeposits = deposits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentWithdrawals = withdrawals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: '#4E8FE8' },
          { label: 'Total Deposited', value: `$${totalDeposited.toLocaleString()}`, icon: DollarSign, color: '#D4AF37' },
          { label: 'Pending Deposits', value: pendingDeposits, icon: ArrowDownCircle, color: '#F0C040', alert: pendingDeposits > 0 },
          { label: 'Pending Withdrawals', value: pendingWithdrawals, icon: ArrowUpCircle, color: '#22D3A8', alert: pendingWithdrawals > 0 },
        ].map(s => (
          <GlassCard key={s.label} className={`p-5 ${s.alert ? 'border-amber-500/30' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                <s.icon size={16} />
              </div>
            </div>
            <div className={`text-2xl font-bold font-mono ${s.alert ? 'text-amber-400' : 'text-foreground'}`}>{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Investments', value: investments.filter(i => i.status === 'active').length, color: '#9945FF' },
          { label: 'Completed', value: investments.filter(i => i.status === 'completed').length, color: '#22D3A8' },
          { label: 'Total Withdrawn', value: `$${totalWithdrawn.toLocaleString()}`, color: '#E53935' },
          { label: 'Net Revenue', value: `$${(totalDeposited - totalWithdrawn).toLocaleString()}`, color: '#D4AF37' },
        ].map(s => (
          <GlassCard key={s.label} className="p-5">
            <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground font-serif mb-4">Recent Deposits</h3>
          {recentDeposits.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No deposits yet</p>
          ) : (
            <div className="space-y-2">
              {recentDeposits.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-foreground">{d.userName}</div>
                    <div className="text-xs text-muted-foreground">{d.planName} · {format(new Date(d.createdAt), 'MMM d')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-foreground">${d.amount.toLocaleString()}</div>
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground font-serif mb-4">Recent Withdrawals</h3>
          {recentWithdrawals.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No withdrawals yet</p>
          ) : (
            <div className="space-y-2">
              {recentWithdrawals.map(w => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-foreground">{w.userName}</div>
                    <div className="text-xs text-muted-foreground">{w.cryptoSymbol} · {format(new Date(w.createdAt), 'MMM d')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-foreground">${w.amount.toLocaleString()}</div>
                    <StatusBadge status={w.status} />
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
