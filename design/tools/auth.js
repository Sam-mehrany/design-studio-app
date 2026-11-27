'use strict';
/**
 * Password login for the studio.
 *
 * Off by default on a local 127.0.0.1 run (the desktop app needs no login). On as soon as a
 * password is configured, and the server refuses to listen on a public interface without one.
 *
 *   STUDIO_PASSWORD_HASH   scrypt$<salt hex>$<hash hex>   (preferred; make one with set-password.js)
 *   STUDIO_PASSWORD        plain password                  (fallback, e.g. a host's secret env var)
 *   STUDIO_SESSION_SECRET  optional; signs session cookies (derived from the password if unset,
 *                          so changing the password signs everyone out)
 *   STUDIO_SESSION_DAYS    optional; how long a sign-in lasts (default 30)
 */
const crypto = require('crypto');

const COOKIE = 'studio_session';
const DAYS = Number(process.env.STUDIO_SESSION_DAYS) || 30;

function hashPassword(pw, salt = crypto.randomBytes(16).toString('hex')) {
  const h = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return `scrypt$${salt}$${h}`;
}

const HASH = (() => {
  if (process.env.STUDIO_PASSWORD_HASH) return process.env.STUDIO_PASSWORD_HASH.trim();
  if (process.env.STUDIO_PASSWORD) return hashPassword(process.env.STUDIO_PASSWORD);
  return null;
})();

const enabled = !!HASH;

const SECRET = process.env.STUDIO_SESSION_SECRET
  || (HASH ? crypto.createHmac('sha256', 'design-studio-session').update(HASH).digest('hex') : '');

function checkPassword(pw) {
  if (!HASH) return false;
  const [scheme, salt, want] = HASH.split('$');
  if (scheme !== 'scrypt' || !salt || !want) return false;
  const got = crypto.scryptSync(String(pw || ''), salt, 64);
  const w = Buffer.from(want, 'hex');
  return w.length === got.length && crypto.timingSafeEqual(w, got);
}

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function makeToken() {
  const exp = Date.now() + DAYS * 864e5;
  const payload = `${exp}.${crypto.randomBytes(8).toString('hex')}`;
  return `${payload}.${sign(payload)}`;
}

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isAuthed(req) {
  if (!enabled) return true;
  const t = parseCookies(req)[COOKIE];
  if (!t) return false;
  const i = t.lastIndexOf('.');
  if (i < 0) return false;
  const payload = t.slice(0, i);
  const sig = Buffer.from(t.slice(i + 1));
  const want = Buffer.from(sign(payload));
  if (sig.length !== want.length || !crypto.timingSafeEqual(sig, want)) return false;
  return Number(payload.split('.')[0]) > Date.now();
}

function isSecure(req) {
  return req.socket.encrypted || String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
}

function sessionCookie(req) {
  return `${COOKIE}=${makeToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${DAYS * 86400}` +
    (isSecure(req) ? '; Secure' : '');
}

function clearCookie(req) {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` + (isSecure(req) ? '; Secure' : '');
}

/* ---------- brute-force brake: 5 misses per 15 minutes per address ---------- */
const misses = new Map();
const WINDOW = 15 * 60e3;
const MAX = 5;

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';
}

function lockedFor(req) {
  const m = misses.get(clientIp(req));
  if (!m) return 0;
  if (Date.now() - m.first > WINDOW) { misses.delete(clientIp(req)); return 0; }
  return m.count >= MAX ? Math.ceil((m.first + WINDOW - Date.now()) / 1000) : 0;
}

function recordMiss(req) {
  const ip = clientIp(req);
  const m = misses.get(ip);
  if (!m || Date.now() - m.first > WINDOW) misses.set(ip, { first: Date.now(), count: 1 });
  else m.count++;
}

function clearMisses(req) { misses.delete(clientIp(req)); }

module.exports = {
  enabled, hashPassword, checkPassword, isAuthed, sessionCookie, clearCookie,
  lockedFor, recordMiss, clearMisses,
};
