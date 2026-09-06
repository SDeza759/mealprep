// Pure plan operations, ported from the old index.html App component. Every function takes the
// current plan and returns a new one — no React, no storage. The semantics that matter (see
// CLAUDE.md "Key Decisions") are preserved exactly:
//   • grouped days stay identical: an edit is computed ONCE from the interacted day and cloned to
//     every member of that day's plan-time group;
//   • manual re-solves anchor at the recipe as written (baseMealIngredients), never at the previous
//     solution;
//   • shakes stay rare: shakeless in-zone first, planned shake second, and the >10%-low safety net;
//     a day whose shake the user removed (noShake) never gets one back until it is regenerated;
//   • the plan is a dense 7-array with nulls for days that have no entry.
import {
  RECIPES, PROTEIN_SHAKE, DAYS_NAMES, adjustDayMeals, solveDayShakeAware,
  applyIngredientOverrides, selectVariant, round1, generatePlan,
} from './index.js';

export const DEFAULT_MEALS = 2;
export const MIN_MEALS = 1;
export const MAX_MEALS = 6;
export const SHORT_DAYS = DAYS_NAMES.map((d) => d.slice(0, 3));
export const EMPTY_TOTALS = Object.freeze({ calories: 0, carbs: 0, protein: 0, fat: 0 });
// Stand-in for a day with no plan entry. Read-only — never mutate it.
export const EMPTY_DAY = Object.freeze({ meals: [], totals: EMPTY_TOTALS, proteinShake: null });

// ---------- targets ----------
export function targetsFrom(t) {
  const calories = Number(t.calories) || 0;
  const carbPct = Number(t.carbPct) || 0, proteinPct = Number(t.proteinPct) || 0, fatPct = Number(t.fatPct) || 0;
  const pctSum = carbPct + proteinPct + fatPct;
  return {
    calories,
    carbGrams: round1((calories * (carbPct / 100)) / 4),
    proteinGrams: round1((calories * (proteinPct / 100)) / 4),
    fatGrams: round1((calories * (fatPct / 100)) / 9),
    pctSum,
    pctValid: pctSum === 100 && calories > 0,
  };
}

const MACROS = [
  { key: 'calories', tKey: 'calories', label: 'Calories' },
  { key: 'carbs', tKey: 'carbGrams', label: 'Carbs' },
  { key: 'protein', tKey: 'proteinGrams', label: 'Protein' },
  { key: 'fat', tKey: 'fatGrams', label: 'Fat' },
];

export function macroPcts(totals, T) {
  const out = {};
  for (const m of MACROS) out[m.key] = T[m.tKey] > 0 ? (totals[m.key] / T[m.tKey]) * 100 : 0;
  return out;
}

// The [95%,105%] zone on all four macros — the only fixed rule in the solver.
export function zoneCheck(totals, T) {
  const pcts = macroPcts(totals, T);
  const off = [];
  for (const m of MACROS) {
    const p = pcts[m.key];
    if (p < 95) off.push({ key: m.key, label: m.label, dir: 'low', pct: Math.round(p) });
    else if (p > 105) off.push({ key: m.key, label: m.label, dir: 'high', pct: Math.round(p) });
  }
  return { ok: off.length === 0, off, pcts };
}

export function zoneText(zone) {
  if (zone.ok) return 'All four inside the 95–105% zone';
  return zone.off.map((o) => `${o.label} ${o.dir} (${o.pct}%)`).join(' · ');
}

// ---------- day groups ----------
export function findDayGroup(groups, d) {
  for (let i = 0; i < groups.length; i++) if (groups[i].includes(d)) return i;
  return -1;
}
export function mealCountFor(mealCounts, d) { return (mealCounts && mealCounts[d]) || DEFAULT_MEALS; }

// `mealCounts` is sparse — densify before generating so what you see is what you get.
export function resolvedMealCounts(mealCounts) {
  const out = {};
  for (let d = 0; d < 7; d++) out[d] = mealCountFor(mealCounts, d);
  return out;
}

// Every day in a group must show one meal count; the group's lowest day index wins.
export function normalizedCounts(groups, mealCounts) {
  const next = { ...(mealCounts || {}) };
  (groups || []).forEach((g) => {
    if (!g.length) return;
    const lead = Math.min(...g);
    const val = next[lead] || DEFAULT_MEALS;
    g.forEach((d) => { next[d] = val; });
  });
  return next;
}

