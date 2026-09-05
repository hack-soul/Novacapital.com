import React from 'react';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Clock } from 'lucide-react';
import { Table, Tr, Td, StatusBadge, EmptyState, GlassCard } from '../../components/ui';
import { getCurrentSession } from '../../lib/auth';
import { db } from '../../lib/storage';

export function DepositHistoryPage() {
  const session = getCurrentSession()!;
  const deposits = db.deposits.forUser(session.userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Deposit History</h1>
        <p className="text-muted-foreground text-sm mt-1">All your deposit requests and their status.</p>
      </div>
      {deposits.length === 0 ? (
        <GlassCard className="p-6">
          <EmptyState icon={<ArrowDownCircle size={40} />} title="No Deposits Yet" description="Your deposit history will appear here once you make your first deposit." />
        </GlassCard>
      ) : (
        <Table headers={['Date', 'Plan', 'Crypto', 'Amount', 'Status']}>
          {deposits.map(d => (
            <Tr key={d.id}>
              <Td className="text-muted-foreground text-xs">{format(new Date(d.createdAt), 'MMM d, yyyy HH:mm')}</Td>
              <Td><span className="font-medium text-foreground">{d.planName} Plan</span></Td>
              <Td><div className="flex items-center gap-1.5"><span className="text-xs font-mono">{d.cryptoSymbol}</span><span className="text-xs text-muted-foreground">{d.crypto}</span></div></Td>
              <Td className="font-mono font-medium text-foreground">${d.amount.toLocaleString()}</Td>
              <Td><StatusBadge status={d.status} /></Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}

export function WithdrawalHistoryPage() {
  const session = getCurrentSession()!;
  const withdrawals = db.withdrawals.forUser(session.userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Withdrawal History</h1>
        <p className="text-muted-foreground text-sm mt-1">All your withdrawal requests and their status.</p>
      </div>
      {withdrawals.length === 0 ? (
        <GlassCard className="p-6">
          <EmptyState icon={<ArrowUpCircle size={40} />} title="No Withdrawals Yet" description="Your withdrawal history will appear here." />
        </GlassCard>
      ) : (
        <Table headers={['Date', 'Crypto', 'Amount', 'Wallet', 'Status']}>
          {withdrawals.map(w => (
            <Tr key={w.id}>
              <Td className="text-muted-foreground text-xs">{format(new Date(w.createdAt), 'MMM d, yyyy HH:mm')}</Td>
              <Td><span className="text-xs font-mono">{w.cryptoSymbol}</span></Td>
              <Td className="font-mono font-medium text-foreground">${w.amount.toLocaleString()}</Td>
              <Td><span className="font-mono text-xs text-muted-foreground">{w.walletAddress.slice(0, 16)}…</span></Td>
              <Td><StatusBadge status={w.status} /></Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}

export function InvestmentHistoryPage() {
  const session = getCurrentSession()!;
  const investments = db.investments.forUser(session.userId).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Investment History</h1>
        <p className="text-muted-foreground text-sm mt-1">All your investment plans and their performance.</p>
      </div>
      {investments.length === 0 ? (
        <GlassCard className="p-6">
          <EmptyState icon={<TrendingUp size={40} />} title="No Investments Yet" description="Your investment history will appear here once you make a deposit." />
        </GlassCard>
      ) : (
        <Table headers={['Plan', 'Amount', 'ROI', 'Duration', 'Start', 'End', 'Expected', 'Status']}>
          {investments.map(inv => (
            <Tr key={inv.id}>
              <Td className="font-medium text-foreground">{inv.planName}</Td>
              <Td className="font-mono">${inv.amount.toLocaleString()}</Td>
              <Td className="text-primary font-mono">{inv.roi}%</Td>
              <Td className="text-muted-foreground">{inv.duration}d</Td>
              <Td className="text-muted-foreground text-xs">{format(new Date(inv.startDate), 'MMM d')}</Td>
              <Td className="text-muted-foreground text-xs">{format(new Date(inv.endDate), 'MMM d')}</Td>
              <Td className="font-mono text-emerald-400">${inv.expectedReturn.toLocaleString()}</Td>
              <Td><StatusBadge status={inv.status} /></Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}

export function NotificationsPage() {
  const session = getCurrentSession()!;
  const [notifications, setNotifications] = React.useState(db.notifications.forUser(session.userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  function markRead(id: string) {
    db.notifications.markRead(id);
    setNotifications(db.notifications.forUser(session.userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  function markAllRead() {
    db.notifications.markAllRead(session.userId);
    setNotifications(db.notifications.forUser(session.userId));
  }

  const typeColors = { success: 'text-emerald-400 bg-emerald-500/10', error: 'text-red-400 bg-red-500/10', warning: 'text-amber-400 bg-amber-500/10', info: 'text-blue-400 bg-blue-500/10' };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">{notifications.filter(n => !n.read).length} unread messages</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">Mark all read</button>
        )}
      </div>
      {notifications.length === 0 ? (
        <GlassCard className="p-6">
          <EmptyState icon={<Clock size={40} />} title="No Notifications" description="You have no notifications yet." />
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <GlassCard key={n.id} className={`p-4 ${!n.read ? 'border-primary/20' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${typeColors[n.type]}`}>
                  {n.type[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-medium ${!n.read ? 'text-foreground' : 'text-foreground/70'}`}>{n.title}</span>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-xs text-primary hover:underline flex-shrink-0">Mark read</button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">{format(new Date(n.createdAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
