// Regenerates audit/macro-audit.html from records.json + template.html.
//
// The file used to be hand-edited (S10). It is now generated: edit records.json,
// run `node audit/macro-audit/build.js`, never touch the HTML directly.
//
// Delta maths, reproduced exactly from the hand-written original:
//   per100  = label * 100 / serving          (unrounded)
//   delta   = per100 - ours                  (unrounded)
//   grams   = round1(delta)                  (what the cell prints)
//   pct     = round1(delta / ours * 100)     (from the UNROUNDED delta, and what sorting uses)
// A row with ours === 0 and delta === 0 prints 0%; ours === 0 with a real delta has no
// meaningful percentage and prints as no-data.
//
// "ours" is read live from INGREDIENT_REGISTRY, never stored in records.json, so the audit
// can never drift from the app's data. Note the registry carries more precision than the
// card prints (White Rice fat is 0.65, displayed 0.7) — deltas use the unrounded value.
const fs = require("fs");
const path = require("path");

const { INGREDIENT_REGISTRY } = require("../../data.js");

const MACROS = ["calories", "carbs", "protein", "fat"];
const CATEGORY_ORDER = [
  "Grains & Pasta",
  "Bakery & Bread",
  "Canned & Legumes",
  "Condiments & Oils",
  "Eggs & Dairy",
  "Meat & Seafood",
];

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// The hand-written original escaped category text twice in the summary column, so
// "Canned & Legumes" rendered as the literal "Canned &amp; Legumes". Fixed here.

const round1 = (n) => Math.round(n * 10) / 10;
// 7 not 7.0, -0.4 stays -0.4, and no "-0"
const fmt = (n) => {
  const r = round1(n);
  return String(Object.is(r, -0) ? 0 : r);
};

function band(pct) {
  if (pct === null) return "na";
  const a = Math.abs(pct);
  if (a > 15) return "bad";
  if (a >= 5) return "warn";
  return "ok";
}

function computeDeltas(rec) {
  if (!rec.label || !rec.serving) {
    return MACROS.map(() => ({ per100: null, grams: null, pct: null, cls: "na" }));
  }
  return MACROS.map((k) => {
    const per100 = (rec.label[k] * 100) / rec.serving;
    const ours = rec.ours[k];
    const delta = per100 - ours;
    let pct;
    if (ours === 0) pct = delta === 0 ? 0 : null;
    else pct = round1((delta / ours) * 100);
    return { per100, grams: round1(delta), pct, cls: band(pct) };
  });
}

function deltaCell(d, tag) {
  if (d.pct === null && d.grams === null) return `<${tag} class="na">—</${tag}>`;
  if (d.pct === null) return `<${tag} class="na">${fmt(d.grams)} <span class="pct">(n/a)</span></${tag}>`;
  return `<${tag} class="${d.cls}">${fmt(d.grams)} <span class="pct">(${d.pct > 0 ? "+" : ""}${d.pct}%)</span></${tag}>`;
}

function maxPct(deltas) {
  const vals = deltas.map((d) => (d.pct === null ? null : Math.abs(d.pct))).filter((v) => v !== null);
  return vals.length ? Math.max(...vals) : null;
}

function summaryRow(rec, deltas) {
  const mp = maxPct(deltas);
  const cells = deltas
    .map((d) => {
      if (d.pct === null) return `    <td class="na">—</td>`;
      return `    <td class="${d.cls}" data-sort="${d.pct}">${fmt(d.grams)} <span class="pct">(${d.pct > 0 ? "+" : ""}${d.pct}%)</span></td>`;
    })
    .join("\n");
  return [
    `    <td><a href="#detail-${rec.idx}">${esc(rec.name)}</a></td>`,
    `    <td class="cat">${esc(rec.category)}</td>`,
    cells,
    `    <td>${esc(rec.form)}${rec.formMismatch ? " ⚠" : ""}</td>`,
    `    <td>${esc(rec.source)}</td>`,
    `    <td>${esc(rec.confidence)}</td>`,
    `    <td class="deccell" data-ing="${esc(rec.name)}">—</td>`,
  ].join("\n");
}

function buildRows(records) {
  // Default view: largest absolute calorie gap first (no-data rows last).
  const sorted = records.slice().sort((a, b) => {
    const ga = a._deltas[0].grams, gb = b._deltas[0].grams;
    if (ga === null && gb === null) return 0;
    if (ga === null) return 1;
    if (gb === null) return -1;
    return Math.abs(gb) - Math.abs(ga);
  });
  const bodies = sorted.map((r) => summaryRow(r, r._deltas));
  return "    <tbody><tr>\n" + bodies.join("\n  </tr><tr>\n") + "\n  </tr></tbody>";
}

function sourceTagClass(source) {
  if (source === "amazon-page") return "tag tag-amazon-page";
  if (source === "aggregator") return "tag tag-aggregator";
  if (source === "none") return "tag tag-none";
  return "tag tag-" + source;
}

