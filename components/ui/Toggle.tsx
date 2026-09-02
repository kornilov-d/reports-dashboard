"use client";

export default function Toggle({
  on,
  onChange,
  ariaLabel,
  size = "md",
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
}) {
  const dims =
    size === "sm"
      ? { w: 32, h: 18, knob: 14 }
      : { w: 40, h: 22, knob: 18 };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => onChange(!on)}
      className={[
        "relative inline-flex shrink-0 items-center rounded-full transition-colors",
        on ? "bg-[var(--color-ink)]" : "bg-[var(--color-line)]",
      ].join(" ")}
      style={{ width: dims.w, height: dims.h }}
    >
      <span
        className="absolute rounded-full bg-white shadow-sm transition-transform"
        style={{
          width: dims.knob,
          height: dims.knob,
          top: (dims.h - dims.knob) / 2,
          left: 2,
          transform: on ? `translateX(${dims.w - dims.knob - 4}px)` : "none",
        }}
      />
    </button>
  );
}
