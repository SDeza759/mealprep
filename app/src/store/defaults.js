// Stable default documents. These objects are referentially stable on purpose: useDoc() hands them
// to useSyncExternalStore as the snapshot when a document does not exist yet, and a fresh object
// on every read would re-render forever.
export const DEFAULT_SETTINGS = Object.freeze({
  targets: { calories: 2000, carbPct: 35, proteinPct: 40, fatPct: 25 },
  theme: 'system',        // 'system' | 'light' | 'dark'
  accent: 'orange',       // 'orange' | 'lime' | 'sky'
  units: 'imperial',      // 'imperial' (lb · oz) | 'metric' (kg · g)
  notifications: { enabled: false, mealReminders: false, proteinNudge: false, workoutReminder: false, weeklyReview: false },
});

export const DEFAULT_DAYGROUPS = Object.freeze({
  groups: [],        // [[0,1,2],[3,4,5]] — day indices, Monday = 0
  excluded: [],      // free days
  mealCounts: {},    // { dayIndex: n } — sparse, grouped days kept equal
  cookDays: {},      // { leadDayIndex: weekdayIndex } — which day you cook a unit's batch meals
});

export const DEFAULT_PLANS = Object.freeze({ weeks: {} }); // { [mondayIso]: week plan }
export const DEFAULT_LIST = Object.freeze([]);
export const DEFAULT_MAP = Object.freeze({});
export const DEFAULT_STATS = Object.freeze({ plans: [] });

export const ACCENTS = {
  orange: { label: 'Orange', dark: '#FF6B35', light: '#D9501B' },
  lime:   { label: 'Lime',   dark: '#7CFF6B', light: '#2A8F1F' },
  sky:    { label: 'Sky',    dark: '#5AB8FF', light: '#1F7FD6' },
};
