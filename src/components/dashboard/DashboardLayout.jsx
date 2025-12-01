import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'

function DashboardLayout({ title, sections }) {
  return (
    <div className="dash-layout min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <DashboardTopbar title={title} />
      <div className=" container grid gap-6 py-2 lg:grid-cols-[260px,1fr]">
        <DashboardSidebar sections={sections} />
        <div className="space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout