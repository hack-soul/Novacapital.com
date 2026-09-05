import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import { Table, Tr, Td, StatusBadge, Modal, Button } from '../../components/ui';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { Withdrawal } from '../../lib/types';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState(() => db.withdrawals.all().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [notes, setNotes] = useState('');

  function refresh() {
    setWithdrawals(db.withdrawals.all().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  function approve(w: Withdrawal) {
    db.withdrawals.update(w.id, { status: 'approved', adminNotes: notes });
    const user = db.users.find(w.userId);
    if (user) db.users.update(w.userId, { balance: Math.max(0, user.balance - w.amount) });
    db.notifications.create({ userId: w.userId, title: 'Withdrawal Approved', message: `Your withdrawal of $${w.amount.toLocaleString()} in ${w.cryptoSymbol} has been processed successfully.`, type: 'success', read: false });
    refresh();
    setSelected(null);
    toast.success('Withdrawal approved!');
  }

  function reject(w: Withdrawal) {
    db.withdrawals.update(w.id, { status: 'rejected', adminNotes: notes });
    db.notifications.create({ userId: w.userId, title: 'Withdrawal Rejected', message: `Your withdrawal of $${w.amount.toLocaleString()} was rejected. ${notes ? 'Reason: ' + notes : 'Contact support.'}`, type: 'error', read: false });
    refresh();
    setSelected(null);
    toast.error('Withdrawal rejected.');
  }

  const filtered = withdrawals.filter(w => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (search && !w.userName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Manage Withdrawals</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and process withdrawal requests.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user..." className="pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {f} ({withdrawals.filter(w => f === 'all' ? true : w.status === f).length})
          </button>
        ))}
      </div>

      <Table headers={['Date', 'User', 'Crypto', 'Amount', 'Wallet', 'Status', 'Actions']}>
        {filtered.map(w => (
          <Tr key={w.id}>
            <Td className="text-xs text-muted-foreground">{format(new Date(w.createdAt), 'MMM d, yy')}</Td>
            <Td>
              <div className="text-sm font-medium text-foreground">{w.userName}</div>
              <div className="text-xs text-muted-foreground">{w.userEmail}</div>
            </Td>
            <Td className="text-xs font-mono">{w.cryptoSymbol}</Td>
            <Td className="font-mono font-medium text-foreground">${w.amount.toLocaleString()}</Td>
            <Td className="text-xs font-mono text-muted-foreground">{w.walletAddress.slice(0, 14)}…</Td>
            <Td><StatusBadge status={w.status} /></Td>
            <Td>
              <div className="flex items-center gap-1">
                <button onClick={() => { setSelected(w); setNotes(w.adminNotes || ''); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Eye size={15} />
                </button>
                {w.status === 'pending' && (
                  <>
                    <button onClick={() => { setSelected(w); setNotes(''); }} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400">
                      <CheckCircle size={15} />
                    </button>
                    <button onClick={() => { db.withdrawals.update(w.id, { status: 'rejected' }); refresh(); toast.error('Rejected.'); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400">
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
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Withdrawal Details" size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">User</div><div className="font-medium">{selected.userName}</div></div>
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">Amount</div><div className="font-mono font-bold text-foreground">${selected.amount.toLocaleString()}</div></div>
              <div className="bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">Crypto</div><div className="font-mono">{selected.cryptoSymbol} — {selected.crypto}</div></div>
              <div className="col-span-2 bg-muted/30 rounded-lg p-3"><div className="text-xs text-muted-foreground mb-1">Wallet Address</div><div className="font-mono text-xs break-all text-foreground">{selected.walletAddress}</div></div>
            </div>
            {selected.status === 'pending' && (
              <>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Admin Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => approve(selected)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
                    <CheckCircle size={16} /> Approve & Process
                  </Button>
                  <Button onClick={() => reject(selected)} variant="danger" className="flex-1">
                    <XCircle size={16} /> Reject
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
