import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/shared/components/ui/button";

export default function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-dark/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 shadow-xl shadow-brand-dark/5">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-dark to-brand-light flex items-center justify-center text-white font-black text-lg shadow-lg mb-4">
              PC
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">Prime Capital Admin</h1>
            <p className="text-sm text-slate-600 mt-1">Sign in to the compliance portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="compliance@primecapital.et"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" disabled={submitting} className="w-full h-11">
              <ShieldCheck className="w-4 h-4" />
              {submitting ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
