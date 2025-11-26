import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import axios from 'axios'

// -------------------------------------------------------------
// Context Setup
// -------------------------------------------------------------
const OrdersContext = createContext(undefined)

const initialState = {
  orders: [],
}

const API_BASE = 'http://localhost/elctro_Ecom_project/admin/api'
const ORDERS_ENDPOINT = `${API_BASE}/testorder`
const SAVE_ENDPOINT = `${API_BASE}/testorder/save`

// -------------------------------------------------------------
// Reducer
// -------------------------------------------------------------
function ordersReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }

    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }

    case 'UPDATE_STATUS': {
      const { id, status } = action.payload
      const timestamp = dayjs().toISOString()

      const updatedOrders = state.orders.map((o) => {
        if (o.id !== id) return o

        const updatedTracking = {
          ...o.tracking,
          history: [
            ...(o.tracking?.history ?? []),
            {
              status: status.charAt(0).toUpperCase() + status.slice(1),
              timestamp,
            },
          ],
        }

        const updatedOrder = {
          ...o,
          status,
          tracking: updatedTracking,
        }

        if (status === 'delivered') {
          updatedOrder.fulfilledAt = timestamp
        }

        return updatedOrder
      })

      return { ...state, orders: updatedOrders }
    }

    case 'APPEND_TRACKING': {
      const { id, entry } = action.payload

      const updatedOrders = state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              tracking: {
                ...o.tracking,
                history: [...(o.tracking?.history ?? []), entry],
              },
            }
          : o
      )

      return { ...state, orders: updatedOrders }
    }

    default:
      return state
  }
}

// -------------------------------------------------------------
// Normalizers
// -------------------------------------------------------------
const toNumber = (v) => (typeof v === 'number' ? v : Number(v ?? 0))

const normalizeItem = (i) => ({
  id: i?.id ? `p-${i.id}` : '',
  title: i?.title ?? i?.name ?? '',
  quantity: toNumber(i?.quantity ?? i?.qty),
  price: toNumber(i?.price),
})

const normalizeAddress = (a) => ({
  name: a?.name ?? '',
  line1: a?.line1 ?? a?.address_line1 ?? '',
  line2: a?.line2 ?? a?.address_line2 ?? null,
  city: a?.city ?? '',
  state: a?.state ?? '',
  postalCode: a?.postalCode ?? a?.postal_code ?? '',
  country: a?.country ?? '',
})

const normalizeTracking = (t) => ({
  carrier: t?.carrier ?? null,
  trackingNumber: t?.trackingNumber ?? t?.tracking_number ?? null,
  history: Array.isArray(t?.history)
    ? t.history.map((h) => ({
        status: h?.status ?? '',
        timestamp:
          h?.timestamp ?? h?.time ?? h?.created_at ?? dayjs().toISOString(),
      }))
    : [],
})

const normalizeOrder = (o) => ({
  id: o?.id ? `ord-${o.id}` : '',
  orderNumber: o?.orderNumber ?? o?.order_number ?? '',
  userId: o?.userId ?? o?.user_id ?? '',
  status: o?.status ?? 'pending',
  placedAt: o?.placedAt ?? o?.placed_at ?? o?.created_at ?? null,
  fulfilledAt: o?.fulfilledAt ?? o?.fulfilled_at ?? null,
  items: Array.isArray(o?.items) ? o.items.map(normalizeItem) : [],
  subtotal: toNumber(o?.subtotal ?? o?.sub_total),
  shipping: toNumber(o?.shipping),
  tax: toNumber(o?.tax),
  total: toNumber(o?.total),
  shippingAddress: normalizeAddress(
    o?.shippingAddress ?? o?.shipping_address ?? {}
  ),
  tracking: normalizeTracking(o?.tracking ?? {}),
  paymentMethod: o?.paymentMethod ?? o?.payment_method ?? undefined,
})

// -------------------------------------------------------------
// Provider
// -------------------------------------------------------------
export function OrdersProvider({ children }) {
  const [state, dispatch] = useReducer(ordersReducer, initialState)

  // -----------------------------------------------------------
  // Fetch Orders from API
  // -----------------------------------------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(ORDERS_ENDPOINT)
        const rawOrders = Array.isArray(res.data?.test_orders)
          ? res.data.test_orders
          : []

        const normalized = rawOrders.map(normalizeOrder)
        dispatch({ type: 'SET_ORDERS', payload: normalized })
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }
    }

    fetchOrders()
  }, [])

  // -----------------------------------------------------------
  // Actions
  // -----------------------------------------------------------
  const setOrders = useCallback(
    (payload) => dispatch({ type: 'SET_ORDERS', payload }),
    []
  )

  const addOrder = useCallback(
    (order) => dispatch({ type: 'ADD_ORDER', payload: order }),
    []
  )

  const updateStatus = useCallback(async (id, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } })

    try {
      const numericId = id.toString().replace('ord-', '')
      const res = await axios.post(`${API_BASE}/testorder/update/${numericId}`, {
        id: numericId,
        status: status.toLowerCase()
      })
      console.log('Update Success:', res)
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
  }, [])

  const appendTracking = useCallback(
    (id, entry) =>
      dispatch({ type: 'APPEND_TRACKING', payload: { id, entry } }),
    []
  )

  const createOrder = useCallback(async (order) => {
    try {
      const res = await axios.post(SAVE_ENDPOINT, order)
      const data = res?.data
      const raw = Array.isArray(data) ? data[0] : data?.order ?? data
      const created = normalizeOrder(raw ?? order)
      dispatch({ type: 'ADD_ORDER', payload: created })
      return created
    } catch (err) {
      dispatch({ type: 'ADD_ORDER', payload: order })
      return order
    }
  }, [])

  // -----------------------------------------------------------
  // Selectors
  // -----------------------------------------------------------
  const getById = useCallback(
    (id) => state.orders.find((o) => o.id === id) ?? null,
    [state.orders]
  )

  const getByOrderNumber = useCallback(
    (num) => state.orders.find((o) => o.orderNumber === num) ?? null,
    [state.orders]
  )

  const getByIdOrNumber = useCallback(
    (q) => state.orders.find((o) => o.id === q || o.orderNumber === q) ?? null,
    [state.orders]
  )

  const listByUser = useCallback(
    (uid) => state.orders.filter((o) => o.userId === uid),
    [state.orders]
  )

  // -----------------------------------------------------------
  // Memoized Value
  // -----------------------------------------------------------
  const value = useMemo(
    () => ({
      orders: state.orders,
      setOrders,
      addOrder,
      updateStatus,
      appendTracking,
      createOrder,
      getById,
      getByOrderNumber,
      getByIdOrNumber,
      listByUser,
    }),
    [
      state.orders,
      setOrders,
      addOrder,
      updateStatus,
      appendTracking,
      createOrder,
      getById,
      getByOrderNumber,
      getByIdOrNumber,
      listByUser,
    ]
  )

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

OrdersProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// -------------------------------------------------------------
// Hook
// -------------------------------------------------------------
export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context)
    throw new Error('useOrders must be used within an OrdersProvider')
  return context
}
