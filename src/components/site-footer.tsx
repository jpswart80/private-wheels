import Link from "next/link";
import { Car, Globe, Mail, Share2 } from "lucide-react";
import { SiteContainer } from "@/components/site-container";

const FOOTER_COLUMNS = [
  {
    title: "Marketplace",
    links: [
      { label: "Buy a Car", href: "/cars" },
      { label: "Sell Your Car", href: "/sell" },
      { label: "Finance Calculator", href: "/finance" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "My Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Private Wheels",
    links: [
      { label: "South Africa", href: "#" },
      { label: "hello@privatewheels.co.za", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted">
      <SiteContainer className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" strokeWidth={2} />
            <span className="font-semibold text-primary">privatewheels</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            South Africa&apos;s trusted private vehicle marketplace. Buy and sell with
            confidence, backed by verified listings.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SiteContainer>

      <div className="border-t">
        <SiteContainer className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Private Wheels (Pty) Ltd. All rights reserved.</p>
        <div className="flex items-center gap-1.5 text-foreground">
          <Globe className="h-4 w-4" />
          <span className="font-medium">English (ZA)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-border">
            <Share2 className="h-4 w-4" />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-border">
            <Mail className="h-4 w-4" />
          </span>
        </div>
        </SiteContainer>
      </div>
    </footer>
  );
}
