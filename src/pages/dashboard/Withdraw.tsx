import React, { useState } from 'react';
import { ArrowUpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassCard, Button } from '../../components/ui';
import { getCurrentSession } from '../../lib/auth';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';

export default function WithdrawPage() {
  const session = getCurrentSession()!;
  const user = db.users.find(session.userId)!;
  const cryptos = db.cryptos.enabled();

  const [form, setForm] = useState({ crypto: '', amount: '', walletAddress: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = parseFloat(form.amount);
    if (!form.crypto) { toast.error('Please select a cryptocurrency'); return; }
    if (!form.walletAddress) { toast.error('Please enter your wallet address'); return; }
    if (numAmount < 10) { toast.error('Minimum withdrawal is $10'); return; }
    if (numAmount > user.balance) { toast.error('Insufficient balance'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    const crypto = cryptos.find(c => c.id === form.crypto)!;
    db.withdrawals.create({
      userId: session.userId,
      userName: user.name,
      userEmail: user.email,
      crypto: crypto.name,
      cryptoSymbol: crypto.symbol,
      amount: numAmount,
      walletAddress: form.walletAddress,
      status: 'pending',
    });
    db.notifications.create({
      userId: session.userId,
      title: 'Withdrawal Requested',
      message: `Your withdrawal of $${numAmount.toLocaleString()} in ${crypto.symbol} has been submitted and is pending approval.`,
      type: 'info',
      read: false,
    });
    setSubmitting(false);
    setDone(true);
    toast.success('Withdrawal request submitted!');
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto">
        <GlassCard gold className="p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-serif mb-3">Withdrawal Requested!</h3>
          <p className="text-muted-foreground mb-6">Your withdrawal request is pending admin approval. Processing typically takes 24–48 business hours.</p>
          <Button onClick={() => { setDone(false); setForm({ crypto: '', amount: '', walletAddress: '' }); }}>
            New Withdrawal
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Withdraw Funds</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a withdrawal request to receive your funds.</p>
      </div>

      <GlassCard className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <ArrowUpCircle size={20} className="text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Available Balance</div>
          <div className="text-xl font-bold text-primary font-mono">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </GlassCard>

      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-400/90">
          <p className="font-medium mb-1">Important Notes</p>
          <ul className="space-y-1 list-disc list-inside text-amber-400/70">
            <li>Minimum withdrawal: $10</li>
            <li>Withdrawals are reviewed and processed within 24–48 hours</li>
            <li>Ensure your wallet address is correct — transactions are irreversible</li>
            <li>Only matured investments are credited to your balance</li>
          </ul>
        </div>
      </div>

      <GlassCard gold className="p-6">
        <h3 className="font-semibold text-foreground mb-5 font-serif">Withdrawal Details</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Crypto selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Cryptocurrency</label>
            <select
              value={form.crypto}
              onChange={e => setForm(f => ({ ...f, crypto: e.target.value }))}
              required
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Select cryptocurrency</option>
              {cryptos.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.symbol}){c.network ? ` — ${c.network}` : ''}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Amount (USD)</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="10"
              max={user.balance}
              step="0.01"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              required
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
            {form.amount && parseFloat(form.amount) > user.balance && (
              <p className="text-xs text-destructive">Amount exceeds your available balance.</p>
            )}
          </div>

          {/* Wallet address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Your Wallet Address</label>
            <input
              type="text"
              placeholder="Enter your receiving wallet address"
              value={form.walletAddress}
              onChange={e => setForm(f => ({ ...f, walletAddress: e.target.value }))}
              required
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={submitting}>
            Submit Withdrawal Request
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
