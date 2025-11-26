import { useEffect, useMemo, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { FiGrid, FiList, FiSliders, FiX } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'
import { useProducts } from '../context/ProductContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import Checkbox from '../components/common/Checkbox.jsx'
import RangeSlider from '../components/common/RangeSlider.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import QuickViewModal from '../components/product/QuickViewModal.jsx'
import useQueryState from '../hooks/useQueryState.js'
import { filterProducts } from '../utils/filterProducts.js'
import { paginate, getTotalPages } from '../utils/pagination.js'
import useDebounce from '../hooks/useDebounce.js'

const PAGE_SIZE = 12

const initialFilterState = {
  q: '',
  category: '',
  brand: '',
  price_min: '',
  price_max: '',
  rating: '',
  availability: '',
  colors: [],
  sort: 'featured',
  view: 'grid',
  page: 1,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.payload.key]: action.payload.value, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'RESET_FILTERS':
      return { ...initialFilterState, view: state.view }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const sorters = {
  featured: {
    label: 'Featured',
    sortFn: (items) => [...items],
  },
  newest: {
    label: 'Newest',
    sortFn: (items) => [...items].sort((a, b) => new Date(b.createdAt ?? b.dealEndTime ?? 0) - new Date(a.createdAt ?? a.dealEndTime ?? 0)),
  },
  price_low: {
    label: 'Price: Low to High',
    sortFn: (items) => [...items].sort((a, b) => a.price - b.price),
  },
  price_high: {
    label: 'Price: High to Low',
    sortFn: (items) => [...items].sort((a, b) => b.price - a.price),
  },
  rating: {
    label: 'Rating',
    sortFn: (items) => [...items].sort((a, b) => b.rating - a.rating),
  },
}

function useHydratedFilters(defaultFilters) {
  const [params] = useSearchParams()
  const parsed = {}

  params.forEach((value, key) => {
    if (['colors'].includes(key)) {
      parsed[key] = value.split(',')
    } else if (['price_min', 'price_max'].includes(key)) {
      parsed[key] = Number(value)
    } else if (key === 'rating' || key === 'page') {
      parsed[key] = Number(value)
    } else {
      parsed[key] = value
    }
  })

  return { ...defaultFilters, ...parsed }
}

function ShopFilters({ filters, dispatch, brandSummary, categorySummary, onApplyQuery, desktop }) {
  const [priceRange, setPriceRange] = useState([
    filters.price_min || 0,
    filters.price_max || 2000,
  ])

  useEffect(() => {
    setPriceRange([
      filters.price_min || 0,
      filters.price_max || 2000,
    ])
  }, [filters.price_min, filters.price_max])

  const handleCheckbox = (key, value, checked) => {
    const current = Array.isArray(filters[key]) ? filters[key] : []
    const next = checked ? [...new Set([...current, value])] : current.filter((item) => item !== value)
    dispatch({ type: 'SET_FILTER', payload: { key, value: next } })
    onApplyQuery({ [key]: next })
  }

  const content = (
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'RESET_FILTERS' })
            onApplyQuery({
              q: '',
              category: '',
              brand: '',
              price_min: '',
              price_max: '',
              rating: '',
              availability: '',
              colors: [],
              page: 1,
            })
          }}
          className="text-sm font-semibold text-primary hover:text-primary/80"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Search</p>
        <input
          type="search"
          placeholder="Search products"
          value={filters.q}
          onChange={(event) => {
            const value = event.target.value
            dispatch({ type: 'SET_FILTER', payload: { key: 'q', value } })
            onApplyQuery({ q: value })
          }}
          className="h-11 w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Price */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Price range</p>
        <RangeSlider
          min={0}
          max={3000}
          step={10}
          values={priceRange}
          onChange={(next) => {
            setPriceRange(next)
            dispatch({ type: 'SET_FILTER', payload: { key: 'price_min', value: next[0] } })
            dispatch({ type: 'SET_FILTER', payload: { key: 'price_max', value: next[1] } })
            onApplyQuery({ price_min: next[0], price_max: next[1] })
          }}
        />
        <div className="flex gap-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])}
            onBlur={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'price_min', value: priceRange[0] } })
              onApplyQuery({ price_min: priceRange[0] })
            }}
            className="h-10 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
            onBlur={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'price_max', value: priceRange[1] } })
              onApplyQuery({ price_max: priceRange[1] })
            }}
            className="h-10 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ">Category</p>
        <div className="space-y-2">
          {categorySummary.map((category) => (
            <Checkbox
              key={category.id}
              id={`category-${category.id}`}
              label={category.name}
              description={`${category.count} items`}
              checked={filters.category === category.slug}
              onChange={(checked) => {
                const value = checked ? category.slug : ''
                dispatch({ type: 'SET_FILTER', payload: { key: 'category', value } })
                onApplyQuery({ category: value })
              }}
            />
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Brand</p>
        <div className="space-y-2">
          {brandSummary.map((brand) => (
            <Checkbox
              key={brand.id}
              id={`brand-${brand.id}`}
              label={brand.name}
              description={`${brand.count} products`}
              checked={filters.brand === brand.id}
              onChange={(checked) => {
                const value = checked ? brand.id : ''
                dispatch({ type: 'SET_FILTER', payload: { key: 'brand', value } })
                onApplyQuery({ brand: value })
              }}
            />
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Rating</p>
        <div className="space-y-2">
          {[4.5, 4, 3.5].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="rating-filter"
                checked={Number(filters.rating) === rating}
                onChange={() => {
                  dispatch({ type: 'SET_FILTER', payload: { key: 'rating', value: rating } })
                  onApplyQuery({ rating })
                }}
                className="h-4 w-4"
              />
              <span className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-300">
                {rating}★ & up
              </span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'rating', value: '' } })
              onApplyQuery({ rating: '' })
            }}
            className="text-xs font-semibold text-primary hover:text-primary/80"
          >
            Clear rating
          </button>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Availability</p>
        <div className="space-y-2">
          {[{ id: 'in_stock', label: 'In stock & ships now' }, { id: 'limited', label: 'Limited or pre-order' }].map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="availability-filter"
                checked={filters.availability === option.id}
                onChange={() => {
                  dispatch({ type: 'SET_FILTER', payload: { key: 'availability', value: option.id } })
                  onApplyQuery({ availability: option.id })
                }}
                className="h-4 w-4"
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{option.label}</span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'availability', value: '' } })
              onApplyQuery({ availability: '' })
            }}
            className="text-xs font-semibold text-primary hover:text-primary/80"
          >
            Clear availability
          </button>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Color</p>
        <div className="flex flex-wrap gap-2">
          {['black', 'white', 'silver', 'blue', 'red', 'gold', 'green'].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleCheckbox('colors', color, !filters.colors.includes(color))}
              className={`h-9 w-9 rounded-full border-2 ${
                filters.colors.includes(color) ? 'border-primary ring-2 ring-primary/40' : 'border-transparent'
              }`}
              style={{
                background:
                  color === 'white'
                    ? '#F3F4F6'
                    : color === 'silver'
                      ? 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)'
                      : color === 'black'
                        ? '#111827'
                        : color === 'gold'
                          ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
                          : color,
              }}
              aria-pressed={filters.colors.includes(color)}
              aria-label={`Filter by ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  if (desktop) return content

  return (
    <div className="space-y-6">
      {content}
    </div>
  )
}

function Shop() {
  const { products, categorySummary, brandSummary } = useProducts()
  const { addItem } = useCart()
  const hydratedFilters = useHydratedFilters(initialFilterState)
  const [filters, dispatch] = useReducer(reducer, hydratedFilters)
  const [queryState, setQueryState] = useQueryState(initialFilterState)
  const [isFiltersOpen, setFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [isQuickViewOpen, setQuickViewOpen] = useState(false)

  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: queryState })
  }, [])

  const debouncedSearch = useDebounce(filters.q, 150)

  const filteredProducts = useMemo(() => {
    const result = filterProducts(products, {
      search: debouncedSearch,
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      minPrice: Number(filters.price_min) || undefined,
      maxPrice: Number(filters.price_max) || undefined,
      tags: undefined,
      minRating: Number(filters.rating) || undefined,
      availability: filters.availability || undefined,
      colors: filters.colors || undefined,
    })

    const sorter = sorters[filters.sort] ?? sorters.featured
    return sorter.sortFn(result)
  }, [products, filters, debouncedSearch])

  const totalPages = getTotalPages(filteredProducts.length, PAGE_SIZE)
  const currentPage = Math.min(filters.page, totalPages)
  const paginatedProducts = paginate(filteredProducts, currentPage, PAGE_SIZE)

  useEffect(() => {
    if (filters.page !== currentPage) {
      dispatch({ type: 'SET_PAGE', payload: currentPage })
    }
    if (Number(queryState.page) !== currentPage) {
      setQueryState({ page: currentPage })
    }
  }, [filters.page, currentPage, queryState.page, setQueryState])

  useEffect(() => {
    if (queryState.view !== filters.view) {
      setQueryState({ view: filters.view })
    }
  }, [filters.view, queryState.view, setQueryState])

  const summary = filteredProducts.length

  const handleAddToCart = (product) => {
    const variant = product.variants?.[0]
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1,
      variantId: variant?.id ?? 'default',
      variantLabel: [variant?.color, variant?.storage].filter(Boolean).join(' / '),
    })
  }

  const renderProductCard = (product) => (
    <ProductCard
      key={product.id}
      product={product}
      onQuickView={() => {
        setQuickViewProduct(product)
        setQuickViewOpen(true)
      }}
    />
  )

  return (
    <>
      <Helmet>
        <title>Shop SkyTech — Explore Flagship Tech</title>
        <meta
          name="description"
          content="Discover SkyTech flagship technology: smartphones, creator laptops, smart home devices, gaming gear, and more. Filter, compare, and curate your dream setup."
        />
      </Helmet>
      <div className="container grid gap-8 py-10 lg:grid-cols-[320px,1fr]">
        <aside className="hidden lg:block">
          <ShopFilters
            filters={filters}
            dispatch={dispatch}
            brandSummary={brandSummary}
            categorySummary={categorySummary}
            onApplyQuery={setQueryState}
            desktop
          />
        </aside>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:border-primary hover:text-primary lg:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-primary dark:hover:text-primary"
      onClick={() => setFiltersOpen(true)}
    >
      <FiSliders /> Filters
    </button>
    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{summary} products</span>
    <div className="flex flex-wrap items-center gap-2">
      {filters.q && (
        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Search: {filters.q}
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'q', value: '' } })
              setQueryState({ q: '' })
            }}
            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        </span>
      )}
      {filters.category && (
        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Category: {categorySummary.find((cat) => cat.slug === filters.category)?.name ?? filters.category}
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'category', value: '' } })
              setQueryState({ category: '' })
            }}
            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label="Clear category filter"
          >
            <FiX />
          </button>
        </span>
      )}
      {filters.brand && (
        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Brand: {brandSummary.find((brand) => brand.id === filters.brand)?.name ?? filters.brand}
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'brand', value: '' } })
              setQueryState({ brand: '' })
            }}
            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label="Clear brand filter"
          >
            <FiX />
          </button>
        </span>
      )}
      {Number(filters.rating) > 0 && (
        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {filters.rating}★ & up
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_FILTER', payload: { key: 'rating', value: '' } })
              setQueryState({ rating: '' })
            }}
            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label="Clear rating filter"
          >
            <FiX />
          </button>
        </span>
      )}
      {filters.colors?.map((color) => (
        <span
          key={color}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
        >
          {color}
          <button
            type="button"
            onClick={() => {
              const current = Array.isArray(filters.colors) ? filters.colors : []
              const next = current.filter((c) => c !== color)
              dispatch({ type: 'SET_FILTER', payload: { key: 'colors', value: next } })
              setQueryState({ colors: next })
            }}
            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label={`Clear ${color} color filter`}
          >
            <FiX />
          </button>
        </span>
      ))}
    </div>
  </div>

  <div className="flex items-center gap-3">
    <div className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 text-neutral-500 transition hover:border-neutral-300 lg:inline-flex dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500">
      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'view', value: 'grid' } })}
        className={`rounded-full p-2 ${filters.view === 'grid' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : ''}`}
        aria-label="Grid view"
      >
        <FiGrid />
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'view', value: 'list' } })}
        className={`rounded-full p-2 ${filters.view === 'list' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : ''}`}
        aria-label="List view"
      >
        <FiList />
      </button>
    </div>

    <select
      value={filters.sort}
      onChange={(event) => {
        dispatch({ type: 'SET_FILTER', payload: { key: 'sort', value: event.target.value } })
        setQueryState({ sort: event.target.value })
      }}
      className="h-11 rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-700 focus:border-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:border-primary"
    >
      {Object.entries(sorters).map(([value, config]) => (
        <option key={value} value={value}>
          {config.label}
        </option>
      ))}
    </select>
  </div>
</div>


          {paginatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-subtle dark:border-neutral-700 dark:bg-neutral-900">
  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">No matches yet</h2>
  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
    Try expanding your filters or exploring our curated collections below.
  </p>
  <Link
    to="/?deal=1"
    className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
  >
    Shop limited-time offers
  </Link>
</div>

          ) : filters.view === 'list' ? (
<div className="space-y-4">
  {paginatedProducts.map((product) => (
    <div
      key={product.id}
      className="flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-subtle transition hover:border-primary/40 hover:shadow-soft md:flex-row dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary/40 dark:shadow-none"
    >
      <img
        src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${product.thumbnail
                }`}
        alt={product.title}
        className="h-48 w-full rounded-2xl bg-neutral-50 object-contain md:w-56 dark:bg-neutral-800"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:bg-neutral-700 dark:text-neutral-300">
            {product.brand}
          </span>
          <span className="text-sm font-semibold text-primary">{product.rating}★</span>
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="text-lg font-semibold text-neutral-900 transition hover:text-primary dark:text-neutral-100 dark:hover:text-primary/90"
        >
          {product.title}
        </Link>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          {product.shortSpecs?.map((spec) => (
            <span key={spec.id} className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-700">
              {spec.value}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="text-sm font-semibold text-primary hover:text-primary/80"
            onClick={() => {
              setQuickViewProduct(product)
              setQuickViewOpen(true)
            }}
          >
            Quick view
          </button>
          <button
            type="button"
            className="rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            onClick={() => handleAddToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between text-right">
        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          ${product.price.toFixed(2)}
        </p>
        {product.originalPrice && (
          <span className="text-sm text-neutral-400 line-through dark:text-neutral-500">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        <Link
          to={`/product/${product.slug}`}
          className="mt-auto inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          View product
        </Link>
      </div>
    </div>
  ))}
</div>

          ) : (
            <ProductGrid columns={4}>
              {paginatedProducts.map((product) => renderProductCard(product))}
            </ProductGrid>
          )}

          {totalPages > 1 && (
<div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
  <p>
    Page {currentPage} of {totalPages}
  </p>
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => {
        const nextPage = Math.max(1, currentPage - 1)
        dispatch({ type: 'SET_PAGE', payload: nextPage })
        setQueryState({ page: nextPage })
      }}
      disabled={currentPage === 1}
      className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:disabled:text-neutral-500"
    >
      Previous
    </button>
    {Array.from({ length: totalPages }).map((_, index) => {
      const page = index + 1
      return (
        <button
          key={page}
          type="button"
          onClick={() => {
            dispatch({ type: 'SET_PAGE', payload: page })
            setQueryState({ page })
          }}
          className={`h-9 w-9 rounded-full text-sm font-semibold ${
            page === currentPage
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          {page}
        </button>
      )
    })}
    <button
      type="button"
      onClick={() => {
        const nextPage = Math.min(totalPages, currentPage + 1)
        dispatch({ type: 'SET_PAGE', payload: nextPage })
        setQueryState({ page: nextPage })
      }}
      disabled={currentPage === totalPages}
      className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:disabled:text-neutral-500"
    >
      Next
    </button>
  </div>
</div>

          )}
        </div>
      </div>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
              <ShopFilters
                filters={filters}
                dispatch={dispatch}
                brandSummary={brandSummary}
                categorySummary={categorySummary}
                onApplyQuery={setQueryState}
              />
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Apply filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'RESET_FILTERS' })
                    setQueryState(initialFilterState)
                    setFiltersOpen(false)
                  }}
                  className="flex-1 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onAddToCart={({ id, variantId }) => {
          const product = quickViewProduct
          const variant = product?.variants?.find((item) => item.id === variantId) ?? product?.variants?.[0]
          addItem({
            id: product?.id ?? id,
            title: product?.title,
            price: product?.price,
            image: product?.thumbnail,
            quantity: 1,
            variantId: variant?.id ?? 'default',
            variantLabel: [variant?.color, variant?.storage].filter(Boolean).join(' / '),
          })
          setQuickViewOpen(false)
        }}
      />
    </>
  )
}

export default Shop
