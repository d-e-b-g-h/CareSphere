import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { generateOtp, upsertUser, verifyOtp, verifyPassword, setSessionUser, getUsers } from "../mock/authMock";

const Glass = ({ className = "", children }) => (
  <div className={`glass-panel border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${className}`}>{children}</div>
);

export default function Auth() {
  const [tab, setTab] = useState("signin");
  const navigate = useNavigate();

  return (
    <div className="container py-24">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 nav-link">
          <ArrowLeft className="size-4" /> Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Glass className="rounded-3xl p-6 md:p-10 bg-white/60 backdrop-blur-[18px]">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200/70 bg-emerald-50/60 text-emerald-800 text-sm font-medium">
              <ShieldCheck className="size-4" /> Privacy-first sign in
            </div>
            <h1 className="heading-2 mt-3">Welcome to CareSphere</h1>
            <p className="body-large text-slate-600">Create your account or sign in to continue. For this demo, OTP is simulated in-browser.</p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="bg-white/70 backdrop-blur px-1 py-1 rounded-full">
              <TabsTrigger value="signin" className="rounded-full px-4">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full px-4">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignInForm onSuccess={() => navigate("/demo")} />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm onSuccess={() => navigate("/demo")} />
            </TabsContent>
          </Tabs>
        </Glass>
      </div>
    </div>
  );
}

function SignUpForm({ onSuccess }) {
  const [step, setStep] = useState("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");

  const valid = useMemo(() => email && /.+@.+\..+/.test(email) && name && password.length >= 8 && password === confirm, [email, name, password, confirm]);

  const createAccount = (e) => {
    e.preventDefault();
    if (!valid) { toast("Please complete all fields (password ≥ 8)." ); return; }
    upsertUser({ name, email, password });
    const code = generateOtp(email);
    toast(`Mock OTP sent to ${email}: ${code}`);
    setStep("verify");
  };

  const verify = (e) => {
    e.preventDefault();
    const res = verifyOtp(email, otp);
    if (!res.ok) { toast(res.reason || "Invalid OTP"); return; }
    setSessionUser({ name, email });
    toast("Signed up successfully (local mock). Redirecting...");
    onSuccess?.();
  };

  return (
    <div>
      {step === "details" ? (
        <form onSubmit={createAccount} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-slate-700">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Patient" className="mt-1 bg-white/70" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 bg-white/70" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="mt-1 bg-white/70" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Confirm Password</label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your password" className="mt-1 bg-white/70" />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 mt-2">
            <Button disabled={!valid} type="submit" className="btn-primary rounded-full">Create Account</Button>
            <span className="text-sm text-slate-500">By continuing you accept our privacy-first, local demo.</span>
          </div>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <div>
            <div className="text-sm text-slate-700 mb-2">Enter 6-digit code sent to {email}</div>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (<InputOTPSlot key={i} index={i} />))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" className="btn-primary rounded-full">Verify & Continue</Button>
            <Button type="button" variant="outline" className="btn-secondary rounded-full" onClick={() => { const c = generateOtp(email); toast(`New mock OTP: ${c}`); }}>Resend OTP</Button>
          </div>
        </form>
      )}
    </div>
  );
}

function SignInForm({ onSuccess }) {
  const [method, setMethod] = useState("password"); // 'password' | 'otp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = () => {
    if (!/.+@.+\..+/.test(email)) { toast("Enter a valid email"); return; }
    const c = generateOtp(email);
    toast(`Mock OTP sent to ${email}: ${c}`);
  };

  const signInWithPassword = (e) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email) || password.length < 8) { toast("Invalid email or password"); return; }
    const ok = verifyPassword({ email, password });
    if (!ok) { toast("No such user or wrong password (mock)"); return; }
    const users = getUsers();
    const u = users[email.toLowerCase()];
    setSessionUser({ name: u?.name || email.split("@")[0], email });
    toast("Signed in (password, local mock)");
    onSuccess?.();
  };

  const verifyOtpSignIn = (e) => {
    e.preventDefault();
    const res = verifyOtp(email, otp);
    if (!res.ok) { toast(res.reason || "Invalid OTP"); return; }
    setSessionUser({ name: email.split("@")[0], email });
    toast("Signed in (OTP, local mock)");
    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full bg-white/70 backdrop-blur p-1">
        <button type="button" onClick={() => setMethod("password")} className={`px-4 py-2 rounded-full text-sm font-medium ${method === "password" ? "bg-white shadow" : "text-slate-600"}`}>Password</button>
        <button type="button" onClick={() => setMethod("otp")} className={`px-4 py-2 rounded-full text-sm font-medium ${method === "otp" ? "bg-white shadow" : "text-slate-600"}`}>One-Time Code</button>
      </div>

      {method === "password" ? (
        <form onSubmit={signInWithPassword} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 bg-white/70" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="mt-1 bg-white/70" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3 mt-2">
            <Button type="submit" className="btn-primary rounded-full">Sign In</Button>
            <Link to="#" className="link-text">Forgot password?</Link>
          </div>
        </form>
      ) : (
        <form onSubmit={verifyOtpSignIn} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-700">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 bg-white/70" />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={sendOtp} className="btn-secondary rounded-full w-full">Send OTP</Button>
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-700 mb-2">Enter 6-digit code</div>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (<InputOTPSlot key={i} index={i} />))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" className="btn-primary rounded-full">Verify & Sign In</Button>
          </div>
        </form>
      )}
    </div>
  );
}