export function unitName(days) {
  if (days.length === 1) return SHORT_DAYS[days[0]];
  const sorted = days.slice().sort((a, b) => a - b);
  const consecutive = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (consecutive) return `${SHORT_DAYS[sorted[0]]}–${SHORT_DAYS[sorted[sorted.length - 1]]}`;
  return sorted.map((d) => SHORT_DAYS[d]).join(' · ');
}

// The units the user plans against: one per group plus each ungrouped day; free days dropped.
export function planningUnits(groups, excluded, mealCounts) {
  const units = [];
  const seen = {};
  (groups || []).forEach((g, gi) => {
    const active = g.filter((d) => !excluded.includes(d));
    if (!active.length) return;
    active.forEach((d) => { seen[d] = true; });
    const lead = Math.min(...active);
    units.push({ key: `g${gi}`, groupIndex: gi, name: unitName(active), days: active, lead, meals: mealCountFor(mealCounts, lead) });
  });
  for (let d = 0; d < 7; d++) {
    if (seen[d] || excluded.includes(d)) continue;
    units.push({ key: `d${d}`, groupIndex: -1, name: SHORT_DAYS[d], days: [d], lead: d, meals: mealCountFor(mealCounts, d) });
  }
  units.sort((a, b) => a.lead - b.lead);
  return units;
}

export function unitForDay(units, d) { return units.find((u) => u.days.includes(d)) || null; }

// Snapshot of group membership at generation time: { dayIndex: { groupIndex } }.
export function groupSnapshot(groups) {
  const out = {};
  for (let d = 0; d < 7; d++) {
    const gi = findDayGroup(groups || [], d);
    if (gi !== -1) out[d] = { groupIndex: gi };
  }
  return out;
}

// Days that share di's group in the CURRENT plan (includes di), based on the generation-time
// snapshot so an edit propagates to exactly the days the user sees grouped.
export function planGroupMembers(days, planGroups, di) {
  const entry = planGroups && planGroups[di];
  if (!entry || !days) return [di];
  const members = [];
  for (let d = 0; d < 7; d++) {
    const e = planGroups[d];
    if (e && e.groupIndex === entry.groupIndex && days[d]) members.push(d);
  }
  return members.length ? members : [di];
}

// ---------- solving ----------
// Re-anchor a meal's solve window at the recipe AS WRITTEN. Falls back to the meal's current
// ingredients when the recipe no longer exists (renames orphan old saved plans).
export function baseMealIngredients(meal) {
  const recipe = RECIPES.find((r) => r.name === (meal.originalName || meal.name));
  if (!recipe) return meal.ingredients;
  let src = recipe.ingredients;
  if (meal.variantLabel && recipe.variants) {
    const v = recipe.variants.find((x) => x.label === meal.variantLabel);
    if (v) src = v.ingredients;
  }
  return src;
}

function mealDataFor(meals, overrides) {
  return meals.map((m) => {
    const ings = baseMealIngredients(m).map((i) => ({ ...i, adjustment: null }));
    applyIngredientOverrides(ings, overrides || {});
    return {
      recipe: { name: m.name, tags: m.isBreakfast ? ['breakfast'] : [], selectedVariant: m.variantLabel ? { label: m.variantLabel } : null },
      ingredients: ings,
    };
  });
}

function sumMacros(ings) {
  const t = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  ings.forEach((i) => { if (i.isSpice) return; t.calories += i.calories; t.carbs += i.carbs; t.protein += i.protein; t.fat += i.fat; });
  return t;
}
function roundTotals(t) { return { calories: round1(t.calories), carbs: round1(t.carbs), protein: round1(t.protein), fat: round1(t.fat) }; }
function cloneMeal(meal) { return { ...meal, ingredients: meal.ingredients.map((i) => ({ ...i })) }; }

