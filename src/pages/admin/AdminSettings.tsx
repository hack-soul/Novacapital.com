import React, { useState } from 'react';
import { Save, MessageCircle, Send, Mail, Globe, BarChart2, BookOpen, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { GlassCard, Button, Input, Textarea } from '../../components/ui';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { SiteSettings, FAQ } from '../../lib/types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(db.settings.get());
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'about' | 'stats'>('general');

  async function save() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    db.settings.update(settings);
    setSaving(false);
    toast.success('Settings saved!');
  }

  function updateFAQ(id: string, field: keyof FAQ, val: string | number) {
    setSettings(s => ({ ...s, faqs: s.faqs.map(f => f.id === id ? { ...f, [field]: val } : f) }));
  }

  function addFAQ() {
    const newFaq: FAQ = { id: Date.now().toString(), question: '', answer: '', order: (settings.faqs?.length || 0) + 1 };
    setSettings(s => ({ ...s, faqs: [...(s.faqs || []), newFaq] }));
  }

  function removeFAQ(id: string) {
    setSettings(s => ({ ...s, faqs: s.faqs.filter(f => f.id !== id) }));
  }

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'contact' as const, label: 'Contact', icon: MessageCircle },
    { id: 'about' as const, label: 'About & FAQs', icon: BookOpen },
    { id: 'stats' as const, label: 'Statistics', icon: BarChart2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Site Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your website content and configuration.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 p-1 rounded-xl border border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <tab.icon size={14} /> <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <GlassCard className="p-6 space-y-5">
          <h3 className="font-semibold text-foreground font-serif">General Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Site Name" value={settings.siteName || ''} onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))} />
            <Input label="Logo Text" value={settings.logoText || ''} onChange={e => setSettings(s => ({ ...s, logoText: e.target.value }))} />
          </div>
          <Input label="Site Tagline" value={settings.siteTagline || ''} onChange={e => setSettings(s => ({ ...s, siteTagline: e.target.value }))} />
          <Input label="Office Address" value={settings.address || ''} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} icon={<Globe size={16} />} />
          <Button onClick={save} loading={saving} className="gap-2"><Save size={16} /> Save Settings</Button>
        </GlassCard>
      )}

      {activeTab === 'contact' && (
        <GlassCard className="p-6 space-y-5">
          <h3 className="font-semibold text-foreground font-serif">Contact Information</h3>
          <p className="text-sm text-muted-foreground">These values appear on the website and are used for contact links.</p>
          <Input label="Telegram URL" value={settings.telegram || ''} onChange={e => setSettings(s => ({ ...s, telegram: e.target.value }))} icon={<Send size={16} />} placeholder="https://t.me/yourhandle" />
          <Input label="WhatsApp URL" value={settings.whatsapp || ''} onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.value }))} icon={<MessageCircle size={16} />} placeholder="https://wa.me/15550000001" />
          <Input label="Support Email" value={settings.email || ''} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} icon={<Mail size={16} />} placeholder="support@example.com" />
          <Button onClick={save} loading={saving} className="gap-2"><Save size={16} /> Save Contact Info</Button>
        </GlassCard>
      )}

      {activeTab === 'about' && (
        <div className="space-y-5">
          <GlassCard className="p-6 space-y-5">
            <h3 className="font-semibold text-foreground font-serif">About Page Content</h3>
            <Input label="About Page Title" value={settings.aboutTitle || ''} onChange={e => setSettings(s => ({ ...s, aboutTitle: e.target.value }))} />
            <Textarea label="About Content" value={settings.aboutContent || ''} onChange={e => setSettings(s => ({ ...s, aboutContent: e.target.value }))} rows={4} />
            <Textarea label="Mission Statement" value={settings.missionContent || ''} onChange={e => setSettings(s => ({ ...s, missionContent: e.target.value }))} rows={3} />
            <Textarea label="Vision Statement" value={settings.visionContent || ''} onChange={e => setSettings(s => ({ ...s, visionContent: e.target.value }))} rows={3} />
            <Button onClick={save} loading={saving} className="gap-2"><Save size={16} /> Save About Content</Button>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground font-serif">FAQ Management</h3>
              <Button size="sm" onClick={addFAQ} className="gap-1"><Plus size={14} /> Add FAQ</Button>
            </div>
            {(settings.faqs || []).map((faq, idx) => (
              <div key={faq.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">FAQ #{idx + 1}</span>
                  <button onClick={() => removeFAQ(faq.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={13} /></button>
                </div>
                <Input label="Question" value={faq.question} onChange={e => updateFAQ(faq.id, 'question', e.target.value)} placeholder="Enter question..." />
                <Textarea label="Answer" value={faq.answer} onChange={e => updateFAQ(faq.id, 'answer', e.target.value)} rows={3} placeholder="Enter answer..." />
              </div>
            ))}
            <Button onClick={save} loading={saving} className="gap-2 w-full"><Save size={16} /> Save All FAQs</Button>
          </GlassCard>
        </div>
      )}

      {activeTab === 'stats' && (
        <GlassCard className="p-6 space-y-5">
          <h3 className="font-semibold text-foreground font-serif">Homepage Statistics</h3>
          <p className="text-sm text-muted-foreground">These statistics are displayed on the homepage and about page.</p>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Users" type="number" value={settings.statistics?.totalUsers || ''} onChange={e => setSettings(s => ({ ...s, statistics: { ...s.statistics, totalUsers: parseInt(e.target.value) } }))} />
            <Input label="Countries" type="number" value={settings.statistics?.countries || ''} onChange={e => setSettings(s => ({ ...s, statistics: { ...s.statistics, countries: parseInt(e.target.value) } }))} />
            <Input label="Years Active" type="number" value={settings.statistics?.yearsActive || ''} onChange={e => setSettings(s => ({ ...s, statistics: { ...s.statistics, yearsActive: parseInt(e.target.value) } }))} />
            <Input label="Platform Uptime" value={settings.statistics?.uptime || ''} onChange={e => setSettings(s => ({ ...s, statistics: { ...s.statistics, uptime: e.target.value } }))} placeholder="99.9%" />
            <Input label="Total Invested (display)" value={settings.statistics?.totalInvested || ''} onChange={e => setSettings(s => ({ ...s, statistics: { ...s.statistics, totalInvested: e.target.value } }))} placeholder="$248M+" />
            <Input label="Total Returns (display)" value={settings.statistics?.totalReturns || ''} onChange={e => setSettings(s => ({ ...s, statistics: { ...s.statistics, totalReturns: e.target.value } }))} placeholder="$87M+" />
          </div>
          <Button onClick={save} loading={saving} className="gap-2"><Save size={16} /> Save Statistics</Button>
        </GlassCard>
      )}
    </div>
  );
}
