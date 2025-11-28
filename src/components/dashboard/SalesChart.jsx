import React, { useState, useMemo } from 'react'
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function SalesChart({ data = {}, exportHandler }) {
  const [view, setView] = useState('monthly') // 'daily' | 'monthly'

  // Transform API data depending on selected view
  const parsed = useMemo(() => {
    if (!data) return []

    if (view === 'monthly') {
      return (data.salesPerMonth || []).map(d => ({
        period: d.ym,            // use generic 'period'
        revenue: Number(d.revenue) || 0,
        orders: Number(d.orders_count) || 0
      }))
    }

    // daily
    return (data.salesPerDay || []).map(d => ({
      period: d.day,            // generic 'period'
      revenue: Number(d.total_amount) || 0,
      orders: Number(d.total_orders) || 0
    }))
  }, [view, data])

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Sales Analytics</h4>

        <div className="flex gap-2">
          {/* Dropdown for daily/monthly */}
          <select
            className="border px-2 py-1 rounded text-sm"
            value={view}
            onChange={e => setView(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>

          {/* Export button */}
          {exportHandler && (
            <button
              onClick={() => exportHandler(parsed, `sales-${view}.xlsx`)}
              className="text-sm px-3 py-1 border rounded"
            >
              Export Excel
            </button>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={parsed}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              label={{
                value: view === 'monthly' ? 'Month' : 'Date',
                position: 'insideBottomRight',
                offset: 0
              }}
            />
            <YAxis
              label={{
                value: 'Revenue / Orders',
                angle: -90,
                position: 'insideLeft'
              }}
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="#10b981"
              stroke="#10b981"
              name="Revenue"
            />
            <Bar dataKey="orders" barSize={20} fill="#3b82f6" name="Orders" />
            <Line type="monotone" dataKey="revenue" stroke="#047857" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
