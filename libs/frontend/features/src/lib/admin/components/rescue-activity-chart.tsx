'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { WEEK_DATA } from '../constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1215] border border-white/10 rounded-xl px-4 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-emerald-400 font-bold">{payload[0].value} rescues</p>
      </div>
    );
  }
  return null;
};

export function RescueActivityChart() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold">Rescue Activity</h3>
          <p className="text-gray-500 text-xs">This week's rescue requests</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
          <TrendingUp className="w-4 h-4" /> Live
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={WEEK_DATA}>
          <defs>
            <linearGradient id="rescueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            stroke="#374151"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#374151"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="rescues"
            stroke="#2ECC71"
            strokeWidth={2}
            fill="url(#rescueGrad)"
            dot={{ fill: '#2ECC71', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#2ECC71' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
