import { useEffect, useMemo, useRef, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useNavigate, useLocation } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce.js'
import { useProducts } from '../../context/ProductContext.jsx'

function highlightMatch(text, query) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'ig')
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={`${part}-${index}`} className="bg-primary/15 text-primary dark:bg-primary/25">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  )
}

function SearchSuggestionItem({ product, query, onSelect }) {
  const media_base_url = import.meta.env.VITE_BASE_MEDIA_URL
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
    >
      <img
        src={`${media_base_url}/products/${product.thumbnail}`}
        alt={product.title}
        loading="lazy"
        className="h-12 w-12 rounded-md object-cover"
      />
      <div className="space-y-1">
        <p className="text-sm font-semibold leading-5 text-neutral-900 dark:text-neutral-200">
          {highlightMatch(product.title, query)}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {highlightMatch(`${product.brand} • ${product.category}`, query)}
        </p>
      </div>
    </button>
  )
}

SearchSuggestionItem.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.string,
    thumbnail: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  query: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

function SearchBar({ compact = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchProducts, categories, setFilters } = useProducts()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)

  const debouncedQuery = useDebounce(query, 200)

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return []
    return searchProducts(debouncedQuery, { limit: 6 })
  }, [debouncedQuery, searchProducts])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(event.target))
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get('category') || 'all'
    setSelectedCategory(categoryParam)
    setFilters({ category: categoryParam === 'all' ? '' : categoryParam })
  }, [location.search, setFilters])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!query.trim()) return
    setFilters({ search: query.trim(), category: selectedCategory === 'all' ? '' : selectedCategory })
    navigate(`/shop?q=${encodeURIComponent(query.trim())}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`)
    setIsOpen(false)
  }

  const handleSelectProduct = (product) => {
    navigate(`/product/${product.slug}`)
    setIsOpen(false)
    setQuery('')
  }

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug)
    setFilters({ category: slug === 'all' ? '' : slug })
    navigate(slug === 'all' ? '/shop' : `/shop?category=${slug}`)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={clsx('relative w-full', compact ? 'max-w-md' : 'max-w-3xl')}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm dark:bg-neutral-700 dark:border-neutral-600"
      >
        {/* Category dropdown */}
        <div className="relative hidden lg:block" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-48 bg-primary text-white px-4 py-2 rounded-full flex justify-between items-center cursor-pointer"
          >
            {selectedCategory === 'all'
              ? 'All Categories'
              : categories.find((c) => c.slug === selectedCategory)?.name}
          </button>
          {isOpen && (
            <ul className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 overflow-hidden dark:bg-neutral-800">
              <li
                onClick={() => handleSelectCategory('all')}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
              >
                All Categories
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search input */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, categories, or brands"
          className="h-10 flex-1 bg-transparent text-sm text-neutral-900 outline-none border-l-2 border-primary placeholder:text-neutral-400 rounded-2xl px-4 dark:text-neutral-200 dark:placeholder:text-neutral-400"
          aria-label="Search catalog"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}

        {/* Search button */}
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90"
        >
          <FiSearch />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && (suggestions.length > 0 || debouncedQuery) && (
        <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft z-50 dark:bg-neutral-800 dark:border-neutral-700">
          {suggestions.length > 0 ? (
            <div className="max-h-80 overflow-y-auto" role="listbox" aria-label="Search suggestions">
              {suggestions.map((product) => (
                <SearchSuggestionItem
                  key={product.id}
                  product={product}
                  query={debouncedQuery}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          ) : (
            <p className="px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400">
              No matches found for <span className="font-semibold">“{debouncedQuery}”</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  compact: PropTypes.bool,
}

export default SearchBar
