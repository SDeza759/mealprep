// Document store on IndexedDB (one object store, key -> JSON document). Falls back to
// localStorage when IndexedDB is unavailable (some private-browsing modes), so the app still runs.
import { openDB } from 'idb';

const DB_NAME = 'dialed';
const STORE = 'docs';
const LS_PREFIX = 'dialed:doc:';

let dbPromise = null;
let mode = 'idb';

function open() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) { db.createObjectStore(STORE); },
    });
  }
  return dbPromise;
}

function lsReadAll() {
  const out = new Map();
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) {
      try { out.set(k.slice(LS_PREFIX.length), JSON.parse(localStorage.getItem(k))); } catch { /* skip */ }
    }
  }
  return out;
}

export async function readAll() {
  try {
    const db = await open();
    const tx = db.transaction(STORE);
    const keys = await tx.store.getAllKeys();
    const vals = await tx.store.getAll();
    const out = new Map();
    keys.forEach((k, i) => out.set(k, vals[i]));
    return out;
  } catch (err) {
    console.warn('[dialed] IndexedDB unavailable, using localStorage', err);
    mode = 'local';
    return lsReadAll();
  }
}

export async function write(key, value) {
  if (mode === 'local') { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); return; }
  const db = await open();
  await db.put(STORE, value, key);
}

export async function remove(key) {
  if (mode === 'local') { localStorage.removeItem(LS_PREFIX + key); return; }
  const db = await open();
  await db.delete(STORE, key);
}

export async function wipe() {
  if (mode === 'local') {
    for (const k of Array.from(lsReadAll().keys())) localStorage.removeItem(LS_PREFIX + k);
    return;
  }
  const db = await open();
  await db.clear(STORE);
}

export function storageMode() { return mode; }
