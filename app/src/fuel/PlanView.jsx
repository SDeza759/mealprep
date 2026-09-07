import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAYS_NAMES } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Bar, Stepper, Chip, Tag, Icon, Empty, cx } from '../ui/index.jsx';
import { useWeekPlan, usePlansDoc, useTargets, useDayGroups, useUnits, usePlanActions, useRangeActions, useSettings, emptyWeek } from './hooks.js';
import { useSelectedDate } from './selection.js';
import { weekStartOf, weekdayIndex, todayIso, isoDate, parseIso } from './dates.js';
import { groupColor, weekDates, fmtDayDate, fmtLongDate, fmtRange, weekLabel, macroLine, targetsLine, useIsDesktop } from './common.js';
import DayPager from './DayPager.jsx';
import MealDetailSheet from './MealDetailSheet.jsx';
import SwapSheet from './SwapSheet.jsx';
import SavedPlans from './SavedPlans.jsx';

const MACRO_TILES = [
  { key: 'calories', tKey: 'calories', label: 'kcal', color: 'var(--accent)', unit: '' },
  { key: 'carbs', tKey: 'carbGrams', label: 'Carbs', color: 'var(--carbs)', unit: ' g' },
  { key: 'protein', tKey: 'proteinGrams', label: 'Protein', color: 'var(--protein)', unit: ' g' },
  { key: 'fat', tKey: 'fatGrams', label: 'Fat', color: 'var(--fat)', unit: ' g' },
];

function ZoneLine({ totals, T }) {
  const zone = ops.zoneCheck(totals, T);
  return (
    <div className="okline">
      <Icon name={zone.ok ? 'checkCircle' : 'alert'} size={16} stroke={2.25} style={{ color: zone.ok ? 'var(--good)' : 'var(--warn)', flex: '0 0 auto' }} />
      <span>{ops.zoneText(zone)}</span>
    </div>
  );
}

function DayTiles({ totals, T }) {
  return (
    <div className="tiles">
      {MACRO_TILES.map((m) => (
        <div key={m.key} className="tile">
          <div className="eyebrow" style={{ fontSize: 10 }}>{m.label}</div>
          <div className="num" style={{ fontSize: 20 }}>{fmtInt(totals[m.key])}{m.unit}</div>
          <Bar value={totals[m.key]} target={T[m.tKey]} color={m.color} thin />
        </div>
      ))}
    </div>
  );
}

