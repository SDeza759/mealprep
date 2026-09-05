import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAYS_NAMES } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Card, Button, Bar, Stepper, Chip, Tag, Icon, Empty, Sheet, Confirm, cx } from '../ui/index.jsx';
import { usePlanDoc, useTargets, useDayGroups, useUnits, usePlanActions, useSettings, useFavorites, todayIndex } from './hooks.js';
import { groupColor, weekDates, fmtDayDate, macroLine, targetsLine, fmtTime, useIsDesktop } from './common.js';
import MealDetailSheet from './MealDetailSheet.jsx';
import SwapSheet from './SwapSheet.jsx';
import SavedPlans from './SavedPlans.jsx';
import { buildGroceryList } from '../core/index.js';
import { groceryQty } from '../core/display.js';

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

// Which planning unit a day belongs to, its cook day and label, from the plan-time snapshot.
function useDayMeta(planDoc, units, dg) {
  return (di) => {
    const unit = ops.unitForDay(units, di);
    const entry = planDoc && planDoc.groups && planDoc.groups[di];
    const gi = entry ? entry.groupIndex : -1;
    const cook = unit ? dg.cookDays[unit.lead] : undefined;
    const cookLabel = cook != null && cook !== '' ? `cook ${ops.SHORT_DAYS[cook]}` : null;
    return { unit, gi, color: groupColor(gi), cookLabel, isGroup: !!unit && unit.days.length > 1 };
  };
}

