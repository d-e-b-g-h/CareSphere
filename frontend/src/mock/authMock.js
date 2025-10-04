// Frontend-only mock auth storage utilities
// NOTE: This is **mocked**. No real auth or network calls.

const USERS_KEY = "cs_users"; // Map of email -> {name, email, password}
const SESSION_USER_KEY = "cs_user"; // current session

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

export function upsertUser({ name, email, password }) {
  const users = getUsers();
  users[email.toLowerCase()] = { name, email: email.toLowerCase(), password: btoa(password) };
  saveUsers(users);
}

export function verifyPassword({ email, password }) {
  const users = getUsers();
  const u = users[email.toLowerCase()];
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

// OTP (mock) stored in sessionStorage with expiry
function otpKey(email) { return `cs_otp_${email.toLowerCase()}`; }

export function generateOtp(email) {
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  const exp = Date.now() + 5 * 60 * 1000; // 5 minutes
  sessionStorage.setItem(otpKey(email), JSON.stringify({ code, exp }));
  return code;
}

export function verifyOtp(email, code) {
  try {
    const raw = sessionStorage.getItem(otpKey(email));
    if (!raw) return { ok: false, reason: "No OTP found" };
    const { code: saved, exp } = JSON.parse(raw);
    if (Date.now() > exp) return { ok: false, reason: "OTP expired" };
    return { ok: saved === code };
  } catch (e) {
    return { ok: false, reason: "Invalid" };
  }
}