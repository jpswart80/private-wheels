"use client";

import { useSyncExternalStore } from "react";
import { VEHICLES } from "@/lib/data/seed-vehicles";
import {
  getAllListings,
  getListingById,
  getListingsByUser,
  subscribeListings,
} from "@/lib/store/listings";

/**
 * Reads the listings store via `useSyncExternalStore` so components
 * re-render automatically after a mutation (create/update/delete) — no
 * manual refresh() needed. The server snapshot is seed-data-only so it
 * matches what the server rendered; React resolves to the real
 * (seed + localStorage) snapshot right after hydration.
 */
export function useListings() {
  const listings = useSyncExternalStore(subscribeListings, getAllListings, () => VEHICLES);
  return { listings };
}

export function useListing(id: string) {
  const listing = useSyncExternalStore(
    subscribeListings,
    () => getListingById(id),
    () => VEHICLES.find((v) => v.id === id),
  );
  return { listing };
}

const EMPTY_LISTINGS: ReturnType<typeof getListingsByUser> = [];

export function useUserListings(userId: string | undefined) {
  const listings = useSyncExternalStore(
    subscribeListings,
    () => (userId ? getListingsByUser(userId) : EMPTY_LISTINGS),
    () => EMPTY_LISTINGS,
  );
  return { listings };
}
