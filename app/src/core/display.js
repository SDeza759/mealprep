// Display helpers that were UI-local in the old index.html. Pure functions, no React.
import { UNIT_INGREDIENTS, round1, GROCERY_COUNTABLE, formatImperial } from './index.js';

// Meats that show ounces alongside grams in the meal detail. A UI concern, deliberately separate
// from INGREDIENT_CATEGORIES "Meat & Seafood" (which also holds seafood).
export const MEAT_INGREDIENTS = new Set([
  'Chicken Breast', 'Chicken Thigh', 'Turkey Breast', 'Duck Breast', 'Duck Leg',
  'Ground Beef (lean)', 'Ground Beef (80% lean)', 'Beef Sirloin',
  'Pork Loin', 'Pork Belly',
  'Ground Lamb',
  'Salmon Fillet', 'Cod', 'Ahi Tuna', 'Shrimp',
  'Bacon', 'Canned Tuna', 'Clams', 'Flank Steak', 'Lamb Shoulder', 'Pork Shoulder',
  'Sea Bass',
]);

// Counts are shown for eggs only (S19, user's call): other unit items vary too much in real size
// for an assumed-average count to be trusted. Egg counts are exact — the solver snaps eggs to 50g.
export function getUnitDisplay(name, grams) {
  const u = UNIT_INGREDIENTS[name];
  if (!u || name !== 'Egg') return null;
  const count = Math.max(1, Math.round(grams / u.gPerUnit));
  return `${count} ${count === 1 ? u.unit : u.plural}`;
}

export function spiceDisplay(grams) {
  if (grams <= 1) return 'pinch';
  if (grams <= 3) return '½ tsp';
  if (grams <= 6) return '1 tsp';
  return `${Math.round(grams / 5)} tsp`;
}

export function gramsToOz(grams) { return round1(grams / 28.3495); }

// Metric counterpart of formatImperial: grams below a kilo, kilos above.
export function formatMetric(grams) {
  if (grams >= 1000) return `${round1(grams / 1000)} kg`;
  return `${Math.round(grams)} g`;
}

export function formatWeight(grams, units) {
  return units === 'metric' ? formatMetric(grams) : formatImperial(grams);
}

// Quantity text for one ingredient line inside a meal (units = 'imperial' | 'metric').
export function ingQtyText(ing, units) {
  if (ing.isSpice) return spiceDisplay(ing.grams);
  const ud = getUnitDisplay(ing.name, ing.grams);
  if (ud) return ud;
  if (units === 'imperial' && MEAT_INGREDIENTS.has(ing.name)) return `${Math.round(ing.grams)}g (${gramsToOz(ing.grams)} oz)`;
  return `${Math.round(ing.grams)}g`;
}

// Grocery quantity in the user's units. Mirrors groceryQtyText in grocery.js (spices as tsp,
// countables as counts) but switches the weight format.
export function groceryQty(item, units) {
  if (item.isSpice) return `~${Math.max(1, Math.round(item.totalGrams / 3))} tsp`;
  const gc = GROCERY_COUNTABLE[item.name];
  if (gc) {
    const count = Math.ceil(item.totalGrams / gc.gPerUnit);
    return `${count} ${count === 1 ? gc.unit : gc.plural}`;
  }
  return formatWeight(item.totalGrams, units);
}

export function fmtInt(n) { return Math.round(n || 0).toLocaleString('en-US'); }
export function pct(value, target) { return target > 0 ? Math.round((value / target) * 100) : 0; }
