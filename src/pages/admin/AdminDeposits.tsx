import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import { Table, Tr, Td, StatusBadge, Modal, Button, Badge } from '../../components/ui';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { Deposit } from '../../lib/types';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState(() => db.deposits.all().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Deposit | null>(null);
  const [notes, setNotes] = useState('');

  function refresh() {
    setDeposits(db.deposits.all().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  function approve(deposit: Deposit) {
    db.deposits.update(deposit.id, { status: 'approved', adminNotes: notes });
    // Create investment
    const plan = db.plans.find(deposit.planId);
    if (plan) {
      const start = new Date().toISOString();
      const end = new Date(Date.now() + plan.duration * 86400000).toISOString();
      db.investments.create({
        userId: deposit.userId,
        planId: deposit.planId,
        planName: deposit.planName,
        depositId: deposit.id,
        amount: deposit.amount,
        roi: plan.roi,
        duration: plan.duration,
        startDate: start,
        endDate: end,
        status: 'active',
        expectedReturn: deposit.amount * (1 + plan.roi / 100),
        currentValue: deposit.amount,
      });
      db.users.update(deposit.userId, { totalInvested: (db.users.find(deposit.userId)?.totalInvested || 0) + deposit.amount });
    }
    db.notifications.create({ userId: deposit.userId, title: 'Deposit Approved', message: `Your deposit of $${deposit.amount.toLocaleString()} (${deposit.planName} Plan) has been approved. Your investment is now active!`, type: 'success', read: false });
    refresh();
    setSelected(null);
    toast.success('Deposit approved and investment activated!');
  }

  function reject(deposit: Deposit) {
    db.deposits.update(deposit.id, { status: 'rejected', adminNotes: notes });
    db.notifications.create({ userId: deposit.userId, title: 'Deposit Rejected', message: `Your deposit of $${deposit.amount.toLocaleString()} was rejected. ${notes ? 'Reason: ' + notes : 'Contact support for assistance.'}`, type: 'error', read: false });
    refresh();
    setSelected(null);
    toast.error('Deposit rejected.');
  }

  const filtered = deposits.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (search && !d.userName.toLowerCase().includes(search.toLowerCase()) && !d.userEmail.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Manage Deposits</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and approve or reject deposit requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user..." className="pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {f} ({deposits.filter(d => f === 'all' ? true : d.status === f).length})
          </button>
        ))}
      </div>

      <Table headers={['Date', 'User', 'Plan', 'Crypto', 'Amount', 'Status', 'Actions']}>
        {filtered.map(d => (
          <Tr key={d.id}>
            <Td className="text-xs text-muted-foreground">{format(new Date(d.createdAt), 'MMM d, yy')}</Td>
            <Td>
              <div className="text-sm font-medium text-foreground">{d.userName}</div>
              <div className="text-xs text-muted-foreground">{d.userEmail}</div>
            </Td>
            <Td className="text-sm text-foreground">{d.planName}</Td>
            <Td className="text-xs font-mono">{d.cryptoSymbol}</Td>
            <Td className="font-mono font-medium text-foreground">${d.amount.toLocaleString()}</Td>
            <Td><StatusBadge status={d.status} /></Td>
            <Td>
              <div className="flex items-center gap-1">
                <button onClick={() => { setSelected(d); setNotes(d.adminNotes || ''); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Eye size={15} />
                </button>
                {d.status === 'pending' && (
                  <>
                    <button onClick={() => { setSelected(d); setNotes(''); }} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors">
                      <CheckCircle size={15} />
                    </button>
                    <button onClick={() => { db.deposits.update(d.id, { status: 'rejected' }); refresh(); toast.error('Rejected.'); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                      <XCircle size={15} />
                    </button>
                  </>
                )}
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Deposit Details" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">User</div><div className="font-medium text-foreground">{selected.userName}</div></div>
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">Amount</div><div className="font-mono font-bold text-foreground">${selected.amount.toLocaleString()}</div></div>
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">Plan</div><div className="text-foreground">{selected.planName}</div></div>
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">Crypto</div><div className="font-mono text-foreground">{selected.cryptoSymbol}</div></div>
              {selected.txHash && <div className="col-span-2 bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">TX Hash</div><div className="font-mono text-xs text-foreground break-all">{selected.txHash}</div></div>}
            </div>
            {selected.proofUrl && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Payment Proof</div>
                <img src={selected.proofUrl} alt="Payment proof" className="w-full max-h-64 object-contain rounded-xl border border-border bg-muted/20" />
              </div>
            )}
            {selected.status === 'pending' && (
              <>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Admin Notes (optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Add notes..." className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => approve(selected)} className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
                    <CheckCircle size={16} /> Approve & Activate
                  </Button>
                  <Button onClick={() => reject(selected)} variant="danger" className="flex-1 gap-2">
                    <XCircle size={16} /> Reject
                  </Button>
                </div>
              </>
            )}
            {selected.status !== 'pending' && (
              <div className="p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                This deposit has been <StatusBadge status={selected.status} />
                {selected.adminNotes && <p className="mt-1">Note: {selected.adminNotes}</p>}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
