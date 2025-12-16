import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Zap,
  KeyRound,
  Fingerprint,
  Cookie,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Project Name */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Hash Lock
            </span>
          </div>

          {/* Login / Sign In Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Text */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 Live Now
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
            Security Built from Scratch
            <br />
            <span className="text-blue-500">Hash Lock</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            A robust, security-first authentication system designed to
            demonstrate a deep understanding of identity management and web
            security protocols.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://github.com/PraveenUppar/Hash-Lock"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition-all"
            >
              View Code
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Feature 1: Argon2 Encryption */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
              {/* Used ShieldCheck for strong encryption/protection */}
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Argon2 Encryption
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Industry-standard password hashing that resists GPU-based
              brute-force attacks better than Bcrypt.
            </p>
          </div>

          {/* Feature 2: OAuth Integration */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-900/30 transition-colors">
              {/* Used Fingerprint for identity/social login */}
              <Fingerprint className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              OAuth Integration
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seamless social login support (Google) with automatic account
              linking and profile retrieval.
            </p>
          </div>

          {/* Feature 3: RBAC Authorization */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-900/30 transition-colors">
              {/* Used KeyRound for roles and permissions */}
              <KeyRound className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              RBAC Authorization
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Role-Based Access Control protecting sensitive API routes and
              Admin Dashboard interfaces.
            </p>
          </div>

          {/* Feature 4: Secure Sessions */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-amber-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-900/30 transition-colors">
              {/* Used Cookie for... well, cookies and sessions */}
              <Cookie className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Secure Sessions
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stateful database sessions with HTTP-only, secure, same-site
              cookies to prevent XSS/CSRF.
            </p>
          </div>

          {/* Feature 5: Password Reset */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-rose-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-900/30 transition-colors">
              {/* Used Mail for email-based recovery flows */}
              <Mail className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Password Reset
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Secure email-based recovery flow with time-limited unique tokens.
            </p>
          </div>

          {/* Feature 6: Access Control (Granular) */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-cyan-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/30 transition-colors">
              {/* Used Lock for general locking/access control */}
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Access Control
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Granular permission settings allow you to define exactly who can
              access your locked files.
            </p>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-slate-300 font-medium">Hash Lock</span>. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
