// One-shot: parse the hand-written audit/macro-audit.html into records.json.
// After this runs, build.js is the source of truth and this script is history.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

// Spent. macro-audit.html is now GENERATED from records.json, so re-running this would
// re-derive records from our own output and silently drop anything the HTML cannot carry.
if (fs.existsSync(path.join(__dirname, "records.json"))) {
  console.error("records.json already exists — this script is history, not a build step.");
  console.error("To change the audit, edit records.json and run build.js.");
  process.exit(1);
}

const html = fs.readFileSync(path.join(ROOT, "audit", "macro-audit.html"), "utf8");

const cards = html.split('<section class="card" id="detail-');
cards.shift();

const unesc = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const num = (s) => (s === "" || s == null ? null : parseFloat(s));

const records = cards.map((chunk) => {
  const idx = parseInt(chunk, 10);
  const grab = (re) => { const m = chunk.match(re); return m ? m[1] : null; };

  const name = grab(/<\/span> ([^<]+) <span class="cat">/).trim();
  const category = unesc(grab(/<span class="cat">([^<]*)<\/span>/));
  const source = grab(/source: ([^<]*)</);
  const confidence = grab(/confidence: ([^<]*)</);
  const form = grab(/form: ([^<]*)</);
  const mismatch = /class="tag mismatch"/.test(chunk);
  const notes = unesc(grab(/<p class="notes">([\s\S]*?)<\/p>/) || "");

  const linksBlock = grab(/<div class="links"><strong>Amazon:<\/strong><br>([\s\S]*?)<\/div>/) || "";
  const links = [...linksBlock.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((m) => ({ url: unesc(m[1]), label: unesc(m[2]) }));

  const rowVals = (label) => {
    const re = new RegExp("<tr><th>" + label + "[^<]*<\\/th>([\\s\\S]*?)<\\/tr>");
    const m = chunk.match(re);
    if (!m) return null;
    return [...m[1].matchAll(/<td[^>]*>([^<]*)/g)].map((x) => num(x[1].trim()));
  };

  // "Our data" is NOT captured: the card prints it display-rounded (White Rice shows fat 0.7
  // where the registry holds 0.65), and build.js reads the live registry instead.
  const amazonRow = chunk.match(/<tr><th>Amazon \(as labeled, ([\d.]+) g serving\)<\/th>([\s\S]*?)<\/tr>/);
  const serving = amazonRow ? parseFloat(amazonRow[1]) : null;
  const label = amazonRow
    ? [...amazonRow[2].matchAll(/<td[^>]*>([^<]*)/g)].map((x) => num(x[1].trim()))
    : null;

  const K = ["calories", "carbs", "protein", "fat"];
  const toObj = (arr) => (arr ? Object.fromEntries(K.map((k, i) => [k, arr[i]])) : null);

  return {
    idx,
    name,
    category,
    source,
    confidence,
    form,
    formMismatch: mismatch,
    notes,
    links,
    serving,
    label: toObj(label),
  };
});

records.sort((a, b) => a.idx - b.idx);
fs.writeFileSync(
  path.join(__dirname, "records.json"),
  JSON.stringify(records, null, 2) + "\n"
);
console.log("extracted", records.length, "records");
console.log("categories in card order:");
let last = null;
records.forEach((r) => { if (r.category !== last) { console.log("  " + r.idx + ": " + r.category); last = r.category; } });
const bad = records.filter((r) => !r.name || !r.label || !r.serving);
if (bad.length) { console.log("INCOMPLETE:", bad.map((b) => b.idx + " " + b.name)); }
