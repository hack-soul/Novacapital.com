import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, TrendingUp,
  Bitcoin, Settings, Menu, LogOut, ChevronRight, MessageSquare, Shield
} from 'lucide-react';
import { logout } from '../../lib/auth';
import type { Page } from '../../lib/types';

interface AdminLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  onLogout: () => void;
}

const navItems: { label: string; page: Page; icon: React.FC<any>; badge?: string }[] = [
  { label: 'Dashboard', page: 'admin', icon: LayoutDashboard },
  { label: 'Users', page: 'admin/users', icon: Users },
  { label: 'Deposits', page: 'admin/deposits', icon: ArrowDownCircle },
  { label: 'Withdrawals', page: 'admin/withdrawals', icon: ArrowUpCircle },
  { label: 'Investment Plans', page: 'admin/plans', icon: TrendingUp },
  { label: 'Cryptocurrencies', page: 'admin/cryptos', icon: Bitcoin },
  { label: 'FAQs', page: 'admin/faqs', icon: MessageSquare },
  { label: 'Site Settings', page: 'admin/settings', icon: Settings },
];

export default function AdminLayout({ currentPage, onNavigate, children, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    onLogout();
    onNavigate('home');
  }

  const sidebar = (
    <div className="h-full flex flex-col bg-[#030810] border-r border-border">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center">
          <span className="text-[#050D1F] font-bold text-xs font-mono">N</span>
        </div>
        <div>
          <div className="font-bold text-sm font-serif text-foreground">NOVA <span className="text-primary">CAPITAL</span></div>
          <div className="flex items-center gap-1 text-[10px] text-primary/70">
            <Shield size={9} /> Admin Panel
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-0.5 px-3">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                currentPage === item.page
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-foreground/70 hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronRight size={17} />
          User Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0">{sidebar}</div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 border-b border-border bg-[#050D1F]/95 backdrop-blur-lg flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground">
              <Menu size={18} />
            </button>
            <div className="text-sm font-medium text-primary">
              {navItems.find(n => n.page === currentPage)?.label || 'Admin'}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <Shield size={12} className="text-primary" />
            <span className="text-xs text-primary font-medium">Admin Mode</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
