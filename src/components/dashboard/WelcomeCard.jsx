import React, { useEffect, useState } from 'react'

export default function WelcomeCard({ userName = 'Admin', pendingOrders = 0, progress = 0 }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = time.toLocaleTimeString()
  const dateStr = time.toLocaleDateString()

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold uppercase">Welcome back, <span className='text-primary'>{userName}</span></h3>
          <p className="text-md text-neutral-500">Today is <span className='font-bold'>{dateStr} — {timeStr}</span></p>
        </div>
        <div className="text-right">
          <p className="text-md font-medium">{pendingOrders} pending orders</p>
          <p className="text-sm text-neutral-500">Action required</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-4 bg-neutral-100 rounded-full overflow-hidden dark:bg-neutral-700">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500 mt-1">{Math.round(progress)}% of target</p>
      </div>
    </div>
  )
}
