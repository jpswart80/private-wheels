export function formatCurrency(value: number): string {
  const rounded = Math.round(value);
  return `R ${rounded.toLocaleString("en-ZA")}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-ZA");
}

export function formatMileage(value: number): string {
  return `${formatNumber(value)} km`;
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function slugifyVehicle(id: string, make: string, model: string): string {
  return `${id}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
