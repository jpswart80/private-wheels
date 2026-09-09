"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useListings } from "@/hooks/use-listings";
import { maxVehiclePrice, DEFAULT_INTEREST_RATE } from "@/lib/finance";
import { formatCurrency } from "@/lib/format";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TERMS = [48, 60, 72, 84];

/**
 * Home-page "what can I afford" hook: a monthly budget + deposit + term
 * resolves to a ceiling price and a live count of matching listings,
 * then drops the buyer straight into a filtered search.
 */
export function BudgetMatcher() {
  const { listings } = useListings();
  const [monthly, setMonthly] = useState("6000");
  const [deposit, setDeposit] = useState("30000");
  const [term, setTerm] = useState("72");

  const ceiling = useMemo(
    () =>
      Math.round(
        maxVehiclePrice({
          monthlyInstalment: Number(monthly) || 0,
          deposit: Number(deposit) || 0,
          rate: DEFAULT_INTEREST_RATE,
          termMonths: Number(term),
        }) / 1000,
      ) * 1000,
    [monthly, deposit, term],
  );

  const matches = useMemo(
    () => listings.filter((v) => v.price <= ceiling).length,
    [listings, ceiling],
  );

  return (
    <div className="grid gap-8 rounded-2xl border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          Buy within your budget
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Tell us what you can pay each month
        </h2>
        <p className="mt-2 max-w-md text-sm leading-[1.5] text-muted-foreground">
          We&apos;ll show you every private listing that fits — at{" "}
          {DEFAULT_INTEREST_RATE}% over {term} months. No sign-up, no credit check.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Field label="Monthly budget (R)">
            <Input
              type="number"
              inputMode="numeric"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
            />
          </Field>
          <Field label="Deposit (R)">
            <Input
              type="number"
              inputMode="numeric"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </Field>
          <Field label="Term">
            <Select value={term} onValueChange={(v) => v && setTerm(v)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(v: string | null) => `${v ?? term} months`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TERMS.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-xl bg-muted p-6 text-center">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Search up to
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{formatCurrency(ceiling)}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{matches}</span> private{" "}
          {matches === 1 ? "listing" : "listings"} match
        </p>
        <Link
          href={`/cars?priceMax=${ceiling}&sort=price-desc`}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          See your matches
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase">{label}</Label>
      {children}
    </div>
  );
}
