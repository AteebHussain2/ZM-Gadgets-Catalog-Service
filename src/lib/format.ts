export function priceWithDiscount(price: number, discount?: number | null) {
  const pct = typeof discount === "number" ? discount : 0
  const discounted = Math.round(price * (1 - pct / 100))
  return { discounted, hasDiscount: pct > 0, pct }
}

export function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
      amount,
    )
  } catch {
    return `PKR ${amount.toLocaleString()}`
  }
}
