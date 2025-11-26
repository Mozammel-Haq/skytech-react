import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useOrders } from '../../context/OrdersContext.jsx'

function AccountDashboard() {
  const { user, isAuthenticated } = useAuth()
  const { listByUser } = useOrders()

  if (!isAuthenticated) {
    return (
  <div className="container py-10">
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center dark:bg-neutral-900 dark:border-neutral-700">
      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Please login to view your dashboard
      </p>
      <Link
        to="/login"
        className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
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
      <title>Account — Dashboard</title>
    </Helmet>
    <div className="container py-10">
      <h1 className="text-2xl font-bold dark:text-white">Welcome, {user.name}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Total orders</p>
          <p className="text-2xl font-bold dark:text-white">{myOrders.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Pending</p>
          <p className="text-2xl font-bold dark:text-white">
            {myOrders.filter((o) => o.status === 'pending' || o.status === 'processing').length}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Delivered</p>
          <p className="text-2xl font-bold dark:text-white">
            {myOrders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
          <h2 className="text-lg font-semibold dark:text-white">Recent orders</h2>
          <Link to="/account/orders" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {myOrders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between p-4 text-sm dark:text-neutral-200">
              <span className="font-semibold">{o.orderNumber}</span>
              <span className="text-neutral-600 dark:text-neutral-400">{o.status}</span>
              <span className="font-semibold">${o.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)

}

export default AccountDashboard
