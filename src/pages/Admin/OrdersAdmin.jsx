import { Helmet } from 'react-helmet-async'
import { useOrders } from '../../context/OrdersContext.jsx'
import DataTable from '../../components/dashboard/DataTable.jsx'
import { useMemo, useCallback } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import dayjs from 'dayjs'
import { FiTrash2 } from 'react-icons/fi'

function OrdersAdmin() {
  const { orders, updateStatus,deleteOrder } = useOrders()

  // advance order status
  const advanceStatus = useCallback((order) => {
    const flow = ['pending', 'processing', 'shipped', 'delivered']
    const idx = flow.indexOf(order.status)
    const next = flow[Math.min(flow.length - 1, idx + 1)]
    updateStatus(order.id, next)
  }, [updateStatus])

  // table rows
  const rows = useMemo(() => {
  const statusFlow = ['pending', 'processing', 'shipped', 'delivered']

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    userId: o.userId,
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
    placedAt: dayjs(o.placedAt).format('YYYY-MM-DD HH:mm'),
    fulfilledAt: o.fulfilledAt ? dayjs(o.fulfilledAt).format('YYYY-MM-DD HH:mm') : '-',
    total: `$${o.total.toFixed(2)}`,
    items: o.items.map(i => `${i.title} x${i.quantity}`).join(', '),
    shippingAddress: `${o.shippingAddress.line1}, ${o.shippingAddress.city}`,
actions: (
  <div className="flex items-center gap-2">

    {/* Status dropdown */}
    <select
      className="rounded border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
      value={o.status}
      onChange={(e) => updateStatus(o.id, e.target.value)}
    >
      {statusFlow.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>

    {/* Delete icon button */}
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this order?")) {
          deleteOrder(o.id)
        }
      }}
      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
      title="Delete Order"
    >
      <FiTrash2 size={16} />
    </button>
  </div>
),


  }))
}, [orders, updateStatus])
// console.log(orders)

  // table columns
  const columns = useMemo(() => [
    { key: 'orderNumber', label: 'Order #' },
    { key: 'userId', label: 'User' },
    { key: 'status', label: 'Status' },
    { key: 'placedAt', label: 'Placed At' },
    { key: 'total', label: 'Total' },
    { key: 'actions', label: 'Actions' },
  ], [])

  return (
    <>
      <Helmet>
        <title>Admin — Orders</title>
      </Helmet>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Orders</h2>
      </div>

      <div className="overflow-x-auto p-4 rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700">
        <DataTable columns={columns} rows={rows} />
      </div>
    </>
  )
}

export default OrdersAdmin
