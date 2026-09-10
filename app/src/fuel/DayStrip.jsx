import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DAYS_NAMES } from '../core/index.js';
import { SHORT_DAYS } from '../core/planOps.js';
import { Icon, cx } from '../ui/index.jsx';
import { MONTHS, MONTH_LONG, fmtDayDate, useIsDesktop } from './common.js';
import { isoDate, addDays, addDaysIso, mondayOf, parseIso, todayIso, weekStartOf, weekdayIndex } from './dates.js';

// One continuous row of days, a year either side of this week, scrolled freely (snaps per day).
// Selecting is a click. The arrows and swipes only move the strip — never the selection. The head
// row names the month(s) on screen, offers Today when today is off screen or not selected, and
// holds whatever the caller passes as `right` (the Week | Month toggle). `rangeN` tints the days
// Generate would cover from the selected one.
const SPAN = 52 * 7;
const GAP = 4;

export default function DayStrip({ date, onSelect, excluded, colorOf, rangeN = 0, right = null }) {
  const desktop = useIsDesktop();
  const perView = desktop ? 14 : 7;
  const ref = useRef(null);
  const days = useMemo(() => {
    const base = mondayOf(new Date());
    return Array.from({ length: SPAN * 2 + 7 }, (_, i) => isoDate(addDays(base, i - SPAN)));
  }, []);
  const today = todayIso();
  const [cellW, setCellW] = useState(0);
  const [firstVis, setFirstVis] = useState(() => Math.max(0, days.indexOf(weekStartOf(date))));
  const step = cellW + GAP;
  const ready = cellW > 0;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setCellW(Math.max(36, Math.floor((el.clientWidth - GAP * (perView - 1)) / perView)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [perView]);

  const scrollToIndex = useCallback((i, smooth) => {
    const el = ref.current;
    if (!el || !ready) return;
    const idx = Math.max(0, Math.min(days.length - perView, i));
    el.scrollTo({ left: idx * step, behavior: smooth ? 'smooth' : 'auto' });
    setFirstVis(idx);
  }, [ready, step, days.length, perView]);

  // First paint and any width change: the selected day's week starts at the left edge.
  useLayoutEffect(() => { if (ready) scrollToIndex(days.indexOf(weekStartOf(date)), false); }, [ready, step]); // eslint-disable-line react-hooks/exhaustive-deps
  // A selection made elsewhere (Today, the month grid) that is off screen: bring its week in.
  useEffect(() => {
    if (!ready) return;
    const i = days.indexOf(date);
    if (i >= 0 && (i < firstVis || i > firstVis + perView - 1)) scrollToIndex(days.indexOf(weekStartOf(date)), true);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let t;
    const onScroll = () => { clearTimeout(t); t = setTimeout(() => { if (ready) setFirstVis(Math.round(el.scrollLeft / step)); }, 80); };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [ready, step]);

  const clamp = (i) => Math.max(0, Math.min(days.length - 1, i));
  const a = parseIso(days[clamp(firstVis)]);
  const b = parseIso(days[clamp(firstVis + perView - 1)]);
  const label = a.getMonth() === b.getMonth() ? `${MONTH_LONG[a.getMonth()]} ${a.getFullYear()}`
    : a.getFullYear() === b.getFullYear() ? `${MONTHS[a.getMonth()]} – ${MONTHS[b.getMonth()]} ${a.getFullYear()}`
      : `${MONTHS[a.getMonth()]} ${a.getFullYear()} – ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  const todayIdx = days.indexOf(today);
  const showToday = date !== today || todayIdx < firstVis || todayIdx > firstVis + perView - 1;
  const goToday = () => { onSelect(today); scrollToIndex(days.indexOf(weekStartOf(today)), true); };
  const rangeEnd = rangeN > 0 ? addDaysIso(date, rangeN) : null;

  return (
    <div className="stack-sm">
      <div className="pager-head">
        <span className="strong">{label}</span>
        <div className="row-sm" style={{ gap: 12 }}>
          {showToday && <button type="button" className="link" onClick={goToday}>Today</button>}
          {right}
        </div>
      </div>
      <div className="row-sm" style={{ gap: 4 }}>
        {desktop && <button type="button" className="icon-btn sm muted" aria-label="Earlier days" onClick={() => scrollToIndex(firstVis - 7, true)}><Icon name="chevronLeft" size={18} /></button>}
        <div className="strip grow" ref={ref} style={{ '--dayw': `${cellW}px` }}>
          {days.map((iso) => {
            const d = weekdayIndex(iso);
            const isFree = excluded.includes(d);
            const isToday = iso === today;
            const on = iso === date;
            const inRange = !!rangeEnd && !isFree && iso >= date && iso < rangeEnd;
            return (
              <button key={iso} type="button" className={cx('day', on && 'on', inRange && 'range')} onClick={() => onSelect(iso)} aria-pressed={on}
                aria-label={`${DAYS_NAMES[d]} ${fmtDayDate(parseIso(iso))}${isToday ? ' (today)' : ''}`}>
                <div className="eyebrow" style={{ fontSize: 10, color: isToday ? 'var(--accent-text)' : undefined }}>{SHORT_DAYS[d]}</div>
                <div className="num" style={{ fontSize: 18, color: isFree ? 'var(--dim)' : isToday && !on ? 'var(--accent-text)' : undefined }}>{parseIso(iso).getDate()}</div>
                {isFree
                  ? <div className="eyebrow" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>free</div>
                  : <div className="day-mark" style={{ '--c': colorOf(iso) }} />}
              </button>
            );
          })}
        </div>
        {desktop && <button type="button" className="icon-btn sm muted" aria-label="Later days" onClick={() => scrollToIndex(firstVis + 7, true)}><Icon name="chevronRight" size={18} /></button>}
      </div>
    </div>
  );
}
