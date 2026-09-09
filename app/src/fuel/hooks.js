// React bindings for settings, day groups, the per-week plans and their actions.
import { useCallback, useMemo } from 'react';
import { useDoc } from '../store/store.js';
import { DEFAULT_SETTINGS, DEFAULT_DAYGROUPS, DEFAULT_MAP, DEFAULT_LIST, DEFAULT_STATS, DEFAULT_PLANS } from '../store/defaults.js';
import { useToast } from '../ui/index.jsx';
import * as ops from '../core/planOps.js';
import { DAYS_NAMES, round1 } from '../core/index.js';
import { isoDate, todayIso, addDaysIso, weekStartOf, weekdayIndex } from './dates.js';

export { isoDate, mondayOf, todayIndex } from './dates.js';

export function useSettings() {
  const [doc, set] = useDoc('settings', DEFAULT_SETTINGS);
  const settings = useMemo(() => ({
    ...DEFAULT_SETTINGS, ...doc,
    targets: { ...DEFAULT_SETTINGS.targets, ...(doc.targets || {}) },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(doc.notifications || {}) },
  }), [doc]);
  const patch = useCallback((p) => set((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...(typeof p === 'function' ? p(prev) : p) })), [set]);
  return [settings, patch];
}

export function useTargets() {
  const [settings] = useSettings();
  return useMemo(() => ops.targetsFrom(settings.targets), [settings.targets]);
}

export function useDayGroups() {
  const [doc, set] = useDoc('daygroups', DEFAULT_DAYGROUPS);
  const dg = useMemo(() => ({ ...DEFAULT_DAYGROUPS, ...doc }), [doc]);
  const patch = useCallback((p) => set((prev) => ({ ...DEFAULT_DAYGROUPS, ...prev, ...(typeof p === 'function' ? p({ ...DEFAULT_DAYGROUPS, ...prev }) : p) })), [set]);
  return [dg, patch];
}

export function useUnits() {
  const [dg] = useDayGroups();
  return useMemo(() => ops.planningUnits(dg.groups, dg.excluded, dg.mealCounts), [dg]);
}

export function useOverrides() { return useDoc('overrides', DEFAULT_MAP)[0]; }
export function useSavedPlans() { return useDoc('savedPlans', DEFAULT_LIST); }
export function useStats() { return useDoc('stats', DEFAULT_STATS); }

export function useFavorites() {
  const [favs, set] = useDoc('favorites', DEFAULT_MAP);
  const toggle = useCallback((name) => {
    if (!name) return;
    set((prev) => { const next = { ...prev }; if (next[name]) delete next[name]; else next[name] = true; return next; });
  }, [set]);
  return [favs, toggle];
}

// ---------- plans: one document, one entry per week keyed by its Monday ----------
export function usePlansDoc() { return useDoc('plans', DEFAULT_PLANS); }

// The plan for one week (null when that week has no plan) and a setter that takes a value or an
// updater; setting null removes the week.
export function useWeekPlan(weekStart) {
  const [plans, setPlans] = usePlansDoc();
  const week = (plans.weeks && plans.weeks[weekStart]) || null;
  const setWeek = useCallback((next) => setPlans((prev) => {
    const weeks = { ...((prev && prev.weeks) || {}) };
    const cur = weeks[weekStart] || null;
    const val = typeof next === 'function' ? next(cur) : next;
    if (val === cur) return prev;
    if (val == null) delete weeks[weekStart]; else weeks[weekStart] = val;
    return { ...prev, weeks };
  }), [setPlans, weekStart]);
  return [week, setWeek];
}

export function emptyWeek(weekStart, T, extra = {}) {
  return { days: Array(7).fill(null), groups: {}, eaten: {}, servings: {}, tags: {}, createdAt: new Date().toISOString(), weekStart, targets: T, ...extra };
}

