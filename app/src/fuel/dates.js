// Date helpers. Dates travel as local ISO strings (YYYY-MM-DD); weeks are keyed by their Monday.
export function pad2(n) { return String(n).padStart(2, '0'); }
export function isoDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
export function parseIso(iso) { const [y, m, d] = String(iso).split('-').map(Number); return new Date(y, m - 1, d); }
export function todayIso() { return isoDate(new Date()); }
export function todayIndex() { return (new Date().getDay() + 6) % 7; }
export function mondayOf(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}
export function weekStartOf(iso) { return isoDate(mondayOf(parseIso(iso))); }
export function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
export function addDaysIso(iso, n) { return isoDate(addDays(parseIso(iso), n)); }
export function weekdayIndex(iso) { return (parseIso(iso).getDay() + 6) % 7; }
