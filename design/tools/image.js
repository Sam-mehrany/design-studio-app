'use strict';
/**
 * Image preparation for analysis and embedding — pure JavaScript, no native modules, so it
 * runs unchanged under Electron's bundled Node on Windows.
 *
 *  - prepare(file)  → a copy small enough for any model API (long edge ≤ 1568 px, JPEG),
 *                     or the original bytes when they are already small and the format is
 *                     one the APIs take.
 *  - measure(file)  → the measured palette (hex + coverage) and WCAG contrast ratios between
 *                     the dominant colours. The analyser hands these to the model so colour
 *                     claims are measurements, not adjectives — which matters most for small
 *                     local models, which guess hex values badly.
 *
 * JPEG and PNG are decoded. WebP/GIF/AVIF are passed through when small enough and get no
 * measurement — the record says so rather than inventing numbers.
 */

const fs = require('fs');
const path = require('path');

const MAX_EDGE = 1568;              // beyond this every vision API downsamples anyway
const MAX_PASSTHROUGH = 3.5 * 1024 * 1024; // stay well under the 5 MB per-image API limit

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };

function codecs() {
  // Lazy: only analysis and embedding need them; the browse-only server never loads them.
  return { jpeg: require('jpeg-js'), PNG: require('pngjs').PNG };
}

/** Decode to RGBA, or null for formats we do not decode. */
function decode(buf, ext) {
  const { jpeg, PNG } = codecs();
  if (ext === '.jpg' || ext === '.jpeg') {
    return jpeg.decode(buf, { useTArray: true, formatAsRGBA: true, maxMemoryUsageInMB: 1024, maxResolutionInMP: 200 });
  }
  if (ext === '.png') {
    const p = PNG.sync.read(buf);
    return { width: p.width, height: p.height, data: p.data };
  }
  return null;
}

/** Area-average downscale: every source pixel contributes, so thin hairlines survive. */
function downscale(img, maxEdge) {
  const { width: w, height: h, data } = img;
  const s = Math.min(1, maxEdge / Math.max(w, h));
  if (s >= 1) return img;
  const W = Math.max(1, Math.round(w * s)), H = Math.max(1, Math.round(h * s));
  const out = new Uint8Array(W * H * 4);
  const acc = new Float64Array(W * H * 4);
  const cnt = new Float64Array(W * H);
  for (let y = 0; y < h; y++) {
    const Y = Math.min(H - 1, Math.floor(y * s));
    for (let x = 0; x < w; x++) {
      const X = Math.min(W - 1, Math.floor(x * s));
      const i = (y * w + x) * 4, o = Y * W + X;
      // Composite alpha over white so a transparent PNG does not turn black.
      const a = data[i + 3] / 255;
      acc[o * 4] += data[i] * a + 255 * (1 - a);
      acc[o * 4 + 1] += data[i + 1] * a + 255 * (1 - a);
      acc[o * 4 + 2] += data[i + 2] * a + 255 * (1 - a);
      cnt[o]++;
    }
  }
  for (let o = 0; o < W * H; o++) {
    const n = cnt[o] || 1;
    out[o * 4] = acc[o * 4] / n; out[o * 4 + 1] = acc[o * 4 + 1] / n; out[o * 4 + 2] = acc[o * 4 + 2] / n; out[o * 4 + 3] = 255;
  }
  return { width: W, height: H, data: out };
}

/**
 * Bytes to send to a model. Returns { data: Buffer, mediaType, width, height, resized }.
 * Throws for a format we can neither pass through nor decode.
 */
function prepare(file) {
  const ext = path.extname(file).toLowerCase();
  const buf = fs.readFileSync(file);
  const img = decode(buf, ext);
  if (!img) {
    if (MIME[ext] && buf.length <= MAX_PASSTHROUGH) return { data: buf, mediaType: MIME[ext], resized: false };
    throw new Error(`${path.basename(file)}: ${ext} is too large to send and cannot be resized here — convert it to PNG or JPEG`);
  }
  if (Math.max(img.width, img.height) <= MAX_EDGE && buf.length <= MAX_PASSTHROUGH) {
    return { data: buf, mediaType: MIME[ext], width: img.width, height: img.height, resized: false };
  }
  const small = downscale(img, MAX_EDGE);
  const { jpeg } = codecs();
  const enc = jpeg.encode({ width: small.width, height: small.height, data: small.data }, 90);
  return { data: Buffer.from(enc.data), mediaType: 'image/jpeg', width: small.width, height: small.height, resized: true };
}

/* ---------- measurement ---------- */

const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const luminance = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/**
 * Palette by 4-bit-per-channel histogram, merged by perceptual distance, on a 256-px
 * thumbnail. Exact enough to name a surface ladder and an accent; not a design token export.
 */
function measure(file) {
  const ext = path.extname(file).toLowerCase();
  let img;
  try { img = decode(fs.readFileSync(file), ext); } catch { img = null; }
  if (!img) return null;
  const t = downscale(img, 256);
  const bins = new Map();
  const total = t.width * t.height;
  for (let i = 0; i < t.data.length; i += 4) {
    const k = ((t.data[i] >> 4) << 8) | ((t.data[i + 1] >> 4) << 4) | (t.data[i + 2] >> 4);
    const b = bins.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    b.n++; b.r += t.data[i]; b.g += t.data[i + 1]; b.b += t.data[i + 2];
    bins.set(k, b);
  }
  const raw = [...bins.values()].map((b) => ({ rgb: [b.r / b.n, b.g / b.n, b.b / b.n], n: b.n })).sort((a, b) => b.n - a.n);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const merged = [];
  for (const c of raw) {
    const hit = merged.find((m) => dist(m.rgb, c.rgb) < 28);
    if (hit) {
      const n = hit.n + c.n;
      hit.rgb = hit.rgb.map((v, i) => (v * hit.n + c.rgb[i] * c.n) / n);
      hit.n = n;
    } else merged.push({ ...c });
  }
  merged.sort((a, b) => b.n - a.n);
  const palette = merged.filter((m) => m.n / total >= 0.004).slice(0, 10)
    .map((m) => ({ hex: hex(...m.rgb), share: Number((m.n / total * 100).toFixed(1)), rgb: m.rgb.map(Math.round) }));
  if (!palette.length) return null;
  const bg = palette[0];
  const pairs = palette.slice(1).map((c) => ({ fg: c.hex, bg: bg.hex, ratio: Number(contrast(c.rgb, bg.rgb).toFixed(2)) }));
  return {
    width: img.width, height: img.height,
    background: bg.hex,
    palette: palette.map(({ hex: h, share }) => ({ hex: h, share })),
    contrast_vs_background: pairs,
  };
}

/** One-paragraph text form for a prompt. */
function measurementText(m) {
  if (!m) return 'No pixel measurement available for this format — estimate colours and say they are estimates.';
  const pal = m.palette.map((p) => `${p.hex} ${p.share}%`).join(', ');
  const con = m.contrast_vs_background.map((p) => `${p.fg} on ${p.bg} = ${p.ratio}:1`).join('; ');
  return `Measured off the pixels (${m.width}×${m.height}, colour = mean of a histogram bin, coverage of the whole frame): `
    + `palette ${pal}. Dominant surface ${m.background}. Contrast of each palette colour against it: ${con}. `
    + 'Small text is anti-aliased, so its true ink can be darker/lighter than any palette entry — treat small-text ratios as lower bounds.';
}

module.exports = { prepare, measure, measurementText, contrast, MIME };
