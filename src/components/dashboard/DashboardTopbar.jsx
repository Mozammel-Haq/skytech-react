function DashboardTopbar({ title }) {
  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <div className="container flex items-center justify-between py-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <a href="/" className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold dark:border-neutral-700">Back to store</a>
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar