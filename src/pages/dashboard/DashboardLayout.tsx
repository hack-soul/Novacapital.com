import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Clock, List, Bell, User, Settings,
  TrendingUp, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { getCurrentSession, logout } from '../../lib/auth';
import { db } from '../../lib/storage';
import type { Page } from '../../lib/types';

interface DashboardLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  onLogout: () => void;
}

const navItems: { label: string; page: Page; icon: React.FC<any> }[] = [
  { label: 'Overview', page: 'dashboard', icon: LayoutDashboard },
  { label: 'Deposit Funds', page: 'dashboard/deposit', icon: ArrowDownCircle },
  { label: 'Withdraw Funds', page: 'dashboard/withdraw', icon: ArrowUpCircle },
  { label: 'Investments', page: 'dashboard/investments', icon: TrendingUp },
  { label: 'Deposit History', page: 'dashboard/deposits', icon: Clock },
  { label: 'Withdrawal History', page: 'dashboard/withdrawals', icon: List },
  { label: 'Notifications', page: 'dashboard/notifications', icon: Bell },
  { label: 'Profile', page: 'dashboard/profile', icon: User },
  { label: 'Settings', page: 'dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ currentPage, onNavigate, children, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getCurrentSession();
  const unread = session ? db.notifications.unreadCount(session.userId) : 0;
  const user = session ? db.users.find(session.userId) : null;

  function handleLogout() {
    logout();
    onLogout();
    onNavigate('home');
  }

  const sidebar = (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center">
            <span className="text-[#050D1F] font-bold text-xs font-mono">N</span>
          </div>
          <span className="font-bold text-sm font-serif text-foreground">NOVA <span className="text-primary">CAPITAL</span></span>
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center text-[#050D1F] text-sm font-bold flex-shrink-0">
            {session?.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{session?.name}</p>
            <p className="text-xs text-muted-foreground font-mono">${(user?.balance || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-0.5 px-3">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                currentPage === item.page
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon size={17} />
              {item.label}
              {item.page === 'dashboard/notifications' && unread > 0 && (
                <span className="ml-auto w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">{unread}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => onNavigate('home')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <ChevronRight size={17} />
          Back to Website
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
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0">{sidebar}</div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 border-b border-border bg-[#050D1F]/95 backdrop-blur-lg flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Menu size={18} />
            </button>
            <div className="text-sm text-muted-foreground hidden sm:block">
              {navItems.find(n => n.page === currentPage)?.label || 'Dashboard'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className="text-sm font-bold text-primary font-mono">${(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <button
              onClick={() => onNavigate('dashboard/notifications')}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
