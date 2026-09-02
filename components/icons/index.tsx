import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  const { strokeWidth = 1.6, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function PlIcon({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0D0D10" />
      <path
        d="M11 9h6.5a4.5 4.5 0 0 1 0 9H13v5h-2V9z"
        fill="#FFFFFF"
      />
      <path d="M13 11.4v4.2h4.2a2.1 2.1 0 0 0 0-4.2H13z" fill="#0D0D10" />
    </svg>
  );
}

export function ChevronRight(p: IconProps) {
  return <svg {...base(p)}><path d="M9 6l6 6-6 6" /></svg>;
}
export function ChevronLeft(p: IconProps) {
  return <svg {...base(p)}><path d="M15 6l-6 6 6 6" /></svg>;
}
export function ChevronDown(p: IconProps) {
  return <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>;
}
export function ChevronUp(p: IconProps) {
  return <svg {...base(p)}><path d="M18 15l-6-6-6 6" /></svg>;
}
export function Search(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
export function Dots(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function Plus(p: IconProps) {
  return <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
}
export function Pencil(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h4l10-10-4-4L4 16v4z" />
      <path d="M14 6l4 4" />
    </svg>
  );
}
export function Close(p: IconProps) {
  return <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
export function ArrowUpDown(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M7 4v16M7 4l-3 3M7 4l3 3" />
      <path d="M17 20V4M17 20l-3-3M17 20l3-3" />
    </svg>
  );
}
export function Gear(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9 1.7 1.7 0 0 0 4.31 7.13l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.65 1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.31.66.97 1.06 1.69 1.06H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
    </svg>
  );
}

/* Sidebar icons */
export function IconList(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconBox(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}
export function IconChart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9l6 5.2" />
    </svg>
  );
}
export function IconBarcode(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14" />
    </svg>
  );
}
export function IconMail(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
export function IconTicket(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M13 5v14" strokeDasharray="2 2" />
    </svg>
  );
}
export function IconCard(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
export function IconChat(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );
}
export function IconBadge(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 2l2.4 2 3.1-.5.6 3.1 2.6 1.8-1.4 2.8 1.4 2.8-2.6 1.8-.6 3.1-3.1-.5L12 22l-2.4-2-3.1.5-.6-3.1L3.3 15.6 4.7 12.8 3.3 10l2.6-1.8.6-3.1L9.6 4 12 2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
export function IconTag(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M20 12V5h-7L3 15l6 6 11-9z" />
      <circle cx="16" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconInfo(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </svg>
  );
}
export function IconStar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
    </svg>
  );
}
export function IconPeople(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="8" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M14 20c0-2.5 1.6-4.7 4-5.6" />
    </svg>
  );
}
export function IconPlay(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function Help(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3" />
      <path d="M12 17v.01" />
    </svg>
  );
}
export function Folder(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}
export function DragHandle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function ImageIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M21 17l-5-5-9 9" />
    </svg>
  );
}
export function FrameIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 7h18M3 17h18M7 3v18M17 3v18" />
    </svg>
  );
}
export function Bolt(p: IconProps) {
  return (
    <svg {...base(p)} fill="currentColor" stroke="none">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
export function Trash(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 7h16" />
      <path d="M10 7V4h4v3" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v7M14 11v7" />
    </svg>
  );
}
export function PlusSmall(p: IconProps) {
  return <svg {...base(p)}><path d="M12 6v12M6 12h12" /></svg>;
}
export function Calendar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
export function Clock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
export function IconTicket2(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V8z" />
    </svg>
  );
}
