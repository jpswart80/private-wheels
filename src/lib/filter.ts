import type { FilterState, Vehicle } from "@/lib/types";
import { parseMakeSelections, vehicleMatchesSelections } from "@/lib/make-model";

export const EMPTY_FILTERS: FilterState = {
  make: "",
  model: "",
  mm: "",
  priceMin: "",
  priceMax: "",
  yearMin: "",
  yearMax: "",
  province: "",
  condition: "",
  transmission: "",
  fuelType: "",
  bodyType: "",
  sort: "newest",
};

export function applyFilters(vehicles: Vehicle[], filters: Partial<FilterState>): Vehicle[] {
  const selections = filters.mm ? parseMakeSelections(filters.mm) : [];

  return vehicles.filter((v) => {
    if (selections.length > 0 && !vehicleMatchesSelections(v, selections)) return false;
    if (filters.make && v.make !== filters.make) return false;
    if (filters.model) {
      // `model` may be a comma-separated list ("Golf,Polo") from the hero search.
      const terms = filters.model
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      const model = v.model.toLowerCase();
      if (terms.length > 0 && !terms.some((t) => model.includes(t))) return false;
    }
    if (filters.province && v.province !== filters.province) return false;
    if (filters.condition && v.condition !== filters.condition) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    if (filters.fuelType && v.fuelType !== filters.fuelType) return false;
    if (filters.bodyType && v.bodyType !== filters.bodyType) return false;

    const priceMin = filters.priceMin ? Number(filters.priceMin) : undefined;
    const priceMax = filters.priceMax ? Number(filters.priceMax) : undefined;
    if (priceMin !== undefined && !Number.isNaN(priceMin) && v.price < priceMin) return false;
    if (priceMax !== undefined && !Number.isNaN(priceMax) && v.price > priceMax) return false;

    const yearMin = filters.yearMin ? Number(filters.yearMin) : undefined;
    const yearMax = filters.yearMax ? Number(filters.yearMax) : undefined;
    if (yearMin !== undefined && !Number.isNaN(yearMin) && v.year < yearMin) return false;
    if (yearMax !== undefined && !Number.isNaN(yearMax) && v.year > yearMax) return false;

    return true;
  });
}

export function sortVehicles(vehicles: Vehicle[], sort: string | undefined): Vehicle[] {
  const sorted = [...vehicles];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "mileage-asc":
      return sorted.sort((a, b) => a.mileage - b.mileage);
    case "year-asc":
      return sorted.sort((a, b) => a.year - b.year);
    case "year-desc":
      return sorted.sort((a, b) => b.year - a.year);
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function countActiveFilters(filters: Partial<FilterState>): number {
  const { sort: _sort, mm, ...rest } = filters;
  void _sort;
  const base = Object.values(rest).filter((v) => v && v.length > 0).length;
  return base + (mm ? parseMakeSelections(mm).length : 0);
}

export type PriceRating = "great" | "fair" | null;

/**
 * Cheap price-intelligence signal: compares a listing against peers of the
 * same body type within ±2 model years. "Great" = 10%+ below the peer
 * median, "Fair" = within 5% of it. Returns null when there aren't enough
 * comparable listings to say anything useful.
 */
export function getPriceRating(vehicle: Vehicle, all: Vehicle[]): PriceRating {
  const peers = all.filter(
    (v) =>
      v.id !== vehicle.id &&
      v.bodyType === vehicle.bodyType &&
      Math.abs(v.year - vehicle.year) <= 2,
  );
  if (peers.length < 4) return null;

  const prices = peers.map((p) => p.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];

  if (vehicle.price <= median * 0.9) return "great";
  if (vehicle.price <= median * 1.05) return "fair";
  return null;
}
