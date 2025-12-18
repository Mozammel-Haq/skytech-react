import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const ProductContext = createContext(undefined)

const initialState = {
  products: [],
  categories: [],
  brands: [],
  filters: {
    search: '',
    category: null,
    brand: null,
  },
}

function productReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: Array.isArray(action.payload) ? action.payload : [] }
    case 'SET_CATEGORIES':
      return { ...state, categories: Array.isArray(action.payload) ? action.payload : [] }
    case 'SET_BRANDS':
      return { ...state, brands: Array.isArray(action.payload) ? action.payload : [] }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }
    default:
      return state
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState)
  const [loading, setLoading] = useState(true)
  const STORAGE_KEYS = {
    products: 'skytech_products',
    categories: 'skytech_categories',
    brands: 'skytech_brands',
  }

  // Helpers
  const normalize = (s) => s?.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
  const toSlug = (s) => (s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')

  const pickArray = (data, keys = []) => {
    if (Array.isArray(data)) return data
    for (const k of keys) {
      const v = data?.[k]
      if (Array.isArray(v)) return v
    }
    const firstArray = Object.values(data || {}).find((v) => Array.isArray(v))
    return Array.isArray(firstArray) ? firstArray : []
  }

  const normalizeCategory = (c) => {
    if (!c) return null
    const name = c?.name ?? c?.title ?? c?.category ?? ''
    const slug = c?.slug ?? c?.category_slug ?? toSlug(name)
    return {
      id: c?.id ?? c?.category_id ?? slug,
      name,
      slug,
      description: c?.description ?? '',
      image: c?.image ?? c?.thumbnail ?? null,
      ...c,
    }
  }

  const normalizeBrand = (b) => {
    if (!b) return null
    const name = b?.name ?? b?.brand ?? ''
    const slug = b?.slug ?? b?.brand_slug ?? toSlug(name)
    return {
      id: b?.id ?? b?.brand_id ?? slug,
      name,
      slug,
      ...b,
    }
  }

  const normalizeProduct = (p) => {
    if (!p) return null
    const title = p?.title ?? p?.name ?? 'Untitled'
    const categoryName = p?.category ?? p?.category_name ?? ''
    const brandName = p?.brand ?? p?.brand_name ?? ''
    const slug = p?.slug ?? p?.product_slug ?? toSlug(title)
    const categorySlug = p?.categorySlug ?? p?.category_slug ?? toSlug(categoryName)
    const brandSlug = p?.brandSlug ?? p?.brand_slug ?? toSlug(brandName)
    const price = Number(p?.price ?? p?.sale_price ?? p?.regular_price ?? 0)
    const thumbnail = p?.thumbnail ?? p?.image ?? p?.thumbnail_url ?? ''
    return {
      id: p?.id ?? p?.product_id ?? slug,
      sku: p?.sku ?? null,
      title,
      slug,
      description: p?.description ?? '',
      category: categoryName || categorySlug,
      categorySlug,
      brand: brandName || brandSlug,
      brandSlug,
      price,
      originalPrice: p?.originalPrice ?? null,
      discountPercent: p?.discountPercent ?? null,
      rating: Number(p?.rating ?? 0),
      reviewsCount: Number(p?.reviewsCount ?? 0),
      stock: Number(p?.stock ?? 0),
      stockStatus: p?.stockStatus ?? null,
      images: Array.isArray(p?.images) ? p.images : thumbnail ? [thumbnail] : [],
      thumbnail,
      variants: Array.isArray(p?.variants) ? p.variants : [],
      tags: Array.isArray(p?.tags) ? p.tags : [],
      featured: Boolean(p?.featured),
      bestseller: Boolean(p?.bestseller),
      newArrival: Boolean(p?.newArrival),
      onSale: Boolean(p?.onSale),
      bestValue: Boolean(p?.bestValue),
      dealEndTime: p?.dealEndTime ?? null,
      shortSpecs: Array.isArray(p?.shortSpecs) ? p.shortSpecs : [],
      highlights: Array.isArray(p?.highlights) ? p.highlights : [],
      shippingEstimate: p?.shippingEstimate ?? null,
      warranty: p?.warranty ?? null,
      badges: Array.isArray(p?.badges) ? p.badges : [],
      relatedIds: Array.isArray(p?.relatedIds) ? p.relatedIds : [],
      recommendedIds: Array.isArray(p?.recommendedIds) ? p.recommendedIds : [],
      ...p,
    }
  }

  useEffect(() => {
    try {
      const ps = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.products) || '[]')
      const cs = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.categories) || '[]')
      const bs = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.brands) || '[]')
      if (Array.isArray(ps) && ps.length) dispatch({ type: 'SET_PRODUCTS', payload: ps })
      if (Array.isArray(cs) && cs.length) dispatch({ type: 'SET_CATEGORIES', payload: cs })
      if (Array.isArray(bs) && bs.length) dispatch({ type: 'SET_BRANDS', payload: bs })
      if ((ps && ps.length) || (cs && cs.length) || (bs && bs.length)) setLoading(false)
    } catch {}
  }, [])

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [pRes, cRes, bRes] = await Promise.all([
          axios.get('http://localhost/elctro_Ecom_project/admin/api/TestProduct'),
          axios.get('http://localhost/elctro_Ecom_project/admin/api/TestProductCategory'),
          axios.get('http://localhost/elctro_Ecom_project/admin/api/TestProductBrand'),
        ])

        dispatch({
          type: 'SET_PRODUCTS',
          payload: pickArray(pRes.data, ['test_products', 'products', 'data', 'items'])
            .map(normalizeProduct)
            .filter(Boolean),
        })

        dispatch({
          type: 'SET_CATEGORIES',
          payload: pickArray(cRes.data, ['test_product_categories', 'data', 'items'])
            .map(normalizeCategory)
            .filter(Boolean),
        })

        dispatch({
          type: 'SET_BRANDS',
          payload: pickArray(bRes.data, ['test_product_brands', 'data', 'items'])
            .map(normalizeBrand)
            .filter(Boolean),
        })
      } catch (err) {
        console.error('Error loading product data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products))
      window.localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(state.categories))
      window.localStorage.setItem(STORAGE_KEYS.brands, JSON.stringify(state.brands))
    } catch {}
  }, [state.products, state.categories, state.brands])

  // Fill categories/brands from products if empty
  useEffect(() => {
    if (state.products.length > 0 && state.categories.length === 0) {
      const cats = Array.from(
        new Map(
          state.products
            .map((p) => ({ slug: p.categorySlug, name: p.category }))
            .filter((c) => c.slug)
            .map((c) => [c.slug, c]),
        ).values(),
      )
      dispatch({ type: 'SET_CATEGORIES', payload: cats.map(normalizeCategory).filter(Boolean) })
    }

    if (state.products.length > 0 && state.brands.length === 0) {
      const brs = Array.from(
        new Map(
          state.products
            .map((p) => ({ slug: p.brandSlug, name: p.brand }))
            .filter((b) => b.slug)
            .map((b) => [b.slug, b]),
        ).values(),
      )
      dispatch({ type: 'SET_BRANDS', payload: brs.map(normalizeBrand).filter(Boolean) })
    }
  }, [state.products, state.categories.length, state.brands.length])

  // Summaries (safe mapping)
  const categorySummary = useMemo(
    () =>
      Array.isArray(state.categories)
        ? state.categories.map((category) => ({
            ...category,
            count: state.products.filter((p) => p.categorySlug === category.slug).length,
          }))
        : [],
    [state.categories, state.products],
  )

  const brandSummary = useMemo(
    () =>
      Array.isArray(state.brands)
        ? state.brands.map((brand) => ({
            ...brand,
            count: state.products.filter(
              (p) => normalize(p.brandSlug) === normalize(brand.slug ?? brand.id ?? brand.name)
            ).length,
          }))
        : [],
    [state.brands, state.products],
  )

  const featuredProducts = useMemo(() => state.products.filter((p) => p.featured), [state.products])
  const newArrivals = useMemo(() => state.products.filter((p) => p.newArrival), [state.products])
  const bestSellers = useMemo(() => state.products.filter((p) => p.bestseller), [state.products])
  const onSaleProducts = useMemo(() => state.products.filter((p) => p.onSale), [state.products])
  const bestValueProducts = useMemo(() => state.products.filter((p) => p.bestValue), [state.products])
  const dealOfDayProduct = useMemo(
    () =>
      state.products.find(
        (p) =>
          Array.isArray(p.badges) &&
          p.badges.some((b) => (typeof b === 'string' ? b : b?.badge) === 'Hot')
      ) ?? null,
    [state.products]
  )

  const searchProducts = useCallback(
    (query, options = {}) => {
      const q = query?.trim().toLowerCase()
      if (!q) return []
      const limit = options.limit ?? 8
      return state.products
        .filter((p) => {
          const tagsText = Array.isArray(p.tags)
            ? p.tags.map((t) => (typeof t === 'string' ? t : t?.tag ?? '')).join(' ')
            : ''
          return [p.title, p.category, p.brand, tagsText].join(' ').toLowerCase().includes(q)
        })
        .slice(0, limit)
    },
    [state.products],
  )

  const getProductBySlug = useCallback(
    (slug) => state.products.find((p) => p.slug === slug) ?? null,
    [state.products],
  )

  const getProductsByIds = useCallback(
    (ids = []) => {
      const set = new Set((Array.isArray(ids) ? ids : []).map((x) => x?.toString()))
      return state.products.filter((p) => set.has(p?.id?.toString()))
    },
    [state.products],
  )

  const getProductsByCategory = useCallback(
    (categorySlug) => state.products.filter((p) => p.categorySlug === categorySlug),
    [state.products],
  )

  const getProductsByTag = useCallback(
    (tag) =>
      state.products.filter((p) =>
        Array.isArray(p.tags) && p.tags.some((t) => (typeof t === 'string' ? t : t?.tag) === tag)
      ),
    [state.products],
  )

  const setFilters = useCallback((payload) => dispatch({ type: 'SET_FILTERS', payload }), [])
  const setProducts = useCallback((payload) => dispatch({ type: 'SET_PRODUCTS', payload }), [])
  const setBrands = useCallback((payload) => dispatch({ type: 'SET_BRANDS', payload }), [])
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), [])

  const value = useMemo(
    () => ({
      products: state.products,
      categories: state.categories,
      brands: state.brands,
      filters: state.filters,
      categorySummary,
      brandSummary,
      featuredProducts,
      newArrivals,
      bestSellers,
      onSaleProducts,
      bestValueProducts,
      dealOfDayProduct,
      searchProducts,
      getProductBySlug,
      getProductsByIds,
      getProductsByCategory,
      getProductsByTag,
      setProducts,
      setBrands,
      setFilters,
      resetFilters,
      loading,
    }),
    [
      state.products,
      state.categories,
      state.brands,
      state.filters,
      categorySummary,
      brandSummary,
      featuredProducts,
      newArrivals,
      bestSellers,
      onSaleProducts,
      bestValueProducts,
      dealOfDayProduct,
      searchProducts,
      getProductBySlug,
      getProductsByIds,
      getProductsByCategory,
      getProductsByTag,
      setProducts,
      setBrands,
      setFilters,
      resetFilters,
      loading,
    ]
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used within a ProductProvider')
  return context
}
