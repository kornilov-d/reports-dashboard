"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/icons";
import Button from "@/components/ui/Button";
import IntegrationDetail from "@/components/inventory/integration/IntegrationDetail";
import NewIntegrationModal from "@/components/inventory/integration/NewIntegrationModal";

const PLATFORMS = ["DTCM"];

export default function Integration() {
  const [connected, setConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);

  if (connected) return <IntegrationDetail />;

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <Ticket />
        <h2 className="mt-8 text-[18px] font-semibold tracking-tight">
          You don&apos;t have any integrations set yet
        </h2>
        <p className="mt-1 text-[14px] text-[var(--color-mute)]">
          Choose the platform to start
        </p>

        <div className="mt-6 flex w-full max-w-[340px] flex-col gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left text-[14px] hover:border-[var(--color-mute-2)]"
            >
              <span
                className={
                  platform ? "text-[var(--color-ink)]" : "text-[var(--color-mute-2)]"
                }
              >
                {platform ?? "Select platform"}
              </span>
              <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
            </button>
            {open && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setPlatform(p);
                      setOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-[13px] hover:bg-[var(--color-line-2)]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            size="lg"
            disabled={!platform}
            onClick={() => setModalOpen(true)}
          >
            Set up
          </Button>
        </div>
      </div>

      <NewIntegrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {
          setModalOpen(false);
          setConnected(true);
        }}
      />
    </>
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
