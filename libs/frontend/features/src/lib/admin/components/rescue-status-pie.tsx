'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PIE_COLORS } from '../constants';
import type { AdminStats, PieChartData } from '../types';

interface RescueStatusPieProps {
  stats: AdminStats;
}

export function RescueStatusPie({ stats }: RescueStatusPieProps) {
  const pieData: PieChartData[] = [
    { name: 'Completed/Closed', value: stats.completedRescues },
    { name: 'Pending', value: stats.pendingRescues },
    { name: 'Active/Assigned', value: stats.activeRescues },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <h3 className="text-white font-bold mb-1">Rescue Status</h3>
      <p className="text-gray-500 text-xs mb-4">Overall breakdown</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: any, n: any) => [v, n]}
            contentStyle={{
              background: '#0a1215',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
            labelStyle={{ color: '#9CA3AF' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {pieData.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: PIE_COLORS[i] }}
              />
              <span className="text-gray-400">{item.name}</span>
            </div>
            <span className="text-white font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