// Rebuild one day from a fixed meal list. `shakeless` is the remove-shake path: plain solve,
// no shake, and the day is marked noShake so later edits don't sneak one back.
function computeDay(srcDay, meals, T, overrides, { shakeless = false } = {}) {
  const isEmpty = meals.length === 0;
  const noShake = shakeless || !!srcDay.noShake;
  let mealData = mealDataFor(meals, overrides);
  let planShake = false;
  if (!isEmpty) {
    if (noShake) {
      adjustDayMeals(mealData, T.calories, T.carbGrams, T.proteinGrams, T.fatGrams);
    } else {
      const solved = solveDayShakeAware(mealData, T.calories, T.carbGrams, T.proteinGrams, T.fatGrams);
      mealData = solved.mealData;
      planShake = solved.planShake;
    }
  }
  const totals = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  const rebuilt = mealData.map((md, idx) => {
    const mt = sumMacros(md.ingredients);
    totals.calories += mt.calories; totals.carbs += mt.carbs; totals.protein += mt.protein; totals.fat += mt.fat;
    const src = meals[idx];
    return {
      originalName: src.originalName || src.name, name: src.name, cuisine: src.cuisine,
      isBreakfast: md.recipe.tags.includes('breakfast'), variantLabel: src.variantLabel || null,
      ingredients: md.ingredients, totalMacros: mt,
    };
  });
  // A PLANNED shake is unconditional (the solve budgeted for it); otherwise the >10%-low net.
  let proteinShake = null;
  if (!isEmpty && !noShake && (planShake || T.proteinGrams - totals.protein > T.proteinGrams * 0.10)) {
    proteinShake = { ...PROTEIN_SHAKE };
    totals.calories += proteinShake.calories; totals.carbs += proteinShake.carbs;
    totals.protein += proteinShake.protein; totals.fat += proteinShake.fat;
  }
  const day = { ...srcDay, meals: rebuilt, totals: roundTotals(totals), proteinShake };
  if (shakeless) day.noShake = true;
  return day;
}

// Array.from over all 7 indices — the plan may hold nulls and map would skip holes.
function writeMembers(days, members, computedDay) {
  const memberSet = new Set(members);
  return Array.from({ length: 7 }, (_, dayI) => {
    if (!memberSet.has(dayI)) return days[dayI] || null;
    const cloned = JSON.parse(JSON.stringify(computedDay));
    cloned.day = dayI;
    return cloned;
  });
}

export function makeMealFromRecipe(recipe, srcDay, mi, T) {
  // Pick the variant against the day's remaining budget (variants-only; the base of a variant
  // recipe is a placeholder). On the add path mi is one past the end, so every meal counts.
  let ings = recipe.ingredients, variantLabel = null;
  if (recipe.variants && recipe.variants.length > 0) {
    const used = { cal: 0, carbs: 0, pro: 0, fat: 0 };
    srcDay.meals.forEach((m, mealI) => {
      if (mealI === mi) return;
      m.ingredients.forEach((i) => { if (!i.isSpice) { used.cal += i.calories; used.carbs += i.carbs; used.pro += i.protein; used.fat += i.fat; } });
    });
    const tmp = { variants: recipe.variants, selectedVariant: null };
    selectVariant(tmp, Math.max(1, T.calories - used.cal), Math.max(0.1, T.carbGrams - used.carbs),
      Math.max(0.1, T.proteinGrams - used.pro), Math.max(0.1, T.fatGrams - used.fat));
    if (tmp.selectedVariant) { ings = tmp.selectedVariant.ingredients; variantLabel = tmp.selectedVariant.label; }
  }
  return {
    originalName: recipe.name, name: recipe.name, cuisine: recipe.cuisine,
    isBreakfast: recipe.tags.includes('breakfast'), variantLabel,
    ingredients: ings.map((i) => ({ ...i, adjustment: null })), totalMacros: { ...recipe.totalMacros },
  };
}

// Swap the meal at mi (or append when isAdd) and re-solve the day; cloned to the whole group.
export function swapMeal({ days, planGroups, di, mi, recipe, T, overrides, isAdd = false }) {
  const members = planGroupMembers(days, planGroups, di);
  const srcDay = days[di] || EMPTY_DAY;
  const newMeal = makeMealFromRecipe(recipe, srcDay, mi, T);
  const newMeals = isAdd
    ? srcDay.meals.map(cloneMeal).concat([newMeal])
    : srcDay.meals.map((m, i) => (i === mi ? newMeal : cloneMeal(m)));
  const day = computeDay(srcDay, newMeals, T, overrides);
  return { days: writeMembers(days, members, day), members, zone: zoneCheck(day.totals, T) };
}