// Record every ticked meal across the given weeks as one stats entry (the old app's "Log Meals").
export function recordEatenMeals(stats, weeks, T) {
  const now = new Date();
  const dateStr = isoDate(now);
  const meals = [];
  const totals = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  let daysWithMeals = 0;
  const ingredientGrams = {};
  const cuisines = {};
  weeks.forEach((week) => week.days.forEach((day, di) => {
    if (!day) return;
    let dayAte = false;
    day.meals.forEach((meal, mi) => {
      if (!week.eaten[`${di}-${mi}`]) return;
      dayAte = true;
      meals.push({ recipe: meal.name, cuisine: meal.cuisine, day: DAYS_NAMES[di], date: week.weekStart ? addDaysIso(week.weekStart, di) : undefined, calories: round1(meal.totalMacros.calories), carbs: round1(meal.totalMacros.carbs), protein: round1(meal.totalMacros.protein), fat: round1(meal.totalMacros.fat) });
      cuisines[meal.cuisine] = (cuisines[meal.cuisine] || 0) + 1;
      meal.ingredients.forEach((ing) => { if (!ing.isSpice) ingredientGrams[ing.name] = (ingredientGrams[ing.name] || 0) + ing.grams; });
      totals.calories += meal.totalMacros.calories; totals.carbs += meal.totalMacros.carbs;
      totals.protein += meal.totalMacros.protein; totals.fat += meal.totalMacros.fat;
    });
    if (dayAte) daysWithMeals++;
  }));
  if (meals.length === 0) return null;
  const n = Math.max(daysWithMeals, 1);
  const avg = { calories: round1(totals.calories / n), carbs: round1(totals.carbs / n), protein: round1(totals.protein / n), fat: round1(totals.fat / n) };
  const score = (v, t) => Math.max(0, 100 - Math.abs((v / t) * 100 - 100) * 3);
  const macroScore = (score(avg.calories, T.calories) + score(avg.carbs, T.carbGrams) + score(avg.protein, T.proteinGrams) + score(avg.fat, T.fatGrams)) / 4;
  const varietyS = Math.min(20, Object.keys(cuisines).length * 4);
  const entry = {
    id: `${dateStr}-${now.getTime()}`, date: dateStr,
    targets: { calories: T.calories, carbs: T.carbGrams, protein: T.proteinGrams, fat: T.fatGrams },
    avgDaily: avg, daysWithMeals, meals, cuisines, ingredientGrams,
    consistencyScore: Math.round(Math.min(100, macroScore * 0.8 + varietyS)), totalMeals: meals.length,
  };
  return { ...stats, plans: [...(stats.plans || []), entry] };
}

// Ticked meals across every week, and the action that logs them all and clears the ticks.
export function useLogEaten() {
  const [plans, setPlans] = usePlansDoc();
  const [, setStats] = useStats();
  const T = useTargets();
  const toast = useToast();
  const count = useMemo(() => Object.values(plans.weeks || {}).reduce((n, w) => n + Object.keys(w.eaten || {}).length, 0), [plans]);
  const logEaten = useCallback(() => {
    let logged = 0;
    setPlans((prev) => {
      const weeks = Object.values((prev && prev.weeks) || {});
      const ticked = weeks.reduce((n, w) => n + Object.keys(w.eaten || {}).length, 0);
      if (!ticked) return prev;
      setStats((stats) => recordEatenMeals(stats, weeks, T) || stats);
      logged = ticked;
      const cleared = {};
      Object.entries(prev.weeks).forEach(([k, w]) => { cleared[k] = { ...w, eaten: {} }; });
      return { ...prev, weeks: cleared };
    });
    if (logged) toast(`Logged ${logged} meal${logged === 1 ? '' : 's'}.`, { kind: 'ok' });
    else toast('Tick the meals you ate first.', { kind: 'warn' });
  }, [setPlans, setStats, T, toast]);
  return { count, logEaten };
}

