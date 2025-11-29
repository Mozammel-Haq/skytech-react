import React from 'react'

export default function RecentOrders({ rows = [] }) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      <h4 className="font-semibold mb-3">Recent Orders</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Order</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.order_number ?? r.id}</td>
                <td className="p-2">{r.customer_name ?? r.user_id ?? '—'}</td>
                <td className="p-2">{r.total_amount ?? '—'}</td>
                <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : r.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
