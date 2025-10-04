export const intro = {
  title: "Your Health, Your App",
  body: "CareSphere is a privacy-first, web-only health platform that turns everyday symptoms and basic health info into a clinician-ready Prepared Patient Pack and a minimal, signed Emergency QR."
};

export const principles = [
  { title: "Security & Privacy", desc: "Client-side encryption; data stays with the user." },
  { title: "Clinical Efficiency", desc: "Concise, structured summaries that save time." },
  { title: "Reliability", desc: "Signed QRs work offline with public key verification." },
  { title: "Governance", desc: "Expiry, revocation, and activity logs ensure transparent control." }
];

export const problems = [
  { title: "Unsafe Emergency Sharing", desc: "No safe way to share only life‑saving facts in emergencies." },
  { title: "Privacy & Control Gaps", desc: "Overexposure, no expiry/revocation, poor visibility into what’s shared." },
  { title: "Wasted Clinical Time", desc: "Scattered, incomplete, or unusable information slows care." }
];

export const solutions = [
  { title: "Prepared Patient Pack", desc: "One‑page, clinician‑ready summary in under 90 seconds." },
  { title: "Emergency QR", desc: "Signed, offline‑verifiable QR showing only six micro‑facts." },
  { title: "Consent & Activity", desc: "Expiring links, one‑click revoke, visible activity trail." }
];

export const objectives = [
  "Everyday to Emergency: simple intake → Pack + Emergency QR.",
  "Privacy‑first: data never leaves browser unless user shares.",
  "Clinically useful: mirrors common medical entities.",
  "Feasible, scalable: lightweight web stack, minimal services.",
  "Reliable: cryptographically signed, offline‑ready.",
  "Human‑centered: usability and trust over storage."
];

export const technologies = [
  "FastAPI (Python)",
  "MongoDB",
  "React + Tailwind",
  "IndexedDB",
  "Web Crypto (Ed25519)",
  "HTML→PDF rendering"
];

export const team = [
  { name: "Debmalya Ghosh", role: "Co‑Founder", phone: "+91 9903783336", linkedin: true },
  { name: "Sumaiya Hossain", role: "Founder", phone: "+91 8918549157", linkedin: true }
];