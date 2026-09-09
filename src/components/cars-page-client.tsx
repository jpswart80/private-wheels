"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useListings } from "@/hooks/use-listings";
import { applyFilters, getPriceRating, sortVehicles } from "@/lib/filter";
import type { FilterState } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/data/constants";
import { VehicleListCard } from "@/components/vehicle-list-card";
import { PlpFilterSidebar } from "@/components/plp-filter-sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CarsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { listings } = useListings();

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

  const filtered = applyFilters(listings, filters);
  const sorted = sortVehicles(filtered, filters.sort);

  function updateSort(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      <div className="border-b py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">All vehicles</h1>
          <p className="mt-1 text-sm text-muted-foreground">{sorted.length} results found</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {/* Results */}
          <div className="min-w-0">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" className="rounded-full lg:hidden">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  }
                />
                <SheetContent side="right" className="w-80 overflow-y-auto p-5">
                  <SheetHeader className="px-0">
                    <SheetTitle>Filter Results</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <PlpFilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="ml-auto flex items-center gap-2">
                <span className="hidden text-sm text-muted-foreground sm:inline">Sort:</span>
                <Select value={filters.sort} onValueChange={updateSort}>
                  <SelectTrigger className="w-[190px]">
                    <SelectValue>
                      {(v: string | null) =>
                        SORT_OPTIONS.find((o) => o.value === v)?.label ?? "Newest First"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-20 text-center">
                <p className="text-lg font-semibold">No vehicles match your filters</p>
                <p className="text-sm text-muted-foreground">
                  Try widening your price range or clearing a filter.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {sorted.map((v) => (
                  <VehicleListCard
                    key={v.id}
                    vehicle={v}
                    priceRating={getPriceRating(v, listings)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Filters — right rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border bg-card p-5">
              <PlpFilterSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
