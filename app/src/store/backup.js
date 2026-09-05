// Backup = every document as one JSON file. Import accepts our own backups and the old app's
// export ({stats, savedPlans, ...}) or a raw dump of its localStorage keys.
import { allDocs } from './store.js';
import { LEGACY_KEYS, normalizeDaygroups } from './migrate.js';

export function buildBackup() {
  return { app: 'dialed', format: 1, exportedAt: new Date().toISOString(), docs: allDocs() };
}

const KNOWN_DOCS = ['settings', 'daygroups', 'plan', 'savedPlans', 'favorites', 'stats', 'overrides', 'habits', 'body', 'train', 'meta'];

// Returns { source: 'dialed' | 'legacy', docs: {...} } or throws with a readable message.
export function parseBackup(text) {
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('That file is not valid JSON.'); }
  if (!data || typeof data !== 'object') throw new Error('That file does not look like a backup.');

  if (data.app === 'dialed' && data.docs && typeof data.docs === 'object') {
    const docs = {};
    for (const [k, v] of Object.entries(data.docs)) if (KNOWN_DOCS.includes(k) || true) docs[k] = v;
    delete docs.meta;
    return { source: 'dialed', docs };
  }

  const docs = {};
  // Old app export: { stats, savedPlans, exportDate, daygroups?, favorites?, overrides? }
  if (data.stats && data.stats.plans) docs.stats = data.stats;
  else if (Array.isArray(data.plans) && !data.stats) docs.stats = { plans: data.plans };
  if (Array.isArray(data.savedPlans)) docs.savedPlans = data.savedPlans;
  if (data.daygroups) docs.daygroups = normalizeDaygroups(data.daygroups);
  if (data.favorites && typeof data.favorites === 'object') docs.favorites = data.favorites;
  if (data.overrides && typeof data.overrides === 'object') docs.overrides = data.overrides;
  // Raw localStorage dump: { mealprep_stats: "...json...", ... } (strings or objects)
  for (const [lsKey, docKey] of Object.entries(LEGACY_KEYS)) {
    if (!(lsKey in data)) continue;
    let v = data[lsKey];
    if (typeof v === 'string') { try { v = JSON.parse(v); } catch { continue; } }
    docs[docKey] = docKey === 'daygroups' ? normalizeDaygroups(v) : v;
  }
  if (Object.keys(docs).length === 0) throw new Error('No Dialed or Actual Size Optimizer data found in that file.');
  return { source: 'legacy', docs };
}

export function backupFileName() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `dialed-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
}

// Save a JSON file. On phones the share sheet is the reliable path (Files, AirDrop, iCloud);
// elsewhere a normal download.
export async function saveJson(name, obj) {
  const text = JSON.stringify(obj, null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
      return 'shared';
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return 'cancelled';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
