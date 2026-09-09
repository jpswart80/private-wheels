"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared shell for the hero-search fields: caller renders the trigger, this
 * owns the open state, outside-click / Escape close, and the dropdown panel
 * container. Give the panel a width via `panelClassName`.
 */
export function PickerField({
  panelClassName,
  onOpenChange,
  trigger,
  children,
}: {
  panelClassName?: string;
  onOpenChange?: (open: boolean) => void;
  trigger: (ctx: { open: boolean; toggle: () => void }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  function change(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) change(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") change(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = () => change(!open);

  return (
    <div ref={rootRef} className="relative">
      {trigger({ open, toggle })}

      {open && (
        <div
          className={cn(
            "shadow-capsule absolute top-full left-0 z-50 mt-2 flex max-h-[min(440px,70vh)] flex-col overflow-hidden rounded-2xl border bg-card",
            panelClassName,
          )}
        >
          {children(() => change(false))}
        </div>
      )}
    </div>
  );
}
