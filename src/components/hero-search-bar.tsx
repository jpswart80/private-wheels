"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MakeModelPicker } from "@/components/make-model-picker";
import { LocationPicker } from "@/components/location-picker";
import { serializeMakeSelections, type MakeSelection } from "@/lib/make-model";

/**
 * Hero search: a combined Make & model picker (multi-select, chips) +
 * Location, in one rounded capsule. Content is left-aligned regardless of
 * surrounding text alignment.
 */
export function HeroSearchBar() {
  const router = useRouter();
  const [makes, setMakes] = useState<MakeSelection[]>([]);
  const [province, setProvince] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    const mm = serializeMakeSelections(makes);
    if (mm) params.set("mm", mm);
    if (province) params.set("province", province);
    router.push(`/cars${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="shadow-capsule mx-auto flex max-w-[760px] items-center rounded-[28px] bg-card p-2 pl-2 text-left">
      <div className="flex min-w-0 flex-1 items-center divide-x divide-border">
        <MakeModelPicker value={makes} onChange={setMakes} className="min-w-0 flex-1 pr-2" />
        <LocationPicker
          value={province}
          onChange={setProvince}
          className="w-[128px] shrink-0 pl-2 sm:w-[156px]"
        />
      </div>

      <button
        type="button"
        onClick={handleSearch}
        aria-label="Search"
        className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-[#e00b41]"
      >
        <Search className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
