import React from 'react'
import DashboardCard from './DashboardCard.jsx'

export default function StatsCards({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 items-center">
      <DashboardCard title="Products" value={stats.totalProducts ?? 0} />
      <DashboardCard title="Orders" value={stats.totalOrders ?? 0} />
      <DashboardCard title="Admins" value={stats.totalAdmins ?? 0} />
      <DashboardCard title="Customers" value={stats.totalCustomers ?? 0} />
    </div>
  )
}
