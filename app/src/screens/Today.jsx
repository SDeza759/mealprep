import { useNavigate } from 'react-router-dom';
import { DAYS_NAMES } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Bar, Ring, Icon, cx } from '../ui/index.jsx';
import { usePlanDoc, useTargets, useDayGroups, useUnits, usePlanActions, useSettings, todayIndex } from '../fuel/hooks.js';
import { fmtLongDate, fmtTime, macroLine, useNow, useIsDesktop } from '../fuel/common.js';
import { useState } from 'react';
import MealDetailSheet from '../fuel/MealDetailSheet.jsx';
import SwapSheet from '../fuel/SwapSheet.jsx';

const BARS = [
  { key: 'carbs', tKey: 'carbGrams', label: 'Carbs', color: 'var(--carbs)' },
  { key: 'protein', tKey: 'proteinGrams', label: 'Protein', color: 'var(--protein)' },
  { key: 'fat', tKey: 'fatGrams', label: 'Fat', color: 'var(--fat)' },
];

export default function Today() {
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const now = useNow();
  const [planDoc] = usePlanDoc();
  const T = useTargets();
  const [dg] = useDayGroups();
  const units = useUnits();
  const actions = usePlanActions();
  const [settings] = useSettings();
  const [detail, setDetail] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);

  const di = todayIndex();
  const day = planDoc ? (planDoc.days[di] || ops.EMPTY_DAY) : null;
  const isFree = dg.excluded.includes(di);
  const unit = ops.unitForDay(units, di);
  const cook = unit ? dg.cookDays[unit.lead] : null;
  const times = day ? ops.mealTimesFor(day.meals.length, settings.mealTimes) : [];

  // Eaten so far today = ticked meals (+ the shake, ticked in the slot after the meals).
  const eaten = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  if (day) {
    day.meals.forEach((m, mi) => { if (planDoc.eaten[`${di}-${mi}`]) { eaten.calories += m.totalMacros.calories; eaten.carbs += m.totalMacros.carbs; eaten.protein += m.totalMacros.protein; eaten.fat += m.totalMacros.fat; } });
    if (day.proteinShake && planDoc.eaten[`${di}-${day.meals.length}`]) { eaten.calories += day.proteinShake.calories; eaten.carbs += day.proteinShake.carbs; eaten.protein += day.proteinShake.protein; eaten.fat += day.proteinShake.fat; }
  }
  const left = Math.max(0, T.calories - eaten.calories);
  const nextIdx = day ? day.meals.findIndex((_, mi) => !planDoc.eaten[`${di}-${mi}`]) : -1;

  const pick = (recipe) => { if (!swapTarget) return; actions.swap(swapTarget.di, swapTarget.mi, recipe, false); setSwapTarget(null); };

  return (
    <div className={cx('page', desktop && 'page-wide')} style={desktop ? { maxWidth: 760 } : undefined}>
      <div className="page-head">
        <div className="page-head-l"><div className="eyebrow">{fmtLongDate(now)}</div><div className="num page-title">Today</div></div>
        <button type="button" className="icon-btn muted" aria-label="Settings" onClick={() => navigate('/more')}><Icon name="gear" size={22} /></button>
      </div>

      <Card className="stack">
        <div className="row" style={{ gap: 16 }}>
          <Ring value={left} max={T.calories} size={120}>
            <div className="num" style={{ fontSize: 34 }}>{fmtInt(left)}</div>
            <div className="eyebrow" style={{ fontSize: 10 }}>kcal left</div>
          </Ring>
          <div className="grow stack" style={{ gap: 11 }}>
            {BARS.map((b) => (
              <div key={b.key} className="stack-sm">
                <div className="row between small"><span className="strong">{b.label}</span><span className="muted"><span className="strong">{Math.round(eaten[b.key])}</span> / {Math.round(T[b.tKey])} g</span></div>
                <Bar value={eaten[b.key]} target={T[b.tKey]} color={b.color} />
              </div>
            ))}
          </div>
        </div>
        <div className="row-sm small muted" style={{ paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <span className="dot" />
          <span><span className="strong">Base targets</span> · {fmtInt(T.calories)} kcal · {Math.round(T.carbGrams)} g carbs · {Math.round(T.proteinGrams)} g protein</span>
        </div>
      </Card>

      <div className="stack">
        <div className="section-head"><div className="eyebrow">Meals</div><button type="button" className="link" onClick={() => navigate('/fuel')}>Open Fuel</button></div>
        {!planDoc && (
          <Card className="stack">
            <div className="strong">No plan for this week yet</div>
            <div className="small muted">Generate one and Today fills in with your meals, times and what's left to eat.</div>
            <Button variant="primary" icon="refresh" onClick={() => { if (actions.generate()) navigate('/fuel'); }}>Generate this week</Button>
          </Card>
        )}
        {planDoc && isFree && <Card><div className="small muted">Free day · nothing planned. Logging off-plan meals arrives in the next milestone.</div></Card>}
        {planDoc && !isFree && day.meals.length === 0 && <Card><div className="small muted">No meals planned for {DAYS_NAMES[di]}. Add one or regenerate under Fuel.</div></Card>}
        {planDoc && !isFree && day.meals.map((meal, mi) => {
          const key = `${di}-${mi}`;
          const isEaten = !!planDoc.eaten[key];
          const isNext = mi === nextIdx;
          const isFresh = planDoc.tags[key] === 'fresh';
          if (!isNext) {
            return (
              <button key={key} type="button" className="row" style={{ padding: '0 4px', width: '100%' }} onClick={() => setDetail({ di, mi })}>
                <div className="num meal-time" style={{ fontSize: 18, color: 'var(--dim)' }}>{times[mi] || ''}</div>
                <div className="grow" style={{ fontSize: 15, fontWeight: 500, color: isEaten ? 'var(--muted)' : 'var(--fg)', textAlign: 'left' }}>{meal.name} <span className="muted" style={{ fontWeight: 400 }}>· {fmtInt(meal.totalMacros.calories)} kcal</span></div>
                {isEaten ? <Icon name="check" size={18} stroke={2.25} style={{ color: 'var(--accent-text)' }} /> : <Icon name="chevronRight" size={18} style={{ color: 'var(--dim)' }} />}
              </button>
            );
          }
          return (
            <Card key={key} className="stack" style={{ gap: 12 }}>
              <button type="button" className="row" style={{ gap: 14, width: '100%' }} onClick={() => setDetail({ di, mi })}>
                <div className="num meal-time">{times[mi] || ''}</div>
                <div className="grow stack-sm" style={{ gap: 3, textAlign: 'left' }}>
                  <div className="meal-name">{meal.name}</div>
                  <div className="small muted">{macroLine(meal.totalMacros)} · {isFresh ? 'fresh · cook today' : `batch${cook != null && cook !== '' ? ` · cooked ${ops.SHORT_DAYS[cook]}` : ''}`}</div>
                </div>
              </button>
              <div className="row-sm">
                <Button variant="primary" icon="check" block onClick={() => actions.toggleEaten(di, mi)}>Eaten</Button>
                <Button variant="ghost" icon="swap" aria-label="Swap" onClick={() => setSwapTarget({ di, mi })} />
              </div>
            </Card>
          );
        })}
        {planDoc && !isFree && day.proteinShake && (() => {
          const key = `${di}-${day.meals.length}`;
          const isEaten = !!planDoc.eaten[key];
          return (
            <button key={key} type="button" className="row" style={{ padding: '0 4px', width: '100%' }} onClick={() => actions.toggleEaten(di, day.meals.length)}>
              <div className="meal-time" style={{ display: 'flex', justifyContent: 'center' }}><Icon name="shake" size={20} style={{ color: 'var(--dim)' }} /></div>
              <div className="grow" style={{ fontSize: 15, fontWeight: 500, color: isEaten ? 'var(--muted)' : 'var(--fg)', textAlign: 'left' }}>Protein shake <span className="muted" style={{ fontWeight: 400 }}>· {day.proteinShake.calories} kcal</span></div>
              <span className={cx('checkbox', isEaten && 'on')}><Icon name="check" size={14} stroke={3} /></span>
            </button>
          );
        })()}
      </div>

      <Card className="row">
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="train" size={22} /></div>
        <div className="grow stack-sm" style={{ gap: 3 }}><div className="strong" style={{ fontSize: 17 }}>Train</div><div className="small muted">Programme and logging come after your brief.</div></div>
      </Card>
      <div className="grid-3">
        {[['Sleep', 'sleep'], ['Steps', 'steps'], ['Trend lb', 'body']].map(([label, icon]) => (
          <Card key={label} className="kpi" style={{ padding: '12px 14px' }}><div className="eyebrow" style={{ fontSize: 10 }}>{label}</div><div className="row-sm"><div className="num" style={{ color: 'var(--dim)' }}>—</div><Icon name={icon} size={16} style={{ color: 'var(--dim)' }} /></div></Card>
        ))}
      </div>
      <div className="small dim">Sleep, steps and weight arrive with Body and Apple Health.</div>

      {detail && <MealDetailSheet planDoc={planDoc} di={detail.di} mi={detail.mi} onClose={() => setDetail(null)} actions={actions} onSwap={(d, m) => { setDetail(null); setSwapTarget({ di: d, mi: m }); }} />}
      {swapTarget && <SwapSheet target={swapTarget} onClose={() => setSwapTarget(null)} onPick={pick} />}
    </div>
  );
}
