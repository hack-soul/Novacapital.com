import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Globe, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { Button, Input, GlassCard } from '../components/ui';
import { register } from '../lib/auth';
import type { Page } from '../lib/types';
import { toast } from '../components/ui';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Nigeria', 'South Africa', 'Brazil', 'India', 'China', 'Russia', 'Other'];

export default function RegisterPage({ onNavigate, onLogin }: { onNavigate: (p: Page) => void; onLogin: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '', country: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register(form.name, form.email, form.password, form.phone, form.country);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to Nova Capital.');
      onLogin();
      onNavigate('dashboard');
    } else {
      setErrors({ general: result.error || 'Registration failed' });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-600/4 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center">
              <span className="text-[#050D1F] font-bold font-mono">N</span>
            </div>
            <span className="font-bold text-xl font-serif">NOVA <span className="text-primary">CAPITAL</span></span>
          </button>
          <h1 className="text-3xl font-bold text-foreground font-serif mb-2">Create Your Account</h1>
          <p className="text-muted-foreground text-sm">Join 48,000+ investors growing their wealth with crypto</p>
        </div>

        <GlassCard gold className="p-8">
          {errors.general && (
            <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Carter"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                icon={<User size={16} />}
                error={errors.name}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                icon={<Mail size={16} />}
                error={errors.email}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    className="w-full bg-input-background border border-border rounded-lg py-2.5 pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <Input
                label="Confirm Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                icon={<Lock size={16} />}
                error={errors.confirm}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone (optional)"
                type="tel"
                placeholder="+1 555 000 0000"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                icon={<Phone size={16} />}
              />
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
            </div>
            <div className="flex items-start gap-2 pt-1">
              <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                By registering, you agree to our Terms of Service and Privacy Policy. You confirm you are at least 18 years old.
              </p>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-primary hover:underline font-medium">Sign in</button>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