function card(rec, deltas) {
  const mp = maxPct(deltas);
  const badgeCls = mp === null ? "na" : band(mp);
  const badgeTxt = mp === null ? "no data" : "max " + mp + "%";
  const links = rec.links
    .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
    .join("<br>");
  const oursCells = MACROS.map((k) => `<td>${fmt(rec.ours[k])}</td>`).join("");

  let labelRow, per100Row;
  if (rec.label && rec.serving) {
    labelRow = `        <tr><th>Amazon (as labeled, ${rec.serving} g serving)</th>${MACROS.map((k) => `<td>${fmt(rec.label[k])}</td>`).join("")}</tr>`;
    per100Row = `        <tr><th>Amazon → per 100 g</th>${deltas.map((d) => `<td>${fmt(d.per100)}</td>`).join("")}</tr>`;
  } else {
    labelRow = `        <tr><th>Amazon (as labeled)</th><td class="na">—</td><td class="na">—</td><td class="na">—</td><td class="na">—</td></tr>`;
    per100Row = `        <tr><th>Amazon → per 100 g</th><td class="na">—</td><td class="na">—</td><td class="na">—</td><td class="na">—</td></tr>`;
  }

  return [
    `  <section class="card" id="detail-${rec.idx}">`,
    `    <h3><span class="badge ${badgeCls}">${badgeTxt}</span> ${esc(rec.name)} <span class="cat">${esc(rec.category)}</span></h3>`,
    `    <div class="meta">`,
    `      <span class="${sourceTagClass(rec.source)}">source: ${esc(rec.source)}</span>`,
    `      <span class="tag">confidence: ${esc(rec.confidence)}</span>`,
    `      <span class="tag">form: ${esc(rec.form)}</span>`,
    rec.formMismatch
      ? `      <span class="tag mismatch">⚠ form differs from USDA raw/dry — delta expected</span>`
      : `      `,
    `    </div>`,
    `    <p class="notes">${esc(rec.notes)}</p>`,
    `    <div class="links"><strong>Amazon:</strong><br>${links}</div>`,
    `    <table class="cmp">`,
    `      <thead><tr><th>Per 100 g</th><th>Calories</th><th>Carbs (g)</th><th>Protein (g)</th><th>Fat (g)</th></tr></thead>`,
    `      <tbody>`,
    `        <tr><th>Our data (USDA)</th>${oursCells}</tr>`,
    labelRow,
    per100Row,
    `        <tr class="delta"><th>Δ (Amazon − ours)</th>${deltas.map((d) => deltaCell(d, "td")).join("")}</tr>`,
    `      </tbody>`,
    `    </table>`,
    `    <div class="decision" data-ing="${esc(rec.name)}">Decision:`,
    `      <label><input type="radio" name="dec_${rec.idx + 1}" value="keep" onchange="setDec(this)"> keep ours</label>`,
    `      <label><input type="radio" name="dec_${rec.idx + 1}" value="adjust" onchange="setDec(this)"> adjust toward Amazon</label>`,
    `      <button type="button" class="clearrow" onclick="clearDec(this)">clear</button>`,
    `    </div>`,
    `    <div class="rownote">`,
    `      <label for="note_${rec.idx + 1}">Notes on ${esc(rec.name)}</label>`,
    `      <textarea id="note_${rec.idx + 1}" data-ing="${esc(rec.name)}" rows="2" spellcheck="true" oninput="setNote(this)" placeholder="Optional — anything you want me to know about this row"></textarea>`,
    `    </div>`,
    `  </section>`,
  ].join("\n");
}

function main() {
  const dir = __dirname;
  const records = JSON.parse(fs.readFileSync(path.join(dir, "records.json"), "utf8"));

  const orphans = records.filter((r) => !INGREDIENT_REGISTRY[r.name]);
  if (orphans.length) {
    console.error("Records with no registry entry (rename or delete them):");
    orphans.forEach((r) => console.error("  " + r.name));
    process.exit(1);
  }
  records.forEach((r) => { r.ours = INGREDIENT_REGISTRY[r.name]; });

  // Cards run grouped by category (registry walk order), alphabetical within a group;
  // idx is assigned from that order so the anchors always match.
  records.sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category), cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name);
  });
  records.forEach((r, i) => { r.idx = i; });
  records.forEach((r) => { r._deltas = computeDeltas(r); });

  const n = records.length;
  const matched = records.filter((r) => r.label && r.serving).length;
  const flagged = records.filter((r) => r.formMismatch).length;

  let tpl = fs.readFileSync(path.join(dir, "template.html"), "utf8");
  tpl = tpl
    .replace(/Packaged ingredients only \(\d+\)\./, `Packaged ingredients only (${n}).`)
    .replace(
      /\d+\/\d+ ingredients matched to an Amazon listing · \d+ flagged/,
      `${matched}/${n} ingredients matched to an Amazon listing · ${flagged} flagged`
    )
    .replace(/Summary — all \d+, biggest deltas first/, `Summary — all ${n}, biggest deltas first`)
    .replace("{{ROWS}}", buildRows(records))
    .replace("{{CARDS}}", records.map((r) => card(r, r._deltas)).join("\n"));

  const out = path.join(dir, "..", "macro-audit.html");
  fs.writeFileSync(out, tpl);
  console.log(`wrote ${out}: ${n} ingredients, ${matched} matched, ${flagged} form-flagged`);
}

main();
