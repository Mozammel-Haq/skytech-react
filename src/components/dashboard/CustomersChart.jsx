import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  DefaultTooltipContent,
  DefaultLegendContent
} from 'recharts';

export default function CustomersChart({ monthlyData = [], dailyData = [], exportHandler }) {
  const [view, setView] = useState('monthly'); // 'daily' | 'monthly'

  // Transform API data into banded chart format
  const parsed = useMemo(() => {
    if (view === 'monthly') {
      return monthlyData.map(d => ({
        name: d.ym,                   // X-axis label
        b: Number(d.new_customers) || 0, // Line value
        a: [0, Number(d.new_customers) || 0] // Banded area range
      }));
    }

    return dailyData.map(d => ({
      name: d.day,
      b: Number(d.new_customers) || 0,
      a: [0, Number(d.new_customers) || 0]
    }));
  }, [view, monthlyData, dailyData]);

  // Optional: filter banded area out of tooltip
  const renderTooltipWithoutRange = ({ payload, ...rest }) => {
    const newPayload = (payload || []).filter(x => x.dataKey !== 'a');
    return <DefaultTooltipContent payload={newPayload} {...rest} />;
  };

  // Optional: filter banded area out of legend
  const renderLegendWithoutRange = ({ payload, ...rest }) => {
    const newPayload = (payload || []).filter(x => x.dataKey !== 'a');
    return <DefaultLegendContent payload={newPayload} {...rest} />;
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      {/* Header with Dropdown & Export */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Customer Growth</h4>

        <div className="flex gap-2">
          <select
            className="border px-2 py-1 rounded text-sm"
            value={view}
            onChange={e => setView(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>

          {exportHandler && parsed.length > 0 && (
            <button
              onClick={() => exportHandler(parsed, `customers-${view}.xlsx`)}
              className="text-sm px-3 py-1 border rounded"
            >
              Export Excel
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={parsed} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: view === 'monthly' ? 'Month' : 'Date', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'New Customers', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={renderTooltipWithoutRange} />
            <Legend content={renderLegendWithoutRange} />
            <Area type="monotone" dataKey="a" stroke="none" fill="#ffd8b5" dot={false} activeDot={false} />
            <Line type="natural" dataKey="b" stroke="#f97316" connectNulls name="New Customers" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
