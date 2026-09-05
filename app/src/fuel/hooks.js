// React bindings for settings, day groups, the current plan and its actions.
import { useCallback, useMemo } from 'react';
import { useDoc } from '../store/store.js';
import { DEFAULT_SETTINGS, DEFAULT_DAYGROUPS, DEFAULT_MAP, DEFAULT_LIST, DEFAULT_STATS } from '../store/defaults.js';
import { useToast } from '../ui/index.jsx';
import * as ops from '../core/planOps.js';
import { DAYS_NAMES, round1 } from '../core/index.js';

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

export function usePlanDoc() { return useDoc('plan', null); }
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

// Monday of the week containing `date`, as YYYY-MM-DD (local time).
export function mondayOf(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
export function isoDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function todayIndex() { return (new Date().getDay() + 6) % 7; }

// Record the checked meals into stats (old app's "Log Meals"): one entry per logging action.
export function recordEatenMeals(stats, days, eatenMap, T) {
  const now = new Date();
  const dateStr = isoDate(now);
  const meals = [];
  const weekTotals = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  let daysWithMeals = 0;
  const ingredientGrams = {};
  const cuisines = {};
  days.forEach((day, di) => {
    if (!day) return;
    let dayAte = false;
    day.meals.forEach((meal, mi) => {
      if (!eatenMap[`${di}-${mi}`]) return;
      dayAte = true;
      meals.push({ recipe: meal.name, cuisine: meal.cuisine, day: DAYS_NAMES[di], calories: round1(meal.totalMacros.calories), carbs: round1(meal.totalMacros.carbs), protein: round1(meal.totalMacros.protein), fat: round1(meal.totalMacros.fat) });
      cuisines[meal.cuisine] = (cuisines[meal.cuisine] || 0) + 1;
      meal.ingredients.forEach((ing) => { if (!ing.isSpice) ingredientGrams[ing.name] = (ingredientGrams[ing.name] || 0) + ing.grams; });
      weekTotals.calories += meal.totalMacros.calories; weekTotals.carbs += meal.totalMacros.carbs;
      weekTotals.protein += meal.totalMacros.protein; weekTotals.fat += meal.totalMacros.fat;
    });
    if (dayAte) daysWithMeals++;
  });
  if (meals.length === 0) return null;
  const n = Math.max(daysWithMeals, 1);
  const avg = { calories: round1(weekTotals.calories / n), carbs: round1(weekTotals.carbs / n), protein: round1(weekTotals.protein / n), fat: round1(weekTotals.fat / n) };
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

export function usePlanActions() {
  const [, setPlanDoc] = usePlanDoc();
  const T = useTargets();
  const [dg] = useDayGroups();
  const overrides = useOverrides();
  const [, setStats] = useStats();
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
    setPlanDoc({ days, groups, eaten: {}, servings: {}, tags: {}, createdAt: new Date().toISOString(), weekStart: isoDate(mondayOf(new Date())), targets: T });
    return true;
  }, [T, dg, overrides, setPlanDoc, toast]);

  const regenerate = useCallback((selection) => {
    if (!T.pctValid) { toast('Macro percentages must add up to 100%.', { kind: 'warn' }); return; }
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const r = ops.regenerateDays({ days: prev.days, planGroups: prev.groups, selection, T, overrides, groups: dg.groups, excluded: dg.excluded, mealCounts: dg.mealCounts });
      if (!r) return prev;
      return { ...prev, days: r.days, groups: r.groups, eaten: ops.dropDayKeys(prev.eaten, r.regenSet), servings: ops.dropDayKeys(prev.servings, r.regenSet), tags: ops.dropDayKeys(prev.tags, r.regenSet) };
    });
  }, [T, dg, overrides, setPlanDoc, toast]);

  const swap = useCallback((di, mi, recipe, isAdd = false) => {
    let zone = null;
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const r = ops.swapMeal({ days: prev.days, planGroups: prev.groups, di, mi, recipe, T, overrides, isAdd });
      zone = r.zone;
      return { ...prev, days: r.days };
    });
    if (zone) warnZone(zone, isAdd ? 'After adding a meal' : 'After the swap');
  }, [T, overrides, setPlanDoc, warnZone]);

  const remove = useCallback((di, mi) => {
    let result = null;
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const r = ops.removeMeal({ days: prev.days, planGroups: prev.groups, di, mi, T, overrides });
      if (!r) return prev;
      result = r;
      return { ...prev, days: r.days, eaten: ops.dropDayKeys(prev.eaten, r.members), servings: ops.dropDayKeys(prev.servings, r.members), tags: ops.dropDayKeys(prev.tags, r.members) };
    });
    if (result && !result.isEmpty) warnZone(result.zone, 'After removing a meal');
  }, [T, overrides, setPlanDoc, warnZone]);

  const dropShake = useCallback((di) => {
    let result = null;
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const r = ops.removeShake({ days: prev.days, planGroups: prev.groups, di, T, overrides });
      if (!r) return prev;
      result = r;
      const eaten = { ...prev.eaten };
      r.members.forEach((d) => { delete eaten[`${d}-${r.shakeSlot}`]; });
      return { ...prev, days: r.days, eaten };
    });
    if (result && !result.zone.ok) toast(`Shake removed. Without it the day is off-zone: ${ops.zoneText(result.zone)} — that's the trade-off. Regenerating the day re-enables shakes.`, { kind: 'warn' });
  }, [T, overrides, setPlanDoc, toast]);

  const toggleEaten = useCallback((di, mi) => {
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const key = `${di}-${mi}`;
      const eaten = { ...prev.eaten };
      if (eaten[key]) delete eaten[key]; else eaten[key] = true;
      return { ...prev, eaten };
    });
  }, [setPlanDoc]);

  // Servings are per day only (not group-aware): they scale the grocery list, nothing else.
  const setServing = useCallback((di, mi, val) => {
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const key = `${di}-${mi}`;
      const servings = { ...prev.servings };
      const v = Math.max(1, val);
      if (v === 1) delete servings[key]; else servings[key] = v;
      return { ...prev, servings };
    });
  }, [setPlanDoc]);

  // Batch / fresh tag. Default is batch; 'fresh' meals are cooked on the day and stay out of Cook Day.
  const toggleTag = useCallback((di, mi) => {
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const members = ops.planGroupMembers(prev.days, prev.groups, di);
      const key = `${di}-${mi}`;
      const nextVal = prev.tags[key] === 'fresh' ? 'batch' : 'fresh';
      const tags = { ...prev.tags };
      members.forEach((d) => { const k = `${d}-${mi}`; if (nextVal === 'batch') delete tags[k]; else tags[k] = 'fresh'; });
      return { ...prev, tags };
    });
  }, [setPlanDoc]);

  const logEaten = useCallback(() => {
    let count = 0;
    setPlanDoc((prev) => {
      if (!prev) return prev;
      const eatenKeys = Object.keys(prev.eaten || {});
      if (!eatenKeys.length) return prev;
      setStats((stats) => recordEatenMeals(stats, prev.days, prev.eaten, T) || stats);
      count = eatenKeys.length;
      return { ...prev, eaten: {} };
    });
    if (count) toast(`Logged ${count} meal${count === 1 ? '' : 's'}.`, { kind: 'ok' });
    else toast('Tick the meals you ate first.', { kind: 'warn' });
  }, [setPlanDoc, setStats, T, toast]);

  const clearPlan = useCallback(() => setPlanDoc(null), [setPlanDoc]);

  return useMemo(() => ({ generate, regenerate, swap, remove, dropShake, toggleEaten, setServing, toggleTag, logEaten, clearPlan }),
    [generate, regenerate, swap, remove, dropShake, toggleEaten, setServing, toggleTag, logEaten, clearPlan]);
}
