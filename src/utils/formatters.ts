export function formatCurrency(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}
