import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Eye, UserCheck, UserX, Trash2 } from 'lucide-react';
import { Table, Tr, Td, StatusBadge, Modal, Badge, Button } from '../../components/ui';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { User } from '../../lib/types';

export default function AdminUsers() {
  const [users, setUsers] = useState(() => db.users.all().filter(u => u.role === 'user'));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);

  function refresh() { setUsers(db.users.all().filter(u => u.role === 'user')); }

  function toggleStatus(u: User) {
    db.users.update(u.id, { status: u.status === 'active' ? 'suspended' : 'active' });
    refresh();
    toast.success(`User ${u.status === 'active' ? 'suspended' : 'reactivated'}.`);
  }

  function deleteUser(u: User) {
    if (!confirm(`Delete ${u.name}? This is irreversible.`)) return;
    db.users.delete(u.id);
    refresh();
    toast.success('User deleted.');
  }

  const filtered = users.filter(u => {
    if (!search) return true;
    return u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Manage Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." className="pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <Table headers={['User', 'Balance', 'Invested', 'Country', 'Joined', 'Status', 'Actions']}>
        {filtered.map(u => (
          <Tr key={u.id}>
            <Td>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-amber-700/30 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                  {u.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
              </div>
            </Td>
            <Td className="font-mono text-primary">${u.balance.toFixed(2)}</Td>
            <Td className="font-mono text-foreground">${u.totalInvested.toLocaleString()}</Td>
            <Td className="text-muted-foreground text-xs">{u.country || '—'}</Td>
            <Td className="text-muted-foreground text-xs">{format(new Date(u.createdAt), 'MMM d, yyyy')}</Td>
            <Td>
              <Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status}</Badge>
            </Td>
            <Td>
              <div className="flex items-center gap-1">
                <button onClick={() => setSelected(u)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye size={15} /></button>
                <button onClick={() => toggleStatus(u)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}>
                  {u.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
                </button>
                <button onClick={() => deleteUser(u)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details" size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-amber-700/30 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                {selected.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">{selected.name}</h3>
                <p className="text-muted-foreground text-sm">{selected.email}</p>
                <Badge variant={selected.status === 'active' ? 'success' : 'danger'} className="mt-1">{selected.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-sm font-mono font-bold text-primary">${selected.balance.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">Balance</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-sm font-mono font-bold text-foreground">${selected.totalInvested.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Invested</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-sm font-mono font-bold text-emerald-400">${selected.totalEarnings.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Earned</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{selected.phone || '—'}</span></div>
              <div><span className="text-muted-foreground">Country:</span> <span className="text-foreground">{selected.country || '—'}</span></div>
              <div><span className="text-muted-foreground">Joined:</span> <span className="text-foreground">{format(new Date(selected.createdAt), 'MMM d, yyyy')}</span></div>
              <div><span className="text-muted-foreground">Role:</span> <span className="text-foreground capitalize">{selected.role}</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant={selected.status === 'active' ? 'danger' : 'primary'} onClick={() => { toggleStatus(selected); setSelected({ ...selected, status: selected.status === 'active' ? 'suspended' : 'active' }); }} className="flex-1">
                {selected.status === 'active' ? 'Suspend User' : 'Reactivate User'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
