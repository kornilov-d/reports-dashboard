import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)] disabled:opacity-40",
  secondary:
    "border border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-line-2)] disabled:opacity-40",
  ghost:
    "text-[var(--color-ink)] hover:bg-[var(--color-line-2)] disabled:opacity-40",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-md",
  md: "h-10 px-4 text-[14px] gap-2 rounded-lg",
  lg: "h-11 px-5 text-[15px] gap-2 rounded-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  leading,
  trailing,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center font-medium transition-colors",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}
