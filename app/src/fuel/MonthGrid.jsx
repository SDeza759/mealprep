import { useMemo } from 'react';
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

// Month view of the plan (desktop). Read-only on purpose: clicking a day selects it — Generate,
// Cook day and the Week view follow — and a double-click opens its week. The N days Generate would
// cover from the selected day are tinted, so "Generate 14 days" is visible before it is pressed.
export default function MonthGrid({ date, onSelect, onOpenWeek, month, onMonth, plans, excluded, T, n, head }) {
  const today = todayIso();
  const cells = useMemo(() => monthCells(month.y, month.m), [month]);
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
      iso, out: d.getMonth() !== month.m, isFree, planned,
      color: groupColor(entry ? entry.groupIndex : -1),
      names: planned ? day.meals.map((meal) => meal.name) : [],
      kcal: planned ? day.totals.calories : 0,
      shake: planned && !!day.proteinShake,
      warn: planned && !ops.zoneCheck(day.totals, T).ok,
      eaten, total,
      inRange: !isFree && iso >= date && iso < rangeEnd,
    };
  };
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
      <div className="month">
        {ops.SHORT_DAYS.map((d) => <div key={d} className="month-dow">{d}</div>)}
        {cells.map((d) => {
          const c = info(d);
          return (
            <button key={c.iso} type="button" aria-pressed={c.iso === date} aria-label={`${c.iso}${c.iso === today ? ' (today)' : ''}`}
              className={cx('mcell', c.out && 'out', c.iso === date && 'on', c.iso === today && 'today', c.inRange && 'range', c.isFree && 'free')}
              onClick={() => onSelect(c.iso)} onDoubleClick={() => onOpenWeek(c.iso)}>
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
