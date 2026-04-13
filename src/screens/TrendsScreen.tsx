// src/screens/TrendsScreen.tsx
// Trend chart — TRAK-02.
// Multi-line Recharts chart showing each dimension's score over time.

import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { db } from '../data/db';
import { DIMENSIONS, type DimensionKey } from '../config/dimensions';

// Accessible, distinct colors per dimension (Claude's discretion)
const DIMENSION_COLORS: Record<DimensionKey, string> = {
  purpose:        '#3b82f6', // blue-500
  people:         '#10b981', // emerald-500
  place:          '#f59e0b', // amber-500
  personalHealth: '#8b5cf6', // violet-500
  provision:      '#ef4444', // red-500
};

export function TrendsScreen() {
  // D-06/Pitfall 4: orderBy('date') ascending — oldest first for left-to-right time axis
  // Do NOT use .reverse() here (that's for HistoryScreen's newest-first list)
  const records = useLiveQuery(
    () => db.assessments.orderBy('date').toArray(),
    []
  );

  // Loading state
  if (records === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-slate-400 text-sm">Loading...</span>
      </div>
    );
  }

  // Empty state
  if (records.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4 text-center">
        <p className="text-[20px] font-semibold text-slate-900">No trend data yet</p>
        <p className="text-sm text-slate-500">
          Complete at least one assessment to see your trends.
        </p>
      </div>
    );
  }

  // Shape records into Recharts data array — each entry is one point on all 5 lines
  const chartData = records.map(r => ({
    date: r.date,
    purpose: r.purpose,
    people: r.people,
    place: r.place,
    personalHealth: r.personalHealth,
    provision: r.provision,
  }));

  // D-08: show dots for sparse data (1-2 points); lines only for 3+ points
  const showDots = records.length <= 2;

  return (
    <div className="flex flex-col px-4 pt-6 gap-4">
      <h2 className="text-[20px] font-semibold text-slate-900 leading-[1.2]">
        Score Trends
      </h2>

      {/* height={260} prevents zero-height collapse; overflow-hidden prevents clip on 375px screens */}
      <div className="overflow-hidden">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, bottom: 0, left: -16 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(iso: string) => format(new Date(iso), 'MMM d')}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: '#64748b' }}
            width={36}
          />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(iso) => typeof iso === 'string' ? format(new Date(iso), 'MMMM d, yyyy') : String(iso)}
          />
          <Legend />
          {DIMENSIONS.map(dim => (
            <Line
              key={dim.key}
              type="monotone"
              dataKey={dim.key}
              name={dim.label}
              stroke={DIMENSION_COLORS[dim.key]}
              strokeWidth={2}
              dot={showDots}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      </div>

      {/* Single-assessment hint */}
      {records.length === 1 && (
        <p className="text-xs text-slate-400 text-center">
          Take more assessments to see how your scores change over time.
        </p>
      )}
    </div>
  );
}
