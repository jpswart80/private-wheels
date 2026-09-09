"use client";

import { Check } from "lucide-react";
import { PickerField } from "@/components/picker-field";
import { PROVINCES } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

/**
 * Province picker for the hero search — same panel styling as the
 * make/model field, single select.
 */
export function LocationPicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <PickerField
        panelClassName="w-[min(260px,calc(100vw-2rem))]"
        trigger={({ open, toggle }) => (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="w-full px-3 py-2 text-left"
          >
            <span className="block text-[13px] font-medium">Location</span>
            <span className="mt-1 flex h-8 items-center text-sm">
              <span
                className={cn(
                  "truncate",
                  value ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {value || "Anywhere"}
              </span>
            </span>
          </button>
        )}
      >
        {(close) => (
          <div className="overflow-y-auto py-1">
            {["", ...PROVINCES].map((p) => (
              <button
                key={p || "any"}
                type="button"
                onClick={() => {
                  onChange(p);
                  close();
                }}
                className={cn(
                  "flex w-full items-center gap-2 py-2 pr-3 pl-4 text-left text-sm hover:bg-muted",
                  value === p && "font-semibold",
                )}
              >
                <span className="flex-1 truncate">{p || "Anywhere"}</span>
                {value === p && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </PickerField>
    </div>
  );
}
