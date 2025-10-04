// Frontend-only mock auth storage utilities
// NOTE: This is **mocked**. No real auth or network calls.

const USERS_KEY = "cs_users"; // Map of email -> {name, email, password, phone}
const SESSION_USER_KEY = "cs_user"; // current session

function isValidEmail(v) { return /.+@.+\..+/.test(v || ""); }
function isValidPhone(v) { return /^\+?\d{7,15}$/.test((v || "").replace(/\s|-/g, "")); }

function normalizePhone(phone, defaultCountry = "+91") {
  if (!phone) return "";
  const raw = phone.toString().replace(/[^\d+]/g, "");
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;
  const digits = raw.startsWith("0") ? raw.slice(1) : raw;
  return `${defaultCountry}${digits}`;
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function saveUsers(map) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map));
}

export function upsertUser({ name, email, password, phone }) {
  const users = getUsers();
  const key = (email || "").toLowerCase();
  const normalized = normalizePhone(phone);
  users[key] = { name, email: key, phone: normalized, password: btoa(password) };
  saveUsers(users);
}

export function verifyPassword({ email, password }) {
  const users = getUsers();
  const u = users[(email || "").toLowerCase()];
  if (!u) return false;
  return u.password === btoa(password);
}

export function setSessionUser(u) {
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(u));
}

export function getSessionUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_USER_KEY) || "null"); } catch (e) { return null; }
}

export function clearSession() {
  localStorage.removeItem(SESSION_USER_KEY);
}

export function getUserByEmailOrPhone({ email, phone }) {
  const users = getUsers();
  const e = (email || "").toLowerCase();
  const p = normalizePhone(phone);
  if (e && users[e]) return users[e];
  // simple linear scan by phone for demo
  if (p) {
    const found = Object.values(users).find(u => u.phone && u.phone === p);
    return found || null;
  }
  return null;
}

// OTP (mock) stored in sessionStorage with expiry
function otpKey(identifier) { return `cs_otp_${identifier}`; }

export function generateOtp(identifier) {
  const id = identifier || "";
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  const exp = Date.now() + 5 * 60 * 1000; // 5 minutes
  sessionStorage.setItem(otpKey(id), JSON.stringify({ code, exp }));
  return code;
}

export function verifyOtp(identifier, code) {
  try {
    const raw = sessionStorage.getItem(otpKey(identifier || ""));
    if (!raw) return { ok: false, reason: "No OTP found" };
    const { code: saved, exp } = JSON.parse(raw);
    if (Date.now() > exp) return { ok: false, reason: "OTP expired" };
    return { ok: saved === code };
  } catch (e) {
    return { ok: false, reason: "Invalid" };
  }
}

export { normalizePhone, isValidEmail, isValidPhone };