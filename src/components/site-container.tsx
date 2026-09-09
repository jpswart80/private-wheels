import { cn } from "@/lib/utils";

/**
 * The one content grid the whole site aligns to — header, page content
 * and footer all wrap their contents in this so left/right edges line up.
 */
export function SiteContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
