import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { InteractiveBg } from "../components/ambient/InteractiveBg";
import { ShieldCheck, QrCode, FileText, Lock, Activity, TimerReset, ArrowRight } from "lucide-react";
import { intro, principles, problems, solutions, objectives, technologies, team } from "../mock/aboutMock";

const Glass = ({ className = "", children }) => (
  <div className={`glass-panel border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${className}`}>{children}</div>
);

const Section = ({ title, subtitle, children }) => (
  <section className="container space-xl">
    <div className="max-w-3xl mb-8">
      <h2 className="heading-2 mb-2" style={{color: "var(--brand-jade)"}}>{title}</h2>
      {subtitle ? <p className="body-large" style={{color: "var(--brand-muted)"}}>{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

export default function About() {
  return (
    <div className="relative">
      <InteractiveBg />

      {/* Header */}
      <div className="nav-header flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 pl-2">
          <div className="size-7 rounded-xl" style={{background: "var(--brand-mint)", border: "1px solid rgba(255,255,255,.7)"}} />
          <span className="font-semibold tracking-tight" style={{color: "var(--brand-jade)"}}>CareSphere</span>
        </Link>
        <div className="flex items-center gap-2 pr-2">
          <Link to="/"><Button className="btn-secondary rounded-full">Home</Button></Link>
          <Link to="/auth"><Button className="btn-primary rounded-full">Get Started</Button></Link>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content text-center">
          <h1 className="hero-title">About CareSphere</h1>
          <p className="hero-subtitle max-w-2xl mx-auto">{intro.body}</p>
          <div className="mt-5">
            <Link to="/auth"><Button className="btn-primary rounded-full">Create Your Pack <ArrowRight className="ml-2 size-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Principles */}
      <Section title="What We Stand For">
        <div className="ai-grid">
          {principles.map((p) => (
            <Glass key={p.title} className="rounded-2xl p-6">
              <div className="font-semibold text-slate-800 mb-1">{p.title}</div>
              <p className="text-sm text-slate-600">{p.desc}</p>
            </Glass>
          ))}
        </div>
      </Section>

      {/* Problems -> Solutions */}
      <Section title="The Problems We Solve" subtitle="Delays, overexposure, and chaos in emergencies.">
        <div className="ai-grid">
          {problems.map((x) => (
            <Glass key={x.title} className="rounded-2xl p-6">
              <div className="font-semibold text-slate-800 mb-1">{x.title}</div>
              <p className="text-sm text-slate-600">{x.desc}</p>
            </Glass>
          ))}
        </div>
      </Section>

      <Section title="Our Approach">
        <div className="ai-grid">
          {solutions.map((s) => (
            <div key={s.title} className="gradient-border">
              <div className="inner p-6 rounded-[15px]">
                <div className="font-semibold text-slate-800 mb-1">{s.title}</div>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Features drill-down */}
      <Section title="Prepared Patient Pack & Emergency QR">
        <div className="grid md:grid-cols-2 gap-6">
          <Glass className="rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FileText className="size-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-slate-800">Prepared Patient Pack</div>
                <p className="text-sm text-slate-600">Symptoms, timeline, medications, allergies, questions—one page the clinician can act on immediately.</p>
              </div>
            </div>
          </Glass>
          <Glass className="rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <QrCode className="size-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-slate-800">Emergency QR</div>
                <p className="text-sm text-slate-600">Six micro‑facts with offline signature verification—reveals only what saves lives.</p>
              </div>
            </div>
          </Glass>
        </div>
      </Section>

      {/* Objectives (Accordion) */}
      <Section title="Objectives">
        <Accordion type="single" collapsible className="max-w-2xl">
          {objectives.map((o, idx) => (
            <AccordionItem key={idx} value={`o-${idx}`}>
              <AccordionTrigger>Objective {idx + 1}</AccordionTrigger>
              <AccordionContent className="text-slate-700">{o}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* Technologies */}
      <Section title="Technologies">
        <div className="flex flex-wrap gap-2">
          {technologies.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section title="Team">
        <div className="ai-grid">
          {team.map((m) => (
            <Glass key={m.name} className="rounded-2xl p-6">
              <div className="font-semibold text-slate-800">{m.name}</div>
              <div className="text-sm text-slate-600">{m.role}</div>
              <div className="text-sm text-slate-600 mt-1">{m.phone}</div>
              <div className="text-sm mt-2 text-emerald-700">{m.linkedin ? "LinkedIn available" : ""}</div>
            </Glass>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section title="Start Your CareSphere Today" subtitle="No account needed for the demo. Data stays private until you share.">
        <Link to="/auth"><Button className="btn-primary rounded-full">Create Your Pack</Button></Link>
      </Section>

      <footer className="border-t border-white/40 bg-white/60 backdrop-blur-md">
        <div className="container py-8 text-sm text-slate-600">© 2025 CareSphere. All rights reserved.</div>
      </footer>
    </div>
  );
}