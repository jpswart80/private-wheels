import type { NewVehicleInput, User, Vehicle } from "@/lib/types";
import { VEHICLES } from "@/lib/data/seed-vehicles";

/**
 * Mock listings store. User-created listings persist to localStorage and are
 * merged with the seed catalogue everywhere listings are read, so the buy
 * flow, the seller dashboard, and the VDP all stay in sync. Like
 * `store/auth.ts`, this is the seam that gets reimplemented against Supabase
 * (Postgres + storage) later — pages should only ever call these functions.
 *
 * Exposes a tiny pub/sub (subscribeListings) so `useSyncExternalStore` can
 * read this store directly and re-render automatically after a mutation —
 * no manual refresh() calls needed at the call site. Reads are cached by a
 * version counter so repeated calls return referentially stable arrays
 * between mutations, which `useSyncExternalStore` requires.
 */

const LISTINGS_KEY = "pw_user_listings";

function isBrowser() {
  return typeof window !== "undefined";
}

function readUserListings(): Vehicle[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(LISTINGS_KEY);
    return raw ? (JSON.parse(raw) as Vehicle[]) : [];
  } catch {
    return [];
  }
}

function writeUserListings(listings: Vehicle[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;

function notify() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeListings(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let mergedVersion = -1;
let mergedCache: Vehicle[] = [];

function getMerged(): Vehicle[] {
  if (mergedVersion !== version) {
    mergedCache = [...readUserListings(), ...VEHICLES];
    mergedVersion = version;
  }
  return mergedCache;
}

let activeVersion = -1;
let activeCache: Vehicle[] = [];

export function getAllListings(): Vehicle[] {
  const merged = getMerged();
  if (activeVersion !== version) {
    activeCache = merged.filter((v) => v.status === "active");
    activeVersion = version;
  }
  return activeCache;
}

export function getListingById(id: string): Vehicle | undefined {
  return getMerged().find((v) => v.id === id);
}

const byUserCache = new Map<string, { version: number; data: Vehicle[] }>();

export function getListingsByUser(userId: string): Vehicle[] {
  const cached = byUserCache.get(userId);
  if (cached && cached.version === version) return cached.data;

  const data = getMerged().filter((v) => v.sellerId === userId);
  byUserCache.set(userId, { version, data });
  return data;
}

export function createListing(input: NewVehicleInput, user: User): Vehicle {
  const listing: Vehicle = {
    ...input,
    id: `listing-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    images: input.images ?? [],
    featured: false,
    status: "active",
    sellerId: user.id,
    sellerName: user.name,
    phone: "Not provided",
    createdAt: new Date().toISOString(),
  };

  writeUserListings([listing, ...readUserListings()]);
  notify();
  return listing;
}

export function updateListing(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
  const listings = readUserListings();
  const index = listings.findIndex((v) => v.id === id);
  if (index === -1) return undefined;

  const updated = { ...listings[index], ...updates };
  listings[index] = updated;
  writeUserListings(listings);
  notify();
  return updated;
}

export function deleteListing(id: string): void {
  writeUserListings(readUserListings().filter((v) => v.id !== id));
  notify();
}
