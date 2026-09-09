"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calculator, TrendingUp } from "lucide-react";
import {
  calculateAffordability,
  calculateInstalment,
  DEFAULT_INTEREST_RATE,
  PRIME_RATE,
} from "@/lib/finance";
import { formatCurrency } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TERM_OPTIONS = [12, 24, 36, 48, 60, 72, 84, 96];
const BALLOON_OPTIONS = [0, 5, 10, 15, 20, 25, 30];

export function FinanceCalculatorClient() {
  const searchParams = useSearchParams();
  const prefillPrice = searchParams.get("price") ?? "";

  const [price, setPrice] = useState(prefillPrice);
  const [deposit, setDeposit] = useState("");
  const [rate, setRate] = useState(String(DEFAULT_INTEREST_RATE));
  const [term, setTerm] = useState("72");
  const [balloon, setBalloon] = useState("0");

  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");

  const instalmentResult = useMemo(() => {
    const p = Number(price);
    if (!p || p <= 0) return null;
    return calculateInstalment({
      price: p,
      deposit: Number(deposit) || 0,
      rate: Number(rate) || 0,
      termMonths: Number(term),
      balloonPct: Number(balloon),
    });
  }, [price, deposit, rate, term, balloon]);

  const affordabilityResult = useMemo(() => {
    const inc = Number(income);
    if (!inc || inc <= 0) return null;
    return calculateAffordability({
      income: inc,
      expenses: Number(expenses) || 0,
    });
  }, [income, expenses]);

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
        <Tabs defaultValue="instalment">
          <TabsList>
            <TabsTrigger value="instalment">
              <Calculator className="h-4 w-4" />
              Monthly Instalment
            </TabsTrigger>
            <TabsTrigger value="affordability">
              <TrendingUp className="h-4 w-4" />
              Affordability Check
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instalment" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border">
                <div className="border-b bg-muted px-5 py-3 text-sm font-semibold">
                  Instalment calculator
                </div>
                <div className="flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-1.5">
                    <Label>Vehicle Price (R)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 450000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Deposit (R)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 50000"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Interest Rate (% per annum)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      SA Prime Rate: {PRIME_RATE}% | Linked rate varies per lender
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Repayment Term (Months)</Label>
                    <Select value={term} onValueChange={(v) => v && setTerm(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(v: string | null) => {
                            const t = Number(v ?? term);
                            return `${t} months (${(t / 12).toFixed(0)} year${t > 12 ? "s" : ""})`;
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TERM_OPTIONS.map((t) => (
                          <SelectItem key={t} value={String(t)}>
                            {t} months ({(t / 12).toFixed(0)} year{t > 12 ? "s" : ""})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Balloon Payment (%)</Label>
                    <Select value={balloon} onValueChange={(v) => v && setBalloon(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(v: string | null) => {
                            const b = v ?? balloon;
                            return `${b}% ${b === "0" ? "(None)" : ""}`;
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {BALLOON_OPTIONS.map((b) => (
                          <SelectItem key={b} value={String(b)}>
                            {b}% {b === 0 ? "(None)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-2xl bg-muted p-8">
                {instalmentResult ? (
                  <div className="w-full">
                    <p className="text-center text-sm font-medium text-muted-foreground uppercase">
                      Estimated Monthly Instalment
                    </p>
                    <p className="mt-2 text-center text-4xl font-semibold tracking-tight">
                      {formatCurrency(instalmentResult.monthlyInstalment)}
                      <span className="text-base font-medium text-muted-foreground">/mo</span>
                    </p>
                    <div className="mt-6 flex flex-col gap-3 border-t pt-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Financed</span>
                        <span className="font-semibold">
                          {formatCurrency(instalmentResult.principal)}
                        </span>
                      </div>
                      {instalmentResult.balloonAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balloon Payment</span>
                          <span className="font-semibold">
                            {formatCurrency(instalmentResult.balloonAmount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold">
                          {formatCurrency(instalmentResult.totalInterest)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Repayment</span>
                        <span className="font-semibold">
                          {formatCurrency(instalmentResult.totalRepayment)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Calculator className="mx-auto h-8 w-8 opacity-40" />
                    <p className="mt-3 text-sm">
                      Enter a vehicle price to calculate your monthly instalment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="affordability" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border">
                <div className="border-b bg-muted px-5 py-3 text-sm font-semibold">
                  Affordability check
                </div>
                <div className="flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-1.5">
                    <Label>Gross Monthly Income (R)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 35000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Total Monthly Expenses (R)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 18000"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include rent, food, utilities, existing debt repayments
                    </p>
                  </div>
                  <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                    Based on South African banking guidelines, vehicle finance should not
                    exceed 30% of disposable income. This tool uses a 72-month term at{" "}
                    {DEFAULT_INTEREST_RATE}% p.a. for estimation.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-2xl bg-muted p-8">
                {affordabilityResult ? (
                  <div className="w-full">
                    <p className="text-center text-sm font-medium text-muted-foreground uppercase">
                      Estimated Affordable Vehicle Price
                    </p>
                    <p className="mt-2 text-center text-4xl font-semibold tracking-tight">
                      {formatCurrency(affordabilityResult.maxVehiclePrice)}
                    </p>
                    <div className="mt-6 flex flex-col gap-3 border-t pt-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disposable Income</span>
                        <span className="font-semibold">
                          {formatCurrency(affordabilityResult.disposableIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Recommended Instalment</span>
                        <span className="font-semibold">
                          {formatCurrency(affordabilityResult.maxInstalment)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="mx-auto h-8 w-8 opacity-40" />
                    <p className="mt-3 text-sm">
                      Enter your monthly income to check your vehicle affordability.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
