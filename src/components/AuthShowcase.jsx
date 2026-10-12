import { IconBoard, IconSpark, IconUser } from "./Icons";

const FEATURES = [
  { icon: IconBoard, text: "Kanban boards synced live across your team" },
  { icon: IconSpark, text: "AI breaks big tasks into a clear checklist" },
  { icon: IconUser, text: "One workspace, everyone on the same page" },
];

export default function AuthShowcase() {
  return (
    <div className="relative hidden overflow-hidden bg-surface lg:flex lg:w-[46%] lg:flex-col lg:justify-between p-10 xl:p-14">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f2a93b, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #45c4b0, transparent 70%)" }}
      />

      <div className="relative flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber text-bg font-display font-bold text-sm">
          CD
        </span>
        <span className="font-display font-semibold text-lg text-text">CollabDesk</span>
      </div>

      <div className="relative">
        <p className="font-mono text-xs text-amber mb-3 tracking-wide">CD-001 · WORKSPACE ONLINE</p>
        <h1 className="font-display text-3xl xl:text-4xl font-semibold text-text leading-tight mb-4">
          The team board that thinks a step ahead.
        </h1>
        <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-8">
          Create a workspace, drop in a task, and let AI split the messy ones into
          something your team can actually start on today.
        </p>

        <ul className="space-y-3">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-text-muted">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 border border-border-soft text-teal">
                <Icon />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative font-mono text-[11px] text-text-faint">
        built for small teams that move fast
      </p>
    </div>
  );
}
