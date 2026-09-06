// Grocery list for a rolling window of dates, across week documents. Free days are skipped and
// the "Day N" labels grocery.js writes into `appearances` become weekday names.
import { buildGroceryList } from '../core/index.js';
import { weekStartOf, weekdayIndex, addDaysIso, parseIso } from './dates.js';
import { fmtDayDate } from './common.js';
import { SHORT_DAYS } from '../core/planOps.js';

export function windowDates(fromIso, n) { return Array.from({ length: Math.max(1, n) }, (_, i) => addDaysIso(fromIso, i)); }

export function daysForWindow(plans, dg, fromIso, n) {
  return windowDates(fromIso, n).map((iso) => {
    const wd = weekdayIndex(iso);
    if (dg.excluded.includes(wd)) return { iso, wd, day: null, week: null, free: true };
    const week = (plans.weeks && plans.weeks[weekStartOf(iso)]) || null;
    return { iso, wd, day: (week && week.days[wd]) || null, week, free: false };
  });
}

export function groceryForWindow(plans, dg, fromIso, n) {
  const entries = daysForWindow(plans, dg, fromIso, n);
  const arr = [];
  const servings = {};
  let scoops = 0;
  entries.forEach((e, i) => {
    arr.push(e.day);
    if (!e.day) return;
    if (e.day.proteinShake) scoops += e.day.proteinShake.scoops;
    e.day.meals.forEach((_, mi) => { const v = e.week.servings && e.week.servings[`${e.wd}-${mi}`]; if (v) servings[`${i}-${mi}`] = v; });
  });
  const list = buildGroceryList(arr, servings);
  list.forEach((section) => section.items.forEach((item) => {
    item.appearances = item.appearances.map((a) => a.replace(/^Day (\d+)/, (_, k) => { const e = entries[Number(k) - 1]; return e ? `${SHORT_DAYS[e.wd]} ${fmtDayDate(parseIso(e.iso))}` : `Day ${k}`; }));
  }));
  return { list, scoops, planned: entries.filter((e) => e.day && e.day.meals.length).length, entries };
}
