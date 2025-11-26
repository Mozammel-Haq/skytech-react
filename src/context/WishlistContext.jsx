import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

const WishlistContext = createContext(undefined)

const STORAGE_KEY = 'skytech_wishlist'

const initialState = {
  items: [],
}

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }
    case 'TOGGLE_ITEM': {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (exists) {
        toast.info('Removed from wishlist')
        return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) }
      }
      toast.success('Saved to wishlist')
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(
    wishlistReducer,
    initialState,
    (init) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          return { items: Array.isArray(parsed) ? parsed : [] }
        }
      } catch (error) {
        toast.error('Could not restore wishlist')
      }
      return init
    },
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      toast.error('Could not persist wishlist')
    }
  }, [state.items])

  const toggleItem = (item) => dispatch({ type: 'TOGGLE_ITEM', payload: item })

  const clearWishlist = () => dispatch({ type: 'CLEAR' })

  const value = useMemo(
    () => ({ items: state.items, toggleItem, clearWishlist }),
    [state.items],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
