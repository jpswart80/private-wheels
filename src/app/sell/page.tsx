"use client";

import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, ClipboardList, HandCoins, MessagesSquare, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Create your account",
    description: "Sign up with just an email and password — takes less than a minute.",
  },
  {
    icon: Camera,
    title: "2. List your vehicle",
    description: "Add your car's details, specs, and photos using our guided listing wizard.",
  },
  {
    icon: MessagesSquare,
    title: "3. Connect with buyers",
    description: "Field enquiries directly from interested buyers and arrange viewings on your terms.",
  },
];

const BENEFITS = [
  {
    icon: HandCoins,
    title: "No Dealer Commission",
    description: "You set the price and you keep what you sell it for. No trade-in mark-downs.",
  },
  {
    icon: Users,
    title: "Reach Real Buyers",
    description: "Your listing is seen by active buyers actively searching for a car like yours.",
  },
  {
    icon: CheckCircle2,
    title: "Full Control",
    description: "Edit, pause, or take down your listing any time from your seller dashboard.",
  },
];

export default function SellPage() {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard/listings/new" : "/register";

  return (
    <div>
      <section className="border-b py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Sell your car the simple way
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            List your vehicle in minutes, reach thousands of buyers directly, and stay in full
            control of your sale from start to finish — no dealer, no middlemen.
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-full bg-primary hover:bg-primary/90"
            render={
              <Link href={ctaHref}>
                {user ? "Create Your Listing" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          List your car in 3 steps
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <s.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="max-w-xs text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Why sell with Private Wheels
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex flex-col gap-3 rounded-2xl bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
                  <b.icon className="h-5.5 w-5.5" strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to list your vehicle?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {user
            ? "Head to your dashboard to create your listing."
            : "Sign in to an existing account, or register in under a minute to get started."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!user && (
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              render={<Link href="/login">Sign In</Link>}
            />
          )}
          <Button
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90"
            render={
              <Link href={ctaHref}>
                {user ? "Create Your Listing" : "Create an Account"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
