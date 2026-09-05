import { useState } from 'react';
import { Sheet, Button, Icon, useToast } from '../ui/index.jsx';
import { usePlanDoc, useSavedPlans, useSettings, useTargets } from './hooks.js';
import { densify } from '../core/planOps.js';

// Saved plans: snapshot the current week under a name, load one back later. Loading restores the
// plan's targets too (calories + macro split) so the week re-solves against what it was built for.
export default function SavedPlans({ open, onClose }) {
  const [planDoc, setPlanDoc] = usePlanDoc();
  const [saved, setSaved] = useSavedPlans();
  const [settings, patch] = useSettings();
  const T = useTargets();
  const toast = useToast();
  const [name, setName] = useState('');

  const save = () => {
    const n = name.trim();
    if (!planDoc || !n) return;
    const entry = {
      name: n, date: new Date().toLocaleDateString(),
      calories: settings.targets.calories, carbPct: settings.targets.carbPct, proteinPct: settings.targets.proteinPct, fatPct: settings.targets.fatPct,
      plan: planDoc.days, planGroups: planDoc.groups, tags: planDoc.tags, weekStart: planDoc.weekStart,
    };
    setSaved([entry, ...saved.filter((p) => p.name !== n)]);
    setName('');
    toast(`Saved "${n}".`, { kind: 'ok' });
  };
  const load = (entry) => {
    patch({ targets: { calories: entry.calories, carbPct: entry.carbPct, proteinPct: entry.proteinPct, fatPct: entry.fatPct } });
    setPlanDoc({ days: densify(entry.plan || []), groups: entry.planGroups || {}, eaten: {}, servings: {}, tags: entry.tags || {}, createdAt: new Date().toISOString(), weekStart: entry.weekStart || null, targets: T });
    toast(`Loaded "${entry.name}".`, { kind: 'ok' });
    onClose();
  };
  const del = (n) => setSaved(saved.filter((p) => p.name !== n));

  return (
    <Sheet open={open} onClose={onClose} title="Saved plans" subtitle="Snapshots of a week you want back later">
      {planDoc && (
        <div className="row-sm">
          <input className="input" placeholder="Name this week…" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); }} />
          <Button variant="primary" onClick={save} disabled={!name.trim()}>Save</Button>
        </div>
      )}
      <div className="list">
        {saved.map((sp) => (
          <div key={sp.name} className="item">
            <div className="grow stack-sm" style={{ gap: 2 }}>
              <div className="item-name">{sp.name}</div>
              <div className="small muted">{sp.date} · {sp.calories} kcal · {sp.carbPct}/{sp.proteinPct}/{sp.fatPct}</div>
            </div>
            <Button size="sm" onClick={() => load(sp)}>Load</Button>
            <button type="button" className="icon-btn sm muted" aria-label={`Delete ${sp.name}`} onClick={() => del(sp.name)}><Icon name="trash" size={16} /></button>
          </div>
        ))}
        {saved.length === 0 && <div className="empty">No saved plans yet.</div>}
      </div>
    </Sheet>
  );
}
