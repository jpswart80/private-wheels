"use client";

import { useSearchParams } from "next/navigation";
import { FinanceCalculator } from "@/components/finance-calculator";

export function FinanceCalculatorClient() {
  const searchParams = useSearchParams();
  const prefillPrice = searchParams.get("price") ?? "";

  return (
    <div>
      <div className="border-b py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Finance calculator</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate your vehicle finance with South African market rates.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <FinanceCalculator initialPrice={prefillPrice} />
      </div>
    </div>
  );
}
