import { Helmet } from 'react-helmet-async'
import { useProducts } from '../../context/ProductContext.jsx'
import { useOrders } from '../../context/OrdersContext.jsx'
import DashboardCard from '../../components/dashboard/DashboardCard.jsx'

function AdminDashboard() {
  const { products } = useProducts()
  const { orders } = useOrders()
  const lowStock = products.filter((p) => p.stockStatus === 'low' || p.stockStatus === 'out').length

  return (
    <>
      <Helmet>
        <title>Admin — Dashboard</title>
      </Helmet>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Total products" value={products.length} />
        <DashboardCard title="Orders" value={orders.length} accent="secondary" />
        <DashboardCard title="Low stock" value={lowStock} />
      </div>
    </>
  )
}

export default AdminDashboard