import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PlanBadge from "./PlanBadge";
import { IconBoard, IconCrown, IconLogout, IconUser } from "./Icons";

function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber text-bg font-display font-bold text-sm">
        CD
      </span>
      <span className="font-display font-semibold text-[15px] tracking-tight text-text">
        CollabDesk
      </span>
    </Link>
  );
}

export default function AppShell({ children, onUpgradeClick }) {
  const { user, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border-soft bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <Link
              to="/dashboard"
              className="hidden items-center gap-1.5 text-sm text-text-muted hover:text-text sm:flex"
            >
              <IconBoard />
              Workspaces
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <PlanBadge premium={isPremium} />
            </div>

            {!isPremium && onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="hidden items-center gap-1.5 rounded-lg bg-amber px-3 py-1.5 text-xs font-display font-semibold text-bg transition hover:bg-amber-dim sm:flex"
              >
                <IconCrown /> Upgrade
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 border border-border font-display text-sm font-semibold text-text hover:border-amber/50"
              >
                {initial}
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 animate-fade-in-up rounded-xl border border-border bg-surface-2 p-2 shadow-xl">
                    <div className="flex items-center gap-2 px-2 py-2 border-b border-border-soft mb-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-text-muted">
                        <IconUser />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text">{user?.name}</p>
                        <p className="truncate text-xs text-text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <div className="px-2 pb-2 sm:hidden">
                      <PlanBadge premium={isPremium} />
                    </div>
                    {!isPremium && onUpgradeClick && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onUpgradeClick();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-amber hover:bg-amber/10 sm:hidden"
                      >
                        <IconCrown /> Upgrade to Premium
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-text hover:bg-red/10 hover:text-red"
                    >
                      <IconLogout /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
