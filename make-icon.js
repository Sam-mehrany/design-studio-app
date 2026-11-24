'use strict';
/**
 * Generate build/icon.png (512×512) with no dependencies — Node's zlib is enough to write
 * a PNG by hand, so the icon is reproducible from source rather than a binary checked in.
 *
 * The mark is the facet grid: unequal bento cells on the studio's tonal surface, one cell
 * in the accent. Rendered at 2× and box-filtered down for antialiasing.
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'build', 'icon.png');
const SIZE = 512;
const SS = 2;                     // supersample factor
const W = SIZE * SS;

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const buf = new Uint8ClampedArray(W * W * 4);           // RGBA, transparent

const put = (x, y, [r, g, b], a = 255) => {
  const i = (y * W + x) * 4;
  const src = a / 255, dstA = buf[i + 3] / 255;
  const outA = src + dstA * (1 - src);
  if (outA === 0) return;
  for (let k = 0; k < 3; k++) {
    buf[i + k] = ([r, g, b][k] * src + buf[i + k] * dstA * (1 - src)) / outA;
  }
  buf[i + 3] = outA * 255;
};

/** Signed distance to a rounded rect; <= 0 is inside. */
const rrDist = (px, py, x, y, w, h, r) => {
  const cx = Math.max(x + r, Math.min(px, x + w - r));
  const cy = Math.max(y + r, Math.min(py, y + h - r));
  const dx = px - cx, dy = py - cy;
  const d = Math.hypot(dx, dy) - r;
  const inside = px >= x && px <= x + w && py >= y && py <= y + h;
  return inside && px > x + r && px < x + w - r ? -1 : (inside && py > y + r && py < y + h - r ? -1 : d);
};

function roundedRect(x, y, w, h, r, colour, alpha = 255) {
  const c = typeof colour === 'string' ? hex(colour) : colour;
  for (let py = Math.max(0, y | 0); py < Math.min(W, y + h + 1); py++) {
    for (let px = Math.max(0, x | 0); px < Math.min(W, x + w + 1); px++) {
      if (rrDist(px + 0.5, py + 0.5, x, y, w, h, r) <= 0) {
        put(px, py, typeof c === 'function' ? c(px, py) : c, alpha);
      }
    }
  }
}

// --- background: rounded square with a diagonal tonal gradient
const top = hex('#1d222a'), bottom = hex('#0b0d10');
roundedRect(0, 0, W, W, 104 * SS, (px, py) => {
  const t = (px / W + py / W) / 2;
  return [0, 1, 2].map((k) => Math.round(top[k] + (bottom[k] - top[k]) * t));
});

// --- the facet grid: three rows of three cells, unequal heights, one accent
const pad = 118 * SS, gap = 20 * SS, cols = 3;
const cw = (W - pad * 2 - gap * 2) / cols;
const heights = [[76, 120, 54], [120, 54, 100], [54, 100, 76]];
let y0 = pad;
for (let row = 0; row < 3; row++) {
  const rowH = Math.max(...heights[row]) * 0.52 * SS + 30 * SS;
  let x = pad;
  for (let col = 0; col < 3; col++) {
    const hh = heights[row][col] * 0.52 * SS + 22 * SS;
    const accent = row === 1 && col === 0;
    const colour = accent ? '#ff4d2e' : ((row + col) % 2 ? '#2b323c' : '#3a424e');
    roundedRect(x, y0 + (rowH - hh), cw, hh, 10 * SS, colour);
    x += cw + gap;
  }
  y0 += rowH + gap;
}

// --- downsample SS×SS -> 1 px
const out = Buffer.alloc(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let dy = 0; dy < SS; dy++) {
      for (let dx = 0; dx < SS; dx++) {
        const i = ((y * SS + dy) * W + (x * SS + dx)) * 4;
        const pa = buf[i + 3] / 255;
        r += buf[i] * pa; g += buf[i + 1] * pa; b += buf[i + 2] * pa; a += pa;
      }
    }
    const n = SS * SS, o = (y * SIZE + x) * 4;
    out[o] = a ? Math.round(r / a) : 0;
    out[o + 1] = a ? Math.round(g / a) : 0;
    out[o + 2] = a ? Math.round(b / a) : 0;
    out[o + 3] = Math.round((a / n) * 255);
  }
}

// --- encode PNG
const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return (b) => { let c = -1; for (const x of b) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
})();

const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(body));
  return Buffer.concat([len, body, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0;                                  // filter: none
  out.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, png);
console.log(`icon: ${OUT} (${SIZE}x${SIZE}, ${(png.length / 1024).toFixed(1)} KB)`);
