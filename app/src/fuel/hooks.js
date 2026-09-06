// React bindings for settings, day groups, the per-week plans and their actions.
import { useCallback, useMemo } from 'react';
import { useDoc } from '../store/store.js';
import { DEFAULT_SETTINGS, DEFAULT_DAYGROUPS, DEFAULT_MAP, DEFAULT_LIST, DEFAULT_STATS, DEFAULT_PLANS } from '../store/defaults.js';
import { useToast } from '../ui/index.jsx';
import * as ops from '../core/planOps.js';
import { DAYS_NAMES, round1 } from '../core/index.js';
import { isoDate, todayIso, addDaysIso } from './dates.js';

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
export function usePlanActions(weekStart) {
  const [plans] = usePlansDoc();
  const [, setWeek] = useWeekPlan(weekStart);
  const T = useTargets();
  const [dg] = useDayGroups();
  const overrides = useOverrides();
  const toast = useToast();

  const warnZone = useCallback((zone, context) => {
    if (zone.ok) return;
    toast(`${context} the day is outside the 95–105% zone: ${ops.zoneText(zone)}. Swap again or regenerate.`, { kind: 'warn' });
  }, [toast]);

  const generate = useCallback(() => {
    if (!T.pctValid) { toast('Macro percentages must add up to 100% — fix them in Settings › Targets.', { kind: 'warn' }); return false; }
    const included = [0, 1, 2, 3, 4, 5, 6].filter((d) => !dg.excluded.includes(d));
    if (!included.length) { toast('Every day is a free day — nothing to plan.', { kind: 'warn' }); return false; }
    const { days, groups } = ops.generateWeek({ T, overrides, groups: dg.groups, excluded: dg.excluded, mealCounts: dg.mealCounts });
    setWeek(emptyWeek(weekStart, T, { days, groups }));
    return true;
  }, [T, dg, overrides, setWeek, weekStart, toast]);

  // Copy another week's meals into this one (eaten marks and servings start fresh).
  const copyFrom = useCallback((sourceWeekStart) => {
    const src = plans.weeks && plans.weeks[sourceWeekStart];
    if (!src) return false;
    setWeek(emptyWeek(weekStart, T, { days: JSON.parse(JSON.stringify(src.days)), groups: { ...(src.groups || {}) }, tags: { ...(src.tags || {}) }, copiedFrom: sourceWeekStart }));
    return true;
  }, [plans, setWeek, weekStart, T]);

  const regenerate = useCallback((selection) => {
    if (!T.pctValid) { toast('Macro percentages must add up to 100%.', { kind: 'warn' }); return; }
    setWeek((prev) => {
      if (!prev) return prev;
      const r = ops.regenerateDays({ days: prev.days, planGroups: prev.groups, selection, T, overrides, groups: dg.groups, excluded: dg.excluded, mealCounts: dg.mealCounts });
      if (!r) return prev;
      return { ...prev, days: r.days, groups: r.groups, eaten: ops.dropDayKeys(prev.eaten, r.regenSet), servings: ops.dropDayKeys(prev.servings, r.regenSet), tags: ops.dropDayKeys(prev.tags, r.regenSet) };
    });
  }, [T, dg, overrides, setWeek, toast]);

  const swap = useCallback((di, mi, recipe, isAdd = false) => {
    let zone = null;
    setWeek((prev) => {
      const base = prev || emptyWeek(weekStart, T);
      const r = ops.swapMeal({ days: base.days, planGroups: base.groups, di, mi, recipe, T, overrides, isAdd });
      zone = r.zone;
      return { ...base, days: r.days };
    });
    if (zone) warnZone(zone, isAdd ? 'After adding a meal' : 'After the swap');
  }, [T, overrides, setWeek, weekStart, warnZone]);

  const remove = useCallback((di, mi) => {
    let result = null;
    setWeek((prev) => {
      if (!prev) return prev;
      const r = ops.removeMeal({ days: prev.days, planGroups: prev.groups, di, mi, T, overrides });
      if (!r) return prev;
      result = r;
      return { ...prev, days: r.days, eaten: ops.dropDayKeys(prev.eaten, r.members), servings: ops.dropDayKeys(prev.servings, r.members), tags: ops.dropDayKeys(prev.tags, r.members) };
    });
    if (result && !result.isEmpty) warnZone(result.zone, 'After removing a meal');
  }, [T, overrides, setWeek, warnZone]);

  const dropShake = useCallback((di) => {
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
  }, [T, overrides, setWeek, toast]);

  const toggleEaten = useCallback((di, mi) => {
    setWeek((prev) => {
      if (!prev) return prev;
      const key = `${di}-${mi}`;
      const eaten = { ...prev.eaten };
      if (eaten[key]) delete eaten[key]; else eaten[key] = true;
      return { ...prev, eaten };
    });
  }, [setWeek]);

  // Servings are per day only (not group-aware): they scale the grocery list, nothing else.
  const setServing = useCallback((di, mi, val) => {
    setWeek((prev) => {
      if (!prev) return prev;
      const key = `${di}-${mi}`;
      const servings = { ...prev.servings };
      const v = Math.max(1, val);
      if (v === 1) delete servings[key]; else servings[key] = v;
      return { ...prev, servings };
    });
  }, [setWeek]);

  // Batch / fresh tag. Default is batch; 'fresh' meals are cooked on the day and stay out of Cook Day.
  const toggleTag = useCallback((di, mi) => {
    setWeek((prev) => {
      if (!prev) return prev;
      const members = ops.planGroupMembers(prev.days, prev.groups, di);
      const key = `${di}-${mi}`;
      const nextVal = prev.tags[key] === 'fresh' ? 'batch' : 'fresh';
      const tags = { ...prev.tags };
      members.forEach((d) => { const k = `${d}-${mi}`; if (nextVal === 'batch') delete tags[k]; else tags[k] = 'fresh'; });
      return { ...prev, tags };
    });
  }, [setWeek]);

  const clearWeek = useCallback(() => setWeek(null), [setWeek]);

  return useMemo(() => ({ generate, copyFrom, regenerate, swap, remove, dropShake, toggleEaten, setServing, toggleTag, clearWeek }),
    [generate, copyFrom, regenerate, swap, remove, dropShake, toggleEaten, setServing, toggleTag, clearWeek]);
}

export { todayIso };
