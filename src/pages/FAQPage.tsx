import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { GlassCard, SectionHeader, Button } from '../components/ui';
import { db } from '../lib/storage';
import type { Page } from '../lib/types';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className={`overflow-hidden transition-all duration-300 ${open ? 'border-primary/30' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/20 transition-colors"
      >
        <span className="text-sm font-medium text-foreground pr-6 leading-relaxed">{q}</span>
        {open
          ? <ChevronUp size={16} className="text-primary flex-shrink-0" />
          : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-border/50">
          <p className="pt-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </GlassCard>
  );
}

export default function FAQPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const settings = db.settings.get();
  const faqs = settings.faqs || [];

  const categories = [
    { label: 'Getting Started', indices: [0, 1] },
    { label: 'Deposits & Returns', indices: [2, 3] },
    { label: 'Security & Trust', indices: [4] },
    { label: 'Account Management', indices: [5, 6, 7] },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader
          tag="FAQ"
          title="Everything You Need to Know"
          subtitle="Get answers to the most common questions about investing with Nova Capital."
        />

        <div className="space-y-3 mb-16">
          {faqs.sort((a, b) => a.order - b.order).map(faq => (
            <FAQItem key={faq.id} q={faq.question} a={faq.answer} />
          ))}
        </div>

        {/* Still have questions */}
        <GlassCard gold className="p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <HelpCircle size={26} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-serif mb-3">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Our expert support team is available 24/7 to help with any questions about your investment journey.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => onNavigate('contact')}>Contact Support</Button>
            <Button variant="outline" onClick={() => onNavigate('register')}>Open an Account</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
