import type { Metadata } from "next";
import { ComingSoonFrame } from "@/components/coming-soon/coming-soon-frame";
import { WhatsAppButton } from "@/components/coming-soon/whatsapp-button";
import { ReachOutDialog } from "@/components/coming-soon/reach-out-dialog";
import { COMING_SOON } from "@/lib/coming-soon";

export const metadata: Metadata = {
  title: "Coming soon | Private Wheels",
  description:
    "Sell your car privately and securely. Message us on WhatsApp to get a voucher — your first listing is on us.",
};

/**
 * The pre-launch holding page. While `SITE_LAUNCHED` is not `true`, `src/proxy.ts`
 * rewrites every route to here, so this is the only page a visitor can reach.
 *
 * Minimal by design: one headline, one action. The incentive ("first listing on
 * us") is a single supporting line, not the star.
 */
export default function ComingSoonPage() {
  return (
    <ComingSoonFrame>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Sell your car privately and securely
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-[1.5] text-muted-foreground">
          Owner to owner — no dealer in the middle, no mark-up. Message us on
          WhatsApp to get a voucher, and your first listing is on us when we
          launch.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <WhatsAppButton
            message={COMING_SOON.whatsappMessage}
            label="Message us on WhatsApp"
          />
          <p className="text-xs text-muted-foreground">
            Want us to reach out instead? <ReachOutDialog />
          </p>
        </div>
      </div>
    </ComingSoonFrame>
  );
}
