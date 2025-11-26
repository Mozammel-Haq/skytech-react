import { Helmet } from 'react-helmet-async'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx'

function AccountLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <>
      <Helmet>
        <title>Account — SkyTech</title>
      </Helmet>
      <DashboardLayout
        title="Account"
        sections={[
          { label: 'Dashboard', to: '/account' },
          { label: 'Orders', to: '/account/orders' },
          { label: 'Profile', to: '/account/profile' },
        ]}
      >
        <Outlet />
      </DashboardLayout>
    </>
  )
}

export default AccountLayout