"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListingWizard } from "@/components/listing-wizard";

function NewListingContent() {
  const searchParams = useSearchParams();
  const showWelcome = searchParams.get("welcome") === "1";
  return <ListingWizard mode="create" showWelcome={showWelcome} />;
}

export default function NewListingPage() {
  return (
    <Suspense fallback={null}>
      <NewListingContent />
    </Suspense>
  );
}
