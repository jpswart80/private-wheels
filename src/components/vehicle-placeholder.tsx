import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-[#f7f7f7] via-[#f0f0f0] to-[#ebebeb]",
  "from-[#efefef] via-[#e8e8e8] to-[#e0e0e0]",
  "from-[#f2f2f2] via-[#ededed] to-[#e4e4e4]",
  "from-[#f7f7f7] via-[#eeeeee] to-[#e2e2e2]",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function VehiclePlaceholder({
  seed,
  className,
  compact = false,
}: {
  seed: string;
  className?: string;
  /** Enlarges the glyph for small thumbnails. */
  compact?: boolean;
}) {
  const gradient = GRADIENTS[hashString(seed) % GRADIENTS.length];

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <Car
        className={cn("text-black/10", compact ? "h-1/2 w-1/2" : "h-1/3 w-1/3 min-h-10 min-w-10")}
        strokeWidth={1.25}
      />
    </div>
  );
}
