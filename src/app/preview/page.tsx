"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Lightweight bypass for the pre-launch gate in `proxy.ts` — lets whoever
 * knows PREVIEW_TOKEN in on the real site with a 4-digit PIN instead of
 * having to know/paste the `?preview=<token>` query param. Meant for demos
 * and presentations, not as real authentication.
 */
export default function PreviewAccessPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("checking");
    try {
      const res = await fetch("/api/preview-auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        setStatus("error");
        setPin("");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xs text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Preview access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the 4-digit PIN to preview the site before launch.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-4">
          <Input
            autoFocus
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setStatus("idle");
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            className="h-14 w-28 rounded-xl text-center text-2xl tracking-[0.5em] focus-visible:border-ring focus-visible:ring-0"
            aria-label="4-digit PIN"
          />

          {status === "error" && (
            <p className="text-sm text-destructive">Incorrect PIN — try again.</p>
          )}

          <Button
            type="submit"
            disabled={pin.length !== 4 || status === "checking"}
            className="h-12 w-full rounded-full bg-primary hover:bg-primary/90"
          >
            {status === "checking" ? "Checking…" : "Unlock"}
          </Button>
        </form>
      </div>
    </div>
  );
}
