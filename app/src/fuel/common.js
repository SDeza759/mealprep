import { useEffect, useState } from 'react';
import { DAYS_NAMES } from '../core/index.js';
import { fmtInt } from '../core/display.js';
import { mondayOf, parseIso } from './dates.js';

// One colour per plan group, readable in both themes; ungrouped days use --muted.
const GROUP_COLORS = ['var(--accent)', 'var(--fg)', 'var(--carbs)', 'var(--protein)', 'var(--fat)', 'var(--good)'];
export function groupColor(gi) { return gi == null || gi < 0 ? 'var(--muted)' : GROUP_COLORS[gi % GROUP_COLORS.length]; }

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function weekDates(weekStart) {
  const start = weekStart ? parseIso(weekStart) : mondayOf(new Date());
  if (Number.isNaN(start.getTime())) return weekDates(null);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}
export function fmtDayDate(d) { return `${MONTHS[d.getMonth()]} ${d.getDate()}`; }
export function fmtLongDate(d) {
  const year = d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : '';
  return `${DAYS_NAMES[(d.getDay() + 6) % 7]}, ${fmtDayDate(d)}${year}`;
}
export function weekLabel(weekStart, withEnd = false) {
  const ds = weekDates(weekStart);
  if (!withEnd) return `Week of ${fmtDayDate(ds[0])}`;
  const sameMonth = ds[0].getMonth() === ds[6].getMonth();
  return `Week of ${fmtDayDate(ds[0])} – ${sameMonth ? ds[6].getDate() : fmtDayDate(ds[6])}`;
}

export function macroLine(m, { kcal = true } = {}) {
  return `${kcal ? `${fmtInt(m.calories)} kcal · ` : ''}${Math.round(m.carbs)} C · ${Math.round(m.protein)} P · ${Math.round(m.fat)} F`;
}
export function targetsLine(T) {
  return `${fmtInt(T.calories)} kcal · ${Math.round(T.carbGrams)} C · ${Math.round(T.proteinGrams)} P · ${Math.round(T.fatGrams)} F`;
}

export function useIsDesktop() {
  const get = () => window.matchMedia('(min-width: 900px)').matches;
  const [is, setIs] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const on = () => setIs(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return is;
}

export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), intervalMs); return () => clearInterval(t); }, [intervalMs]);
  return now;
}
