export const LABEL_COLORS = [
  { key: "amber", bg: "bg-amber", text: "text-bg" },
  { key: "teal", bg: "bg-teal", text: "text-bg" },
  { key: "blue", bg: "bg-blue", text: "text-bg" },
  { key: "green", bg: "bg-green", text: "text-bg" },
  { key: "red", bg: "bg-red", text: "text-bg" },
];

export function colorFor(key) {
  return LABEL_COLORS.find((c) => c.key === key) || LABEL_COLORS[0];
}
