"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#0e0e1c] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e8c97e]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e8c97e]/2 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-[#e8c97e]/5 border border-[#e8c97e]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8c97e" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Terminal</h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">Encryption Active • Secure Link</p>
        </div>

        <div className="glass-strong p-8 md:p-10 relative overflow-hidden border border-[#e8c97e]/10">
          {/* Internal Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#e8c97e]/20 to-transparent" />
          
          <form action={formAction} className="space-y-6">
            <AnimatePresence mode="wait">
              {state?.error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl mb-4"
                >
                  {state.error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1"
              >
                Identification
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="email@vault.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8c97e]/30 focus:ring-4 focus:ring-[#e8c97e]/5 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-bold text-white/40 uppercase tracking-widest"
                >
                  Access Key
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8c97e]/30 focus:ring-4 focus:ring-[#e8c97e]/5 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-white transition-colors"
              />
              <label htmlFor="rememberMe" className="text-sm text-white/60 select-none">
                Maintain session for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#e8c97e] text-[#0e0e1c] font-bold py-3.5 rounded-xl hover:bg-[#f2d995] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {pending ? (
                <div className="w-5 h-5 border-2 border-[#0e0e1c]/20 border-t-[#0e0e1c] rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-white/20 text-xs font-mono">
          SECURE_PROTOCOL_v4.2 // AGENT_IDENTIFIED
        </p>
      </motion.div>
    </main>
  );
}
