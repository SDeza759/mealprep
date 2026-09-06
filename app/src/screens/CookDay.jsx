import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DAYS_NAMES, RECIPE_COOKING_DATA } from '../core/index.js';
import { fmtInt, groceryQty, spiceDisplay } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Icon, Empty, cx } from '../ui/index.jsx';
import { useWeekPlan, useDayGroups, useUnits, useSettings } from '../fuel/hooks.js';
import { macroLine, useIsDesktop } from '../fuel/common.js';

// "8 min", "5-7 minutes", "about an hour" → minutes (the longest figure mentioned), or null.
export function stepMinutes(text) {
  let best = null;
  const re = /(\d+)(?:\s*(?:-|–|to)\s*(\d+))?\s*(min|minute|hour|hr)/gi;
  let m;
  while ((m = re.exec(text))) {
    const n = Math.max(Number(m[1]), Number(m[2] || 0));
    const mins = /h/i.test(m[3]) ? n * 60 : n;
    if (best === null || mins > best) best = mins;
  }
  if (best === null && /\ban hour\b/i.test(text)) best = 60;
  return best;
}

function mmss(sec) { const s = Math.max(0, Math.round(sec)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

// Cook Day merges a unit's batch meals into one prep flow: merged shopping-to-counter list,
// every recipe's steps in order, then portioning. Fresh meals stay out.
export default function CookDay() {
  const { week: weekStart, unit: unitKey } = useParams();
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const units = useUnits();
  const [planDoc, setPlanDoc] = useWeekPlan(weekStart);
  const [dg] = useDayGroups();
  const [settings] = useSettings();
  const [timer, setTimer] = useState(null); // { endAt, total }
  const [tick, setTick] = useState(0);
  useEffect(() => { if (!timer) return undefined; const t = setInterval(() => setTick((x) => x + 1), 500); return () => clearInterval(t); }, [timer]);

  const unit = units.find((u) => u.key === unitKey);
  const lead = unit ? unit.lead : -1;
  const leadDay = planDoc && unit ? planDoc.days[lead] : null;

  const batch = useMemo(() => {
    if (!leadDay || !unit) return [];
    const out = [];
    leadDay.meals.forEach((meal, mi) => {
      if (planDoc.tags[`${lead}-${mi}`] === 'fresh') return;
      let portions = 0;
      unit.days.forEach((d) => { const dd = planDoc.days[d]; if (dd && dd.meals[mi]) portions += planDoc.servings[`${d}-${mi}`] || 1; });
      out.push({ meal, mi, portions, cook: RECIPE_COOKING_DATA[meal.originalName] });
    });
    return out;
  }, [leadDay, unit, planDoc, lead]);

  const merged = useMemo(() => {
    const map = {};
    batch.forEach(({ meal, portions }) => meal.ingredients.forEach((ing) => {
      if (!map[ing.name]) map[ing.name] = { name: ing.name, totalGrams: 0, isSpice: !!ing.isSpice, uses: [] };
      map[ing.name].totalGrams += ing.grams * portions;
      map[ing.name].uses.push(meal.name);
    }));
    const items = Object.values(map);
    return { main: items.filter((i) => !i.isSpice).sort((a, b) => b.totalGrams - a.totalGrams), spices: items.filter((i) => i.isSpice).sort((a, b) => a.name.localeCompare(b.name)) };
  }, [batch]);

  const steps = useMemo(() => batch.flatMap(({ meal, mi, portions, cook }) => (cook && cook.steps ? cook.steps : ['No written steps for this recipe — cook it the way you know.']).map((text, i) => ({ recipe: meal.name, mi, portions, text, minutes: stepMinutes(text), n: i + 1, of: cook && cook.steps ? cook.steps.length : 1 }))), [batch]);

  const progress = (planDoc && planDoc.cook && planDoc.cook[unitKey]) || { step: 0, checked: {} };
  const setProgress = (fn) => setPlanDoc((prev) => {
    if (!prev) return prev;
    const cur = (prev.cook && prev.cook[unitKey]) || { step: 0, checked: {} };
    return { ...prev, cook: { ...(prev.cook || {}), [unitKey]: fn(cur) } };
  });

  const back = () => navigate('/fuel');
  if (!planDoc || !unit || batch.length === 0) {
    return (
      <div className="page">
        <div className="page-back"><button type="button" className="icon-btn" onClick={back} aria-label="Back"><Icon name="chevronLeft" size={20} /></button><div className="page-head-l"><div className="eyebrow">Cook day</div><div className="num page-title" style={{ fontSize: 30 }}>Nothing to cook</div></div></div>
        <Card><Empty>{!planDoc ? 'Generate a week first.' : 'Every meal in this unit is tagged fresh, or the unit no longer exists. Tag a meal as batch in the plan to prep it ahead.'}</Empty></Card>
      </div>
    );
  }

  const stepIdx = Math.min(progress.step, steps.length);
  const current = steps[stepIdx];
  const allDone = stepIdx >= steps.length;
  const minutesLeft = steps.slice(stepIdx).reduce((s, st) => s + (st.minutes || 0), 0);
  const cookOn = dg.cookDays[unit.lead];
  const remaining = timer ? Math.max(0, (timer.endAt - Date.now()) / 1000) : null;
  const timerDone = timer && remaining <= 0;
  useEffect(() => { if (timerDone && navigator.vibrate) navigator.vibrate([200, 100, 200]); }, [timerDone]);

  const toggleChecked = (name) => setProgress((p) => { const checked = { ...p.checked }; if (checked[name]) delete checked[name]; else checked[name] = true; return { ...p, checked }; });
  const done = () => { setTimer(null); setProgress((p) => ({ ...p, step: Math.min(p.step + 1, steps.length) })); };
  const backStep = () => { setTimer(null); setProgress((p) => ({ ...p, step: Math.max(0, p.step - 1) })); };
  const reset = () => { setTimer(null); setProgress(() => ({ step: 0, checked: {} })); };

  return (
    <div className={cx('page', desktop && 'page-wide')} style={desktop ? { maxWidth: 760 } : undefined}>
      <div className="page-back">
        <button type="button" className="icon-btn" onClick={back} aria-label="Back"><Icon name="chevronLeft" size={20} /></button>
        <div className="page-head-l grow">
          <div className="eyebrow">Cook day{cookOn != null && cookOn !== '' ? ` · ${DAYS_NAMES[cookOn]}` : ''}</div>
          <div className="num page-title" style={{ fontSize: 30 }}>{unit.name} batch</div>
        </div>
        {timer && <div className="num" style={{ fontSize: 22, color: timerDone ? 'var(--accent-text)' : 'var(--muted)' }}>{timerDone ? 'Done' : mmss(remaining)}</div>}
      </div>
      <div className="small muted">{unit.days.length} day{unit.days.length === 1 ? '' : 's'} · {batch.map((b) => `${b.meal.name} × ${b.portions}`).join(' · ')} · fresh meals are not in this list</div>

      <div className="stack-sm" style={{ gap: 8 }}>
        <div className="row between small"><span className="strong">{allDone ? 'All steps done' : `Step ${stepIdx + 1} of ${steps.length}`}</span><span className="muted">{allDone ? 'time to portion' : minutesLeft ? `about ${minutesLeft} min left` : ''}</span></div>
        <div className="cook-progress" style={{ gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, minmax(0, 1fr))` }}>{steps.map((_, i) => <i key={i} className={i < stepIdx ? 'done' : ''} />)}</div>
      </div>

      {!allDone ? (
        <Card hi className="stack" style={{ padding: 16 }}>
          <div className="row between">
            <div className="eyebrow accent">Now · {current.recipe} × {current.portions}</div>
            {current.minutes && <div className="row-sm small muted"><Icon name="timer" size={15} />{current.minutes} min</div>}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.45 }}>{current.text}</div>
          <div className="small muted">Recipe step {current.n} of {current.of}. Quantities below are merged across all {current.portions} portions.</div>
          <div className="row-sm">
            {current.minutes && !timer && <Button variant="primary" block icon="timer" onClick={() => setTimer({ endAt: Date.now() + current.minutes * 60000, total: current.minutes })}>Start {current.minutes}:00 timer</Button>}
            {timer && <Button variant="ghost" block onClick={() => setTimer(null)}>{timerDone ? 'Clear timer' : `Stop timer · ${mmss(remaining)}`}</Button>}
            <Button variant={current.minutes && !timerDone ? 'ghost' : 'primary'} block={!current.minutes} icon="check" onClick={done}>Done</Button>
          </div>
          {stepIdx > 0 && <button type="button" className="link" onClick={backStep}>Previous step</button>}
        </Card>
      ) : (
        <Card hi className="stack" style={{ padding: 16 }}>
          <div className="eyebrow accent">Portion it out</div>
          <div className="small muted">Let everything cool a little, then split evenly into containers. Fridge for up to 4 days.</div>
          <Button size="sm" onClick={reset}>Start over</Button>
        </Card>
      )}

      <Card className="stack-sm" style={{ gap: 6 }}>
        <div className="section-head"><div className="eyebrow">On the counter</div><div className="small muted">merged across {batch.reduce((s, b) => s + b.portions, 0)} portions</div></div>
        <div className="list">
          {merged.main.map((it) => {
            const on = !!progress.checked[it.name];
            return (
              <button key={it.name} type="button" className="item" style={{ padding: '8px 0' }} onClick={() => toggleChecked(it.name)}>
                <span className={cx('checkbox', on && 'on')}><Icon name="check" size={14} stroke={3} /></span>
                <div className="grow" style={{ color: on ? 'var(--muted)' : 'var(--fg)', fontWeight: on ? 400 : 600 }}>{it.name}</div>
                <div className="num" style={{ fontSize: 16, color: on ? 'var(--muted)' : 'var(--fg)' }}>{groceryQty(it, settings.units)}</div>
              </button>
            );
          })}
        </div>
        {merged.spices.length > 0 && <div className="small muted" style={{ paddingTop: 6 }}>Spices: {merged.spices.map((s) => `${s.name} (${spiceDisplay(s.totalGrams)})`).join(', ')}</div>}
      </Card>

      <Card className="stack">
        <div className="eyebrow">Then portion</div>
        {batch.map((b) => (
          <div key={b.mi} className="stack-sm">
            <div className="strong">{b.meal.name} · {b.portions} container{b.portions === 1 ? '' : 's'}</div>
            <div className="row-sm wrap">
              {unit.days.map((d) => <span key={d} className="chip"><span className="num" style={{ fontSize: 14 }}>{ops.SHORT_DAYS[d]}</span></span>)}
            </div>
            <div className="small muted">{fmtInt(b.meal.totalMacros.calories)} kcal per container · {macroLine(b.meal.totalMacros, { kcal: false })}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
