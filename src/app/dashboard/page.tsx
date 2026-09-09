"use client";

import Link from "next/link";
import { toast } from "sonner";
import { MoreVertical, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useUserListings } from "@/hooks/use-listings";
import { deleteListing, updateListing } from "@/lib/store/listings";
import { formatCurrency, formatMileage } from "@/lib/format";
import { VehiclePlaceholder } from "@/components/vehicle-placeholder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-amber-100 text-amber-700",
  sold: "bg-slate-200 text-slate-700",
  draft: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { listings } = useUserListings(user?.id);

  const activeCount = listings.filter((l) => l.status === "active").length;
  const totalValue = listings
    .filter((l) => l.status === "active")
    .reduce((sum, l) => sum + l.price, 0);

  function handleToggleStatus(id: string, status: string) {
    updateListing(id, { status: status === "active" ? "paused" : "active" });
    toast.success(status === "active" ? "Listing paused." : "Listing reactivated.");
  }

  function handleDelete(id: string) {
    deleteListing(id);
    toast.success("Listing deleted.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground">Manage your vehicle listings.</p>
        </div>
        <Button
          className="rounded-full bg-primary hover:bg-primary/90"
          render={
            <Link href="/dashboard/listings/new">
              <Plus className="h-4 w-4" />
              Create New Listing
            </Link>
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-2xl font-semibold tracking-tight">{listings.length}</p>
          <p className="text-xs text-muted-foreground uppercase">Total Listings</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-2xl font-semibold tracking-tight">{activeCount}</p>
          <p className="text-xs text-muted-foreground uppercase">Active Listings</p>
        </div>
        <div className="col-span-2 rounded-2xl border bg-card p-5 sm:col-span-1">
          <p className="text-2xl font-semibold tracking-tight text-primary">
            {formatCurrency(totalValue)}
          </p>
          <p className="text-xs text-muted-foreground uppercase">Active Listing Value</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Your Listings</h2>

      {listings.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <p className="font-semibold">You haven&apos;t listed a vehicle yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first listing and start reaching buyers today.
          </p>
          <Button
            className="mt-2 rounded-full bg-primary hover:bg-primary/90"
            render={
              <Link href="/dashboard/listings/new">
                <Plus className="h-4 w-4" />
                Create New Listing
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                <VehiclePlaceholder seed={listing.id} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {listing.year} {listing.make} {listing.model} {listing.variant}
                  </p>
                  <Badge className={STATUS_STYLES[listing.status]} variant="secondary">
                    {listing.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(listing.price)} · {formatMileage(listing.mileage)} ·{" "}
                  {listing.town}, {listing.province}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  render={
                    <Link href={`/dashboard/listings/${listing.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleStatus(listing.id, listing.status)}>
                      {listing.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4" /> Pause Listing
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" /> Reactivate Listing
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete Listing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
