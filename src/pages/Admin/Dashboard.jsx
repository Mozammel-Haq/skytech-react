import { Helmet } from 'react-helmet-async'
import WelcomeCard from '../../components/dashboard/WelcomeCard.jsx'
import StatsCards from '../../components/dashboard/StatsCards.jsx'
import SalesChart from '../../components/dashboard/SalesChart.jsx'
import TopProductsChart from '../../components/dashboard/TopProductsChart.jsx'
import CustomersChart from '../../components/dashboard/CustomersChart.jsx'
import RecentOrders from '../../components/dashboard/RecentOrders.jsx'
import { useDashboard } from '../../context/DashboardContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardCard from '../../components/dashboard/DashboardCard.jsx'

export default function SuperAdminDashboard() {
  const { stats, loading, exportToExcel } = useDashboard()
  const { user } = useAuth() // username

  if (loading) return <p>Loading dashboard...</p>
  if (!stats) return <p>Unable to load dashboard.</p>

  // compute small progress example (delivered / total)
  const progress = stats.totalOrders ? (stats.deliveredOrders / stats.totalOrders) * 100 : 0

  return (
    <>
      <Helmet><title>Super Admin — Dashboard</title></Helmet>

      <div className="grid gap-4 md:grid-cols-3 items-start">
  {/* Welcome card takes 2/3 */}
  <div className="md:col-span-2">
    <WelcomeCard 
      userName={user?.name ?? 'Admin'} 
      pendingOrders={stats.pendingOrders} 
      progress={progress} 
    />
  </div>

  {/* StatsCards takes 1/3 */}
  <div className="md:col-span-1">
    <div className='flex flex-wrap justify-around gap-4'>
              <DashboardCard title="Total Products"value={stats.totalProducts ?? 0} />
              <DashboardCard title="Total Orders" value={stats.totalOrders ?? 0} />
              <DashboardCard title="Total Customers" value={stats.totalCustomers ?? 0} />
    </div>
  </div>
</div>


      <div className="grid gap-4 md:grid-cols-3 mt-4">
  <div className="md:col-span-2">
    <SalesChart 
      data={stats} 
      exportHandler={(rows, filename) => exportToExcel(rows, filename, 'Sales')} 
    />
  </div>

  <div className="md:col-span-1">
    <TopProductsChart 
      data={stats.topProducts} 
      exportHandler={(rows, filename) => exportToExcel(rows, filename, 'TopProducts')} 
    />
  </div>
</div>



      <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div>
    <RecentOrders rows={stats.recentOrders} />
  </div>
  <div>
    <CustomersChart
      monthlyData={stats.customerGrowth}
      dailyData={stats.customerGrowthDaily}
      exportHandler={(rows, filename) => exportToExcel(rows, filename, 'Customers')}
    />
  </div>

</div>

    </>
  )
}
