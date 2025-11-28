import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function CustomersChart({ data = [], exportHandler }) {
  const parsed = data.map((d) => ({ month: d.ym, new_customers: Number(d.new_customers) || 0 }))

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Customer Growth</h4>
        {exportHandler && <button onClick={() => exportHandler(parsed, 'customers.xlsx')} className="text-sm px-3 py-1 border rounded">Export Excel</button>}
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={parsed}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="new_customers" stroke="#f97316" fill="#ffd8b5" name="New Customers" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
