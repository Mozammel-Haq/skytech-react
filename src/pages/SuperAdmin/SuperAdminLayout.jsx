import { Helmet } from 'react-helmet-async'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx'
import { FiBox, FiList, FiTag, FiShoppingCart, FiRotateCcw, FiHome, FiUsers, FiShield, FiBarChart2, FiSettings } from 'react-icons/fi'

function SuperAdminLayout() {
  const { isAuthenticated, isSuperAdmin } = useAuth()

  if (!isAuthenticated || !isSuperAdmin) return <Navigate to="/login" replace />

  return (
    <>
      <Helmet>
        <title>Super Admin — SkyTech</title>
      </Helmet>
      <DashboardLayout
        title="Super Admin"
        sections={[
          { label: 'Dashboard', to: '/super-admin', icon: FiHome },
          {
            label: 'Catalog',
            icon: FiBox,
            children: [
              { label: 'Products', to: '/super-admin/products', icon: FiBox },
              { label: 'Categories', to: '/super-admin/categories', icon: FiList },
              { label: 'Brands', to: '/super-admin/brands', icon: FiTag },
            ],
          },
          {
            label: 'Sales',
            icon: FiShoppingCart,
            children: [
              { label: 'Orders', to: '/super-admin/orders', icon: FiShoppingCart },
              { label: 'Returns', to: '/super-admin/returns', icon: FiRotateCcw },
            ],
          },
          {
            label: 'Users',
            icon: FiUsers,
            roles: ['super_admin'],
            children: [
              { label: 'Admin Users', to: '/super-admin/admins', icon: FiUsers, roles: ['super_admin'] },
              { label: 'Customers', to: '/super-admin/customers', icon: FiUsers, roles: ['super_admin'] },
            ],
          },
          { label: 'Roles', to: '/super-admin/roles', icon: FiShield, roles: ['super_admin'] },
                    { label: 'Homepage', to: '/super-admin/homepage', icon: FiHome },
          { label: 'Settings', to: '/super-admin/settings', icon: FiSettings, roles: ['super_admin'] },
          { label: 'Analytics', to: '/super-admin/analytics', icon: FiBarChart2, roles: ['super_admin'] },
          
        ]}
      >
        <Outlet />
      </DashboardLayout>
    </>
  )
}

export default SuperAdminLayout