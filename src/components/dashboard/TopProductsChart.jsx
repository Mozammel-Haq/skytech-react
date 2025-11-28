import React from 'react'
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = [
  '#e67e22',
  '#f5a623',
  '#9b59b6', 
  '#f1c40f', 
'#72d6b5', 
  '#4a90e2'
];


// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white p-2 rounded shadow border">
      <p className="font-semibold">{data.name}</p>
      <p>Units Sold: {data.uv}</p>
      {data.percentage !== undefined && <p>Percentage: {data.percentage}%</p>}
    </div>
  )
}

export default function TopProductsRadialChart({ data = [], exportHandler }) {
  const total = data.reduce((sum, item) => sum + (item.total_sold || 0), 0)

  const parsed = data.map((d, i) => ({
    name: d.name,
    uv: Number(d.total_sold) || 0,
    percentage: total ? ((d.total_sold / total) * 100).toFixed(0) : 0,
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className="p-4 relative max-h-[400px] rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Top Products</h4>
        {exportHandler && (
          <button
            onClick={() =>
              exportHandler(parsed.map(d => ({ name: d.name, value: d.uv })), 'top-products.xlsx')
            }
            className="text-sm px-3 py-1 border rounded"
          >
            Export Excel
          </button>
        )}
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="45%"
            innerRadius="15%"
            outerRadius="80%"
            barSize={25}
            data={parsed}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="uv"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                const entry = parsed[index]
                const radius = innerRadius + (outerRadius - innerRadius) / 2
                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {`${entry.percentage}%`}
                  </text>
                )
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Custom legend below the chart */}
        <div className="flex w-full justify-center flex-wrap mt-2 gap-2 absolute bottom-16 left-1/2 transform -translate-x-1/2">
          {parsed.map((d, i) => (
            <div key={i} className="flex items-center space-x-1 text-sm">
              <div
                style={{ backgroundColor: d.fill, width: 12, height: 12 }}
                className="rounded-sm"
              />
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
