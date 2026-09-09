"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Check,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { useListing, useListings } from "@/hooks/use-listings";
import type { Vehicle } from "@/lib/types";
import { formatCurrency, formatMileage } from "@/lib/format";
import { VehiclePlaceholder } from "@/components/vehicle-placeholder";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SPEC_ROWS = (v: Vehicle) => [
  { label: "Year", value: v.year },
  { label: "Mileage", value: formatMileage(v.mileage) },
  { label: "Transmission", value: v.transmission },
  { label: "Fuel Type", value: v.fuelType },
  { label: "Body Type", value: v.bodyType },
  { label: "Condition", value: v.condition },
  { label: "Previous Owners", value: v.previousOwners },
  { label: "Service History", value: v.serviceHistory },
  { label: "Accident History", value: v.accidentHistory },
  { label: "Colour", value: v.colour },
];

export function VehicleDetailClient({ id }: { id: string }) {
  const { listing } = useListing(id);
  const { listings } = useListings();
  const [numberRevealed, setNumberRevealed] = useState(false);

  if (!listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Vehicle not found</h1>
        <p className="mt-2 text-muted-foreground">
          This listing may have been removed or sold.
        </p>
        <Button className="mt-6" render={<Link href="/cars">Back to all vehicles</Link>} />
      </div>
    );
  }

  const similar = listings
    .filter((v) => v.id !== listing.id && (v.bodyType === listing.bodyType || v.make === listing.make))
    .slice(0, 4);

  function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Enquiry sent to the seller — they'll be in touch soon.");
  }

  return (
    <div>
      <div className="border-b py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-sm sm:px-6 lg:px-8">
          <Link
            href="/cars"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium">
            {listing.year} {listing.make} {listing.model}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <VehiclePlaceholder seed={listing.id} />
              {listing.featured && (
                <span className="shadow-pill absolute top-3 left-3 rounded-full bg-card px-3 py-1.5 text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg">
                  <VehiclePlaceholder seed={`${listing.id}-${i}`} compact />
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
              Technical Specification Sheet
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {SPEC_ROWS(listing).map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground uppercase">{row.label}</p>
                  <p className="font-semibold">{row.value}</p>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
              Vehicle Features
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {listing.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
              Description
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {listing.description}
            </p>
          </div>

          <aside>
            <div className="shadow-capsule sticky top-24 flex flex-col gap-4 rounded-2xl bg-card p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {listing.year} {listing.make}
                </p>
                <h1 className="text-xl font-semibold tracking-tight">
                  {listing.model} {listing.variant}
                </h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {listing.town}, {listing.province}
                </p>
              </div>

              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {formatCurrency(listing.price)}
                </p>
                <p className="text-xs text-muted-foreground">Incl. VAT / Excl. Finance</p>
              </div>

              <Button
                variant="outline"
                className="rounded-full"
                render={
                  <Link href={`/finance?price=${listing.price}`}>
                    <Calculator className="h-4 w-4" />
                    Calculate Finance
                  </Link>
                }
              />

              <Separator />

              <div>
                <p className="mb-2 text-sm font-semibold">Contact Seller</p>
                <div className="flex flex-col gap-2">
                  <Button
                    className="rounded-full bg-foreground text-background hover:opacity-90"
                    onClick={() => setNumberRevealed(true)}
                  >
                    <Phone className="h-4 w-4" />
                    {numberRevealed ? listing.phone : "Click to Reveal Number"}
                  </Button>

                  <Dialog>
                    <DialogTrigger
                      render={
                        <Button variant="outline" className="rounded-full">
                          <Mail className="h-4 w-4" />
                          Enquire Now
                        </Button>
                      }
                    />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Enquire about {listing.year} {listing.make} {listing.model}
                        </DialogTitle>
                        <DialogDescription>
                          Send {listing.sellerName.split(" ")[0]} a message about this vehicle.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="enquiry-name">Your Name</Label>
                          <Input id="enquiry-name" required placeholder="Jane Doe" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="enquiry-email">Email</Label>
                          <Input id="enquiry-email" type="email" required placeholder="you@example.com" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="enquiry-message">Message</Label>
                          <Textarea
                            id="enquiry-message"
                            required
                            defaultValue={`Hi, is the ${listing.year} ${listing.make} ${listing.model} still available?`}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                            Send Enquiry
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold tracking-tight">Similar vehicles</h2>
            <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">
              {similar.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
