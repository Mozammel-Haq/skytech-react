export function paginate(items, page = 1, perPage = 12) {
  const start = (page - 1) * perPage
  return items.slice(start, start + perPage)
}

export function getTotalPages(totalItems, perPage = 12) {
  return Math.max(1, Math.ceil(totalItems / perPage))
}
