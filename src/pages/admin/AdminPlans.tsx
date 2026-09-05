import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard, Button, Modal, Input, Textarea, StatusBadge, Badge } from '../../components/ui';
import { db } from '../../lib/storage';
import { toast } from '../../components/ui';
import type { Plan } from '../../lib/types';

const emptyPlan: Omit<Plan, 'id'> = {
  name: '', minDeposit: 100, maxDeposit: 9999, roi: 10, duration: 7,
  description: '', status: 'active', features: [''], popular: false, badge: '',
};

export default function AdminPlans() {
  const [plans, setPlans] = useState(db.plans.all);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<Partial<Plan> & { features: string[] }>(emptyPlan as any);
  const [isEdit, setIsEdit] = useState(false);

  function refresh() { setPlans(db.plans.all()); }

  function openCreate() {
    setEditPlan({ ...emptyPlan, features: [''] });
    setIsEdit(false);
    setShowModal(true);
  }

  function openEdit(plan: Plan) {
    setEditPlan({ ...plan, features: [...plan.features] });
    setIsEdit(true);
    setShowModal(true);
  }

  function deletePlan(id: string) {
    if (!confirm('Delete this plan?')) return;
    db.plans.delete(id);
    refresh();
    toast.success('Plan deleted.');
  }

  function savePlan() {
    if (!editPlan.name) { toast.error('Plan name required'); return; }
    const features = (editPlan.features || []).filter(f => f.trim());
    const data = { ...editPlan, features };
    if (isEdit && editPlan.id) {
      db.plans.update(editPlan.id, data as Partial<Plan>);
      toast.success('Plan updated!');
    } else {
      db.plans.create(data as Omit<Plan, 'id'>);
      toast.success('Plan created!');
    }
    refresh();
    setShowModal(false);
  }

  function toggleStatus(plan: Plan) {
    db.plans.update(plan.id, { status: plan.status === 'active' ? 'inactive' : 'active' });
    refresh();
  }

  function updateFeature(i: number, val: string) {
    const f = [...(editPlan.features || [])];
    f[i] = val;
    setEditPlan(p => ({ ...p, features: f }));
  }

  function addFeature() { setEditPlan(p => ({ ...p, features: [...(p.features || []), ''] })); }
  function removeFeature(i: number) { setEditPlan(p => ({ ...p, features: (p.features || []).filter((_, idx) => idx !== i) })); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Investment Plans</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage investment plans.</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> Add Plan</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {plans.map(plan => (
          <GlassCard key={plan.id} gold={plan.popular} className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground font-serif">{plan.name}</h3>
                {plan.badge && <span className="text-xs text-primary">{plan.badge}</span>}
              </div>
              <StatusBadge status={plan.status} />
            </div>
            <div className="text-3xl font-bold text-primary font-mono">{plan.roi}%</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Min: <span className="text-foreground font-mono">${plan.minDeposit.toLocaleString()}</span></div>
              <div>Max: <span className="text-foreground font-mono">${plan.maxDeposit.toLocaleString()}</span></div>
              <div>Duration: <span className="text-foreground">{plan.duration} days</span></div>
            </div>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => toggleStatus(plan)} className={`p-1.5 rounded-lg transition-colors ${plan.status === 'active' ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted'}`}>
                {plan.status === 'active' ? <CheckCircle size={15} /> : <XCircle size={15} />}
              </button>
              <button onClick={() => openEdit(plan)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"><Edit size={15} /></button>
              <button onClick={() => deletePlan(plan.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Edit Plan' : 'Create Plan'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Plan Name" value={editPlan.name || ''} onChange={e => setEditPlan(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Elite" required />
            <Input label="Badge Text" value={editPlan.badge || ''} onChange={e => setEditPlan(p => ({ ...p, badge: e.target.value }))} placeholder="e.g. Popular" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Deposit ($)" type="number" value={editPlan.minDeposit || ''} onChange={e => setEditPlan(p => ({ ...p, minDeposit: parseFloat(e.target.value) }))} />
            <Input label="Max Deposit ($)" type="number" value={editPlan.maxDeposit || ''} onChange={e => setEditPlan(p => ({ ...p, maxDeposit: parseFloat(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ROI (%)" type="number" value={editPlan.roi || ''} onChange={e => setEditPlan(p => ({ ...p, roi: parseFloat(e.target.value) }))} />
            <Input label="Duration (days)" type="number" value={editPlan.duration || ''} onChange={e => setEditPlan(p => ({ ...p, duration: parseInt(e.target.value) }))} />
          </div>
          <Textarea label="Description" value={editPlan.description || ''} onChange={e => setEditPlan(p => ({ ...p, description: e.target.value }))} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground/80">Status</label>
              <select value={editPlan.status} onChange={e => setEditPlan(p => ({ ...p, status: e.target.value as any }))} className="bg-input-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editPlan.popular || false} onChange={e => setEditPlan(p => ({ ...p, popular: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground/80">Mark as Popular</span>
            </label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground/80">Features</label>
              <button onClick={addFeature} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus size={12} /> Add Feature</button>
            </div>
            <div className="space-y-2">
              {(editPlan.features || []).map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder="Feature description" className="flex-1 bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={savePlan} className="flex-1">{isEdit ? 'Save Changes' : 'Create Plan'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
