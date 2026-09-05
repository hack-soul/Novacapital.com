import React from 'react';
import { Send, MessageCircle, Mail, Shield, Globe, Twitter, Linkedin } from 'lucide-react';
import type { Page } from '../lib/types';
import { db } from '../lib/storage';

export default function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const settings = db.settings.get();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#030810] border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <span className="text-[#050D1F] font-bold font-mono">N</span>
              </div>
              <span className="text-foreground font-bold text-xl tracking-wide font-serif">
                NOVA <span className="text-primary">CAPITAL</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              {settings.siteTagline || 'Invest Smarter. Grow Faster.'} — Trusted by 48,000+ investors in 120+ countries. Institutional-grade crypto investment management.
            </p>
            <div className="flex items-center gap-3">
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                  <Send size={15} />
                </a>
              )}
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                  <MessageCircle size={15} />
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`}
                  className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                  <Mail size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'About Us', page: 'about' as Page },
                { label: 'Investment Plans', page: 'plans' as Page },
                { label: 'FAQ', page: 'faq' as Page },
                { label: 'Contact', page: 'contact' as Page },
              ].map(link => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Security</h4>
            <ul className="space-y-3">
              {['SSL Encrypted', 'Cold Storage Vaults', 'Multi-Sig Security', 'Third-Party Audits', 'GDPR Compliant', 'AML/KYC Verified'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={12} className="text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} Nova Capital. All rights reserved. Investment involves risk.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe size={12} />
            <span>Available in 120+ countries</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
