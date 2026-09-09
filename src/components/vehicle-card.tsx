"use client";

import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, MapPin, Settings2 } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { formatCurrency, formatMileage } from "@/lib/format";
import { VehiclePlaceholder } from "@/components/vehicle-placeholder";
import { cn } from "@/lib/utils";

/**
 * Compact vehicle card for the home page and PDP "similar" rail:
 * condition / price-drop badges + a location chip over the image, then
 * year → title → icon spec row → labelled price (with the pre-drop price
 * struck through and the live price in brand red).
 *
 * Standard footprint: never narrower than MIN_TILE_WIDTH. Parents lay
 * these out at that width or wider — `w-[260px] shrink-0` in a scroll
 * row, `repeat(auto-fill, minmax(260px, 1fr))` in a grid.
 */
export const MIN_TILE_WIDTH = 260;

export function VehicleCard({
  vehicle,
  className,
}: {
  vehicle: Vehicle;
  className?: string;
}) {
  const hasPriceDrop =
    typeof vehicle.originalPrice === "number" && vehicle.originalPrice > vehicle.price;

  return (
    <Link
      href={`/cars/${vehicle.id}`}
      className={cn("group block w-full min-w-[260px]", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        {vehicle.images[0] ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            sizes="(min-width: 1024px) 280px, 90vw"
            className="object-cover"
          />
        ) : (
          <VehiclePlaceholder seed={vehicle.id} />
        )}

        {/* Badge stack */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {vehicle.condition !== "Used" && (
            <span className="shadow-pill rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold">
              {vehicle.condition}
            </span>
          )}
          {hasPriceDrop && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              Price drop
            </span>
          )}
        </div>

        {/* Location */}
        <span className="absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{vehicle.town}</span>
        </span>
      </div>

      <div className="mt-3">
        {/* Year + title */}
        <p className="text-xs font-medium text-muted-foreground">{vehicle.year}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium tracking-tight">
          {vehicle.make} {vehicle.model} {vehicle.variant}
        </h3>

        {/* Spec row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {vehicle.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            {vehicle.transmission}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 border-t pt-3">
          <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Price
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <p
              className={cn(
                "text-base font-semibold tracking-tight",
                hasPriceDrop && "text-primary",
              )}
            >
              {formatCurrency(vehicle.price)}
            </p>
            {hasPriceDrop && (
              <s className="text-xs text-muted-foreground">
                {formatCurrency(vehicle.originalPrice!)}
              </s>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
