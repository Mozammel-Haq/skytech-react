import { Helmet } from 'react-helmet-async'
import DashboardCard from '../../components/dashboard/DashboardCard.jsx'
import { useProducts } from '../../context/ProductContext.jsx'
import { useOrders } from '../../context/OrdersContext.jsx'

function SuperAdminDashboard() {
  const { products } = useProducts()
  const { orders } = useOrders()
  return (
    <>
      <Helmet>
        <title>Super Admin — Dashboard</title>
      </Helmet>
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Products" value={products.length} />
        <DashboardCard title="Orders" value={orders.length} />
        <DashboardCard title="Admins" value={1} />
        <DashboardCard title="Customers" value={2} />
      </div>
    </>
  )
}

export default SuperAdminDashboard