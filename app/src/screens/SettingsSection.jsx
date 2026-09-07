import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DAYS_NAMES, RECIPES, INGREDIENT_REGISTRY } from '../core/index.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Seg, Toggle, SRow, Stepper, Sheet, Confirm, Icon, cx, useToast } from '../ui/index.jsx';
import { useSettings, useDayGroups, useUnits, useTargets, usePlansDoc } from '../fuel/hooks.js';
import { groupColor, targetsLine, useIsDesktop } from '../fuel/common.js';
import { ACCENTS } from '../store/defaults.js';
import { buildBackup, parseBackup, saveJson, backupFileName } from '../store/backup.js';
import { replaceAll, clearAll, allDocs, setDoc } from '../store/store.js';
import { storageMode } from '../store/db.js';
import pkg from '../../package.json';

const TITLES = {
  appearance: 'Appearance', targets: 'Targets', days: 'Day groups', meals: 'Meals per day', units: 'Units',
  notifications: 'Notifications', backup: 'Backup', about: 'About',
};

function Appearance() {
  const [settings, patch] = useSettings();
  return (
    <>
      <Card className="stack">
        <div className="eyebrow">Theme</div>
        <Seg value={settings.theme} onChange={(v) => patch({ theme: v })} options={[
          { value: 'system', label: 'System', icon: 'monitor' }, { value: 'light', label: 'Light', icon: 'sun' }, { value: 'dark', label: 'Dark', icon: 'moon' },
        ]} />
        <div className="srow" style={{ minHeight: 44 }}>
          <div className="srow-main"><div className="srow-title">Accent</div><div className="srow-val">{(ACCENTS[settings.accent] || ACCENTS.orange).label}</div></div>
          <div className="row-sm">
            {Object.entries(ACCENTS).map(([key, a]) => (
              <button key={key} type="button" className={cx('swatch', settings.accent === key && 'on')} aria-label={a.label} title={a.label}
                style={{ background: settings.theme === 'light' ? a.light : a.dark }} onClick={() => patch({ accent: key })} />
            ))}
          </div>
        </div>
      </Card>
      <div className="infobox">Macro colours stay fixed — carbs blue, protein magenta, fat yellow — and are always labelled, so the accent never changes what a bar means.</div>
    </>
  );
}

function Targets() {
  const [settings, patch] = useSettings();
  const T = useTargets();
  const t = settings.targets;
  const set = (k, v) => patch({ targets: { ...t, [k]: v === '' ? '' : Number(v) } });
  const num = (v) => (v === '' ? '' : v);
  return (
    <>
      <Card className="stack">
        <label className="field"><span>Calories per day</span><input className="input num" type="number" inputMode="numeric" min={1000} max={6000} step={10} value={num(t.calories)} onChange={(e) => set('calories', e.target.value)} /></label>
        <div className="grid-3">
          {[['carbPct', 'Carbs %', 'var(--carbs)', T.carbGrams], ['proteinPct', 'Protein %', 'var(--protein)', T.proteinGrams], ['fatPct', 'Fat %', 'var(--fat)', T.fatGrams]].map(([k, label, color, grams]) => (
            <label key={k} className="field">
              <span style={{ color }}>{label}</span>
              <input className="input num" type="number" inputMode="numeric" min={0} max={100} value={num(t[k])} onChange={(e) => set(k, e.target.value)} />
              <span className="small muted">{Math.round(grams)} g</span>
            </label>
          ))}
        </div>
        {T.pctValid ? <div className="okline"><Icon name="checkCircle" size={16} stroke={2.25} style={{ color: 'var(--good)' }} />{targetsLine(T)}</div>
          : <div className="warnbox">Percentages add up to {T.pctSum}% — they must equal 100% before a plan can be generated.</div>}
      </Card>
      <div className="infobox">The solver holds every day inside 95–105% of all four numbers. Protein at 0.8–1 g per pound of bodyweight and fat at 20–30% of calories are the usual starting points; carbs fill the rest. Adaptive targets from your weight trend arrive with Body.</div>
    </>
  );
}

