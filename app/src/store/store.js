// In-memory document cache with React bindings. Every document lives here after boot(); writes
// update memory synchronously (so the UI never waits on IndexedDB) and persist in the background.
import { useCallback, useSyncExternalStore } from 'react';
import { readAll, write, remove, wipe } from './db.js';
import { migrateLegacy } from './migrate.js';
import { isoDate, mondayOf } from '../fuel/dates.js';

const docs = new Map();
const listeners = new Set();
let ready = false;

function emit() { for (const fn of listeners) fn(); }

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function isReady() { return ready; }
export function hasDoc(key) { return docs.has(key); }
export function getDoc(key, fallback) { return docs.has(key) ? docs.get(key) : fallback; }

export function setDoc(key, value) {
  docs.set(key, value);
  emit();
  write(key, value).catch((err) => console.error('[dialed] persist failed for', key, err));
}

export function deleteDoc(key) {
  docs.delete(key);
  emit();
  remove(key).catch((err) => console.error('[dialed] delete failed for', key, err));
}

export function allDocs() { return Object.fromEntries(docs); }

// Replace every document (backup import). Persists each key; removes keys not in the snapshot.
export async function replaceAll(snapshot) {
  const keys = new Set([...docs.keys(), ...Object.keys(snapshot)]);
  docs.clear();
  for (const [k, v] of Object.entries(snapshot)) docs.set(k, v);
  emit();
  for (const k of keys) {
    if (k in snapshot) await write(k, snapshot[k]); else await remove(k);
  }
  normalizeDocs();
}

// Shape upgrades for documents written by older builds. Runs after boot and after any import.
// • `plan` (a single week) → `plans.weeks[<its Monday>]`.
export function normalizeDocs() {
  const legacy = docs.get('plan');
  if (legacy && Array.isArray(legacy.days)) {
    const cur = docs.get('plans');
    const plans = { ...(cur || {}), weeks: { ...((cur && cur.weeks) || {}) } };
    const ws = legacy.weekStart || isoDate(mondayOf(new Date()));
    if (!plans.weeks[ws]) plans.weeks[ws] = { ...legacy, weekStart: ws };
    docs.set('plans', plans);
    docs.delete('plan');
    emit();
    write('plans', plans).catch(() => {});
    remove('plan').catch(() => {});
  }
}

export async function clearAll() {
  docs.clear();
  emit();
  await wipe();
}

export async function boot() {
  const stored = await readAll();
  for (const [k, v] of stored) docs.set(k, v);
  // First run on an origin that still holds the old app's localStorage: bring its data across.
  if (!docs.has('meta')) {
    const migrated = migrateLegacy((k) => docs.has(k), (k, v) => { docs.set(k, v); write(k, v).catch(() => {}); });
    const meta = { createdAt: new Date().toISOString(), ...(migrated.length ? { migratedFrom: 'localStorage', migratedKeys: migrated } : {}) };
    docs.set('meta', meta);
    await write('meta', meta);
  }
  normalizeDocs();
  ready = true;
  emit();
}

// React binding. `fallback` MUST be referentially stable (see defaults.js).
export function useDoc(key, fallback) {
  const value = useSyncExternalStore(subscribe, () => (docs.has(key) ? docs.get(key) : fallback));
  const set = useCallback((next) => {
    const current = docs.has(key) ? docs.get(key) : fallback;
    setDoc(key, typeof next === 'function' ? next(current) : next);
  }, [key, fallback]);
  return [value, set];
}
