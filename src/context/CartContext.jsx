import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

const CartContext = createContext(undefined)

const STORAGE_KEY = 'skytech_cart'

const initialState = {
  items: [],
  promoCode: null,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.id === action.payload.id && item.variantId === action.payload.variantId,
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === action.payload.id && item.variantId === action.payload.variantId),
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [], promoCode: null }
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.payload }
    case 'CLEAR_PROMO':
      return { ...state, promoCode: null }
    default:
      return state
  }
}

const PROMO_CODES = {
  SKY10: {
    code: 'SKY10',
    type: 'percentage',
    value: 10,
    description: 'Take 10% off your subtotal',
  },
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (init) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          return {
            items: Array.isArray(parsed?.items) ? parsed.items : [],
            promoCode: parsed?.promoCode ?? null,
          }
        }
      } catch (error) {
        toast.error('Could not restore cart state')
      }
      return init
    },
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, promoCode: state.promoCode }),
      )
    } catch (error) {
      toast.error('Could not persist cart state')
    }
  }, [state.items, state.promoCode])

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success('Added to cart', {
      toastId: `cart-${item.id}-${item.variantId}`,
      pauseOnHover: false,
    })
  }, [])

  const updateQuantity = useCallback((id, variantId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, variantId, quantity } })
  }, [])

  const removeItem = useCallback((id, variantId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, variantId } })
    toast.info('Removed from cart')
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
    toast.info('Cart cleared')
  }, [])

  const applyPromo = useCallback((code) => {
    const formatted = code.trim().toUpperCase()
    const promo = PROMO_CODES[formatted]
    if (!promo) {
      toast.error('Promo code not recognized')
      return false
    }
    dispatch({ type: 'APPLY_PROMO', payload: promo })
    toast.success(`Promo ${formatted} applied`)
    return true
  }, [])

  const clearPromo = useCallback(() => dispatch({ type: 'CLEAR_PROMO' }), [])

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? 15 : 0
    const tax = subtotal * 0.07
    let discount = 0

    if (state.promoCode?.type === 'percentage') {
      discount = subtotal * (state.promoCode.value / 100)
    }

    const total = subtotal + shipping + tax - discount

    return {
      subtotal,
      shipping,
      tax,
      discount,
      total,
    }
  }, [state.items, state.promoCode])

  const cartCount = useMemo(
    () => state.items.reduce((acc, item) => acc + item.quantity, 0),
    [state.items],
  )

  const value = useMemo(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      cartCount,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyPromo,
      clearPromo,
    }),
    [
      state.items,
      state.promoCode,
      cartCount,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyPromo,
      clearPromo,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
