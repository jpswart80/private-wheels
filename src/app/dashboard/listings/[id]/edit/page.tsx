"use client";

import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useListing } from "@/hooks/use-listings";
import { ListingWizard } from "@/components/listing-wizard";
import { Button } from "@/components/ui/button";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const { listing } = useListing(id);

  if (!listing || listing.sellerId !== user?.id) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">
          This listing doesn&apos;t exist or doesn&apos;t belong to your account.
        </p>
        <Button className="mt-6" render={<Link href="/dashboard">Back to Dashboard</Link>} />
      </div>
    );
  }

  return <ListingWizard mode="edit" existingListing={listing} />;
}
