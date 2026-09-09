import { Suspense } from "react";
import type { Metadata } from "next";
import { FinanceCalculatorClient } from "@/components/finance-calculator-client";

export const metadata: Metadata = {
  title: "Finance Calculator | Private Wheels",
  description: "Calculate your vehicle finance instalment and affordability with South African market rates.",
};

export default function FinancePage() {
  return (
    <Suspense fallback={null}>
      <FinanceCalculatorClient />
    </Suspense>
  );
}
