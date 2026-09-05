import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { GlassCard, Button, Modal, Input, Badge } from '../../components/ui';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { CryptoWallet } from '../../lib/types';

const emptyCrypto: Omit<CryptoWallet, 'id'> = {
  name: '', symbol: '', network: '', walletAddress: '', enabled: true, coingeckoId: '', icon: '', color: '#D4AF37',
};

export default function AdminCryptos() {
  const [cryptos, setCryptos] = useState(db.cryptos.all);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<CryptoWallet>>(emptyCrypto);
  const [isEdit, setIsEdit] = useState(false);

  function refresh() { setCryptos(db.cryptos.all()); }

  function openCreate() { setEditItem({ ...emptyCrypto }); setIsEdit(false); setShowModal(true); }
  function openEdit(c: CryptoWallet) { setEditItem({ ...c }); setIsEdit(true); setShowModal(true); }

  function toggleEnabled(c: CryptoWallet) {
    db.cryptos.update(c.id, { enabled: !c.enabled });
    refresh();
    toast.success(`${c.name} ${c.enabled ? 'disabled' : 'enabled'}`);
  }

  function deleteCrypto(id: string) {
    if (!confirm('Delete this cryptocurrency?')) return;
    db.cryptos.delete(id);
    refresh();
    toast.success('Removed.');
  }

  function save() {
    if (!editItem.name || !editItem.symbol || !editItem.walletAddress) {
      toast.error('Name, symbol, and wallet address are required.');
      return;
    }
    if (isEdit && editItem.id) {
      db.cryptos.update(editItem.id, editItem as Partial<CryptoWallet>);
      toast.success('Updated!');
    } else {
      db.cryptos.create(editItem as Omit<CryptoWallet, 'id'>);
      toast.success('Created!');
    }
    refresh();
    setShowModal(false);
  }

  const qrUrl = (addr: string) => `https://api.qrserver.com/v1/create-qr-code/?size=100x100&bgcolor=050D1F&color=D4AF37&data=${encodeURIComponent(addr)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Cryptocurrencies</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage accepted cryptos and wallet addresses.</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> Add Crypto</Button>
      </div>

      <div className="grid gap-4">
        {cryptos.map(c => (
          <GlassCard key={c.id} className={`p-5 ${!c.enabled ? 'opacity-60' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border border-border flex-shrink-0" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
                {c.icon || c.symbol[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{c.symbol}</span>
                  {c.network && <Badge variant="default">{c.network}</Badge>}
                  <Badge variant={c.enabled ? 'success' : 'default'}>{c.enabled ? 'Active' : 'Disabled'}</Badge>
                </div>
                <div className="text-xs font-mono text-muted-foreground mt-1 truncate">{c.walletAddress}</div>
              </div>
              <div className="flex items-center gap-2">
                <img src={qrUrl(c.walletAddress)} alt="QR" className="w-10 h-10 rounded border border-border bg-[#050D1F]" />
                <button onClick={() => toggleEnabled(c)} className={`p-2 rounded-lg text-sm transition-colors ${c.enabled ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                  {c.enabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"><Edit size={15} /></button>
                <button onClick={() => deleteCrypto(c.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Edit Cryptocurrency' : 'Add Cryptocurrency'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={editItem.name || ''} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} placeholder="Bitcoin" required />
            <Input label="Symbol" value={editItem.symbol || ''} onChange={e => setEditItem(p => ({ ...p, symbol: e.target.value.toUpperCase() }))} placeholder="BTC" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Network" value={editItem.network || ''} onChange={e => setEditItem(p => ({ ...p, network: e.target.value }))} placeholder="Bitcoin" />
            <Input label="Icon Character" value={editItem.icon || ''} onChange={e => setEditItem(p => ({ ...p, icon: e.target.value }))} placeholder="₿" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="CoinGecko ID" value={editItem.coingeckoId || ''} onChange={e => setEditItem(p => ({ ...p, coingeckoId: e.target.value }))} placeholder="bitcoin" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Brand Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={editItem.color || '#D4AF37'} onChange={e => setEditItem(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-border bg-input-background cursor-pointer" />
                <input value={editItem.color || ''} onChange={e => setEditItem(p => ({ ...p, color: e.target.value }))} className="flex-1 bg-input-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Wallet Address *</label>
            <input value={editItem.walletAddress || ''} onChange={e => setEditItem(p => ({ ...p, walletAddress: e.target.value }))} placeholder="Enter wallet address" required className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {editItem.walletAddress && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <img src={qrUrl(editItem.walletAddress)} alt="QR preview" className="w-16 h-16 rounded border border-border" />
              <div className="text-xs text-muted-foreground">QR code preview for this wallet address.</div>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editItem.enabled ?? true} onChange={e => setEditItem(p => ({ ...p, enabled: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-foreground/80">Enable this cryptocurrency</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={save} className="flex-1">{isEdit ? 'Save Changes' : 'Add Cryptocurrency'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
