import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input, GlassCard, toast } from '../components/ui';
import { login } from '../lib/auth';
import type { Page } from '../lib/types';

export default function LoginPage({ onNavigate, onLogin }: { onNavigate: (p: Page) => void; onLogin: () => void }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      onLogin();
      const session = result.user;
      if (session?.role === 'admin') onNavigate('admin');
      else onNavigate('dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/4 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center">
              <span className="text-[#050D1F] font-bold font-mono">N</span>
            </div>
            <span className="font-bold text-xl font-serif">
              NOVA <span className="text-primary">CAPITAL</span>
            </span>
          </button>
          <h1 className="text-3xl font-bold text-foreground font-serif mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to access your investment dashboard</p>
        </div>

        <GlassCard gold className="p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              icon={<Mail size={16} />}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full bg-input-background border border-border rounded-lg py-2.5 pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('register')} className="text-primary hover:underline font-medium">
                Create one free
              </button>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
