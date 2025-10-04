import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Input } from "../components/ui/input";
import { toast } from "../components/ui/sonner";
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  ClipboardCheck,
  ArrowRight,
  QrCode,
  FileText,
  Stethoscope,
  Share2,
  Activity,
  Gavel,
  TimerReset,
  Mail,
} from "lucide-react";
import { features, navLinks, techPoints, uniquePoints, whyChoose } from "../mock/mock";

const ICONS = { ShieldCheck, Lock, BadgeCheck, ClipboardCheck, QrCode, FileText, Stethoscope, Share2, Activity, Gavel, TimerReset };

// Small helper for glass effect container
const Glass = ({ className = "", children }) => (
  <div
    className={`glass-panel border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ eyebrow, title, subtitle, align = "center" }) => (
  <div className={`mx-auto ${align === "center" ? "text-center" : "text-left"} max-w-3xl mb-10`}> 
    {eyebrow ? <div className="text-sm tracking-wide text-emerald-700/80 mb-2">{eyebrow}</div> : null}
    <h2 className="heading-2 mb-3 text-balance text-[rgb(0,55,32)]">{title}</h2>
    {subtitle ? <p className="body-large text-slate-600">{subtitle}</p> : null}
  </div>
);

const QRMock = () => (
  <div className="size-24 rounded-md overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 p-2 border border-white/50">
    <div className="grid grid-cols-6 grid-rows-6 gap-1 h-full">
      {Array.from({ length: 36 }).map((_, i) => (
        <div key={i} className={`${i % 3 === 0 ? "bg-slate-900" : "bg-slate-500/60"} rounded-[2px]`}></div>
      ))}
    </div>
  </div>
);

const MockPackCard = () => (
  <Glass className="rounded-2xl p-5 backdrop-blur-[18px] backdrop-saturate-150 bg-white/60">
    <div className="flex items-start gap-4">
      <div className="shrink-0"><QRMock /></div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">Verified</span>
        </div>
        <h4 className="font-semibold text-slate-800">Prepared Patient Pack</h4>
        <ul className="text-sm text-slate-600 list-disc pl-5">
          <li>Chief concern: Fainting spells</li>
          <li>Timeline: 2 weeks — 3 episodes</li>
          <li>Meds & allergies summarized</li>
        </ul>
      </div>
    </div>
  </Glass>
);

const EmailCapture = ({ compact = false }) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email to begin");
      return;
    }
    localStorage.setItem("cs_demo_email", email);
    toast("Welcome to CareSphere — creating your pack locally.");
    navigate("/demo");
  };

  return (
    <form onSubmit={onSubmit} className={`flex ${compact ? "flex-col sm:flex-row" : "flex-col md:flex-row"} gap-3 w-full max-w-xl`}>
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/70 border-white/40 backdrop-blur-md focus-visible:ring-emerald-500"
      />
      <Button type="submit" className="btn-primary rounded-full px-6 py-6 text-white" variant="default">
        Create Your Pack
      </Button>
    </form>
  );
};

export default function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    // subtle entry animation
    const el = heroRef.current;
    if (el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(10px)";
      requestAnimationFrame(() => {
        el.style.transition = "opacity .5s ease, transform .5s ease";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      });
    }
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative">
      {/* Floating Glass Nav */}
      <div className="nav-header flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 pl-2">
          <div className="size-7 rounded-xl bg-emerald-400/70 border border-white/60 shadow-inner" />
          <span className="font-semibold tracking-tight text-slate-800">CareSphere</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((n) => (
            <a key={n.href} href={n.href} className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo(n.href); }}>{n.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
          <Link to="/demo">
            <Button className="btn-secondary rounded-full">Get Started</Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div ref={heroRef} className="hero-content">
          <h1 className="hero-title">Your Health, Prepared & Private.</h1>
          <p className="hero-subtitle">Turn everyday symptoms and health info into a clinician-ready Prepared Patient Pack and an ultra-minimal Emergency QR.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            <Link to="/demo">
              <Button className="btn-primary rounded-full">Get Started <ArrowRight className="ml-2 size-4" /></Button>
            </Link>
            <Button onClick={() => scrollTo('#features')} className="btn-secondary rounded-full" variant="outline">See Features</Button>
          </div>

          {/* Visual */}
          <div className="mt-10 grid md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1 text-left">
              <MockPackCard />
            </div>
            <div className="order-1 md:order-2">
              <Glass className="rounded-3xl p-6 bg-white/55 backdrop-blur-[20px]">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-slate-800 font-semibold mb-1">Emergency QR</h4>
                    <p className="text-sm text-slate-600">Ultra-minimal, signed, and reveals only essentials offline.</p>
                  </div>
                  <QRMock />
                </div>
              </Glass>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="container space-xl">
        <SectionTitle
          title="Clinics waste time. Emergencies are chaotic."
          subtitle="Collecting scattered histories slows care. Bystanders often don’t know what to share safely."
          align="left"
        />
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="relative">
            <Glass className="rounded-2xl p-6 bg-white/60 backdrop-blur-[16px]">
              <p className="font-semibold text-slate-700 mb-2">Messy papers & memory</p>
              <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                <li>Scattered test results</li>
                <li>Forgotten meds &amp; allergies</li>
                <li>No clear timeline</li>
              </ul>
            </Glass>
            <Glass className="rounded-2xl p-6 bg-white/60 backdrop-blur-[16px] absolute -right-6 -bottom-6 hidden md:block">
              <p className="font-semibold text-slate-700 mb-2">Clean digital pack</p>
              <p className="text-sm text-slate-600">One page. Actionable. Verifiable.</p>
            </Glass>
          </div>
          <div>
            <MockPackCard />
          </div>
        </div>
      </section>

      {/* Unique */}
      <section id="unique" className="container space-xl">
        <SectionTitle
          title="Preparation over hoarding. Privacy by default."
          subtitle="CareSphere is built to surface only what matters, when it matters — and keep everything else private."
        />
        <div className="ai-grid">
          {uniquePoints.map((u) => {
            const I = ICONS[u.icon] || ShieldCheck;
            return (
              <Glass key={u.title} className="rounded-2xl p-5 bg-white/60 backdrop-blur-[14px]">
                <div className="flex items-start gap-3">
                  <I className="size-5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800">{u.title}</div>
                    <p className="text-sm text-slate-600">{u.desc}</p>
                  </div>
                </div>
              </Glass>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container space-xl">
        <SectionTitle title="Everything You Need, Nothing You Don’t." />
        <div className="ai-grid">
          {features.map((f) => {
            const I = ICONS[f.icon] || FileText;
            return (
              <Card key={f.title} className="product-card bg-white/70 border-white/50 backdrop-blur-[14px]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <I className="size-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="product-card-title">{f.title}</h4>
                      <p className="product-card-description">{f.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Technical Approach (Accordion) */}
      <section id="how" className="container space-xl">
        <SectionTitle title="How It Works Under the Hood" subtitle="A minimal, verifiable, privacy-first flow." />
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>Technical details</AccordionTrigger>
            <AccordionContent>
              <ul className="text-sm text-slate-700 space-y-2">
                {techPoints.map((t) => (
                  <li key={t.title} className="flex items-start gap-2">
                    <span className="mt-1 size-2 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-semibold text-slate-800">{t.title}</div>
                      <div className="text-slate-600">{t.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Why Choose */}
      <section id="impact" className="container space-xl">
        <SectionTitle title="High Impact. Low Friction. Works When It Matters." />
        <div className="ai-grid">
          {whyChoose.map((w) => {
            const I = ICONS[w.icon] || Activity;
            return (
              <Glass key={w.title} className="rounded-2xl p-6 bg-white/60 backdrop-blur-[16px]">
                <div className="flex items-start gap-3">
                  <I className="size-6 text-emerald-700" />
                  <div>
                    <div className="font-semibold text-slate-800">{w.title}</div>
                    <p className="text-sm text-slate-600">{w.desc}</p>
                  </div>
                </div>
              </Glass>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="container space-2xl">
        <Glass className="rounded-3xl p-8 md:p-10 bg-emerald-50/60 backdrop-blur-[20px] border-emerald-200/60">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="heading-3 mb-2">Start Your CareSphere Today</h3>
              <p className="text-slate-600 mb-4">No account needed. Data stays private until you share.</p>
              <EmailCapture />
            </div>
            <div className="md:justify-self-end">
              <MockPackCard />
            </div>
          </div>
        </Glass>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/40 bg-white/60 backdrop-blur-md">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">© 2025 CareSphere. All rights reserved.</div>
          <nav className="flex items-center gap-4 text-sm">
            <a className="nav-link" href="#">About</a>
            <a className="nav-link" href="#">FAQ</a>
            <a className="nav-link" href="#">Privacy Policy</a>
            <a className="nav-link" href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// Demo route content (simple stub)
export function DemoPage() {
  const [name, setName] = useState(localStorage.getItem("cs_demo_name") || "");
  const [email, setEmail] = useState(localStorage.getItem("cs_demo_email") || "");
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("cs_demo_name", name);
    localStorage.setItem("cs_demo_email", email);
    toast("Saved locally. You can clear anytime.");
    setSaved(true);
  };

  return (
    <div className="container py-20">
      <h1 className="heading-2 mb-4">Create Your Pack</h1>
      <p className="body-medium text-slate-600 mb-8">This is a mock demo. No data leaves your browser.</p>
      <Glass className="rounded-2xl p-6 bg-white/60 backdrop-blur-[16px]">
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-700">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Patient" className="mt-1 bg-white/70" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 bg-white/70" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3 mt-2">
            <Button type="submit" className="btn-primary rounded-full">Save</Button>
            {saved ? <span className="text-sm text-emerald-700">Saved ✓</span> : null}
          </div>
        </form>
      </Glass>
    </div>
  );
}