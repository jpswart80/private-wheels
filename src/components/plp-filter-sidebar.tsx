"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  BODY_TYPES,
  CONDITIONS,
  FUEL_TYPES,
  MAKES,
  PROVINCES,
  TRANSMISSIONS,
} from "@/lib/data/constants";
import { countActiveFilters } from "@/lib/filter";
import type { FilterState } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AllAwareValue({ placeholder }: { placeholder: string }) {
  return (
    <SelectValue>{(v: string | null) => (!v || v === "all" ? placeholder : v)}</SelectValue>
  );
}

const FILTER_KEYS: (keyof FilterState)[] = [
  "make",
  "model",
  "mm",
  "priceMin",
  "priceMax",
  "yearMin",
  "yearMax",
  "province",
  "condition",
  "transmission",
  "fuelType",
  "bodyType",
];

export function PlpFilterSidebar({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: FilterState = {
    make: searchParams.get("make") ?? "",
    model: searchParams.get("model") ?? "",
    mm: searchParams.get("mm") ?? "",
    priceMin: searchParams.get("priceMin") ?? "",
    priceMax: searchParams.get("priceMax") ?? "",
    yearMin: searchParams.get("yearMin") ?? "",
    yearMax: searchParams.get("yearMax") ?? "",
    province: searchParams.get("province") ?? "",
    condition: searchParams.get("condition") ?? "",
    transmission: searchParams.get("transmission") ?? "",
    fuelType: searchParams.get("fuelType") ?? "",
    bodyType: searchParams.get("bodyType") ?? "",
    sort: searchParams.get("sort") ?? "newest",
  };

  function update(key: keyof FilterState, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // The sidebar's single make/model controls and the hero's stacked
    // `mm` selection can't both be live — the sidebar wins here.
    if (key === "make" || key === "model") params.delete("mm");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    onApplied?.();
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));
    const rest = params.toString();
    router.replace(rest ? `${pathname}?${rest}` : pathname, { scroll: false });
    onApplied?.();
  }

  const activeCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          Filter Results
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 px-2 text-xs">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Make</Label>
        <Select value={filters.make || "all"} onValueChange={(v) => update("make", v === "all" ? "" : v)}>
          <SelectTrigger className="w-full">
            <AllAwareValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {MAKES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Model</Label>
        <Input
          placeholder="e.g. Golf, Polo, X5"
          defaultValue={filters.model}
          onBlur={(e) => update("model", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && update("model", e.currentTarget.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Price Range (R)
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={filters.priceMin}
            onBlur={(e) => update("priceMin", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={filters.priceMax}
            onBlur={(e) => update("priceMax", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Year</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            defaultValue={filters.yearMin}
            onBlur={(e) => update("yearMin", e.target.value)}
          />
          <Input
            type="number"
            placeholder="To"
            defaultValue={filters.yearMax}
            onBlur={(e) => update("yearMax", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Province</Label>
        <Select
          value={filters.province || "all"}
          onValueChange={(v) => update("province", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <AllAwareValue placeholder="All Provinces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Condition</Label>
        <Select
          value={filters.condition || "all"}
          onValueChange={(v) => update("condition", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <AllAwareValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Condition</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Transmission
        </Label>
        <Select
          value={filters.transmission || "all"}
          onValueChange={(v) => update("transmission", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <AllAwareValue placeholder="Any Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Transmission</SelectItem>
            {TRANSMISSIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Fuel Type</Label>
        <Select
          value={filters.fuelType || "all"}
          onValueChange={(v) => update("fuelType", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <AllAwareValue placeholder="Any Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Fuel Type</SelectItem>
            {FUEL_TYPES.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Body Type</Label>
        <Select
          value={filters.bodyType || "all"}
          onValueChange={(v) => update("bodyType", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <AllAwareValue placeholder="Any Body Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Body Type</SelectItem>
            {BODY_TYPES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