function Days() {
  const [dg, patch] = useDayGroups();
  const units = useUnits();
  const [plans] = usePlansDoc();
  const hasPlans = Object.keys(plans.weeks || {}).length > 0;
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(null);
  const groups = dg.groups;
  const byNum = (a, b) => a - b;

  const tap = (d) => {
    if (dg.excluded.includes(d)) { setSelected(null); setMenu(d); return; }
    if (selected === null) { setSelected(d); return; }
    if (selected === d) { setSelected(null); setMenu(d); return; }
    const gA = ops.findDayGroup(groups, selected), gB = ops.findDayGroup(groups, d);
    let next;
    if (gA !== -1 && gB !== -1) {
      if (gA === gB) { setSelected(null); return; }
      next = groups.map((g, i) => (i === gA ? [...g, ...groups[gB]].sort(byNum) : g)).filter((_, i) => i !== gB);
    } else if (gA !== -1) next = groups.map((g, i) => (i === gA ? [...g, d].sort(byNum) : g));
    else if (gB !== -1) next = groups.map((g, i) => (i === gB ? [...g, selected].sort(byNum) : g));
    else next = [...groups, [selected, d].sort(byNum)];
    patch({ groups: next, mealCounts: ops.normalizedCounts(next, dg.mealCounts) });
    setSelected(null);
  };
  const ungroup = (d) => {
    const gi = ops.findDayGroup(groups, d);
    if (gi === -1) return;
    patch({ groups: groups.map((g, i) => (i === gi ? g.filter((x) => x !== d) : g)).filter((g) => g.length > 1) });
  };
  const toggleFree = (d) => {
    if (dg.excluded.includes(d)) { patch({ excluded: dg.excluded.filter((x) => x !== d) }); return; }
    patch({ groups: groups.map((g) => g.filter((x) => x !== d)).filter((g) => g.length > 0), excluded: [...dg.excluded, d].sort(byNum) });
  };
  const setCook = (unit, v) => {
    const cookDays = { ...dg.cookDays };
    if (v === '') delete cookDays[unit.lead]; else cookDays[unit.lead] = Number(v);
    patch({ cookDays });
  };
  const menuGi = menu != null ? ops.findDayGroup(groups, menu) : -1;

  return (
    <>
      <Card className="stack">
        <div className="eyebrow">Days</div>
        <div className="week">
          {[0, 1, 2, 3, 4, 5, 6].map((d) => {
            const free = dg.excluded.includes(d);
            const gi = ops.findDayGroup(groups, d);
            return (
              <button key={d} type="button" className={cx('day', selected === d && 'on')} onClick={() => tap(d)} aria-pressed={selected === d} style={selected === d ? { borderColor: 'var(--accent)' } : undefined}>
                <div className="eyebrow" style={{ fontSize: 10 }}>{ops.SHORT_DAYS[d]}</div>
                <div className="num" style={{ fontSize: 16, color: free ? 'var(--dim)' : undefined }}>{free ? '–' : gi !== -1 ? `G${gi + 1}` : '1'}</div>
                {free ? <div className="eyebrow" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>free</div> : <div className="day-mark" style={{ '--c': groupColor(gi) }} />}
              </button>
            );
          })}
        </div>
        <div className="small muted" style={{ lineHeight: 1.45 }}>
          {selected !== null ? <span><span className="strong">{DAYS_NAMES[selected]} selected.</span> Tap another day to put them in one group, or tap it again for options.</span>
            : 'Tap a day, then a second day to group them. Grouped days share one plan — same meals, same amounts — so you cook once and eat it on each of those days. Tap a day twice for free-day and ungroup options.'}
        </div>
      </Card>
      <Card pad={false} className="card-rows">
        {units.map((u) => (
          <div key={u.key} className="srow" style={{ alignItems: 'center' }}>
            <span className="dot" style={{ '--c': groupColor(u.groupIndex) }} />
            <div className="srow-main">
              <div className="srow-title">{u.name}{u.days.length > 1 ? ' group' : ''}</div>
              <div className="srow-val">{u.days.length > 1 ? `${u.days.map((d) => ops.SHORT_DAYS[d]).join(' · ')} share one plan` : 'Own plan'}</div>
            </div>
            <label className="row-sm small muted" style={{ flex: '0 0 auto' }}>
              <span>Cook</span>
              <select className="input" style={{ width: 96, height: 36 }} value={dg.cookDays[u.lead] ?? ''} onChange={(e) => setCook(u, e.target.value)} aria-label={`Cook day for ${u.name}`}>
                <option value="">—</option>
                {DAYS_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
              </select>
            </label>
          </div>
        ))}
        {units.length === 0 && <div className="srow"><div className="srow-main"><div className="srow-val">Every day is free — nothing gets planned.</div></div></div>}
      </Card>
      <div className="infobox">Cook day is when you prep a group's batch meals (fresh meals are cooked on the day). Changes here shape the next week you generate{hasPlans ? '; weeks already planned keep their groups' : ''}.</div>
      <Sheet open={menu != null} onClose={() => setMenu(null)} title={menu != null ? DAYS_NAMES[menu] : ''}>
        {menu != null && (
          <div className="stack-sm">
            <Button block onClick={() => { toggleFree(menu); setMenu(null); }}>{dg.excluded.includes(menu) ? 'Plan this day' : 'Make it a free day'}</Button>
            {menuGi !== -1 && <Button block onClick={() => { ungroup(menu); setMenu(null); }}>Remove from group G{menuGi + 1}</Button>}
          </div>
        )}
      </Sheet>
    </>
  );
}

function Meals() {
  const [dg, patch] = useDayGroups();
  const T = useTargets();
  const units = useUnits();
  const setCount = (u, val) => {
    const v = Math.max(ops.MIN_MEALS, Math.min(ops.MAX_MEALS, val));
    const next = { ...dg.mealCounts };
    u.days.forEach((d) => { next[d] = v; });
    patch({ mealCounts: next });
  };
  const strained = ops.strainedUnits(units, T.calories);
  return (
    <>
      <Card pad={false} className="card-rows">
        {units.map((u) => (
          <div key={u.key} className="srow">
            <span className="dot" style={{ '--c': groupColor(u.groupIndex) }} />
            <div className="srow-main"><div className="srow-title">{u.name}</div><div className="srow-val">{Math.round(T.calories / u.meals)} kcal per meal</div></div>
            <Stepper value={u.meals} onChange={(v) => setCount(u, v)} min={ops.MIN_MEALS} max={ops.MAX_MEALS} ariaLabel={`Meals per day for ${u.name}`} />
          </div>
        ))}
      </Card>
      {strained.length > 0 && <div className="warnbox">{strained.map((u) => `${u.name} (${Math.round(T.calories / u.meals)} kcal/meal)`).join(', ')} — that's a lot to ask of one sitting, so those days may land off-target.</div>}
      <div className="infobox">A protein shake is added only when a day can't reach its targets from meals alone, and you can remove it from any day.</div>
    </>
  );
}

function Units() {
  const [settings, patch] = useSettings();
  return (
    <Card className="stack">
      <div className="eyebrow">Weights</div>
      <Seg value={settings.units} onChange={(v) => patch({ units: v })} options={[{ value: 'imperial', label: 'lb · oz' }, { value: 'metric', label: 'kg · g' }]} />
      <div className="small muted">Grocery quantities and cook-day amounts. Recipe tables always show grams — that's what the solver scales.</div>
    </Card>
  );
}

function Notifications() {
  const [settings, patch] = useSettings();
  const n = settings.notifications;
  const set = (k, v) => patch({ notifications: { ...n, [k]: v } });
  const sub = [
    ['mealReminders', 'Meal reminders', '10 min before each planned meal'],
    ['proteinNudge', 'Protein nudge', '6:00 pm if you are 40 g or more short'],
    ['workoutReminder', 'Workout reminder', 'On planned training days'],
    ['weeklyReview', 'Weekly review', 'Sunday evening'],
  ];
  return (
    <>
      <Card pad={false} className="card-rows">
        <SRow title="Notifications" value="Off silences everything below" right={<Toggle on={n.enabled} onChange={(v) => set('enabled', v)} label="Notifications" />} />
        {sub.map(([k, title, val]) => <SRow key={k} indent title={title} value={val} right={<Toggle on={n.enabled && n[k]} disabled={!n.enabled} onChange={(v) => set(k, v)} label={title} />} />)}
      </Card>
      <div className="infobox">Your choices are saved now. The reminders themselves arrive with the phone app (milestone 3) — a website can't reliably wake an iPhone.</div>
    </>
  );
}

function Backup() {
  const toast = useToast();
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const size = useMemo(() => Math.round(new Blob([JSON.stringify(allDocs())]).size / 1024), [pending]);

  const exportAll = async () => {
    const r = await saveJson(backupFileName(), buildBackup());
    if (r !== 'cancelled') toast(r === 'shared' ? 'Backup handed to the share sheet.' : 'Backup downloaded.', { kind: 'ok' });
  };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { setPending(parseBackup(String(reader.result))); } catch (err) { toast(err.message, { kind: 'warn' }); } };
    reader.readAsText(file);
  };
  const apply = async (mode) => {
    if (!pending) return;
    const current = allDocs();
    if (mode === 'replace') {
      const next = { ...pending.docs, meta: current.meta };
      await replaceAll(next);
    } else {
      for (const [k, v] of Object.entries(pending.docs)) setDoc(k, v);
    }
    toast(`Imported ${Object.keys(pending.docs).length} section${Object.keys(pending.docs).length === 1 ? '' : 's'} from ${pending.source === 'dialed' ? 'a Dialed backup' : 'the old app'}.`, { kind: 'ok' });
    setPending(null);
  };
  const wipe = async () => { await clearAll(); window.location.reload(); };

  return (
    <>
      <Card pad={false} className="card-rows">
        <SRow title="Export backup" value="Plans, logs, favorites, settings — one JSON file" onClick={exportAll} />
        <SRow title="Import backup" value="A Dialed backup, or the old app's export" onClick={() => fileRef.current && fileRef.current.click()} />
      </Card>
      <input ref={fileRef} type="file" accept=".json,application/json" onChange={onFile} style={{ display: 'none' }} />
      <div className="infobox">
        <div className="strong" style={{ marginBottom: 4 }}>Moving from the old Actual Size Optimizer</div>
        Open it, go to Stats › Data Management › Export JSON, then import that file here. If the old app runs on this same address its data was already picked up on first launch.
      </div>
      <Card pad={false} className="card-rows">
        <SRow title="Storage" value={`${storageMode() === 'idb' ? 'IndexedDB' : 'localStorage'} on this device · about ${size} KB`} />
        <SRow title="Erase everything" value="Start over as a brand-new install on this device" danger onClick={() => setConfirmClear(true)} />
      </Card>
      <Sheet open={!!pending} onClose={() => setPending(null)} title="Import this file?" subtitle={pending ? `${pending.source === 'dialed' ? 'Dialed backup' : 'Old app export'} · ${Object.keys(pending.docs).join(', ')}` : ''}
        footer={<><Button block onClick={() => apply('merge')}>Add to mine</Button><Button block variant="primary" onClick={() => apply('replace')}>Replace mine</Button></>}>
        <div className="small muted" style={{ lineHeight: 1.45 }}><span className="strong">Replace</span> overwrites the sections in the file and keeps the rest. <span className="strong">Add</span> also overwrites those sections — use it when the file only holds part of your data (for example just the old app's stats).</div>
      </Sheet>
      <Confirm open={confirmClear} onClose={() => setConfirmClear(false)} title="Erase everything on this device?" confirmLabel="Erase" danger onConfirm={wipe}
        body="This deletes every plan, log, favorite and setting stored by Dialed on this device and reloads as a first launch. The old app's data is not picked up again — export a backup first if you want any of it back." />
    </>
  );
}

function About() {
  const base = import.meta.env.BASE_URL;
  return (
    <>
      <Card pad={false} className="card-rows">
        <SRow title="Dialed" value={`Version ${pkg.version} · milestone 1 (shell, Fuel, Today)`} />
        <SRow title="Recipes and macros" value={`${RECIPES.length} recipes · ${Object.keys(INGREDIENT_REGISTRY).length} ingredients, USDA raw per 100 g unless a retail label is noted`} />
        <SRow title="Old app" value="Actual Size Optimizer, kept until Dialed reaches parity" onClick={() => window.open(`${base}legacy/`, '_blank', 'noopener')} />
      </Card>
      <div className="infobox">Everything stays on this device — there are no accounts and nothing is sent anywhere. Install it from the browser's share menu (Add to Home Screen) to use it like an app, offline included.</div>
    </>
  );
}

const SECTIONS = { appearance: Appearance, targets: Targets, days: Days, meals: Meals, units: Units, notifications: Notifications, backup: Backup, about: About };

export default function SettingsSection() {
  const { section } = useParams();
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const Body = SECTIONS[section];
  if (!Body) { navigate('/more', { replace: true }); return null; }
  return (
    <div className="page" style={desktop ? { maxWidth: 720 } : undefined}>
      <div className="page-back">
        <button type="button" className="icon-btn" onClick={() => navigate('/more')} aria-label="Back to settings"><Icon name="chevronLeft" size={20} /></button>
        <div className="page-head-l"><div className="eyebrow">Settings</div><div className="num page-title" style={{ fontSize: 30 }}>{TITLES[section]}</div></div>
      </div>
      <Body />
    </div>
  );
}
