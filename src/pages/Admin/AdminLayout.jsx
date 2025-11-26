import { Helmet } from 'react-helmet-async'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx'
import { FiBox, FiList, FiTag, FiShoppingCart, FiRotateCcw, FiHome } from 'react-icons/fi'

function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />

  return (
    <>
      <Helmet>
        <title>Admin — SkyTech</title>
      </Helmet>
      <DashboardLayout
        title="Admin"
        sections={[
          { label: 'Dashboard', to: '/admin', icon: FiHome },
          {
            label: 'Catalog',
            icon: FiBox,
            children: [
              { label: 'Products', to: '/admin/products', icon: FiBox },
              { label: 'Categories', to: '/admin/categories', icon: FiList },
              { label: 'Brands', to: '/admin/brands', icon: FiTag },
            ],
          },
          {
            label: 'Sales',
            icon: FiShoppingCart,
            children: [
              { label: 'Orders', to: '/admin/orders', icon: FiShoppingCart },
              { label: 'Returns', to: '/admin/returns', icon: FiRotateCcw },
            ],
          },
          { label: 'Homepage', to: '/admin/homepage', icon: FiHome },
        ]}
      >
        <Outlet />
      </DashboardLayout>
    </>
  )
}

export default AdminLayout
