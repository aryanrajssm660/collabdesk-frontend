import { IconCalendar, IconCheckSquare } from "./Icons";
import { colorFor } from "../lib/labelColors";

const MOCK_COLUMNS = [
  {
    name: "To do",
    dot: "bg-teal",
    cards: [
      { title: "Design onboarding flow", labels: ["blue"], checklist: "2/5" },
      { title: "Set up S3 bucket policy", labels: ["amber"] },
    ],
  },
  {
    name: "In progress",
    dot: "bg-blue",
    cards: [
      { title: "AI subtask generator", labels: ["teal", "green"], checklist: "4/6", due: "Aug 22" },
      { title: "Real-time socket sync" },
    ],
  },
  {
    name: "Done",
    dot: "bg-green",
    cards: [{ title: "Google OAuth login", labels: ["green"] }],
  },
];

export default function BoardMockup() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-4 shadow-2xl sm:p-5">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-green/60" />
        <span className="ml-3 font-mono text-[11px] text-text-faint">CollabDesk · Product Launch</span>
      </div>

      <div className="flex gap-3 overflow-hidden">
        {MOCK_COLUMNS.map((col) => (
          <div key={col.name} className="w-[150px] shrink-0 rounded-lg border border-border-soft bg-surface-2 p-2 sm:w-[170px]">
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
              <span className="text-[11px] font-medium text-text-muted">{col.name}</span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-md border border-border bg-surface-3 p-2 shadow-sm"
                >
                  {card.labels && (
                    <div className="mb-1 flex gap-1">
                      {card.labels.map((c) => (
                        <span key={c} className={`h-1.5 w-4 rounded-full ${colorFor(c).bg}`} />
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] font-medium leading-snug text-text">{card.title}</p>
                  {(card.checklist || card.due) && (
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-text-faint">
                      {card.checklist && (
                        <span className="inline-flex items-center gap-0.5">
                          <IconCheckSquare /> {card.checklist}
                        </span>
                      )}
                      {card.due && (
                        <span className="inline-flex items-center gap-0.5">
                          <IconCalendar /> {card.due}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
