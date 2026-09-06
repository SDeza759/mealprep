import { DAYS_NAMES } from '../core/index.js';
import { SHORT_DAYS } from '../core/planOps.js';
import { cx } from '../ui/index.jsx';

// Seven-day selector shared by Home and Fuel › Plan. Today's date reads in the accent when it is
// not the selected day; free days show "free" instead of a group mark.
export default function WeekStrip({ sel, onSelect, dates, excluded, colorOf, today }) {
  return (
    <div className="week">
      {[0, 1, 2, 3, 4, 5, 6].map((d) => {
        const isFree = excluded.includes(d);
        const isToday = d === today;
        return (
          <button key={d} type="button" className={cx('day', d === sel && 'on')} onClick={() => onSelect(d)} aria-label={`${DAYS_NAMES[d]}${isToday ? ' (today)' : ''}`} aria-pressed={d === sel}>
            <div className="eyebrow" style={{ fontSize: 10, color: isToday ? 'var(--accent-text)' : undefined }}>{SHORT_DAYS[d]}</div>
            <div className="num" style={{ fontSize: 18, color: isFree ? 'var(--dim)' : isToday && d !== sel ? 'var(--accent-text)' : undefined }}>{dates[d].getDate()}</div>
            {isFree
              ? <div className="eyebrow" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}>free</div>
              : <div className="day-mark" style={{ '--c': colorOf(d) }} />}
          </button>
        );
      })}
    </div>
  );
}