// Remove a meal and re-solve the rest. Removing the last meal empties the day (no solve, no shake).
export function removeMeal({ days, planGroups, di, mi, T, overrides }) {
  const srcDay = days[di];
  if (!srcDay || srcDay.meals.length < 1) return null;
  const members = planGroupMembers(days, planGroups, di);
  const remaining = srcDay.meals.filter((_, i) => i !== mi);
  const day = computeDay(srcDay, remaining, T, overrides);
  return { days: writeMembers(days, members, day), members, zone: zoneCheck(day.totals, T), isEmpty: remaining.length === 0 };
}

// Drop the day's shake and accept the best shakeless solve, even off-zone (user's call, S18).
export function removeShake({ days, planGroups, di, T, overrides }) {
  const srcDay = days[di];
  if (!srcDay || !srcDay.proteinShake) return null;
  const members = planGroupMembers(days, planGroups, di);
  const day = computeDay(srcDay, srcDay.meals, T, overrides, { shakeless: true });
  return { days: writeMembers(days, members, day), members, zone: zoneCheck(day.totals, T), shakeSlot: srcDay.meals.length };
}

export function densify(p) { return Array.from({ length: 7 }, (_, i) => p[i] || null); }

export function generateWeek({ T, overrides, groups, excluded, mealCounts }) {
  const p = generatePlan(T.calories, T.carbGrams, T.proteinGrams, T.fatGrams, overrides || {}, groups, excluded, null, resolvedMealCounts(mealCounts));
  return { days: densify(p), groups: groupSnapshot(groups) };
}

// Regenerate the given days (expanded to their full current groups), keeping every other day and
// seeding the week tracker with the kept recipes so nothing is duplicated.
export function regenerateDays({ days, planGroups, selection, T, overrides, groups, excluded, mealCounts }) {
  const regenSet = new Set();
  selection.forEach((di) => {
    const gi = findDayGroup(groups, di);
    const members = gi !== -1 ? groups[gi] : [di];
    members.forEach((d) => { if (!excluded.includes(d)) regenSet.add(d); });
  });
  if (regenSet.size === 0) return null;
  const excludedForCall = [];
  for (let d = 0; d < 7; d++) if (!regenSet.has(d)) excludedForCall.push(d);
  const seed = { recipeNames: {} };
  days.forEach((day, di) => {
    if (!day || regenSet.has(di) || excluded.includes(di)) return;
    day.meals.forEach((meal) => { seed.recipeNames[meal.name] = true; });
  });
  const p = generatePlan(T.calories, T.carbGrams, T.proteinGrams, T.fatGrams, overrides || {}, groups, excludedForCall, seed, resolvedMealCounts(mealCounts));
  const nextDays = Array.from({ length: 7 }, (_, di) => (regenSet.has(di) ? p[di] || null : days[di] || null));
  const nextGroups = { ...(planGroups || {}) };
  regenSet.forEach((d) => {
    const gi = findDayGroup(groups, d);
    if (gi !== -1) nextGroups[d] = { groupIndex: gi }; else delete nextGroups[d];
  });
  return { days: nextDays, groups: nextGroups, regenSet: Array.from(regenSet) };
}

// Weekly averages over days that actually hold meals (emptied and free days are skipped).
export function weeklySummary(days, excluded, T) {
  const active = (days || []).filter((day, di) => day && day.meals.length > 0 && !excluded.includes(di));
  const n = active.length;
  const sum = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  active.forEach((d) => { sum.calories += d.totals.calories; sum.carbs += d.totals.carbs; sum.protein += d.totals.protein; sum.fat += d.totals.fat; });
  const avg = n ? { calories: round1(sum.calories / n), carbs: round1(sum.carbs / n), protein: round1(sum.protein / n), fat: round1(sum.fat / n) } : { ...EMPTY_TOTALS };
  return { n, sum, avg, pcts: n ? macroPcts(avg, T) : null };
}

export function shakeScoops(days) {
  let scoops = 0;
  (days || []).forEach((day) => { if (day && day.proteinShake) scoops += day.proteinShake.scoops; });
  return scoops;
}

// Remove every "di-mi" key whose day is in `daySet` (eaten marks, servings, batch tags).
export function dropDayKeys(map, daySet) {
  const set = new Set(daySet);
  const out = {};
  Object.keys(map || {}).forEach((k) => { if (!set.has(parseInt(k, 10))) out[k] = map[k]; });
  return out;
}

export const DAY_STRAIN = { high: 1100, low: 350 };
export function strainedUnits(units, calories) {
  return units.filter((u) => { const per = calories / u.meals; return per > DAY_STRAIN.high || per < DAY_STRAIN.low; });
}