export default function PlanView({ onGenerate }) {
  const desktop = useIsDesktop();
  const navigate = useNavigate();
  const [date, setDate] = useSelectedDate();
  const weekStart = weekStartOf(date);
  const sel = weekdayIndex(date);
  const [stored] = useWeekPlan(weekStart);
  const [plans] = usePlansDoc();
  const T = useTargets();
  const [dg] = useDayGroups();
  const units = useUnits();
  const actions = usePlanActions(weekStart);
  const [settings, patchSettings] = useSettings();
  const { copyPattern, canCopy } = useRangeActions();
  const [detail, setDetail] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const n = settings.planDays || 7;
  const dates = useMemo(() => weekDates(weekStart), [weekStart]);
  const today = weekStart === weekStartOf(todayIso()) ? weekdayIndex(todayIso()) : -1;
  // A week with no document renders as an empty week; actions create the document on first edit.
  const planDoc = stored || emptyWeek(weekStart, T);

  // Which planning unit a day belongs to, its cook day and colour, from the plan-time snapshot.
  const meta = (di) => {
    const unit = ops.unitForDay(units, di);
    const entry = planDoc && planDoc.groups && planDoc.groups[di];
    const gi = entry ? entry.groupIndex : -1;
    const cook = unit ? dg.cookDays[unit.lead] : undefined;
    const cookLabel = cook != null && cook !== '' ? `cook ${ops.SHORT_DAYS[cook]}` : null;
    return { unit, gi, color: groupColor(gi), cookLabel, isGroup: !!unit && unit.days.length > 1 };
  };
  const colorOf = (iso) => {
    if (weekStartOf(iso) !== weekStart) { const w = plans.weeks && plans.weeks[weekStartOf(iso)]; const e = w && w.groups && w.groups[weekdayIndex(iso)]; return groupColor(e ? e.groupIndex : -1); }
    return meta(weekdayIndex(iso)).color;
  };

  useEffect(() => { if (detail && !(planDoc && planDoc.days[detail.di] && planDoc.days[detail.di].meals[detail.mi])) setDetail(null); }, [planDoc, detail]);

  const openSwap = (di, mi, isAdd = false) => { setDetail(null); setSwapTarget({ di, mi, isAdd }); };
  const pick = (recipe) => { if (!swapTarget) return; actions.swap(swapTarget.di, swapTarget.mi, recipe, swapTarget.isAdd); setSwapTarget(null); };

  const pager = <DayPager date={date} onSelect={setDate} excluded={dg.excluded} colorOf={colorOf} />;
  const sheets = (
    <>
      {detail && <MealDetailSheet planDoc={planDoc} di={detail.di} mi={detail.mi} onClose={() => setDetail(null)} actions={actions} onSwap={(di, mi) => openSwap(di, mi)} />}
      {swapTarget && <SwapSheet target={swapTarget} onClose={() => setSwapTarget(null)} onPick={pick} />}
      <SavedPlans open={savedOpen} onClose={() => setSavedOpen(false)} weekStart={weekStart} />
    </>
  );

  const days = planDoc.days;

  const MealCard = ({ di, mi, meal }) => {
    const key = `${di}-${mi}`;
    const isFresh = planDoc.tags[key] === 'fresh';
    const isEaten = !!planDoc.eaten[key];
    const { cookLabel } = meta(di);
    return (
      <Card className="meal-card" role="button" tabIndex={0} onClick={() => setDetail({ di, mi })} onKeyDown={(e) => { if (e.key === 'Enter') setDetail({ di, mi }); }} style={{ cursor: 'pointer' }}>
        <div className="row top">
          <div className="grow stack-sm" style={{ gap: 4 }}>
            <div className="meal-name row-sm wrap" style={{ gap: 6 }}>{meal.name}{meal.variantLabel && <Tag>{meal.variantLabel}</Tag>}</div>
            <div className="small muted">{macroLine(meal.totalMacros)}</div>
          </div>
          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <Stepper value={planDoc.servings[key] || 1} onChange={(v) => actions.setServing(di, mi, v)} min={1} max={12} ariaLabel="Servings" />
          </div>
        </div>
        <div className="row-sm" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Chip on={!isFresh} icon={isFresh ? undefined : 'pot'} onClick={() => actions.toggleTag(di, mi)}>{isFresh ? 'Fresh · cook that day' : `Batch${cookLabel ? ` · ${cookLabel}` : ''}`}</Chip>
          <Chip on={isEaten} hi={isEaten} icon="check" onClick={() => actions.toggleEaten(di, mi)}>{isEaten ? 'Eaten' : 'Eat'}</Chip>
          <div className="grow" />
          <button type="button" className="link" onClick={() => openSwap(di, mi)}>Swap</button>
        </div>
      </Card>
    );
  };

  const DayBody = ({ di }) => {
    const day = days[di] || ops.EMPTY_DAY;
    const isFree = dg.excluded.includes(di);
    const { unit, cookLabel, color, isGroup } = meta(di);
    if (isFree) {
      return <Card><Empty title={`${DAYS_NAMES[di]} is a free day`}>Nothing planned. Change that under Settings › Day groups.</Empty></Card>;
    }
    if (day.meals.length === 0) {
      const iso = isoDate(dates[di]);
      return (
        <Card className="stack-lg" style={{ padding: 20 }}>
          <Empty title={`Nothing planned for ${fmtLongDate(dates[di])}`}>
            Generate starts here and covers {fmtRange(iso, n)}.{isGroup ? ` ${unit.name} share one plan.` : ''}
          </Empty>
          <div className="row between">
            <span className="small strong">Days to plan</span>
            <Stepper value={n} onChange={(v) => patchSettings({ planDays: v })} min={1} max={28} ariaLabel="Days to plan" />
          </div>
          <div className="stack-sm">
            <Button variant="primary" block icon="refresh" onClick={() => onGenerate(iso)}>Generate {n} day{n === 1 ? '' : 's'}</Button>
            {canCopy(iso, n) && <Button block icon="copy" onClick={() => copyPattern(iso, n)}>Repeat last plan</Button>}
            <div className="row-sm" style={{ justifyContent: 'center', gap: 16 }}>
              <button type="button" className="link" onClick={() => openSwap(di, 0, true)}>Add a meal</button>
              {unit && <button type="button" className="link" onClick={() => actions.regenerate([di])}>Just {isGroup ? unit.name : 'this day'}</button>}
            </div>
          </div>
        </Card>
      );
    }
    return (
      <>
        <Card className="stack">
          <div className="stack-sm" style={{ gap: 3 }}>
            <div className="row-sm wrap" style={{ gap: 6 }}>
              <span className="dot" style={{ '--c': color }} />
              <span className="strong">{DAYS_NAMES[di]}</span>
              <span className="muted small">· {fmtDayDate(dates[di])}{isGroup ? ` · ${unit.name} group` : ' · own plan'}{cookLabel ? ` · ${cookLabel}` : ''}</span>
            </div>
            <div className="small muted">Targets {targetsLine(T)}</div>
          </div>
          <DayTiles totals={day.totals} T={T} />
          <ZoneLine totals={day.totals} T={T} />
        </Card>
        {day.meals.map((meal, mi) => <MealCard key={`${di}-${mi}`} di={di} mi={mi} meal={meal} />)}
        {day.proteinShake && (
          <Card className="row">
            <Icon name="shake" size={22} style={{ color: 'var(--muted)' }} />
            <div className="grow stack-sm" style={{ gap: 3 }}>
              <div className="strong">Protein shake</div>
              <div className="small muted">{day.proteinShake.calories} kcal · {day.proteinShake.carbs} C · {day.proteinShake.protein} P · {day.proteinShake.fat} F · 1 scoop</div>
            </div>
            <button type="button" className="icon-btn sm muted" aria-label="Remove shake and re-solve" onClick={() => actions.dropShake(di)}><Icon name="x" size={16} /></button>
          </Card>
        )}
        <div className="row-sm wrap">
          {day.meals.length < ops.MAX_MEALS && <Button size="sm" icon="plus" onClick={() => openSwap(di, day.meals.length, true)}>Add meal</Button>}
          {unit && <Button size="sm" icon="refresh" onClick={() => actions.regenerate([di])}>Regenerate {isGroup ? unit.name : 'day'}</Button>}
        </div>
      </>
    );
  };

  // ---------- phone ----------
  if (!desktop) {
    return (
      <>
        {pager}
        <DayBody di={sel} />
        <button type="button" className="link" style={{ alignSelf: 'flex-start' }} onClick={() => setSavedOpen(true)}>Saved plans</button>
        {sheets}
      </>
    );
  }

  // ---------- desktop ----------
  const summary = ops.weeklySummary(days, dg.excluded, T);
  const activeIdx = [0, 1, 2, 3, 4, 5, 6];
  let maxMeals = 1;
  activeIdx.forEach((di) => { const day = days[di]; if (day && day.meals.length > maxMeals) maxMeals = day.meals.length; });
  const anyCanAdd = activeIdx.some((di) => !dg.excluded.includes(di) && (days[di] ? days[di].meals.length : 0) < ops.MAX_MEALS);
  const selUnit = meta(sel).unit;
  const weekEmpty = activeIdx.every((di) => !days[di] || days[di].meals.length === 0);
  const selFree = dg.excluded.includes(sel);

  // Nothing in this week yet: no zero tiles, no seven identical rows. Generate lives in the header;
  // here only the actions that are not a copy of it.
  if (weekEmpty) {
    return (
      <div className="desk-main">
        {pager}
        <Card style={{ padding: 28 }}>
          <Empty title={`Nothing planned for ${weekLabel(weekStart, true).replace('Week of ', '')}`}>
            Pick a start day above and press Generate — it covers {fmtRange(date, n)}.
          </Empty>
          <div className="row-sm" style={{ justifyContent: 'center', gap: 20, marginTop: 4 }}>
            {canCopy(date, n) && <button type="button" className="link" onClick={() => copyPattern(date, n)}><Icon name="copy" size={14} stroke={2.25} />Repeat last plan</button>}
            {!selFree && <button type="button" className="link" onClick={() => openSwap(sel, 0, true)}><Icon name="plus" size={14} stroke={2.25} />Add a meal by hand</button>}
            <button type="button" className="link" onClick={() => setSavedOpen(true)}><Icon name="bookmark" size={14} stroke={2.25} />Saved plans</button>
          </div>
        </Card>
        {sheets}
      </div>
    );
  }

  return (
    <div className="desk-main">
        {pager}
        <div className="grid-4">
          {MACRO_TILES.map((m) => (
            <Card key={m.key} className="stack-sm" style={{ gap: 8 }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>Avg {m.key === 'calories' ? 'calories' : m.key}</div>
              <div className="row baseline" style={{ gap: 6 }}>
                <div className="num nowrap" style={{ fontSize: 28 }}>{fmtInt(summary.avg[m.key])}{m.unit}</div>
                <div className="small muted">{summary.pcts ? `${Math.round(summary.pcts[m.key])}% of ${fmtInt(T[m.tKey])}` : '—'}{m.key === 'calories' ? ` · ${summary.n} day${summary.n === 1 ? '' : 's'}` : ''}</div>
              </div>
              <Bar value={summary.avg[m.key]} target={T[m.tKey]} color={m.color} thin />
            </Card>
          ))}
        </div>
        <Card pad={false} style={{ overflow: 'hidden' }}>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Day</th>{Array.from({ length: maxMeals }, (_, i) => <th key={i}>Meal</th>)}{anyCanAdd && <th style={{ width: 48 }} />}<th>Total</th><th>Group</th></tr></thead>
              <tbody>
                {activeIdx.map((di) => {
                  const day = days[di] || ops.EMPTY_DAY;
                  const isFree = dg.excluded.includes(di);
                  const { unit, color, cookLabel, isGroup } = meta(di);
                  return (
                    <tr key={di} className={cx(di === today && 'today')} onClick={() => setDate(isoDate(dates[di]))} style={{ cursor: 'pointer', outline: di === sel ? '1px solid var(--line)' : undefined }}>
                      <td><div className="stack-sm" style={{ gap: 2 }}><div className="strong" style={{ color: isFree ? 'var(--muted)' : undefined }}>{ops.SHORT_DAYS[di]}</div><div className="small muted">{fmtDayDate(dates[di])}{di === today ? ' · today' : ''}</div></div></td>
                      {isFree ? (
                        <td colSpan={maxMeals + (anyCanAdd ? 1 : 0) + 1}><span className="muted">Free day · nothing planned.</span></td>
                      ) : (
                        <>
                          {Array.from({ length: maxMeals }, (_, mi) => {
                            const meal = day.meals[mi];
                            if (!meal) return <td key={mi}>{mi === 0 && day.meals.length === 0 ? <span className="muted">Nothing planned</span> : null}</td>;
                            const key = `${di}-${mi}`;
                            const fresh = planDoc.tags[key] === 'fresh';
                            return (
                              <td key={mi}>
                                <div className="row">
                                  <button type="button" className="cell-btn" onClick={(e) => { e.stopPropagation(); setDetail({ di, mi }); }}>
                                    <span className="cell-name row-sm wrap" style={{ gap: 6 }}>{planDoc.eaten[key] && <Icon name="check" size={14} stroke={2.5} style={{ color: 'var(--accent-text)' }} />}{meal.name}</span>
                                    <span className="small muted">{meal.variantLabel ? `${meal.variantLabel} · ` : ''}{fmtInt(meal.totalMacros.calories)} kcal</span>
                                  </button>
                                  <button type="button" className="tag" onClick={(e) => { e.stopPropagation(); actions.toggleTag(di, mi); }}>{fresh ? 'fresh' : 'batch'}</button>
                                </div>
                              </td>
                            );
                          })}
                          {anyCanAdd && <td>{day.meals.length < ops.MAX_MEALS && <button type="button" className="icon-btn sm muted" aria-label="Add meal" onClick={(e) => { e.stopPropagation(); openSwap(di, day.meals.length, true); }}><Icon name="plus" size={16} /></button>}</td>}
                          <td>
                            <div className="row-sm">
                              <span className="num" style={{ fontSize: 18 }}>{fmtInt(day.totals.calories)}</span>
                              {day.proteinShake && <button type="button" className="tag" title="Protein shake · click to remove" onClick={(e) => { e.stopPropagation(); actions.dropShake(di); }}>+ shake</button>}
                              {day.meals.length > 0 && !ops.zoneCheck(day.totals, T).ok && <Icon name="alert" size={16} style={{ color: 'var(--warn)' }} />}
                            </div>
                          </td>
                        </>
                      )}
                      <td><div className="row-sm"><span className="dot" style={{ '--c': isFree ? 'var(--dim)' : color }} /><span className="small muted">{isFree ? 'free' : `${isGroup ? unit.name : 'own plan'}${cookLabel ? ` · ${cookLabel}` : ''}`}</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="row-sm wrap">
          {selUnit && <Button icon="refresh" onClick={() => actions.regenerate([sel])}>Regenerate {selUnit.days.length > 1 ? selUnit.name : ops.SHORT_DAYS[sel]}</Button>}
          <Button icon="bookmark" onClick={() => setSavedOpen(true)}>Saved plans</Button>
          {stored && <Button icon="trash" onClick={() => actions.clearWeek()}>Clear this week</Button>}
        </div>
      {sheets}
    </div>
  );
}
