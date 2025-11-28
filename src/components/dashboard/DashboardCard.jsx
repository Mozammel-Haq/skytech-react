function DashboardCard({ title, value, accent = 'primary' }) {
  const accentClass = accent === 'primary' ? 'text-primary' : accent === 'secondary' ? 'text-secondary' : 'text-neutral-500'
  return (
    <div className="text-center rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{title}</p>
      <p className={`text-2xl font-bold dark:text-white ${accentClass}`}>{value}</p>
    </div>
  )
}

export default DashboardCard