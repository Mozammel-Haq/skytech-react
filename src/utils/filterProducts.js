const COLOR_KEYWORDS = ['black', 'white', 'silver', 'blue', 'red', 'green', 'gold', 'gray', 'graphite', 'midnight', 'purple']

function normalizeColor(value) {
  if (!value) return null
  const lower = value.toLowerCase()
  const match = COLOR_KEYWORDS.find((keyword) => lower.includes(keyword))
  return match ?? lower
}

function normalize(value) {
  return value?.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function filterProducts(products, filters = {}) {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    tags,
    minRating,
    availability,
    colors,
  } = filters

  return products.filter((product) => {
    const tagsText = Array.isArray(product.tags)
      ? product.tags
          .map((t) => (typeof t === 'string' ? t : t?.tag ?? ''))
          .join(' ')
      : ''

    const matchesSearch = search
      ? [product.title, product.description, product.category, product.brand, tagsText]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      : true

    const matchesCategory = category ? normalize(product.categorySlug) === normalize(category) : true
    const matchesBrand = brand ? normalize(product.brandSlug) === normalize(brand) : true
    const matchesMinPrice = typeof minPrice === 'number' ? product.price >= minPrice : true
    const matchesMaxPrice = typeof maxPrice === 'number' ? product.price <= maxPrice : true
    const matchesTags = Array.isArray(tags) && tags.length > 0
      ? tags.every((tag) => {
          const pt = product.tags ?? []
          return pt.some((t) => (typeof t === 'string' ? t : t?.tag) === tag)
        })
      : true
    const matchesRating = typeof minRating === 'number' ? product.rating >= minRating : true

    const matchesAvailability = availability
      ? (() => {
          const status = (product.availability ?? product.stockStatus ?? '')
            .toString()
            .toLowerCase()
          if (availability === 'in_stock') {
            return status.includes('in stock') || status.includes('available') || status === 'stock'
          }
          if (availability === 'limited') {
            return (
              status.includes('limited') ||
              status.includes('preorder') ||
              status.includes('pre-order') ||
              status.includes('pre order')
            )
          }
          return true
        })()
      : true

    const matchesColors = Array.isArray(colors) && colors.length > 0
      ? product.variants?.some((variant) => {
          const normalized = normalizeColor(variant.color)
          return normalized ? colors.includes(normalized) : false
        }) ?? false
      : true

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesTags &&
      matchesRating &&
      matchesAvailability &&
      matchesColors
    )
  })
}