// Actions on one week's plan. Every edit goes through planOps, then setWeek.
// Plan actions for any week: `actionsFor(weekStart)` returns the same set usePlanActions() does,
// bound to that week — the desktop list spans week documents, so each row binds its own.
export function usePlanActionsFor() {
  const [, setPlans] = usePlansDoc();
  const T = useTargets();
  const [dg] = useDayGroups();
  const overrides = useOverrides();
  const toast = useToast();

  return useCallback((weekStart) => {
    const setWeek = (next) => setPlans((prev) => {
      const weeks = { ...((prev && prev.weeks) || {}) };
      const cur = weeks[weekStart] || null;
      const val = typeof next === 'function' ? next(cur) : next;
      if (val === cur) return prev;
      if (val == null) delete weeks[weekStart]; else weeks[weekStart] = val;
      return { ...prev, weeks };
    });
    const warnZone = (zone, context) => {
      if (zone.ok) return;
      toast(`${context} the day is outside the 95–105% zone: ${ops.zoneText(zone)}. Swap again or regenerate.`, { kind: 'warn' });
    };

    const regenerate = (selection) => {
      if (!T.pctValid) { toast('Macro percentages must add up to 100%.', { kind: 'warn' }); return; }
      setWeek((prev) => {
        const base = prev || emptyWeek(weekStart, T);
        const r = ops.regenerateDays({ days: base.days, planGroups: base.groups, selection, T, overrides, groups: dg.groups, excluded: dg.excluded, mealCounts: dg.mealCounts, gen: Date.now() });
        if (!r) return prev;
        return { ...base, days: r.days, groups: r.groups, eaten: ops.dropDayKeys(base.eaten, r.regenSet), servings: ops.dropDayKeys(base.servings, r.regenSet), tags: ops.dropDayKeys(base.tags, r.regenSet) };
      });
    };

    const swap = (di, mi, recipe, isAdd = false) => {
      let zone = null;
      setWeek((prev) => {
        const base = prev || emptyWeek(weekStart, T);
        const r = ops.swapMeal({ days: base.days, planGroups: base.groups, di, mi, recipe, T, overrides, isAdd });
        zone = r.zone;
        return { ...base, days: r.days };
      });
      if (zone) warnZone(zone, isAdd ? 'After adding a meal' : 'After the swap');
    };

    const remove = (di, mi) => {
      let result = null;
      setWeek((prev) => {
        if (!prev) return prev;
        const r = ops.removeMeal({ days: prev.days, planGroups: prev.groups, di, mi, T, overrides });
        if (!r) return prev;
        result = r;
        return { ...prev, days: r.days, eaten: ops.dropDayKeys(prev.eaten, r.members), servings: ops.dropDayKeys(prev.servings, r.members), tags: ops.dropDayKeys(prev.tags, r.members) };
      });
      if (result && !result.isEmpty) warnZone(result.zone, 'After removing a meal');
    };

    const dropShake = (di) => {
      let result = null;
      setWeek((prev) => {
        if (!prev) return prev;
        const r = ops.removeShake({ days: prev.days, planGroups: prev.groups, di, T, overrides });
        if (!r) return prev;
        result = r;
        const eaten = { ...prev.eaten };
        r.members.forEach((d) => { delete eaten[`${d}-${r.shakeSlot}`]; });
        return { ...prev, days: r.days, eaten };
      });
      if (result && !result.zone.ok) toast(`Shake removed. Without it the day is off-zone: ${ops.zoneText(result.zone)} — that's the trade-off. Regenerating the day re-enables shakes.`, { kind: 'warn' });
    };

    const toggleEaten = (di, mi) => {
      setWeek((prev) => {
        if (!prev) return prev;
        const key = `${di}-${mi}`;
        const eaten = { ...prev.eaten };
        if (eaten[key]) delete eaten[key]; else eaten[key] = true;
        return { ...prev, eaten };
      });
    };

    // Servings are per day only (not group-aware): they scale the grocery list, nothing else.
    const setServing = (di, mi, val) => {
      setWeek((prev) => {
        if (!prev) return prev;
        const key = `${di}-${mi}`;
        const servings = { ...prev.servings };
        const v = Math.max(1, val);
        if (v === 1) delete servings[key]; else servings[key] = v;
        return { ...prev, servings };
      });
    };

    // Batch / fresh tag. Default is batch; 'fresh' meals are cooked on the day and stay out of Cook Day.
    const toggleTag = (di, mi) => {
      setWeek((prev) => {
        if (!prev) return prev;
        const members = ops.planGroupMembers(prev.days, prev.groups, di);
        const key = `${di}-${mi}`;
        const nextVal = prev.tags[key] === 'fresh' ? 'batch' : 'fresh';
        const tags = { ...prev.tags };
        members.forEach((d) => { const k = `${d}-${mi}`; if (nextVal === 'batch') delete tags[k]; else tags[k] = 'fresh'; });
        return { ...prev, tags };
      });
    };

    const clearWeek = () => setWeek(null);

    return { regenerate, swap, remove, dropShake, toggleEaten, setServing, toggleTag, clearWeek };
  }, [setPlans, T, dg, overrides, toast]);
}

export function usePlanActions(weekStart) {
  const actionsFor = usePlanActionsFor();
  return useMemo(() => actionsFor(weekStart), [actionsFor, weekStart]);
}

