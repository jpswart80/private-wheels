import Image from "next/image";
import type { Vehicle } from "@/lib/types";
import { VehiclePlaceholder } from "@/components/vehicle-placeholder";

/**
 * A single vehicle photo at `index`, or the generated placeholder when the
 * listing has no photo (or no photo at that slot). Fills its positioned
 * parent — wrap in a `relative` box with an aspect ratio.
 */
export function VehicleMedia({
  vehicle,
  index = 0,
  sizes,
  className = "object-cover",
  priority = false,
  compact = false,
}: {
  vehicle: Pick<Vehicle, "id" | "images" | "year" | "make" | "model">;
  index?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const src = vehicle.images[index];
  if (!src) {
    return <VehiclePlaceholder seed={`${vehicle.id}-${index}`} compact={compact} />;
  }

  return (
    <Image
      src={src}
      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      fill
      sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"}
      className={className}
      priority={priority}
    />
  );
}
