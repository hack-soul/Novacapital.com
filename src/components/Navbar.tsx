import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard, Settings, Shield } from 'lucide-react';
import { getCurrentSession, logout } from '../lib/auth';
import { db } from '../lib/storage';
import type { Page } from '../lib/types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const publicLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Plans', page: 'plans' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const session = getCurrentSession();
  const unread = session ? db.notifications.unreadCount(session.userId) : 0;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function handleLogout() {
    logout();
    onNavigate('home');
    setUserMenuOpen(false);
  }

  const isDashboard = currentPage.startsWith('dashboard') || currentPage.startsWith('admin');

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      scrolled || isDashboard
        ? 'bg-[#050D1F]/95 backdrop-blur-xl border-b border-border shadow-lg'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-[0_0_16px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_24px_rgba(212,175,55,0.6)] transition-all">
              <span className="text-[#050D1F] font-bold text-sm font-mono">N</span>
            </div>
            <span className="text-foreground font-bold text-lg tracking-wide font-serif">
              NOVA <span className="text-primary">CAPITAL</span>
            </span>
          </button>

          {/* Desktop nav */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-1">
              {publicLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === link.page
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => onNavigate('dashboard/notifications')}
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center text-[#050D1F] text-xs font-bold">
                      {session.name[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">{session.name}</span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-20">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium text-foreground truncate">{session.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.email}</p>
                        </div>
                        <div className="py-1">
                          <button onClick={() => { onNavigate('dashboard'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
                            <LayoutDashboard size={15} /> Dashboard
                          </button>
                          <button onClick={() => { onNavigate('dashboard/profile'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
                            <User size={15} /> Profile
                          </button>
                          {session.role === 'admin' && (
                            <button onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-muted transition-colors">
                              <Shield size={15} /> Admin Panel
                            </button>
                          )}
                          <div className="border-t border-border my-1" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-muted transition-colors">
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all shadow-[0_0_16px_rgba(212,175,55,0.3)]"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#050D1F]/98 border-t border-border">
          <div className="px-4 py-4 flex flex-col gap-1">
            {publicLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  currentPage === link.page ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </button>
            ))}
            {!session && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => { onNavigate('login'); setMobileOpen(false); }} className="flex-1 py-2.5 text-sm font-medium border border-border rounded-lg text-foreground">Sign In</button>
                <button onClick={() => { onNavigate('register'); setMobileOpen(false); }} className="flex-1 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg">Get Started</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
