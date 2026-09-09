import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Tag } from "lucide-react";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { VehicleCard } from "@/components/vehicle-card";
import { ScrollRow } from "@/components/scroll-row";
import { BudgetMatcher } from "@/components/budget-matcher";
import { SiteContainer } from "@/components/site-container";
import { VEHICLES, getFeaturedVehicles, getLatestVehicles } from "@/lib/data/seed-vehicles";
import { formatCurrency } from "@/lib/format";
import { BODY_TYPES } from "@/lib/data/constants";

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Verified private sellers",
    body: "Every seller confirms their identity before a listing goes live — you always know who you're dealing with.",
  },
  {
    icon: Tag,
    title: "No dealer mark-up",
    body: "You buy at the owner's price. Real-time pricing data keeps every listing honest.",
  },
  {
    icon: MessageCircle,
    title: "Talk to the owner directly",
    body: "Message or call the person who actually drove the car. No middleman, no sales floor.",
  },
];

export default function HomePage() {
  const featured = getFeaturedVehicles(10);
  const latest = getLatestVehicles(10);

  const totalValue = VEHICLES.reduce((sum, v) => sum + v.price, 0);
  const sellerCount = new Set(VEHICLES.map((v) => v.sellerId)).size;

  const styleCounts = BODY_TYPES.map((bt) => ({
    bodyType: bt,
    count: VEHICLES.filter((v) => v.bodyType === bt).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const makeCounts = [...new Set(VEHICLES.map((v) => v.make))]
    .map((make) => ({ make, count: VEHICLES.filter((v) => v.make === make).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return (
    <div>
      {/* Hero — contained banner */}
      <section className="pt-6 pb-2">
        <SiteContainer>
          <div className="relative rounded-3xl border bg-muted px-6 py-14 text-center sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-70 [background:radial-gradient(55%_65%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_72%)]"
            />
            <div className="relative mx-auto max-w-[820px]">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                South Africa&apos;s private vehicle marketplace
              </p>
              <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Buy your next car straight from the owner
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base leading-[1.5] text-muted-foreground">
                {VEHICLES.length} cars listed by verified private sellers — no dealer
                mark-ups, no middlemen, no pressure.
              </p>

              <div className="mt-8">
                <HeroSearchBar />
              </div>

              <div className="mx-auto mt-6 flex flex-wrap justify-center gap-2.5">
                {styleCounts.map(({ bodyType, count }) => (
                  <Link
                    key={bodyType}
                    href={`/cars?bodyType=${encodeURIComponent(bodyType)}`}
                    className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 text-sm font-medium ring-1 ring-border transition-all hover:bg-muted hover:ring-foreground/30 hover:shadow-capsule"
                  >
                    {bodyType}
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* Featured */}
      <section className="border-y bg-muted/40 py-6">
        <SiteContainer>
          <ScrollRow
            title="Featured this week"
            action={{ href: "/cars?sort=newest", label: "See more" }}
          >
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} className="w-[260px] shrink-0" />
            ))}
          </ScrollRow>
        </SiteContainer>
      </section>

      {/* Budget matcher */}
      <section className="py-14">
        <SiteContainer>
          <BudgetMatcher />
        </SiteContainer>
      </section>

      {/* Just added */}
      <section className="border-y bg-muted/40 py-6">
        <SiteContainer>
          <ScrollRow
            title="Just added"
            action={{ href: "/cars?sort=newest", label: "See more" }}
          >
            {latest.map((v) => (
              <VehicleCard key={v.id} vehicle={v} className="w-[260px] shrink-0" />
            ))}
          </ScrollRow>
        </SiteContainer>
      </section>

      {/* Shop by make */}
      <section className="py-14">
        <SiteContainer>
          <SectionHead title="Shop by make" href="/cars" linkLabel="All makes" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {makeCounts.map(({ make, count }) => (
              <Link
                key={make}
                href={`/cars?make=${encodeURIComponent(make)}`}
                className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm transition-shadow hover:shadow-capsule"
              >
                <span className="font-medium">{make}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* Why private */}
      <section className="border-t bg-muted/40 py-16">
        <SiteContainer>
          <h2 className="text-2xl font-semibold tracking-tight">Why buy privately?</h2>
          <p className="mt-2 max-w-lg text-sm leading-[1.5] text-muted-foreground">
            A private sale can save you tens of thousands — if you can trust the seller and
            the price. That&apos;s the part we fixed.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {TRUST.map((t) => (
              <div key={t.title} className="flex flex-col gap-3">
                <t.icon className="h-6 w-6" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold">{t.title}</h3>
                <p className="text-sm leading-[1.5] text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-8">
            <Stat value={`${VEHICLES.length}`} label="Cars listed" />
            <Stat value={`${sellerCount}+`} label="Private sellers" />
            <Stat value={formatCurrency(totalValue)} label="In listings" />
          </div>
        </SiteContainer>
      </section>

      {/* Sell CTA */}
      <section className="py-16">
        <SiteContainer>
          <div className="grid overflow-hidden rounded-3xl border sm:grid-cols-2">
            <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Selling instead?
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                List your car in minutes, reach real buyers
              </h2>
              <p className="max-w-md text-sm leading-[1.5] text-muted-foreground">
                Create a listing with our guided wizard, set your own price, and field
                enquiries directly. You stay in control the whole way.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sell your car
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/finance"
                  className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Finance calculator
                </Link>
              </div>
            </div>
            <ol className="flex flex-col justify-center gap-6 bg-muted p-8 sm:p-12">
              {[
                "Add your car's details and photos",
                "Set your price — we show you the market range",
                "Reply to buyers and arrange a viewing",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-[1.5]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}

function SectionHead({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  );
}
