// run.js — entry point for the Node test harness.
// Replaces the browser-only debug panel for validation/simulation.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const data = require(path.join(ROOT, 'data.js'));
const algorithm = require(path.join(ROOT, 'algorithm.js'));
const grocery = require(path.join(ROOT, 'grocery.js')); // not used by harness, but verifies it loads

const validator = require('./validator.js');
const simulator = require('./simulator.js');
const compareLib = require('./compare.js');

const DEFAULT_TARGETS = { cal: 2000, carbs: 175, protein: 200, fat: 55.6 };
const KNOWN_MODES = ['validator', 'simulator', 'all', 'compare'];

function printUsage() {
  process.stderr.write([
    'Usage:',
    '  node tests/run.js validator [--targets=cal,carbs,protein,fat]',
    '  node tests/run.js simulator [--targets=cal,carbs,protein,fat]',
    '  node tests/run.js all       [--targets=cal,carbs,protein,fat]',
    '',
    '  node tests/run.js compare --baseline-only [--targets=...]',
    '  node tests/run.js compare --experiment <baseline.json> [--targets=...]',
    '  node tests/run.js compare --from=<a.json> --to=<b.json>',
    '',
    'Default targets: 2000,175,200,55.6',
    '',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0) return { error: 'no_mode' };

  const mode = args[0];
  if (!KNOWN_MODES.includes(mode)) return { error: 'unknown_mode', mode };

  const targets = { ...DEFAULT_TARGETS };
  let baselineOnly = false;
  let experimentBaseline = null;
  let fromPath = null;
  let toPath = null;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--targets=')) {
      const raw = arg.slice('--targets='.length);
      const parts = raw.split(',').map((s) => Number(s));
      if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n <= 0)) {
        return {
          error: 'bad_targets',
          message: `Invalid --targets value: "${raw}". Expected 4 positive numbers: cal,carbs,protein,fat`,
        };
      }
      targets.cal = parts[0];
      targets.carbs = parts[1];
      targets.protein = parts[2];
      targets.fat = parts[3];
    } else if (arg === '--baseline-only') {
      baselineOnly = true;
    } else if (arg === '--experiment') {
      if (i + 1 >= args.length) {
        return { error: 'compare_arg', message: '--experiment requires a path argument' };
      }
      experimentBaseline = args[++i];
    } else if (arg.startsWith('--from=')) {
      fromPath = arg.slice('--from='.length);
    } else if (arg.startsWith('--to=')) {
      toPath = arg.slice('--to='.length);
    } else {
      return { error: 'unknown_flag', flag: arg };
    }
  }

  // Compare-mode-specific validation
  if (mode === 'compare') {
    const hasBaseline = baselineOnly;
    const hasExperiment = experimentBaseline !== null;
    const hasDiff = fromPath !== null || toPath !== null;

    if (hasBaseline && hasExperiment) {
      return { error: 'compare_arg', message: '--baseline-only and --experiment are mutually exclusive' };
    }
    if ((hasBaseline || hasExperiment) && hasDiff) {
      return {
        error: 'compare_arg',
        message: '--baseline-only/--experiment cannot be combined with --from/--to',
      };
    }
    if (hasDiff && (fromPath === null || toPath === null)) {
      return { error: 'compare_arg', message: '--from requires --to and vice versa' };
    }
    if (!hasBaseline && !hasExperiment && !hasDiff) {
      return {
        error: 'compare_arg',
        message:
          'compare requires one of: --baseline-only, --experiment <path>, or --from=<path> --to=<path>',
      };
    }
  } else {
    // Reject compare-only flags when not in compare mode
    if (baselineOnly || experimentBaseline !== null || fromPath !== null || toPath !== null) {
      return {
        error: 'unknown_flag',
        flag: '--baseline-only/--experiment/--from/--to (only valid in compare mode)',
      };
    }
  }

  return { mode, targets, baselineOnly, experimentBaseline, fromPath, toPath };
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function ensureOutputDir() {
  const dir = path.join(__dirname, 'output');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function targetSlug(t) {
  return `${t.cal}-${t.carbs}-${t.protein}-${t.fat}`;
}

function readJSON(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    process.stderr.write(`Error reading ${label} file "${filePath}": ${e.message}\n`);
    process.exit(2);
  }
}

