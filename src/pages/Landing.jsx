import { Link } from "react-router-dom";
import BoardMockup from "../components/BoardMockup";
import {
  IconArrowRight,
  IconBoard,
  IconCheckSquare,
  IconPaperclip,
  IconShield,
  IconSpark,
  IconUsers,
  IconZap,
} from "../components/Icons";

const FEATURES = [
  {
    icon: IconBoard,
    title: "Boards that update instantly",
    text: "Move a card and your whole team sees it move too — no refresh, no delay, powered by real-time sync.",
  },
  {
    icon: IconSpark,
    title: "AI that breaks work down",
    text: "Paste a messy task description and get a clear, actionable checklist in seconds.",
  },
  {
    icon: IconUsers,
    title: "Built for teams, not solo lists",
    text: "Shared workspaces, assignees, and comments keep everyone looking at the same source of truth.",
  },
  {
    icon: IconCheckSquare,
    title: "Lists, labels, checklists, dates",
    text: "Organize work exactly how your team thinks — custom columns, color labels, due dates, and subtasks.",
  },
  {
    icon: IconPaperclip,
    title: "Attach files where the work is",
    text: "Drop reference files straight onto a task so context never gets lost in a chat thread.",
  },
  {
    icon: IconShield,
    title: "Secure by default",
    text: "Google sign-in, hashed passwords, and workspace-scoped access keep your team's data where it belongs.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create a workspace",
    text: "Spin up a workspace for your team in seconds — no setup, no config.",
  },
  {
    n: "02",
    title: "Add and organize tasks",
    text: "Drop tasks into lists, tag them, assign people, and set due dates.",
  },
  {
    n: "03",
    title: "Move fast, together",
    text: "Watch the board update live as your team ships — with AI helping break down the big stuff.",
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber text-bg font-display font-bold text-sm">
            CD
          </span>
          <span className="font-display font-semibold text-[15px] tracking-tight text-text">
            CollabDesk
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-text-muted md:flex">
          <a href="#features" className="hover:text-text">Features</a>
          <a href="#how-it-works" className="hover:text-text">How it works</a>
          <a href="#pricing" className="hover:text-text">Pricing</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:text-text"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber px-4 py-2 text-sm font-display font-semibold text-bg transition hover:bg-amber-dim"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f2a93b, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #45c4b0, transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[11px] text-amber">
            <IconSpark /> AI-POWERED TASK BOARDS
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-text sm:text-5xl">
            Organize your team's work, without the chaos.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
            CollabDesk is a real-time Kanban board built for small teams — with AI that
            breaks big tasks into clear checklists, so nothing sits stuck in "To do."
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber px-5 py-3 text-sm font-display font-semibold text-bg transition hover:bg-amber-dim"
            >
              Start for free <IconArrowRight />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text hover:bg-surface-2"
            >
              Log in
            </Link>
          </div>
          <p className="mt-4 text-xs text-text-faint">Free to start · No credit card required</p>
        </div>

        <div className="lg:pl-6">
          <BoardMockup />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="border-t border-border-soft bg-surface/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text">
            Everything a fast-moving team needs
          </h2>
          <p className="mt-3 text-sm text-text-muted">
            No bloat, no learning curve — just the tools that actually get used.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-surface p-5 transition hover:border-amber/40"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                <Icon />
              </span>
              <h3 className="mb-1.5 font-display font-semibold text-text">{title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text">Up and running in minutes</h2>
          <p className="mt-3 text-sm text-text-muted">Three steps between you and an organized team.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="relative rounded-xl border border-border bg-surface p-6">
              <span className="font-mono text-xs text-amber">{step.n}</span>
              <h3 className="mt-2 mb-1.5 font-display font-semibold text-text">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["Unlimited tasks & lists", "Real-time collaboration", "1 workspace", "Basic file attachments"],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹499",
    period: "/ month",
    features: [
      "Everything in Free",
      "Unlimited workspaces",
      "AI subtask generation",
      "Priority support",
    ],
    cta: "Upgrade after signup",
    highlight: true,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border-soft bg-surface/40 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text">Simple pricing</h2>
          <p className="mt-3 text-sm text-text-muted">Start free. Upgrade only when your team needs more.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlight ? "border-amber/50 bg-surface" : "border-border bg-surface"
              }`}
            >
              {plan.highlight && (
                <span className="mb-3 inline-block rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-text">{plan.name}</h3>
              <p className="mt-1 mb-4">
                <span className="font-display text-3xl font-semibold text-text">{plan.price}</span>{" "}
                <span className="text-sm text-text-faint">{plan.period}</span>
              </p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="mt-0.5 text-green"><IconCheckSquare /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block rounded-lg px-4 py-2.5 text-center text-sm font-display font-semibold transition ${
                  plan.highlight
                    ? "bg-amber text-bg hover:bg-amber-dim"
                    : "border border-border text-text hover:bg-surface-2"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber">
          <IconZap />
        </span>
        <h2 className="font-display text-3xl font-semibold text-text">Ready to get your team organized?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-muted">
          Create your first workspace in under a minute. No credit card needed.
        </p>
        <Link
          to="/signup"
          className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-amber px-6 py-3 text-sm font-display font-semibold text-bg transition hover:bg-amber-dim"
        >
          Start for free <IconArrowRight />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-soft py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber text-bg font-display font-bold text-xs">
            CD
          </span>
          <span className="font-display text-sm font-semibold text-text">CollabDesk</span>
        </div>
        <p className="text-xs text-text-faint">
          © {new Date().getFullYear()} CollabDesk. Built for small teams that move fast.
        </p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
