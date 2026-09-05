import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// ─── Button ────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer';
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-muted border border-border',
    ghost: 'text-foreground hover:bg-muted hover:text-primary',
    danger: 'bg-destructive text-destructive-foreground hover:brightness-110',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({ label, error, icon, suffix, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-foreground/80">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          id={inputId}
          className={clsx(
            'w-full bg-input-background border border-border rounded-lg py-2.5 text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors',
            icon ? 'pl-10' : 'pl-4',
            suffix ? 'pr-16' : 'pr-4',
            error && 'border-destructive focus:ring-destructive/30',
            className
          )}
          {...props}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-foreground/80">{label}</label>}
      <textarea
        id={inputId}
        className={clsx(
          'w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors resize-none',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-foreground/80">{label}</label>}
      <select
        id={inputId}
        className={clsx(
          'w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors cursor-pointer',
          error && 'border-destructive',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    gold: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    default: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border', variants[variant], className)}>
      {children}
    </span>
  );
}

// ─── GlassCard ────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gold?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover, gold, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border bg-card/60 backdrop-blur-xl',
        gold ? 'border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.08)]' : 'border-border',
        hover && 'cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.12)] hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full bg-card border border-border rounded-2xl shadow-2xl', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground font-serif">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastListeners: ((toast: ToastItem) => void)[] = [];

export function toast(message: string, type: ToastItem['type'] = 'info') {
  const id = Date.now().toString();
  toastListeners.forEach(fn => fn({ id, message, type }));
}
toast.success = (msg: string) => toast(msg, 'success');
toast.error = (msg: string) => toast(msg, 'error');
toast.warning = (msg: string) => toast(msg, 'warning');
toast.info = (msg: string) => toast(msg, 'info');

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4000);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter(fn => fn !== handler); };
  }, []);

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400" />,
    error: <AlertCircle size={16} className="text-red-400" />,
    warning: <AlertTriangle size={16} className="text-amber-400" />,
    info: <Info size={16} className="text-blue-400" />,
  };
  const colors = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    warning: 'border-amber-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={clsx('flex items-center gap-3 px-4 py-3 bg-card border rounded-xl shadow-xl backdrop-blur-xl text-foreground text-sm max-w-xs pointer-events-auto', colors[t.type])}>
          {icons[t.type]}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ label, value, change, positive, icon, color = '#D4AF37' }: StatCardProps) {
  return (
    <GlassCard className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18`, color }}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
      {change && (
        <div className={clsx('text-xs font-medium', positive ? 'text-emerald-400' : 'text-red-400')}>
          {positive ? '▲' : '▼'} {change}
        </div>
      )}
    </GlassCard>
  );
}

// ─── Counter ────────────────────────────────────────────────────────────

export function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled' | 'inactive' }) {
  const map = {
    pending: 'warning',
    approved: 'success',
    active: 'success',
    rejected: 'danger',
    cancelled: 'danger',
    completed: 'info',
    inactive: 'default',
  } as const;
  return <Badge variant={map[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

// ─── Loading Spinner ────────────────────────────────────────────────────

export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <div
      className={clsx('border-2 border-border border-t-primary rounded-full animate-spin', className)}
      style={{ width: size, height: size }}
    />
  );
}

// ─── Section Header ────────────────────────────────────────────────────

export function SectionHeader({ tag, title, subtitle, center = true }: { tag?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={clsx('mb-12', center && 'text-center')}>
      {tag && (
        <div className={clsx('inline-flex items-center gap-2 mb-4', center && 'mx-auto')}>
          <div className="w-8 h-px bg-primary" />
          <span className="text-primary text-sm font-medium uppercase tracking-widest">{tag}</span>
          <div className="w-8 h-px bg-primary" />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight font-serif">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────

export function Table({ headers, children, className }: { headers: string[]; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('overflow-x-auto rounded-xl border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={clsx('hover:bg-muted/30 transition-colors', className)}>{children}</tr>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx('px-4 py-3 text-foreground whitespace-nowrap', className)}>{children}</td>;
}

// ─── Empty State ────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description }: { icon?: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {icon && <div className="text-muted-foreground/40 mb-2">{icon}</div>}
      <p className="text-foreground font-medium">{title}</p>
      {description && <p className="text-muted-foreground text-sm max-w-xs">{description}</p>}
    </div>
  );
}