function runMode(mode, targets, outputDir) {
  const ts = timestamp();
  const filename = path.join(outputDir, `${mode}-${targetSlug(targets)}-${ts}.json`);

  let result;
  let summary;
  let pass;

  if (mode === 'validator') {
    result = validator.run(targets, { algorithm, data });
    summary = validator.formatSummary(result, filename);
    pass = !result.error && result.passCount === result.totalDays;
  } else if (mode === 'simulator') {
    result = simulator.run(targets, { algorithm, data });
    summary = simulator.formatSummary(result, filename);
    const recipesSelected = result.recipeFrequency.filter((r) => r.count > 0).length;
    pass = !result.error && result.passRate >= 0.99 && recipesSelected === data.RECIPES.length;
  }

  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
  process.stdout.write(summary + '\n');
  return { pass, hadError: !!result.error };
}

function handleCompare(parsed, outputDir) {
  const ts = timestamp();
  const slug = targetSlug(parsed.targets);

  // (1) Diff existing files
  if (parsed.fromPath && parsed.toPath) {
    const from = readJSON(parsed.fromPath, '--from');
    const to = readJSON(parsed.toPath, '--to');

    const diff = compareLib.compare(from, to, {
      baselineFile: parsed.fromPath,
      experimentFile: parsed.toPath,
    });

    const filename = path.join(outputDir, `compare-${slug}-${ts}.json`);
    fs.writeFileSync(filename, JSON.stringify(diff, null, 2));
    process.stdout.write(compareLib.formatSummary(diff, from, to, filename) + '\n');
    return 0;
  }

  // (2) Run baseline-only
  if (parsed.baselineOnly) {
    const result = simulator.run(parsed.targets, { algorithm, data });
    const filename = path.join(outputDir, `simulator-baseline-${slug}-${ts}.json`);
    fs.writeFileSync(filename, JSON.stringify(result, null, 2));
    const recipesSelected = result.recipeFrequency.filter((r) => r.count > 0).length;
    const total = data.RECIPES.length;
    const rate = (result.passRate * 100).toFixed(2);
    process.stdout.write(
      `Baseline simulator: ${result.totalDays} days, ${result.passCount}/${result.totalDays} passed (${rate}%) | ${recipesSelected}/${total} recipes selected\n`
    );
    process.stdout.write(`Baseline saved: ${filename}\n`);
    process.stdout.write(`Next: make your data change, then run:\n`);
    process.stdout.write(`  node tests/run.js compare --experiment ${filename}\n`);
    return result.error ? 1 : 0;
  }

  // (3) Run experiment + diff against baseline
  if (parsed.experimentBaseline) {
    const baseline = readJSON(parsed.experimentBaseline, '--experiment');

    const experiment = simulator.run(parsed.targets, { algorithm, data });
    const experimentFile = path.join(outputDir, `simulator-experiment-${slug}-${ts}.json`);
    fs.writeFileSync(experimentFile, JSON.stringify(experiment, null, 2));

    const diff = compareLib.compare(baseline, experiment, {
      baselineFile: parsed.experimentBaseline,
      experimentFile,
    });
    const compareFile = path.join(outputDir, `compare-${slug}-${ts}.json`);
    fs.writeFileSync(compareFile, JSON.stringify(diff, null, 2));
    process.stdout.write(compareLib.formatSummary(diff, baseline, experiment, compareFile) + '\n');
    return experiment.error ? 1 : 0;
  }

  // Unreachable thanks to parseArgs validation
  return 2;
}

function main() {
  const parsed = parseArgs(process.argv);

  if (parsed.error === 'no_mode' || parsed.error === 'unknown_mode') {
    if (parsed.error === 'unknown_mode') {
      process.stderr.write(`Unknown mode: ${parsed.mode}\n\n`);
    }
    printUsage();
    process.exit(2);
  }
  if (parsed.error === 'unknown_flag') {
    process.stderr.write(`Unknown flag: ${parsed.flag}\n\n`);
    printUsage();
    process.exit(2);
  }
  if (parsed.error === 'bad_targets') {
    process.stderr.write(`Error: ${parsed.message}\n\n`);
    printUsage();
    process.exit(2);
  }
  if (parsed.error === 'compare_arg') {
    process.stderr.write(`Error: ${parsed.message}\n\n`);
    printUsage();
    process.exit(2);
  }

  // Initialize the data layer once before any algorithm call.
  algorithm.initializeData();

  const outputDir = ensureOutputDir();

  if (parsed.mode === 'compare') {
    process.exit(handleCompare(parsed, outputDir));
  }

  let exitCode = 0;
  const modes = parsed.mode === 'all' ? ['validator', 'simulator'] : [parsed.mode];
  for (const m of modes) {
    const r = runMode(m, parsed.targets, outputDir);
    if (!r.pass || r.hadError) exitCode = 1;
  }
  process.exit(exitCode);
}

main();
