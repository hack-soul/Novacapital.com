import React, { useState } from 'react';
import { Copy, CheckCircle, Upload, X, ArrowRight } from 'lucide-react';
import { GlassCard, Button, Select } from '../../components/ui';
import { getCurrentSession } from '../../lib/auth';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { Plan, CryptoWallet } from '../../lib/types';

export default function DepositPage() {
  const session = getCurrentSession()!;
  const plans = db.plans.active();
  const cryptos = db.cryptos.enabled();

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoWallet | null>(null);
  const [amount, setAmount] = useState('');
  const [proof, setProof] = useState<string | null>(null);
  const [proofName, setProofName] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function copyAddress() {
    if (selectedCrypto) {
      navigator.clipboard.writeText(selectedCrypto.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Address copied!');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { setProof(reader.result as string); setProofName(file.name); };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!selectedPlan || !selectedCrypto || !amount || !proof) {
      toast.error('Please complete all required fields including payment proof.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (numAmount < selectedPlan.minDeposit || numAmount > selectedPlan.maxDeposit) {
      toast.error(`Amount must be between $${selectedPlan.minDeposit} and $${selectedPlan.maxDeposit}`);
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    const user = db.users.find(session.userId)!;
    db.deposits.create({
      userId: session.userId,
      userName: user.name,
      userEmail: user.email,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      crypto: selectedCrypto.name,
      cryptoSymbol: selectedCrypto.symbol,
      amount: numAmount,
      status: 'pending',
      proofUrl: proof,
      txHash,
    });
    db.notifications.create({
      userId: session.userId,
      title: 'Deposit Submitted',
      message: `Your deposit of $${numAmount.toLocaleString()} for the ${selectedPlan.name} Plan has been submitted and is pending approval.`,
      type: 'info',
      read: false,
    });
    setSubmitting(false);
    setStep(4);
    toast.success('Deposit submitted successfully!');
  }

  const qrUrl = selectedCrypto
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=050D1F&color=D4AF37&data=${encodeURIComponent(selectedCrypto.walletAddress)}`
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Deposit Funds</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete the steps below to start your investment.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {['Select Plan', 'Select Crypto', 'Send & Upload', 'Confirmed'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-xs font-medium ${step > i + 1 ? 'text-emerald-400' : step === i + 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${step > i + 1 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : step === i + 1 ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted border-border'}`}>
                {step > i + 1 ? <CheckCircle size={12} /> : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < 3 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-emerald-500/40' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Plan */}
      {step === 1 && (
        <GlassCard gold className="p-6">
          <h3 className="font-semibold text-foreground mb-4 font-serif">Step 1: Choose Investment Plan</h3>
          <div className="grid gap-3">
            {plans.map(plan => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80 bg-muted/30'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{plan.name} Plan</div>
                    <div className="text-xs text-muted-foreground mt-0.5">${plan.minDeposit.toLocaleString()} – ${plan.maxDeposit.toLocaleString()} • {plan.duration} days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary font-mono">{plan.roi}%</div>
                    <div className="text-xs text-muted-foreground">ROI</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-5" disabled={!selectedPlan} onClick={() => setStep(2)}>
            Continue <ArrowRight size={16} />
          </Button>
        </GlassCard>
      )}

      {/* Step 2: Select Crypto */}
      {step === 2 && (
        <GlassCard gold className="p-6">
          <h3 className="font-semibold text-foreground mb-4 font-serif">Step 2: Select Payment Cryptocurrency</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cryptos.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCrypto(c)}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${selectedCrypto?.id === c.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80 bg-muted/30'}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold border border-border" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
                  {c.icon}
                </div>
                <div className="text-xs font-semibold text-foreground">{c.symbol}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.network || c.name}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" disabled={!selectedCrypto} onClick={() => setStep(3)}>
              Continue <ArrowRight size={16} />
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Send & Upload */}
      {step === 3 && selectedPlan && selectedCrypto && (
        <GlassCard gold className="p-6 space-y-5">
          <h3 className="font-semibold text-foreground font-serif">Step 3: Send Funds & Upload Proof</h3>

          {/* Wallet */}
          <div className="bg-muted/40 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <img
                src={qrUrl}
                alt="Wallet QR Code"
                className="w-36 h-36 rounded-lg border border-border bg-[#050D1F] flex-shrink-0"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="text-xs text-muted-foreground mb-2">Send {selectedCrypto.symbol} ({selectedCrypto.network}) to:</div>
                <div className="font-mono text-sm text-foreground break-all bg-muted/50 rounded-lg p-3 mb-3">
                  {selectedCrypto.walletAddress}
                </div>
                <button
                  onClick={copyAddress}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary hover:bg-primary/20 transition-colors"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-400">
              ⚠️ Only send {selectedCrypto.symbol} on the {selectedCrypto.network} network. Sending other coins may result in permanent loss.
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Investment Amount (USD)</label>
            <input
              type="number"
              placeholder={`$${selectedPlan.minDeposit} – $${selectedPlan.maxDeposit}`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={selectedPlan.minDeposit}
              max={selectedPlan.maxDeposit}
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
            {amount && (
              <div className="text-xs text-emerald-400">
                Expected return: ${(parseFloat(amount || '0') * (1 + selectedPlan.roi / 100)).toFixed(2)} after {selectedPlan.duration} days
              </div>
            )}
          </div>

          {/* Tx Hash */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Transaction Hash (optional)</label>
            <input
              type="text"
              placeholder="Enter your transaction ID/hash"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
          </div>

          {/* Upload proof */}
          <div>
            <label className="text-sm font-medium text-foreground/80 block mb-2">Payment Screenshot (required)</label>
            {proof ? (
              <div className="relative rounded-xl overflow-hidden border border-primary/30">
                <img src={proof} alt="Payment proof" className="w-full h-48 object-cover" />
                <button
                  onClick={() => { setProof(null); setProofName(''); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-xs text-white truncate">{proofName}</div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors bg-muted/20">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload screenshot</span>
                <span className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WEBP up to 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1" loading={submitting} onClick={handleSubmit}>
              Submit Deposit
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <GlassCard gold className="p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-serif mb-3">Deposit Submitted!</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Your deposit is under review. Our team will verify your payment and activate your investment within 24 hours.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Plan</div>
              <div className="text-sm font-semibold text-foreground">{selectedPlan?.name}</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Amount</div>
              <div className="text-sm font-semibold font-mono text-foreground">${parseFloat(amount).toLocaleString()}</div>
            </div>
          </div>
          <Button onClick={() => { setStep(1); setSelectedPlan(null); setSelectedCrypto(null); setAmount(''); setProof(null); setTxHash(''); }}>
            Make Another Deposit
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
