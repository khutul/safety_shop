// Shared price formatter for the Mongolian storefront.
export function formatMnt(amount: number): string {
  return `${(amount || 0).toLocaleString("mn-MN")}₮`
}