// Generate: a rolling window of n days from any date, mapped onto the week documents it
// touches. Groups are weekday patterns, so a Thu–Sat group inside the window is still planned as
// one shared plan; a group only partly inside plans just its in-window days. Recipes used earlier
// in the same window seed later weeks so nothing repeats across the Sunday/Monday boundary.
export function useRangeActions() {
  const [plans, setPlans] = usePlansDoc();
  const [settings, patchSettings] = useSettings();
  const T = useTargets();
  const [dg] = useDayGroups();
  const overrides = useOverrides();
  const toast = useToast();

  const byWeek = (fromIso, n) => {
    const out = {};
    for (let i = 0; i < n; i++) {
      const iso = addDaysIso(fromIso, i);
      const ws = weekStartOf(iso);
      (out[ws] = out[ws] || []).push(weekdayIndex(iso));
    }
    return out;
  };

  const plannedCount = useCallback((fromIso, n) => {
    let count = 0;
    for (let i = 0; i < n; i++) {
      const iso = addDaysIso(fromIso, i);
      const wd = weekdayIndex(iso);
      if (dg.excluded.includes(wd)) continue;
      const w = plans.weeks && plans.weeks[weekStartOf(iso)];
      const d = w && w.days[wd];
      if (d && d.meals.length) count++;
    }
    return count;
  }, [plans, dg]);

  const generateRange = useCallback((fromIso, n) => {
    if (!T.pctValid) { toast('Macro percentages must add up to 100% — fix them in Settings › Targets.', { kind: 'warn' }); return false; }
    const gen = Date.now();
    const seedNames = {};
    let any = false;
    const groupsByWeek = byWeek(fromIso, n);
    setPlans((prev) => {
      const weeks = { ...((prev && prev.weeks) || {}) };
      Object.keys(groupsByWeek).sort().forEach((ws) => {
        const cur = weeks[ws] || emptyWeek(ws, T);
        const r = ops.regenerateDays({ days: cur.days, planGroups: cur.groups || {}, selection: groupsByWeek[ws], T, overrides, groups: dg.groups, excluded: dg.excluded, mealCounts: dg.mealCounts, expand: false, seedNames, gen });
        if (!r) return;
        any = true;
        r.names.forEach((nm) => { seedNames[nm] = true; });
        weeks[ws] = { ...cur, days: r.days, groups: r.groups, eaten: ops.dropDayKeys(cur.eaten, r.regenSet), servings: ops.dropDayKeys(cur.servings, r.regenSet), tags: ops.dropDayKeys(cur.tags, r.regenSet) };
      });
      return { ...prev, weeks };
    });
    if (!any) { toast('Every day in that range is a free day — nothing to plan.', { kind: 'warn' }); return false; }
    if (n !== settings.planDays) patchSettings({ planDays: n });
    return true;
  }, [T, dg, overrides, setPlans, settings.planDays, patchSettings, toast]);

  // Repeat the last plan: each day in the window copies the most recent earlier day with the same
  // weekday that has meals (up to eight weeks back). Eaten marks and servings start fresh.
  const copyPattern = useCallback((fromIso, n) => {
    const gen = Date.now();
    let copied = 0;
    setPlans((prev) => {
      const weeks = { ...((prev && prev.weeks) || {}) };
      for (let i = 0; i < n; i++) {
        const iso = addDaysIso(fromIso, i);
        const wd = weekdayIndex(iso);
        if (dg.excluded.includes(wd)) continue;
        const ws = weekStartOf(iso);
        let src = null, srcWeek = null;
        for (let back = 1; back <= 8 && !src; back++) {
          const sws = addDaysIso(ws, -7 * back);
          const w = weeks[sws];
          if (w && w.days[wd] && w.days[wd].meals.length) { src = w.days[wd]; srcWeek = w; }
        }
        if (!src) continue;
        const cur = weeks[ws] || emptyWeek(ws, T);
        const days = cur.days.slice();
        days[wd] = { ...JSON.parse(JSON.stringify(src)), day: wd };
        const gi = ops.findDayGroup(dg.groups, wd);
        const groups = { ...(cur.groups || {}) };
        if (gi !== -1) groups[wd] = { groupIndex: gi, gen }; else delete groups[wd];
        const tags = ops.dropDayKeys(cur.tags, [wd]);
        Object.keys(srcWeek.tags || {}).forEach((k) => { if (k.startsWith(`${wd}-`)) tags[k] = srcWeek.tags[k]; });
        weeks[ws] = { ...cur, days, groups, tags, eaten: ops.dropDayKeys(cur.eaten, [wd]), servings: ops.dropDayKeys(cur.servings, [wd]) };
        copied++;
      }
      return { ...prev, weeks };
    });
    if (copied) toast(`Copied ${copied} day${copied === 1 ? '' : 's'} from your last plan.`, { kind: 'ok' });
    else toast('No earlier plan to copy from yet.', { kind: 'warn' });
    if (copied && n !== settings.planDays) patchSettings({ planDays: n });
    return copied;
  }, [T, dg, setPlans, settings.planDays, patchSettings, toast]);

  // Something to copy from: any earlier day with meals for a weekday in the window.
  const canCopy = useCallback((fromIso, n) => {
    for (let i = 0; i < n; i++) {
      const iso = addDaysIso(fromIso, i);
      const wd = weekdayIndex(iso);
      if (dg.excluded.includes(wd)) continue;
      const ws = weekStartOf(iso);
      for (let back = 1; back <= 8; back++) {
        const w = plans.weeks && plans.weeks[addDaysIso(ws, -7 * back)];
        if (w && w.days[wd] && w.days[wd].meals.length) return true;
      }
    }
    return false;
  }, [plans, dg]);

  return useMemo(() => ({ generateRange, copyPattern, plannedCount, canCopy }), [generateRange, copyPattern, plannedCount, canCopy]);
}

export { todayIso };
