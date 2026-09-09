"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal snap-scrolling row with desktop arrow controls — the
 * primary way the home page surfaces vehicle collections (Style 1).
 * Pass `action` to add a "see more" link beside the arrows.
 */
export function ScrollRow({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <ChevronRight className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-4">
          {action && (
            <Link
              href={action.href}
              className="shrink-0 text-sm font-medium text-primary hover:underline"
            >
              {action.label}
            </Link>
          )}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount(-600)}
              className="shadow-pill flex h-8 w-8 items-center justify-center rounded-full bg-card transition-transform hover:scale-105"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount(600)}
              className="shadow-pill flex h-8 w-8 items-center justify-center rounded-full bg-card transition-transform hover:scale-105"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}
