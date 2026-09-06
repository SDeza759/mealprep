import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAYS_NAMES } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Bar, Ring, Icon, Tag, cx } from '../ui/index.jsx';
import { useWeekPlan, usePlansDoc, useTargets, useDayGroups, useUnits, usePlanActions } from '../fuel/hooks.js';
import { useSelectedDate } from '../fuel/selection.js';
import { weekStartOf, weekdayIndex, todayIso } from '../fuel/dates.js';
import { fmtLongDate, weekDates, macroLine, groupColor, useIsDesktop } from '../fuel/common.js';
import DayPager from '../fuel/DayPager.jsx';
import MealDetailSheet from '../fuel/MealDetailSheet.jsx';

const BARS = [
  { key: 'carbs', tKey: 'carbGrams', label: 'Carbs', color: 'var(--carbs)' },
  { key: 'protein', tKey: 'proteinGrams', label: 'Protein', color: 'var(--protein)' },
  { key: 'fat', tKey: 'fatGrams', label: 'Fat', color: 'var(--fat)' },
];

// Home = the day's log: what's left to eat, every planned meal with an Eaten switch. Opens on
// today; any day — a year back or ahead — can be selected to catch up on marks or read a summary.
export default function Home() {
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const [date, setDate] = useSelectedDate();
  const weekStart = weekStartOf(date);
  const sel = weekdayIndex(date);
  const [planDoc] = useWeekPlan(weekStart);
  const [plans] = usePlansDoc();
  const T = useTargets();
  const [dg] = useDayGroups();
  const units = useUnits();
  const actions = usePlanActions(weekStart);
  const [detail, setDetail] = useState(null);
  const dates = useMemo(() => weekDates(weekStart), [weekStart]);
  const isToday = date === todayIso();

  const day = (planDoc && planDoc.days[sel]) || ops.EMPTY_DAY;
  const hasMeals = day.meals.length > 0;
  const isFree = dg.excluded.includes(sel);
  const unit = ops.unitForDay(units, sel);
  const cook = unit ? dg.cookDays[unit.lead] : null;
  const cookText = cook != null && cook !== '' ? ` · cooked ${ops.SHORT_DAYS[cook]}` : '';
  const colorOf = (iso) => { const w = plans.weeks && plans.weeks[weekStartOf(iso)]; const e = w && w.groups && w.groups[weekdayIndex(iso)]; return groupColor(e ? e.groupIndex : -1); };

  // Eaten so far = ticked meals (+ the shake, ticked in the slot after the meals).
  const eaten = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  if (planDoc) {
    day.meals.forEach((m, mi) => { if (planDoc.eaten[`${sel}-${mi}`]) { eaten.calories += m.totalMacros.calories; eaten.carbs += m.totalMacros.carbs; eaten.protein += m.totalMacros.protein; eaten.fat += m.totalMacros.fat; } });
    if (day.proteinShake && planDoc.eaten[`${sel}-${day.meals.length}`]) { eaten.calories += day.proteinShake.calories; eaten.carbs += day.proteinShake.carbs; eaten.protein += day.proteinShake.protein; eaten.fat += day.proteinShake.fat; }
  }
  const left = Math.max(0, T.calories - eaten.calories);
  const shakeKey = `${sel}-${day.meals.length}`;

  return (
    <div className={cx('page', desktop && 'page-wide')} style={desktop ? { maxWidth: 760 } : undefined}>
      <div className="page-head">
        <div className="page-head-l"><div className="eyebrow">{fmtLongDate(dates[sel])}{isToday ? ' · today' : ''}</div><div className="num page-title">Home</div></div>
      </div>
      <DayPager date={date} onSelect={setDate} excluded={dg.excluded} colorOf={colorOf} />

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
        <div className="eyebrow">Meals</div>
        {isFree && <Card><div className="small muted">Free day · nothing planned.</div></Card>}
        {!isFree && !hasMeals && (
          <Card className="stack">
            <div className="strong">Nothing planned for {DAYS_NAMES[sel]}</div>
            <Button variant="primary" icon="fuel" onClick={() => navigate('/fuel')}>Meal Plan</Button>
          </Card>
        )}
        {!isFree && day.meals.map((meal, mi) => {
          const key = `${sel}-${mi}`;
          const isEaten = !!planDoc.eaten[key];
          const isFresh = planDoc.tags[key] === 'fresh';
          return (
            <Card key={key} className="stack" style={{ gap: 12 }}>
              <button type="button" className="row top" style={{ width: '100%', gap: 12 }} onClick={() => setDetail({ di: sel, mi })}>
                <div className="grow stack-sm" style={{ gap: 3, textAlign: 'left' }}>
                  <div className="meal-name row-sm wrap" style={{ gap: 6, color: isEaten ? 'var(--muted)' : undefined }}>{meal.name}{meal.variantLabel && <Tag>{meal.variantLabel}</Tag>}</div>
                  <div className="small muted">{macroLine(meal.totalMacros)} · {isFresh ? 'fresh · cook that day' : `batch${cookText}`}</div>
                </div>
                <Icon name="chevronRight" size={18} style={{ color: 'var(--dim)', flex: '0 0 auto' }} />
              </button>
              <Button variant={isEaten ? 'soft' : 'primary'} icon="check" block onClick={() => actions.toggleEaten(sel, mi)}>{isEaten ? 'Eaten' : 'Mark eaten'}</Button>
            </Card>
          );
        })}
        {!isFree && day.proteinShake && (
          <Card className="row">
            <Icon name="shake" size={22} style={{ color: 'var(--muted)' }} />
            <div className="grow stack-sm" style={{ gap: 3 }}>
              <div className="strong" style={{ color: planDoc.eaten[shakeKey] ? 'var(--muted)' : undefined }}>Protein shake</div>
              <div className="small muted">{day.proteinShake.calories} kcal · {day.proteinShake.carbs} C · {day.proteinShake.protein} P · {day.proteinShake.fat} F</div>
            </div>
            <Button size="sm" variant={planDoc.eaten[shakeKey] ? 'soft' : 'primary'} icon="check" onClick={() => actions.toggleEaten(sel, day.meals.length)}>{planDoc.eaten[shakeKey] ? 'Eaten' : 'Mark eaten'}</Button>
          </Card>
        )}
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

      {detail && planDoc && <MealDetailSheet planDoc={planDoc} di={detail.di} mi={detail.mi} onClose={() => setDetail(null)} actions={actions} readOnly />}
    </div>
  );
}
