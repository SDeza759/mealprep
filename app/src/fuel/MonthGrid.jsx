import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { fmtInt } from '../core/display.js';
import * as ops from '../core/planOps.js';
import { Icon, cx } from '../ui/index.jsx';
import { groupColor } from './common.js';
import { isoDate, parseIso, todayIso, weekStartOf, weekdayIndex, addDaysIso, mondayOf } from './dates.js';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MAX_NAMES = 4;

export function monthOf(iso) { const d = parseIso(iso); return { y: d.getFullYear(), m: d.getMonth() }; }
// Six Monday-first rows covering the month (42 dates), so the grid never changes height.
export function monthCells(y, m) {
  const start = mondayOf(new Date(y, m, 1));
  return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}

// The grid itself: day-of-week header plus 42 cells. Read-only on purpose: clicking a day selects
// it — Generate, Cook day and the Week view follow — and a double-click opens its week. The N days
// Generate would cover from the selected day are tinted, so "Generate 14 days" is visible before it
// is pressed. `compact` is the phone form: number + group dot, like the iPhone Calendar month.
export function MonthCells({ y, m, date, onSelect, onOpenWeek, plans, excluded, T, n, compact = false }) {
  const today = todayIso();
  const cells = useMemo(() => monthCells(y, m), [y, m]);
  const weeks = (plans && plans.weeks) || {};
  const rangeEnd = addDaysIso(date, n); // exclusive

  const info = (d) => {
    const iso = isoDate(d);
    const di = weekdayIndex(iso);
    const wk = weeks[weekStartOf(iso)];
    const day = wk && wk.days ? wk.days[di] : null;
    const planned = !!(day && day.meals && day.meals.length);
    const isFree = excluded.includes(di);
    const entry = wk && wk.groups && wk.groups[di];
    const total = planned ? day.meals.length + (day.proteinShake ? 1 : 0) : 0;
    let eaten = 0;
    if (planned && wk.eaten) for (let mi = 0; mi < total; mi++) if (wk.eaten[`${di}-${mi}`]) eaten++;
    return {
      iso, out: d.getMonth() !== m, isFree, planned,
      color: groupColor(entry ? entry.groupIndex : -1),
      names: planned ? day.meals.map((meal) => meal.name) : [],
      kcal: planned ? day.totals.calories : 0,
      shake: planned && !!day.proteinShake,
      warn: planned && !ops.zoneCheck(day.totals, T).ok,
      eaten, total,
      inRange: !isFree && iso >= date && iso < rangeEnd,
    };
  };

  return (
    <div className={cx('month', compact && 'compact')}>
      {ops.SHORT_DAYS.map((d) => <div key={d} className="month-dow">{d}</div>)}
      {cells.map((d) => {
        const c = info(d);
        return (
          <button key={c.iso} type="button" aria-pressed={c.iso === date} aria-label={`${c.iso}${c.iso === today ? ' (today)' : ''}`}
            className={cx('mcell', compact && 'compact', c.out && 'out', c.iso === date && 'on', c.iso === today && 'today', c.inRange && 'range', c.isFree && 'free')}
            onClick={() => onSelect(c.iso)} onDoubleClick={onOpenWeek ? () => onOpenWeek(c.iso) : undefined}>
            {compact ? (
              <>
                <span className="num mcell-num">{d.getDate()}</span>
                {c.planned && <span className="dot" style={{ '--c': c.color }} />}
              </>
            ) : (
              <>
                <div className="mcell-head">
                  <span className="num mcell-num">{d.getDate()}</span>
                  {c.isFree
                    ? <span className="eyebrow" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>free</span>
                    : c.planned && <span className="dot" style={{ '--c': c.color }} />}
                </div>
                {c.names.slice(0, MAX_NAMES).map((name, i) => <div key={i} className="mcell-meal">{name}</div>)}
                {c.names.length > MAX_NAMES && <div className="mcell-meal muted">+{c.names.length - MAX_NAMES} more</div>}
                {c.planned && (
                  <div className="mcell-foot">
                    <span className="num" style={{ fontSize: 14, color: 'var(--fg)' }}>{fmtInt(c.kcal)}</span>
                    {c.shake && <span>+ shake</span>}
                    {c.warn && <Icon name="alert" size={13} style={{ color: 'var(--warn)' }} />}
                    {c.eaten > 0 && (
                      <span className="row-sm" style={{ gap: 2, marginLeft: 'auto', color: c.eaten === c.total ? 'var(--accent-text)' : undefined }}>
                        <Icon name="check" size={12} stroke={2.5} />{c.eaten < c.total ? `${c.eaten}/${c.total}` : ''}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Desktop month view: arrows + label on the left, Today and the Week | Month toggle on the right.
export default function MonthGrid({ date, onSelect, onOpenWeek, month, onMonth, plans, excluded, T, n, head }) {
  const today = todayIso();
  const shift = (k) => { const d = new Date(month.y, month.m + k, 1); onMonth({ y: d.getFullYear(), m: d.getMonth() }); };
  return (
    <div className="stack-sm">
      <div className="pager-head">
        <div className="row-sm" style={{ gap: 4 }}>
          <button type="button" className="icon-btn sm muted" aria-label="Previous month" onClick={() => shift(-1)}><Icon name="chevronLeft" size={18} /></button>
          <span className="strong" style={{ minWidth: 150, textAlign: 'center' }}>{MONTH_NAMES[month.m]} {month.y}</span>
          <button type="button" className="icon-btn sm muted" aria-label="Next month" onClick={() => shift(1)}><Icon name="chevronRight" size={18} /></button>
        </div>
        <div className="row-sm" style={{ gap: 12 }}>
          {date !== today && <button type="button" className="link" onClick={() => onSelect(today)}>Today</button>}
          {head}
        </div>
      </div>
      <MonthCells y={month.y} m={month.m} date={date} onSelect={onSelect} onOpenWeek={onOpenWeek} plans={plans} excluded={excluded} T={T} n={n} />
    </div>
  );
}

// Phone month view: compact grids a year either side of this month, swiped page by page like the
// week strip. Swiping changes the visible month only; the selection stays where it was.
const SPAN = 13;
export function MonthPager({ date, onSelect, month, onMonth, plans, excluded, T, n, head }) {
  const today = todayIso();
  const ref = useRef(null);
  const months = useMemo(() => {
    const base = monthOf(todayIso());
    return Array.from({ length: SPAN * 2 + 1 }, (_, i) => { const d = new Date(base.y, base.m + (i - SPAN), 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  }, []);
  const idx = months.findIndex((x) => x.y === month.y && x.m === month.m);
  const pageRef = useRef(idx < 0 ? SPAN : idx);
  const align = useCallback((p) => { const el = ref.current; if (el) el.scrollLeft = p * el.clientWidth; }, []);
  useLayoutEffect(() => { align(pageRef.current); }, [align]);
  // The visible month moved elsewhere (Today link, a selection in another month): jump to it.
  useLayoutEffect(() => { if (idx >= 0 && idx !== pageRef.current) { pageRef.current = idx; align(idx); } }, [idx, align]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => align(pageRef.current));
    ro.observe(el);
    return () => ro.disconnect();
  }, [align]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let t;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const p = Math.round(el.scrollLeft / el.clientWidth);
        if (p !== pageRef.current && months[p]) { pageRef.current = p; onMonth(months[p]); }
      }, 120);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [months, onMonth]);

  return (
    <div className="stack-sm">
      <div className="pager-head">
        <span className="strong">{MONTH_NAMES[month.m]} {month.y}</span>
        <div className="row-sm" style={{ gap: 12 }}>
          {date !== today && <button type="button" className="link" onClick={() => onSelect(today)}>Today</button>}
          {head}
        </div>
      </div>
      <div className="pager" ref={ref}>
        {months.map((mo) => (
          <div key={`${mo.y}-${mo.m}`} className="pager-page">
            <MonthCells y={mo.y} m={mo.m} date={date} onSelect={onSelect} plans={plans} excluded={excluded} T={T} n={n} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