export function GenerateCard({ onGenerate, T, units, dg }) {
  const strained = ops.strainedUnits(units, T.calories);
  return (
    <Card className="stack-lg" style={{ padding: 20 }}>
      <Empty title="No plan for this week yet">
        <div className="stack-sm">
          <div>Targets {targetsLine(T)}.</div>
          <div>{units.length ? units.map((u) => `${u.name} · ${u.meals} meal${u.meals === 1 ? '' : 's'}`).join(' · ') : 'No days to plan'}{dg.excluded.length ? ` · free: ${dg.excluded.map((d) => ops.SHORT_DAYS[d]).join(', ')}` : ''}.</div>
        </div>
      </Empty>
      {!T.pctValid && <div className="warnbox">Macro percentages add up to {T.pctSum}% — they must equal 100%. Fix them under Settings › Targets.</div>}
      {strained.length > 0 && <div className="warnbox">{strained.map((u) => `${u.name} (${Math.round(T.calories / u.meals)} kcal/meal)`).join(', ')} — that's a lot to ask of one sitting, so those days may land off-target.</div>}
      <Button variant="primary" block icon="refresh" onClick={onGenerate} disabled={!T.pctValid || !units.length}>Generate this week</Button>
    </Card>
  );
}

export default function PlanView() {
  const desktop = useIsDesktop();
  const navigate = useNavigate();
  const [planDoc] = usePlanDoc();
  const T = useTargets();
  const [dg] = useDayGroups();
  const units = useUnits();
  const actions = usePlanActions();
  const [settings] = useSettings();
  const [favorites, toggleFav] = useFavorites();
  const [sel, setSel] = useState(() => { const t = todayIndex(); return dg.excluded.includes(t) ? (units[0] ? units[0].lead : t) : t; });
  const [detail, setDetail] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const meta = useDayMeta(planDoc, units, dg);
  const dates = useMemo(() => weekDates(planDoc && planDoc.weekStart), [planDoc]);
  const today = todayIndex();

  useEffect(() => { if (detail && !(planDoc && planDoc.days[detail.di] && planDoc.days[detail.di].meals[detail.mi])) setDetail(null); }, [planDoc, detail]);

  const onGenerate = () => { if (planDoc) setConfirmRegen(true); else actions.generate(); };

  const openSwap = (di, mi, isAdd = false) => { setDetail(null); setSwapTarget({ di, mi, isAdd }); };
  const pick = (recipe) => { if (!swapTarget) return; actions.swap(swapTarget.di, swapTarget.mi, recipe, swapTarget.isAdd); setSwapTarget(null); };

  const sheets = (
    <>
      {detail && <MealDetailSheet planDoc={planDoc} di={detail.di} mi={detail.mi} onClose={() => setDetail(null)} actions={actions} onSwap={(di, mi) => openSwap(di, mi)} />}
      {swapTarget && <SwapSheet target={swapTarget} onClose={() => setSwapTarget(null)} onPick={pick} />}
      <Confirm open={confirmRegen} onClose={() => setConfirmRegen(false)} title="Replace this week's plan?" confirmLabel="Generate" onConfirm={() => actions.generate()}
        body="A fresh week is generated from your targets and day groups. Eaten marks, servings and batch tags on the current plan are cleared." />
      <SavedPlans open={savedOpen} onClose={() => setSavedOpen(false)} />
    </>
  );

  if (!planDoc) {
    return (
      <>
        <GenerateCard onGenerate={onGenerate} T={T} units={units} dg={dg} />
        <Button variant="ghost" block icon="bookmark" onClick={() => setSavedOpen(true)}>Saved plans</Button>
        {sheets}
      </>
    );
  }

  const days = planDoc.days;
  const unitOf = (di) => meta(di).unit;

  // ---------- meal card (shared by phone list and desktop table popovers) ----------
  const MealCard = ({ di, mi, meal, time }) => {
    const key = `${di}-${mi}`;
    const isFresh = planDoc.tags[key] === 'fresh';
    const isEaten = !!planDoc.eaten[key];
    const { cookLabel } = meta(di);
    return (
      <Card className="meal-card" role="button" tabIndex={0} onClick={() => setDetail({ di, mi })} onKeyDown={(e) => { if (e.key === 'Enter') setDetail({ di, mi }); }} style={{ cursor: 'pointer' }}>
        <div className="row top">
          <div className="grow stack-sm" style={{ gap: 4 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>Meal {mi + 1}{time ? ` · ${fmtTime(time)}` : ''}</div>
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
    const times = ops.mealTimesFor(day.meals.length, settings.mealTimes);
    const hasBatch = day.meals.some((_, mi) => planDoc.tags[`${di}-${mi}`] !== 'fresh');
    if (isFree) {
      return <Card><Empty title={`${DAYS_NAMES[di]} is a free day`}>Nothing planned. Change that under Settings › Day groups.</Empty></Card>;
    }
    return (
      <>
        <Card className="stack">
          <div className="stack-sm" style={{ gap: 3 }}>
            <div className="row-sm wrap" style={{ gap: 6 }}>
              <span className="dot" style={{ '--c': color }} />
              <span className="strong">{DAYS_NAMES[di]}</span>
              <span className="muted small">{isGroup ? `· ${unit.name} group` : '· own plan'}{cookLabel ? ` · ${cookLabel}` : ''}</span>
            </div>
            <div className="small muted">Targets {targetsLine(T)}</div>
          </div>
          {day.meals.length > 0 ? (<><DayTiles totals={day.totals} T={T} /><ZoneLine totals={day.totals} T={T} /></>) : (
            <div className="infobox">No meals on this day — add one below or regenerate {unit ? unit.name : 'it'}.</div>
          )}
        </Card>
        {day.meals.map((meal, mi) => <MealCard key={`${di}-${mi}`} di={di} mi={mi} meal={meal} time={times[mi]} />)}
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
          {unit && hasBatch && <Button size="sm" icon="pot" onClick={() => navigate(`/fuel/cook/${unit.key}`)}>Cook day</Button>}
        </div>
      </>
    );
  };

  // ---------- phone ----------
  if (!desktop) {
    return (
      <>
        <div className="week">
          {[0, 1, 2, 3, 4, 5, 6].map((d) => {
            const isFree = dg.excluded.includes(d);
            const { color } = meta(d);
            return (
              <button key={d} type="button" className={cx('day', d === sel && 'on')} onClick={() => setSel(d)} aria-label={DAYS_NAMES[d]} aria-pressed={d === sel}>
                <div className="eyebrow" style={{ fontSize: 10, color: d === today ? 'var(--fg)' : undefined }}>{ops.SHORT_DAYS[d]}</div>
                <div className="num" style={{ fontSize: 18, color: isFree ? 'var(--dim)' : undefined }}>{dates[d].getDate()}</div>
                {isFree ? <div className="eyebrow" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>free</div> : <div className="day-mark" style={{ '--c': color }} />}
              </button>
            );
          })}
        </div>
        <DayBody di={sel} />
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
  const selUnit = unitOf(sel);
  const grocery = buildGroceryList(days.map((d, di) => (dg.excluded.includes(di) ? null : d)), planDoc.servings);
  const topItems = grocery.flatMap((s) => s.items).filter((i) => !i.isSpice).sort((a, b) => b.totalGrams - a.totalGrams).slice(0, 4);
  const itemCount = grocery.reduce((n, s) => n + s.items.length, 0);
  const nextCook = units.find((u) => dg.cookDays[u.lead] != null && dg.cookDays[u.lead] !== '' && u.days.some((d) => days[d] && days[d].meals.some((_, mi) => planDoc.tags[`${d}-${mi}`] !== 'fresh')));
  const inZoneDays = activeIdx.filter((di) => days[di] && days[di].meals.length && !dg.excluded.includes(di) && ops.zoneCheck(days[di].totals, T).ok).length;

  return (
    <div className="desk-cols">
      <div className="desk-main">
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
              <thead><tr><th>Day</th>{Array.from({ length: maxMeals }, (_, i) => <th key={i}>Meal {i + 1}</th>)}{anyCanAdd && <th style={{ width: 48 }} />}<th>Total</th><th>Group</th></tr></thead>
              <tbody>
                {activeIdx.map((di) => {
                  const day = days[di] || ops.EMPTY_DAY;
                  const isFree = dg.excluded.includes(di);
                  const { unit, color, cookLabel, isGroup } = meta(di);
                  const times = ops.mealTimesFor(day.meals.length, settings.mealTimes);
                  return (
                    <tr key={di} className={cx(di === today && 'today')} onClick={() => setSel(di)} style={{ cursor: 'pointer', outline: di === sel ? '1px solid var(--line)' : undefined }}>
                      <td><div className="stack-sm" style={{ gap: 2 }}><div className="strong" style={{ color: isFree ? 'var(--muted)' : undefined }}>{ops.SHORT_DAYS[di]}</div><div className="small muted">{fmtDayDate(dates[di])}{di === today ? ' · today' : ''}</div></div></td>
                      {isFree ? (
                        <td colSpan={maxMeals + (anyCanAdd ? 1 : 0) + 1}><span className="muted">Free day · nothing planned.</span></td>
                      ) : (
                        <>
                          {Array.from({ length: maxMeals }, (_, mi) => {
                            const meal = day.meals[mi];
                            if (!meal) return <td key={mi}>{mi === 0 && day.meals.length === 0 ? <span className="muted small">No meals — add one or regenerate.</span> : null}</td>;
                            const key = `${di}-${mi}`;
                            const fresh = planDoc.tags[key] === 'fresh';
                            return (
                              <td key={mi}>
                                <div className="row">
                                  <button type="button" className="cell-btn" onClick={(e) => { e.stopPropagation(); setDetail({ di, mi }); }}>
                                    <span className="cell-name row-sm wrap" style={{ gap: 6 }}>{planDoc.eaten[key] && <Icon name="check" size={14} stroke={2.5} style={{ color: 'var(--accent-text)' }} />}{meal.name}</span>
                                    <span className="small muted">{meal.variantLabel ? `${meal.variantLabel} · ` : ''}{fmtInt(meal.totalMacros.calories)} kcal{times[mi] ? ` · ${fmtTime(times[mi])}` : ''}</span>
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
          <Button icon="clipboard" onClick={() => actions.logEaten()}>Log eaten meals{Object.keys(planDoc.eaten).length ? ` (${Object.keys(planDoc.eaten).length})` : ''}</Button>
        </div>
      </div>
      <div className="desk-rail">
        <Card className="stack" style={{ padding: 18 }}>
          <div className="section-head"><div className="eyebrow">Next cook day</div>{nextCook && <div className="small muted">{DAYS_NAMES[dg.cookDays[nextCook.lead]]}</div>}</div>
          {nextCook ? (
            <>
              <div className="strong" style={{ fontSize: 17 }}>{nextCook.name} batch</div>
              <div className="small muted">{(() => { const day = days[nextCook.lead]; if (!day) return '—'; const names = day.meals.filter((_, mi) => planDoc.tags[`${nextCook.lead}-${mi}`] !== 'fresh').map((m) => m.name); return `${names.join(', ')} × ${nextCook.days.length}`; })()}</div>
              <Button block icon="pot" onClick={() => navigate(`/fuel/cook/${nextCook.key}`)}>Open cook mode</Button>
            </>
          ) : (
            <div className="small muted" style={{ lineHeight: 1.45 }}>Set a cook day per group under Settings › Day groups and the batch meals show up here.</div>
          )}
        </Card>
        <Card className="stack" style={{ padding: 18 }}>
          <div className="section-head"><div className="eyebrow">Grocery</div><div className="small muted">{itemCount} items · {grocery.length} aisles</div></div>
          <div className="stack-sm" style={{ gap: 8 }}>
            {topItems.map((it) => <div key={it.name} className="row between"><span>{it.name}</span><span className="num" style={{ fontSize: 15 }}>{groceryQty(it, settings.units)}</span></div>)}
          </div>
          <button type="button" className="link" onClick={() => navigate('/fuel/grocery')}>Open list</button>
        </Card>
        <Card className="stack" style={{ padding: 18 }}>
          <div className="eyebrow">This week</div>
          <div className="small muted" style={{ lineHeight: 1.45 }}>
            <div><span className="strong">{inZoneDays} of {summary.n}</span> planned days land inside the 95–105% zone on all four macros.</div>
            <div style={{ marginTop: 6 }}>Targets {targetsLine(T)}. Lifting-day carbs and the weight trend arrive with Train and Body.</div>
          </div>
        </Card>
      </div>
      {sheets}
    </div>
  );
}
