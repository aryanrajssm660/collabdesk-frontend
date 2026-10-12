import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { API_BASE_URL } from "../lib/api";
import AuthShowcase from "../components/AuthShowcase";
import { IconGoogle, IconLoader } from "../components/Icons";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signup({ name, email, password });
    setLoading(false);
    if (res.ok) {
      toast.success("Account created — log in to continue");
      navigate("/login");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg">
      <AuthShowcase />

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber text-bg font-display font-bold text-sm">
              CD
            </span>
            <span className="font-display font-semibold text-text">CollabDesk</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-text mb-1">Create your account</h1>
          <p className="text-sm text-text-muted mb-6">Set up your first workspace in a minute.</p>

          <a
            href={`${API_BASE_URL}/api/auth/google`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 py-2.5 text-sm font-medium text-text transition hover:bg-surface-3 mb-5"
          >
            <IconGoogle /> Continue with Google
          </a>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-border-soft" />
            <span className="text-xs text-text-faint">or with email</span>
            <div className="h-px flex-1 bg-border-soft" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <p className="rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Lee"
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-amber/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-amber/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-amber/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber py-2.5 font-display font-semibold text-bg transition hover:bg-amber-dim disabled:opacity-60"
            >
              {loading && <IconLoader />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-amber hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
