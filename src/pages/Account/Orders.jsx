import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useOrders } from '../../context/OrdersContext.jsx'

function AccountOrders() {
  const { user, isAuthenticated } = useAuth()
  const { listByUser } = useOrders()
  if (!isAuthenticated) {
return (
  <div className="container py-10">
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center dark:bg-neutral-900 dark:border-neutral-700">
      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Please login to view your orders
      </p>
      <Link
        to="/login"
        className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Login
      </Link>
    </div>
  </div>
)

  }

  const myOrders = listByUser(user.id)

return (
  <>
    <Helmet>
      <title>Account — Orders</title>
    </Helmet>
    <div className="container py-10">
      <h1 className="text-2xl font-bold dark:text-white">Your orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left dark:text-white">Order</th>
              <th className="p-3 text-left dark:text-white">Status</th>
              <th className="p-3 text-left dark:text-white">Placed</th>
              <th className="p-3 text-left dark:text-white">Total</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100 dark:border-neutral-700">
                <td className="p-3 font-semibold dark:text-white">{o.orderNumber}</td>
                <td className="p-3 dark:text-neutral-300">{o.status}</td>
                <td className="p-3 dark:text-neutral-300">{new Date(o.placedAt).toLocaleString()}</td>
                <td className="p-3 font-semibold dark:text-white">${o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
)

}

export default AccountOrders
