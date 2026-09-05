// Renders the Dialed app icons as PNGs with no dependencies: a dark square, the accent ring, the
// pointer and the centre dot from the logo. Run `npm run icons` after changing the mark.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/icons');
const BG = [0x0b, 0x0f, 0x14];
const ACCENT = [0xff, 0x6b, 0x35];

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function png(size, rgba) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function segDist(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby)));
  return Math.hypot(px - (ax + abx * t), py - (ay + aby * t));
}

// 1 when the unit-space point (x, y) is inside the accent mark; scale shrinks it for maskable icons.
function markCoverage(x, y, scale) {
  const u = (x - 0.5) / scale, v = (y - 0.5) / scale;
  const r = Math.hypot(u, v);
  const RING_R = 0.30, STROKE = 0.062, DOT_R = 0.052;
  const ring = Math.abs(r - RING_R) <= STROKE / 2;
  const pointer = segDist(u, v, 0, 0, 0.20, -0.20) <= STROKE / 2;
  const dot = r <= DOT_R;
  return ring || pointer || dot ? 1 : 0;
}

function render(size, { corner, markScale }) {
  const SS = 4;
  const rgba = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let bgCov = 0, markCov = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) / size, y = (py + (sy + 0.5) / SS) / size;
          const qx = Math.max(Math.abs(x - 0.5) - (0.5 - corner), 0), qy = Math.max(Math.abs(y - 0.5) - (0.5 - corner), 0);
          if (Math.hypot(qx, qy) > corner) continue;
          bgCov += 1;
          markCov += markCoverage(x, y, markScale);
        }
      }
      const a = bgCov / (SS * SS);
      const m = bgCov ? markCov / bgCov : 0;
      const o = (py * size + px) * 4;
      rgba[o] = Math.round(BG[0] * (1 - m) + ACCENT[0] * m);
      rgba[o + 1] = Math.round(BG[1] * (1 - m) + ACCENT[1] * m);
      rgba[o + 2] = Math.round(BG[2] * (1 - m) + ACCENT[2] * m);
      rgba[o + 3] = Math.round(255 * a);
    }
  }
  return png(size, rgba);
}

fs.mkdirSync(OUT, { recursive: true });
const jobs = [
  ['icon-192.png', 192, { corner: 0.0, markScale: 1.0 }],
  ['icon-512.png', 512, { corner: 0.0, markScale: 1.0 }],
  ['maskable-512.png', 512, { corner: 0.0, markScale: 0.78 }],
  ['apple-touch-icon.png', 180, { corner: 0.0, markScale: 1.0 }],
];
for (const [name, size, opts] of jobs) {
  fs.writeFileSync(path.join(OUT, name), render(size, opts));
  console.log('wrote', name);
}
