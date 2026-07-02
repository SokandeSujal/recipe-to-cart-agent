"use client";

import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export function MockModeBanner({ compact = false }: { compact?: boolean }) {
  const [visible, setVisible] = useState(
    process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false",
  );

  useEffect(() => {
    let mounted = true;

    fetch("/api/mcp/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((status: { mode?: string; authorized?: boolean }) => {
        if (mounted) {
          setVisible(status.mode !== "real" || status.authorized !== true);
        }
      })
      .catch(() => {
        if (mounted) {
          setVisible(process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={[
        "flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-900",
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
      ].join(" ")}
    >
      <Info size={compact ? 15 : 17} strokeWidth={1.9} />
      <span className="font-semibold">
        Sample data - not connected to Instamart yet.
      </span>
    </div>
  );
}
