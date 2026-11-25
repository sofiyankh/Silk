"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Clock,
  RotateCcw,
} from "@/components/icons";

interface AdminLoginClientProps {
  defaultEmail?: string;
  defaultPassword?: string;
  defaultSecurityKey?: string;
}

export function AdminLoginClient({
  defaultEmail = "",
  defaultPassword = "",
  defaultSecurityKey = "",
}: AdminLoginClientProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [challengeToken, setChallengeToken] = useState("");
  const [securityKey, setSecurityKey] = useState(defaultSecurityKey);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Submit email + password to receive challenge token
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch("/api/admin/secure-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication step 1 failed");
      }

      if (data.challengeRequired && data.challengeToken) {
        setChallengeToken(data.challengeToken);
        setStep(2);
        setInfo("Step 1 authenticated. Please verify the 32-character secondary security key.");
      } else {
        throw new Error("Challenge sequence failure. Please retry.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate step 1");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit 32-character security key with challenge token
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch("/api/admin/secure-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 2,
          challengeToken,
          securityKey: securityKey.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Step 2 secondary key verification failed");
      }

      setInfo("Authorization verified. Redirecting to Silk Control Center...");
      // Hard redirect to admin dashboard
      setTimeout(() => {
        window.location.href = "/admin";
      }, 400);
    } catch (err: any) {
      setError(err.message || "Failed to verify security key");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f0f0f0] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-[#141414] border border-[#262626] p-8 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Top security gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="text-center space-y-3">
          <div className="relative h-10 w-28 mx-auto">
            <Image
              src="/brand/logo/silk-logo-white.png"
              alt="Silk Admin"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-800/80 rounded-full text-[10px] uppercase font-bold tracking-widest text-red-400">
            <ShieldCheck size={13} />
            <span>Dedicated Admin Gateway · Port 9090</span>
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Silk Control Center
          </h1>
          <p className="text-xs text-[#888888]">
            Two-Pass MFA Authentication · 4-Hour Recycled JWT Session
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 py-2 border-y border-[#202020] text-xs">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${
              step === 1
                ? "bg-white/10 text-white font-semibold border border-white/20"
                : "text-zinc-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center">
              1
            </span>
            <span>Master Password</span>
          </div>
          <span className="text-zinc-600">→</span>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${
              step === 2
                ? "bg-red-500/10 text-red-400 font-semibold border border-red-500/30"
                : "text-zinc-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center">
              2
            </span>
            <span>32-Char Security Key</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded flex items-start gap-2">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded flex items-start gap-2">
            <Sparkles size={15} className="mt-0.5 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#888888] font-medium flex items-center gap-1.5">
                <Mail size={12} />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@silk.com"
                className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-[#666666] tracking-wide"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#888888] font-medium flex items-center gap-1.5">
                <Lock size={12} />
                <span>Admin Master Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-[#666666] tracking-wide"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-white text-black font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Validating Step 1...</span>
              ) : (
                <>
                  <span>Proceed to Step 2</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4 text-xs">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">Verified Identity:</span>
                <span className="text-zinc-200 font-mono">{email}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">Session Window:</span>
                <span className="text-amber-400 font-mono flex items-center gap-1">
                  <Clock size={11} /> 4 Hours Recycling
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider text-red-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  <span>32-Character Security Key</span>
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    securityKey.length === 32 ? "text-emerald-400 font-bold" : "text-amber-400"
                  }`}
                >
                  {securityKey.length}/32 chars
                </span>
              </div>

              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  required
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="Enter 32-character security key"
                  className="w-full bg-[#1c1c1c] border border-red-900/60 rounded px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-red-600 tracking-wider pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500">
                Secondary key configured in .env (32 alphanumeric characters).
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg shadow-red-950/50"
              >
                {loading ? (
                  <span>Generating 4-Hour JWT...</span>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Authorize Admin Session</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError(null);
                  setInfo(null);
                }}
                className="w-full py-2 bg-transparent text-zinc-400 hover:text-zinc-200 text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Return to Step 1</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-[#1f1f1f] text-center text-[10px] text-zinc-600 space-y-1">
          <p>Protected by Anti-Fuzzing & Brute-Force Rate Limiting</p>
        </div>
      </div>
    </div>
  );
}
