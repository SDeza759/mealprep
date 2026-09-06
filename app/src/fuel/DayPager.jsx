import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../ui/index.jsx';
import WeekStrip from './WeekStrip.jsx';
import { weekDates, weekLabel, useIsDesktop } from './common.js';
import { isoDate, addDays, mondayOf, weekStartOf, weekdayIndex, todayIso, addDaysIso } from './dates.js';

// A year of weeks either side of the current one, swiped page by page (scroll-snap). Swiping to
// another week moves the selection to the same weekday there; arrows do the same on desktop.
const SPAN = 52;

const Page = memo(function Page({ week, selIdx, todayIdx, excluded, colorOf, onPick }) {
  const dates = useMemo(() => weekDates(week), [week]);
  return (
    <div className="pager-page">
      <WeekStrip sel={selIdx} onSelect={(d) => onPick(isoDate(dates[d]))} dates={dates} excluded={excluded} colorOf={(d) => colorOf(isoDate(dates[d]))} today={todayIdx} />
    </div>
  );
});

export default function DayPager({ date, onSelect, excluded, colorOf, label = true }) {
  const desktop = useIsDesktop();
  const ref = useRef(null);
  const weeks = useMemo(() => {
    const base = mondayOf(new Date());
    return Array.from({ length: SPAN * 2 + 1 }, (_, i) => isoDate(addDays(base, (i - SPAN) * 7)));
  }, []);
  const today = todayIso();
  const todayWeek = weekStartOf(today);
  const selWeek = weekStartOf(date);
  const [page, setPage] = useState(() => Math.max(0, weeks.indexOf(selWeek)));
  const pageRef = useRef(page);
  pageRef.current = page;

  const align = useCallback((p) => { const el = ref.current; if (el) el.scrollLeft = p * el.clientWidth; }, []);
  useLayoutEffect(() => { align(pageRef.current); }, [align]);
  // A selection made elsewhere (Today link, arrows) jumps the scroller to that week — instantly, so
  // no intermediate scroll events fight the selection.
  useLayoutEffect(() => {
    const p = weeks.indexOf(selWeek);
    if (p >= 0 && p !== pageRef.current) { setPage(p); align(p); }
  }, [selWeek, weeks, align]);
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
        if (p !== pageRef.current && weeks[p]) { setPage(p); onSelect(addDaysIso(weeks[p], weekdayIndex(date))); }
      }, 120);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [weeks, date, onSelect]);

  const visibleWeek = weeks[page] || selWeek;
  const away = date !== today;
  return (
    <div className="stack-sm">
      {(label || away) && (
        <div className="pager-head">
          <span className="small muted">{label ? weekLabel(visibleWeek, true) : ''}</span>
          {away && <button type="button" className="link" onClick={() => onSelect(today)}>Today</button>}
        </div>
      )}
      <div className="row-sm" style={{ gap: 4 }}>
        {desktop && <button type="button" className="icon-btn sm muted" aria-label="Previous week" onClick={() => onSelect(addDaysIso(date, -7))}><Icon name="chevronLeft" size={18} /></button>}
        <div className="pager grow" ref={ref}>
          {weeks.map((w) => (
            <Page key={w} week={w} selIdx={w === selWeek ? weekdayIndex(date) : -1} todayIdx={w === todayWeek ? weekdayIndex(today) : -1}
              excluded={excluded} colorOf={colorOf} onPick={onSelect} />
          ))}
        </div>
        {desktop && <button type="button" className="icon-btn sm muted" aria-label="Next week" onClick={() => onSelect(addDaysIso(date, 7))}><Icon name="chevronRight" size={18} /></button>}
      </div>
    </div>
  );
}
