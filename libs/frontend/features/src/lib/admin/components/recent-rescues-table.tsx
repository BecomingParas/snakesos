'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import type { RescueRecord } from '../types';

interface RecentRescuesTableProps {
  rescues: RescueRecord[];
}

export function RecentRescuesTable({ rescues }: RecentRescuesTableProps) {
  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-bold">Recent Rescue Requests</h3>
        </div>
        <Link
          href="/admin/rescues"
          className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Caller', 'Phone', 'Municipality', 'Status', 'Time'].map((h) => (
                <th
                  key={h}
                  className="text-left text-gray-500 font-medium px-5 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rescues.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  No rescue requests yet
                </td>
              </tr>
            ) : (
              rescues.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-3 text-white font-medium whitespace-nowrap">
                    {r.name}
                  </td>
                  <td className="px-5 py-3 text-gray-400 font-mono whitespace-nowrap">
                    {r.phone}
                  </td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                    {r.municipality}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        STATUS_COLORS[r.status] || STATUS_COLORS.CLOSED
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
