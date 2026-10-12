import { IconCrown } from "./Icons";

export default function PlanBadge({ premium }) {
  if (premium) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 text-xs font-medium text-amber font-display">
        <IconCrown className="text-amber" />
        Premium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted font-display">
      Free plan
    </span>
  );
}
