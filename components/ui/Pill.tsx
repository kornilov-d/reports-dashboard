import type { ReactNode } from "react";

type Tone = "success" | "danger" | "muted" | "info";

const tones: Record<Tone, string> = {
  success: "bg-[#E8F6EE] text-[var(--color-success)]",
  danger: "bg-[#FCE8E8] text-[var(--color-danger)]",
  muted: "bg-[var(--color-line-2)] text-[var(--color-mute)]",
  info: "bg-[#E5F5FB] text-[var(--color-info)]",
};

export default function Pill({
  tone = "muted",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
