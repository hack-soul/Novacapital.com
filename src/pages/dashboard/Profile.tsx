import React, { useState } from 'react';
import { User, Mail, Phone, Globe, Save, Key, Eye, EyeOff } from 'lucide-react';
import { GlassCard, Button, Input } from '../../components/ui';
import { getCurrentSession } from '../../lib/auth';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Nigeria', 'South Africa', 'Brazil', 'India', 'China', 'Russia', 'Other'];

export default function ProfilePage() {
  const session = getCurrentSession()!;
  const user = db.users.find(session.userId)!;
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', country: user.country || '' });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    db.users.update(session.userId, { name: form.name, phone: form.phone, country: form.country });
    setSaving(false);
    toast.success('Profile updated successfully.');
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passForm.current !== user.password) { toast.error('Current password is incorrect.'); return; }
    if (passForm.newPass.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match.'); return; }
    setSavingPass(true);
    await new Promise(r => setTimeout(r, 600));
    db.users.update(session.userId, { password: passForm.newPass });
    setPassForm({ current: '', newPass: '', confirm: '' });
    setSavingPass(false);
    toast.success('Password changed successfully.');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal information and security settings.</p>
      </div>

      {/* Avatar / header */}
      <GlassCard gold className="p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center text-[#050D1F] text-3xl font-bold font-serif border-2 border-primary/30 flex-shrink-0">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-serif">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-primary mt-1 capitalize">{user.role} account</p>
          </div>
        </div>
      </GlassCard>

      {/* Profile form */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-foreground font-serif mb-5">Personal Information</h3>
        <form onSubmit={saveProfile} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} icon={<User size={16} />} required />
          <Input label="Email Address" value={user.email} disabled className="opacity-60 cursor-not-allowed" icon={<Mail size={16} />} />
          <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} icon={<Phone size={16} />} placeholder="+1 555 000 0000" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Country</label>
            <select
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button type="submit" loading={saving} className="gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </form>
      </GlassCard>

      {/* Password */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-foreground font-serif mb-5">Change Password</h3>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Current Password</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPass ? 'text' : 'password'}
                value={passForm.current}
                onChange={e => setPassForm(f => ({ ...f, current: e.target.value }))}
                required
                className="w-full bg-input-background border border-border rounded-lg py-2.5 pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">New Password</label>
              <input type={showPass ? 'text' : 'password'} value={passForm.newPass} onChange={e => setPassForm(f => ({ ...f, newPass: e.target.value }))} required placeholder="Min. 6 chars"
                className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Confirm New</label>
              <input type={showPass ? 'text' : 'password'} value={passForm.confirm} onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))} required placeholder="Repeat password"
                className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" />
            </div>
          </div>
          <Button type="submit" variant="outline" loading={savingPass}>
            Update Password
          </Button>
        </form>
      </GlassCard>

      {/* Account Stats */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-foreground font-serif mb-4">Account Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-primary font-mono">${user.balance.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Balance</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-foreground font-mono">${user.totalInvested.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Invested</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-emerald-400 font-mono">${user.totalEarnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Earned</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
