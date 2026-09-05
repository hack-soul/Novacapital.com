import React, { useState } from 'react';
import { Send, MessageCircle, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { GlassCard, Button, Input, Textarea, SectionHeader } from '../components/ui';
import { db } from '../lib/storage';
import { toast } from '../components/ui';

export default function ContactPage() {
  const settings = db.settings.get();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! We\'ll respond within 24 hours.');
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          tag="Contact Us"
          title="We're Here to Help, 24/7"
          subtitle="Reach out through any channel — our team responds promptly day and night."
        />

        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {/* Contact channels */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: Send,
                label: 'Telegram',
                value: '@novacapital_help',
                desc: 'Fastest response — usually within minutes',
                href: settings.telegram || 'https://t.me/novacapital_help',
                color: '#2AABEE',
                cta: 'Open Telegram',
              },
              {
                icon: MessageCircle,
                label: 'WhatsApp',
                value: '+1 555 000 0001',
                desc: 'Chat with our support team directly',
                href: settings.whatsapp || 'https://wa.me/15550000001',
                color: '#25D366',
                cta: 'Open WhatsApp',
              },
              {
                icon: Mail,
                label: 'Email',
                value: settings.email || 'novacapital99@outlook.com',
                desc: 'Detailed enquiries — response within 24h',
                href: `mailto:${settings.email || 'novacapital99@outlook.com'}`,
                color: '#D4AF37',
                cta: 'Send Email',
              },
            ].map(c => (
              <GlassCard key={c.label} hover className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
                    <c.icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">{c.label}</div>
                    <div className="text-sm text-primary mt-0.5 font-mono">{c.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:border-primary/30 hover:text-primary text-foreground/70 transition-colors"
                    >
                      {c.cta}
                    </a>
                  </div>
                </div>
              </GlassCard>
            ))}

            <GlassCard className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Office Address</div>
                  <div className="text-sm text-muted-foreground mt-1">{settings.address || '350 Fifth Avenue, New York, NY 10118, USA'}</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={22} className="text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Support Hours</div>
                  <div className="text-sm text-muted-foreground mt-1">24 hours · 7 days a week · 365 days a year</div>
                  <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online Now</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contact form */}
          <GlassCard gold className="lg:col-span-3 p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif">Message Sent!</h3>
                <p className="text-muted-foreground">Our team will get back to you within 24 hours. You can also reach us instantly via Telegram or WhatsApp.</p>
                <Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground font-serif mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Your Name" placeholder="John Carter" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                  <Textarea label="Message" placeholder="Tell us more about your inquiry..." rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                  <Button type="submit" size="lg" className="w-full" loading={loading}>
                    <Send size={16} /> Send Message
                  </Button>
                </form>
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
