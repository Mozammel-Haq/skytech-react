import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

const CompareContext = createContext(undefined)

const STORAGE_KEY = 'skytech_compare'

const MAX_COMPARE_ITEMS = 3

const initialState = {
  items: [],
}

function compareReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CompareProvider({ children }) {
  const [state, dispatch] = useReducer(
    compareReducer,
    initialState,
    (init) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          return { items: Array.isArray(parsed) ? parsed : [] }
        }
      } catch (error) {
        console.error('Could not restore compare list')
      }
      return init
    },
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      toast.error('Could not persist compare list')
    }
  }, [state.items])

  const addItem = (item) => {
    if (state.items.length >= MAX_COMPARE_ITEMS) {
      toast.info(`You can compare up to ${MAX_COMPARE_ITEMS} products at once`)
      return
    }
    if (state.items.find((x) => x.id === item.id)) {
      toast.info('Already in compare list')
      return
    }
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success('Added to compare')
  }

  const removeItem = (id) => {
    if (state.items.find((x) => x.id === id)) {
      dispatch({ type: 'REMOVE_ITEM', payload: id })
      toast.info('Removed from compare list')
    }
  }

  const clear = () => dispatch({ type: 'CLEAR' })

  const value = useMemo(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      clear,
      max: MAX_COMPARE_ITEMS,
    }),
    [state.items],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

CompareProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
