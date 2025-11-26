export function getDiscountPrice(price, originalPrice) {
  if (!price || !originalPrice || originalPrice <= price) {
    return 0
  }
  const savings = originalPrice - price
  return Math.round((savings / originalPrice) * 100)
}
