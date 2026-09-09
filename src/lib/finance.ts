import type {
  AffordabilityInputs,
  AffordabilityResult,
  InstalmentInputs,
  InstalmentResult,
} from "@/lib/types";

export const DEFAULT_INTEREST_RATE = 18.25;
export const PRIME_RATE = 11.75;
const AFFORDABILITY_TERM_MONTHS = 72;
const MAX_INSTALMENT_TO_DISPOSABLE_RATIO = 0.3;

/**
 * Standard reducing-balance amortization, adjusted for a balloon (residual)
 * payment settled at the end of the term instead of amortized within it.
 */
export function calculateInstalment({
  price,
  deposit,
  rate,
  termMonths,
  balloonPct,
}: InstalmentInputs): InstalmentResult {
  const principal = Math.max(price - deposit, 0);
  const balloonAmount = principal * (balloonPct / 100);
  const monthlyRate = rate / 100 / 12;

  let monthlyInstalment: number;
  if (monthlyRate === 0) {
    monthlyInstalment = (principal - balloonAmount) / termMonths;
  } else {
    const growth = Math.pow(1 + monthlyRate, termMonths);
    monthlyInstalment =
      (principal * growth - balloonAmount) * (monthlyRate / (growth - 1));
  }

  const totalRepayment = monthlyInstalment * termMonths + balloonAmount;
  const totalInterest = totalRepayment - principal;

  return {
    monthlyInstalment: Math.max(monthlyInstalment, 0),
    principal,
    balloonAmount,
    totalRepayment,
    totalInterest,
  };
}

/**
 * Largest vehicle price a given monthly instalment supports at a term/rate,
 * plus the deposit paid up front. Inverse of `calculateInstalment` (no
 * balloon). Used by the home-page budget matcher.
 */
export function maxVehiclePrice({
  monthlyInstalment,
  deposit,
  rate,
  termMonths,
}: {
  monthlyInstalment: number;
  deposit: number;
  rate: number;
  termMonths: number;
}): number {
  if (monthlyInstalment <= 0) return deposit;
  const monthlyRate = rate / 100 / 12;

  let financed: number;
  if (monthlyRate === 0) {
    financed = monthlyInstalment * termMonths;
  } else {
    const growth = Math.pow(1 + monthlyRate, termMonths);
    financed = monthlyInstalment * ((growth - 1) / (monthlyRate * growth));
  }

  return Math.max(financed + deposit, 0);
}

/**
 * Reverse-solves the maximum vehicle price a buyer can afford, based on the
 * SA banking guideline that vehicle finance shouldn't exceed ~30% of
 * disposable income, at a fixed reference term/rate.
 */
export function calculateAffordability({
  income,
  expenses,
  rate = DEFAULT_INTEREST_RATE,
  termMonths = AFFORDABILITY_TERM_MONTHS,
}: AffordabilityInputs): AffordabilityResult {
  const disposableIncome = Math.max(income - expenses, 0);
  const maxInstalment = disposableIncome * MAX_INSTALMENT_TO_DISPOSABLE_RATIO;

  const monthlyRate = rate / 100 / 12;
  let maxVehiclePrice: number;
  if (monthlyRate === 0) {
    maxVehiclePrice = maxInstalment * termMonths;
  } else {
    const growth = Math.pow(1 + monthlyRate, termMonths);
    maxVehiclePrice = maxInstalment * ((growth - 1) / (monthlyRate * growth));
  }

  return {
    disposableIncome,
    maxInstalment,
    maxVehiclePrice,
  };
}
