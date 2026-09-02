"use client";

type State = "checked" | "indeterminate" | "unchecked";

export default function Checkbox({
  state = "unchecked",
  onClick,
  ariaLabel,
}: {
  state?: State;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const filled = state !== "unchecked";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
        filled
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
          : "border-[var(--color-line)] bg-white hover:border-[var(--color-mute)]",
      ].join(" ")}
    >
      {state === "checked" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.5l2.3 2.3L9.5 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {state === "indeterminate" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 6h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
