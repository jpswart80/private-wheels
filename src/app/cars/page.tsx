import { Suspense } from "react";
import type { Metadata } from "next";
import { CarsPageClient } from "@/components/cars-page-client";

export const metadata: Metadata = {
  title: "Buy a Car | Private Wheels",
  description: "Browse verified private vehicle listings across South Africa.",
};

export default function CarsPage() {
  return (
    <Suspense fallback={null}>
      <CarsPageClient />
    </Suspense>
  );
}
