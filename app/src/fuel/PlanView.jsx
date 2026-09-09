import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAYS_NAMES } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Bar, Stepper, Chip, Tag, Icon, Empty, Seg, Confirm, cx } from '../ui/index.jsx';
import { useWeekPlan, usePlansDoc, useTargets, useDayGroups, useUnits, usePlanActions, usePlanActionsFor, useRangeActions, useSettings, emptyWeek } from './hooks.js';
import { useSelectedDate } from './selection.js';
import { weekStartOf, weekdayIndex, todayIso, isoDate, parseIso, addDaysIso } from './dates.js';
import { groupColor, weekDates, fmtDayDate, fmtLongDate, fmtRange, weekLabel, macroLine, targetsLine, useIsDesktop, MONTHS } from './common.js';
import DayPager from './DayPager.jsx';
import MealDetailSheet from './MealDetailSheet.jsx';
import SwapSheet from './SwapSheet.jsx';
import SavedPlans from './SavedPlans.jsx';
import MonthGrid, { MonthPager, monthOf, monthCells } from './MonthGrid.jsx';

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

export default function PlanView() {
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
  const actionsFor = usePlanActionsFor(); // the desktop list spans weeks; each row binds its own
  const [settings, patchSettings] = useSettings();
  const { copyPattern, canCopy } = useRangeActions();
  const [detail, setDetail] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const n = settings.planDays || 7;
  // Desktop Week | Month toggle (persisted). The visible month follows the selection when it moves.
  const view = settings.planView === 'month' ? 'month' : 'week';
  const [month, setMonth] = useState(() => monthOf(date));
  useEffect(() => { setMonth((c) => { const m = monthOf(date); return c.y === m.y && c.m === m.m ? c : m; }); }, [date]);
  const viewSeg = <Seg className="sm" value={view} onChange={(v) => patchSettings({ planView: v })} options={[{ value: 'week', label: 'Week', icon: desktop ? 'list' : undefined }, { value: 'month', label: 'Month', icon: desktop ? 'calendar' : undefined }]} />;
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

  // Sheets carry the week they belong to (`ws`); the phone always works in the selected week.
  const docFor = (ws) => (ws === weekStart ? planDoc : ((plans.weeks && plans.weeks[ws]) || emptyWeek(ws, T)));
  useEffect(() => {
    if (!detail) return;
    const d = docFor(detail.ws || weekStart);
    if (!(d.days[detail.di] && d.days[detail.di].meals[detail.mi])) setDetail(null);
  }, [plans, planDoc, detail]); // eslint-disable-line react-hooks/exhaustive-deps

  const openSwap = (di, mi, isAdd = false, ws = weekStart) => { setDetail(null); setSwapTarget({ di, mi, isAdd, ws }); };
  const pick = (recipe) => { if (!swapTarget) return; actionsFor(swapTarget.ws || weekStart).swap(swapTarget.di, swapTarget.mi, recipe, swapTarget.isAdd); setSwapTarget(null); };

  const pager = <DayPager date={date} onSelect={setDate} excluded={dg.excluded} colorOf={colorOf} extra={viewSeg} />;
  const sheets = (
    <>
      {detail && <MealDetailSheet planDoc={docFor(detail.ws || weekStart)} di={detail.di} mi={detail.mi} onClose={() => setDetail(null)} actions={actionsFor(detail.ws || weekStart)} onSwap={(di, mi) => openSwap(di, mi, false, detail.ws || weekStart)} />}
      {swapTarget && <SwapSheet target={swapTarget} onClose={() => setSwapTarget(null)} onPick={pick} />}
      <SavedPlans open={savedOpen} onClose={() => setSavedOpen(false)} weekStart={weekStart} />
      <Confirm open={confirmClear} onClose={() => setConfirmClear(false)} title={`Clear the week of ${weekLabel(weekStart, true).replace('Week of ', '')}?`} confirmLabel="Clear" danger
        onConfirm={() => actions.clearWeek()} body="Removes every meal, eaten mark, serving and batch tag in this week. Generate can fill it again." />
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
      // Generate lives in the header (once, at the top); the card holds only its day count and the
      // actions that are not a copy of it.
      return (
        <Card className="stack" style={{ padding: 20 }}>
          <div className="num" style={{ fontSize: 22, textAlign: 'center', padding: '10px 0 2px' }}>Nothing planned</div>
          <div className="row-sm wrap" style={{ justifyContent: 'center', gap: 16 }}>
            {canCopy(iso, n) && <button type="button" className="link" onClick={() => copyPattern(iso, n)}><Icon name="copy" size={14} stroke={2.25} />Repeat last plan</button>}
            <button type="button" className="link" onClick={() => openSwap(di, 0, true)}><Icon name="plus" size={14} stroke={2.25} />Add a meal</button>
            {unit && <button type="button" className="link" onClick={() => actions.regenerate([di])}>Just {isGroup ? unit.name : 'this day'}</button>}
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
          {day.meals.length < ops.MAX_MEALS && <Button size="sm" icon="plus" onClick={() => openSwap(di, day.meals.length, true)}>Add a meal</Button>}
          {unit && <Button size="sm" icon="refresh" onClick={() => actions.regenerate([di])}>Regenerate {isGroup ? unit.name : ops.SHORT_DAYS[di]}</Button>}
        </div>
      </>
    );
  };

  // Averages over the planned days of the week, and of the visible month (free weekdays skipped).
  const summary = ops.weeklySummary(days, dg.excluded, T);
  const monthPlanned = monthCells(month.y, month.m)
    .filter((d) => d.getMonth() === month.m)
    .map((d) => { const iso = isoDate(d); const di = weekdayIndex(iso); if (dg.excluded.includes(di)) return null; const wk = plans.weeks && plans.weeks[weekStartOf(iso)]; return wk && wk.days ? wk.days[di] : null; })
    .filter((d) => d && d.meals.length > 0);
  const monthSummary = ops.weeklySummary(monthPlanned, [], T);
  const avgLine = (label, s) => s.n > 0 && (
    <div className="small muted">{label} avg · {macroLine(s.avg)} · {s.n} day{s.n === 1 ? '' : 's'}</div>
  );
  const bottomRow = (extra) => (
    <div className="row-sm wrap">
      {extra}
      <Button size={desktop ? undefined : 'sm'} icon="bookmark" onClick={() => setSavedOpen(true)}>Saved plans</Button>
      {stored && <Button size={desktop ? undefined : 'sm'} icon="trash" onClick={() => setConfirmClear(true)}>Clear this week</Button>}
    </div>
  );

  // ---------- phone ----------
  if (!desktop) {
    return (
      <>
        {view === 'month'
          ? <MonthPager date={date} onSelect={setDate} month={month} onMonth={setMonth} plans={plans} excluded={dg.excluded} T={T} n={n} head={viewSeg} />
          : pager}
        {view === 'month' ? avgLine(MONTHS[month.m], monthSummary) : avgLine('Week', summary)}
        <DayBody di={sel} />
        {bottomRow()}
        {sheets}
      </>
    );
  }

  // ---------- desktop ----------
  const tiles = (s) => (
    <div className="grid-4">
      {MACRO_TILES.map((m) => (
        <Card key={m.key} className="stack-sm" style={{ gap: 8 }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>Avg {m.key === 'calories' ? 'calories' : m.key}</div>
          <div className="row baseline" style={{ gap: 6 }}>
            <div className="num nowrap" style={{ fontSize: 28 }}>{fmtInt(s.avg[m.key])}{m.unit}</div>
            <div className="small muted">{s.pcts ? `${Math.round(s.pcts[m.key])}% of ${fmtInt(T[m.tKey])}` : '—'}{m.key === 'calories' ? ` · ${s.n} day${s.n === 1 ? '' : 's'}` : ''}</div>
          </div>
          <Bar value={s.avg[m.key]} target={T[m.tKey]} color={m.color} thin />
        </Card>
      ))}
    </div>
  );

  if (view === 'month') {
    return (
      <div className="desk-main">
        <MonthGrid date={date} onSelect={setDate} onOpenWeek={(iso) => { setDate(iso); patchSettings({ planView: 'week' }); }}
          month={month} onMonth={setMonth} plans={plans} excluded={dg.excluded} T={T} n={n} head={viewSeg} />
        {monthSummary.n > 0 && tiles(monthSummary)}
        {sheets}
      </div>
    );
  }

  // The list runs from the selected day, like Generate does: at least the Generate window (n days),
  // extended to the last planned day within four weeks so a longer stretch never stops at a Sunday.
  const rows = [];
  let lastPlanned = -1;
  for (let i = 0; i < 28; i++) {
    const iso = addDaysIso(date, i);
    const ws = weekStartOf(iso);
    const di = weekdayIndex(iso);
    const doc = (plans.weeks && plans.weeks[ws]) || null;
    const day = (doc && doc.days && doc.days[di]) || ops.EMPTY_DAY;
    if (day.meals.length) lastPlanned = i;
    rows.push({ iso, ws, di, doc, day, isFree: dg.excluded.includes(di) });
  }
  rows.splice(Math.max(n, lastPlanned + 1));
  const rowMeta = (row) => {
    const unit = ops.unitForDay(units, row.di);
    const entry = row.doc && row.doc.groups && row.doc.groups[row.di];
    const gi = entry ? entry.groupIndex : -1;
    const cook = unit ? dg.cookDays[unit.lead] : undefined;
    return { unit, color: groupColor(gi), cookLabel: cook != null && cook !== '' ? `cook ${ops.SHORT_DAYS[cook]}` : null, isGroup: !!unit && unit.days.length > 1 };
  };
  let maxMeals = 1;
  rows.forEach((r) => { if (r.day.meals.length > maxMeals) maxMeals = r.day.meals.length; });
  const anyCanAdd = rows.some((r) => !r.isFree && r.day.meals.length < ops.MAX_MEALS);
  const listSummary = ops.weeklySummary(rows.map((r) => (r.isFree ? null : r.day)), [], T);
  const selUnit = meta(sel).unit;
  const listEmpty = rows.every((r) => r.day.meals.length === 0);
  const selFree = dg.excluded.includes(sel);
  const todayStr = todayIso();

  // Nothing planned from here on: no zero tiles, no identical empty rows. Generate lives in the
  // header; here only the actions that are not a copy of it.
  if (listEmpty) {
    return (
      <div className="desk-main">
        {pager}
        <Card style={{ padding: 28 }}>
          <Empty title="Nothing planned" />
          <div className="row-sm" style={{ justifyContent: 'center', gap: 20, marginTop: 4 }}>
            {canCopy(date, n) && <button type="button" className="link" onClick={() => copyPattern(date, n)}><Icon name="copy" size={14} stroke={2.25} />Repeat last plan</button>}
            {!selFree && <button type="button" className="link" onClick={() => openSwap(sel, 0, true)}><Icon name="plus" size={14} stroke={2.25} />Add a meal</button>}
            {selUnit && <button type="button" className="link" onClick={() => actions.regenerate([sel])}>Just {selUnit.days.length > 1 ? selUnit.name : 'this day'}</button>}
          </div>
        </Card>
        {bottomRow()}
        {sheets}
      </div>
    );
  }

  return (
    <div className="desk-main">
        {pager}
        {tiles(listSummary)}
        <Card pad={false} style={{ overflow: 'hidden' }}>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Day</th>{Array.from({ length: maxMeals }, (_, i) => <th key={i}>Meal</th>)}{anyCanAdd && <th style={{ width: 48 }} />}<th>Total</th><th>Group</th></tr></thead>
              <tbody>
                {rows.map((row) => {
                  const { iso, ws, di, doc, day, isFree } = row;
                  const { unit, color, cookLabel, isGroup } = rowMeta(row);
                  const act = actionsFor(ws);
                  const isToday = iso === todayStr;
                  return (
                    <tr key={iso} className={cx(isToday && 'today')}>
                      <td><div className="stack-sm" style={{ gap: 2 }}><div className="strong" style={{ color: isFree ? 'var(--muted)' : undefined }}>{ops.SHORT_DAYS[di]}</div><div className="small muted">{fmtDayDate(parseIso(iso))}{isToday ? ' · today' : ''}</div></div></td>
                      {isFree ? (
                        <td colSpan={maxMeals + (anyCanAdd ? 1 : 0) + 1}><span className="muted">Free day · nothing planned.</span></td>
                      ) : (
                        <>
                          {Array.from({ length: maxMeals }, (_, mi) => {
                            const meal = day.meals[mi];
                            if (!meal) return <td key={mi}>{mi === 0 && day.meals.length === 0 ? <span className="muted">Nothing planned</span> : null}</td>;
                            const key = `${di}-${mi}`;
                            const fresh = !!doc && doc.tags[key] === 'fresh';
                            const eaten = !!doc && !!doc.eaten[key];
                            return (
                              <td key={mi}>
                                <div className="row">
                                  <button type="button" className="cell-btn" onClick={() => setDetail({ di, mi, ws })}>
                                    <span className="cell-name row-sm wrap" style={{ gap: 6 }}>{eaten && <Icon name="check" size={14} stroke={2.5} style={{ color: 'var(--accent-text)' }} />}{meal.name}</span>
                                    <span className="small muted">{meal.variantLabel ? `${meal.variantLabel} · ` : ''}{fmtInt(meal.totalMacros.calories)} kcal</span>
                                  </button>
                                  <button type="button" className="tag" onClick={() => act.toggleTag(di, mi)}>{fresh ? 'fresh' : 'batch'}</button>
                                </div>
                              </td>
                            );
                          })}
                          {anyCanAdd && <td>{day.meals.length < ops.MAX_MEALS && <button type="button" className="icon-btn sm muted" aria-label="Add a meal" onClick={() => openSwap(di, day.meals.length, true, ws)}><Icon name="plus" size={16} /></button>}</td>}
                          <td>
                            <div className="row-sm">
                              <span className="num" style={{ fontSize: 18 }}>{fmtInt(day.totals.calories)}</span>
                              {day.proteinShake && <button type="button" className="tag" title="Protein shake · click to remove" onClick={() => act.dropShake(di)}>+ shake</button>}
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
        {bottomRow(selUnit && <Button icon="refresh" onClick={() => actions.regenerate([sel])}>Regenerate {selUnit.days.length > 1 ? selUnit.name : ops.SHORT_DAYS[sel]}</Button>)}
      {sheets}
    </div>
  );
}
