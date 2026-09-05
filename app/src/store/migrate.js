// One-way import of the old Actual Size Optimizer localStorage keys into the document store.
// Runs once per origin (guarded by the `meta` document) and never deletes the old keys, so the
// legacy index.html keeps working on the same origin.
export const LEGACY_KEYS = {
  mealprep_daygroups: 'daygroups',
  mealprep_plans: 'savedPlans',
  mealprep_overrides: 'overrides',
  mealprep_stats: 'stats',
  mealprep_favorites: 'favorites',
};

export function readLegacyLocalStorage() {
  const out = {};
  for (const [lsKey, docKey] of Object.entries(LEGACY_KEYS)) {
    let raw = null;
    try { raw = localStorage.getItem(lsKey); } catch { raw = null; }
    if (!raw) continue;
    try { out[docKey] = JSON.parse(raw); } catch { /* corrupt entry: skip */ }
  }
  return out;
}

// Normalise the legacy `mealprep_daygroups` shape ({groups, excluded, mealCounts}).
export function normalizeDaygroups(v) {
  if (!v || typeof v !== 'object') return null;
  return {
    groups: Array.isArray(v.groups) ? v.groups : [],
    excluded: Array.isArray(v.excluded) ? v.excluded : [],
    mealCounts: v.mealCounts && typeof v.mealCounts === 'object' ? v.mealCounts : {},
    cookDays: v.cookDays && typeof v.cookDays === 'object' ? v.cookDays : {},
  };
}

export function migrateLegacy(has, set) {
  const found = readLegacyLocalStorage();
  const migrated = [];
  for (const [docKey, value] of Object.entries(found)) {
    if (has(docKey)) continue;
    set(docKey, docKey === 'daygroups' ? normalizeDaygroups(value) : value);
    migrated.push(docKey);
  }
  return migrated;
}
