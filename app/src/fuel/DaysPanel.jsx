import { useState } from 'react';
import { DAYS_NAMES } from '../core/index.js';
import * as ops from '../core/planOps.js';
import { Card, Chip, Stepper, Icon, cx } from '../ui/index.jsx';
import { useDayGroups, useUnits, useTargets } from './hooks.js';
import { groupColor } from './common.js';

// The plan's shape, on the plan screen: which days share meals, meals a day, cook days, free days.
// Collapsed, it says so in one line. Open, tap a weekday and pick what it does — no sheet.
// Shape changes apply to what gets generated next; days already planned keep their meals.
export default function DaysPanel() {
  const [dg, patch] = useDayGroups();
  const units = useUnits();
  const T = useTargets();
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState(null);
  const byNum = (a, b) => a - b;
  const cookOf = (u) => (dg.cookDays[u.lead] != null && dg.cookDays[u.lead] !== '' ? Number(dg.cookDays[u.lead]) : null);

  // One line: "Mon–Wed share meals · cook Sun  ·  Thu–Sat share meals · cook Wed  ·  Sun free  ·  2 meals a day".
  const mealsSet = [...new Set(units.map((u) => u.meals))];
  const mealsOf = (u) => (mealsSet.length > 1 ? ` · ${u.meals} meal${u.meals === 1 ? '' : 's'}` : '');
  const groupsOnly = units.filter((u) => u.days.length > 1);
  const singles = units.filter((u) => u.days.length === 1);
  const parts = groupsOnly.map((u) => `${u.name} share meals${mealsOf(u)}${cookOf(u) != null ? ` · cook ${ops.SHORT_DAYS[cookOf(u)]}` : ''}`);
  if (singles.length === units.length && !dg.excluded.length && mealsSet.length === 1) parts.push('Every day its own plan');
  else if (singles.length) parts.push(`${singles.map((u) => u.name + mealsOf(u)).join(', ')} own plan${singles.length > 1 ? 's' : ''}`);
  if (dg.excluded.length) parts.push(`${dg.excluded.map((d) => ops.SHORT_DAYS[d]).join(', ')} free`);
  if (units.length && mealsSet.length === 1) parts.push(`${mealsSet[0]} meal${mealsSet[0] === 1 ? '' : 's'} a day`);
  const summary = units.length ? parts.join('  ·  ') : 'Every day is free — nothing gets planned';

  const withoutDay = (groups, d) => groups.map((g) => g.filter((x) => x !== d)).filter((g) => g.length > 1);
  const setOwn = (d) => patch({ groups: withoutDay(dg.groups, d), excluded: dg.excluded.filter((x) => x !== d) });
  const setFree = (d) => patch({ groups: withoutDay(dg.groups, d), excluded: [...dg.excluded.filter((x) => x !== d), d].sort(byNum) });
  const join = (d, unit) => {
    let groups = withoutDay(dg.groups, d);
    const gi = groups.findIndex((g) => g.includes(unit.lead));
    groups = gi !== -1 ? groups.map((g, i) => (i === gi ? [...g, d].sort(byNum) : g)) : [...groups, [unit.lead, d].sort(byNum)];
    patch({ groups, excluded: dg.excluded.filter((x) => x !== d), mealCounts: ops.normalizedCounts(groups, dg.mealCounts) });
  };
  const setMeals = (unit, val) => {
    const v = Math.max(ops.MIN_MEALS, Math.min(ops.MAX_MEALS, val));
    const next = { ...dg.mealCounts };
    unit.days.forEach((x) => { next[x] = v; });
    patch({ mealCounts: next });
  };
  const setCook = (unit, v) => {
    const cookDays = { ...dg.cookDays };
    if (v === '') delete cookDays[unit.lead]; else cookDays[unit.lead] = Number(v);
    patch({ cookDays });
  };

  if (!open) {
    return (
      <div className="days-line">
        <span className="small muted" style={{ minWidth: 0 }}>{summary}</span>
        <button type="button" className="link nowrap" onClick={() => { setOpen(true); setPick(null); }}><Icon name="edit" size={14} stroke={2.25} />Edit days</button>
      </div>
    );
  }

  const pickFree = pick != null && dg.excluded.includes(pick);
  const pickUnit = pick != null && !pickFree ? ops.unitForDay(units, pick) : null;
  const strained = pickUnit ? ops.strainedUnits([pickUnit], T.calories).length > 0 : false;

  return (
    <Card className="stack">
      <div className="row between">
        <div className="eyebrow">Days</div>
        <button type="button" className="link" onClick={() => setOpen(false)}>Done</button>
      </div>
      <div className="week">
        {[0, 1, 2, 3, 4, 5, 6].map((d) => {
          const free = dg.excluded.includes(d);
          const u = free ? null : ops.unitForDay(units, d);
          return (
            <button key={d} type="button" className={cx('day', pick === d && 'on')} onClick={() => setPick(pick === d ? null : d)} aria-pressed={pick === d} style={pick === d ? { borderColor: 'var(--accent)' } : undefined}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{ops.SHORT_DAYS[d]}</div>
              <div className="num" style={{ fontSize: 16, color: free ? 'var(--dim)' : undefined }}>{free ? '–' : u ? u.meals : '·'}</div>
              {free ? <div className="eyebrow" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>free</div> : <div className="day-mark" style={{ '--c': groupColor(u ? u.groupIndex : -1) }} />}
            </button>
          );
        })}
      </div>
      {pick == null ? (
        <div className="small muted">Tap a day to change who it shares meals with, how many meals it gets, or make it a free day. The number on each day is its meals a day.</div>
      ) : (
        <div className="stack-sm" style={{ gap: 10 }}>
          <div className="small"><span className="strong">{DAYS_NAMES[pick]}</span> <span className="muted">shares meals with</span></div>
          <div className="row-sm wrap">
            <Chip on={!pickFree && !!pickUnit && pickUnit.days.length === 1} onClick={() => setOwn(pick)}>Nobody · own plan</Chip>
            {units.filter((u) => u.days.length > 1 && u.days.includes(pick)).map((u) => <Chip key={u.key} on hi onClick={() => {}}>{u.name}</Chip>)}
            {units.filter((u) => !u.days.includes(pick)).map((u) => <Chip key={u.key} on={false} onClick={() => join(pick, u)}>{u.name}</Chip>)}
            <Chip on={pickFree} onClick={() => setFree(pick)}>Free day</Chip>
          </div>
          {pickUnit && (
            <div className="row wrap" style={{ gap: 16 }}>
              <label className="row-sm small muted">
                <span>Meals a day{pickUnit.days.length > 1 ? ` for ${pickUnit.name}` : ''}</span>
                <Stepper value={pickUnit.meals} onChange={(v) => setMeals(pickUnit, v)} min={ops.MIN_MEALS} max={ops.MAX_MEALS} ariaLabel="Meals a day" />
              </label>
              <label className="row-sm small muted">
                <span>Cook on</span>
                <select className="input" style={{ width: 130, height: 36 }} value={cookOf(pickUnit) ?? ''} onChange={(e) => setCook(pickUnit, e.target.value)} aria-label={`Cook day for ${pickUnit.name}`}>
                  <option value="">—</option>
                  {DAYS_NAMES.map((nm, i) => <option key={i} value={i}>{nm}</option>)}
                </select>
              </label>
            </div>
          )}
          {strained && <div className="small" style={{ color: 'var(--warn)' }}>About {Math.round(T.calories / pickUnit.meals)} kcal per meal — a lot for one sitting; those days may land off-target.</div>}
        </div>
      )}
      <div className="small muted">Grouped days share one plan — same meals, same amounts — so you cook once. Changes shape what you generate next; days already planned keep their meals.</div>
    </Card>
  );
}
