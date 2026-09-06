// The selected date, shared by Home and Fuel for the session (not persisted): pick a day on Home,
// open Fuel, and you are looking at the same day and week.
import { useCallback, useSyncExternalStore } from 'react';
import { todayIso } from './dates.js';

let current = todayIso();
const listeners = new Set();
function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function useSelectedDate() {
  const value = useSyncExternalStore(subscribe, () => current);
  const set = useCallback((iso) => {
    if (iso === current) return;
    current = iso;
    for (const fn of listeners) fn();
  }, []);
  return [value, set];
}
