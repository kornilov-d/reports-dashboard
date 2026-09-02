import { Plus } from "@/components/icons";
import Button from "@/components/ui/Button";

export default function EmptyState({
  title = "You don't have any shows yet",
  subtitle = "Create shows to start",
  ctaLabel = "Add shows",
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <Ticket />
      <h2 className="mt-8 text-[18px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-[14px] text-[var(--color-mute)]">{subtitle}</p>
      <div className="mt-6">
        <Button leading={<Plus size={16} />}>{ctaLabel}</Button>
      </div>
    </div>
  );
}

function Ticket() {
  return (
    <svg
      width="116"
      height="116"
      viewBox="0 0 116 116"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(-14 58 58)">
        <rect
          x="22"
          y="30"
          width="72"
          height="56"
          rx="8"
          fill="var(--color-platinum-haze)"
        />
        <circle cx="58" cy="30" r="6" fill="white" />
        <circle cx="58" cy="86" r="6" fill="white" />
        <text
          x="58"
          y="58"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="800"
          fontSize="14"
          letterSpacing="2"
          fill="var(--color-platinum-monday)"
        >
          OPERA
        </text>
        <text
          x="58"
          y="74"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          fontSize="9"
          letterSpacing="3"
          fill="var(--color-platinum-monday)"
        >
          TICKET
        </text>
      </g>
    </svg>
  );
}
