'use strict';
/**
 * Image measurement helpers. These are what make the analysis "measured, not guessed":
 * the model looks at the picture, but every hex value and contrast ratio it writes
 * comes from these functions.
 */
const fs = require('fs');
const sharp = require('sharp');

const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function parseHex(h) {
  const m = String(h).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) throw new Error(`not a hex colour: ${h}`);
  let s = m[1];
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}

/** WCAG 2.x relative luminance and contrast ratio. */
function luminance([r, g, b]) {
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrastRatio(fgHex, bgHex) {
  const a = luminance(parseHex(fgHex)), b = luminance(parseHex(bgHex));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

async function meta(file) {
  const m = await sharp(file).metadata();
  return { width: m.width, height: m.height, format: m.format };
}

/**
 * Dominant colours of the whole image or a region. Region is in fractions of the image
 * (0–1), so the model never has to know pixel sizes. Method: downscale, bucket each pixel
 * to 4 bits per channel, count, then report each bucket's true mean colour.
 */
async function palette(file, { region, count = 6 } = {}) {
  let img = sharp(file).removeAlpha();
  const { width, height } = await meta(file);
  if (region) {
    const clamp = (v) => Math.min(1, Math.max(0, Number(v) || 0));
    const left = Math.floor(clamp(region.x) * width), top = Math.floor(clamp(region.y) * height);
    const w = Math.max(1, Math.min(width - left, Math.round(clamp(region.w) * width)));
    const h = Math.max(1, Math.min(height - top, Math.round(clamp(region.h) * height)));
    img = img.extract({ left, top, width: w, height: h });
  }
  const { data, info } = await img.resize(160, 160, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
  const buckets = new Map();
  const n = info.width * info.height;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const e = buckets.get(key) || { r: 0, g: 0, b: 0, c: 0 };
    e.r += r; e.g += g; e.b += b; e.c++;
    buckets.set(key, e);
  }
  return [...buckets.values()]
    .sort((a, b) => b.c - a.c)
    .slice(0, Math.min(12, Math.max(1, count)))
    .map((e) => ({ hex: hex(e.r / e.c, e.g / e.c, e.b / e.c), share: Math.round((e.c / n) * 1000) / 10 }));
}

/** 16×16 difference hash: 256 bits. Distance under ~30 means "probably the same picture". */
async function dhash(file) {
  const { data } = await sharp(file).greyscale().resize(17, 16, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const bits = [];
  for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) bits.push(data[r * 17 + c] > data[r * 17 + c + 1] ? 1 : 0);
  return bits;
}
const hamming = (a, b) => a.reduce((s, v, i) => s + (v !== b[i] ? 1 : 0), 0);

/** Small JPEG for sending to a model: keeps requests light whatever the original size. */
async function forModel(file, maxSide = 1024) {
  const buf = await sharp(file).rotate().resize(maxSide, maxSide, { fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' }).jpeg({ quality: 88 }).toBuffer();
  return { mediaType: 'image/jpeg', base64: buf.toString('base64') };
}

const isImage = (f) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f) && fs.existsSync(f);

module.exports = { parseHex, contrastRatio, meta, palette, dhash, hamming, forModel, isImage };
