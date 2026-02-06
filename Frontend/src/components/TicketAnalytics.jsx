import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const COLORS = ['#6366F1', '#F97316', '#22C55E', '#EAB308', '#EC4899', '#0EA5E9'];

const TicketAnalytics = ({ analytics, role }) => {
  if (!analytics) {
    return null;
  }

  const { totalTickets, bySource = [], byStatus = [], byPriority = [] } = analytics;

  const hasAnyData =
    totalTickets > 0 || bySource.length > 0 || byStatus.length > 0 || byPriority.length > 0;

  if (!hasAnyData) {
    return (
      <div className="bg-dark-secondary rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Ticket Analytics</h2>
        <p className="text-gray-400 text-sm">
          No ticket data available yet to display analytics.
        </p>
      </div>
    );
  }

  const title =
    role === 'admin'
      ? 'Ticket Analytics (All Tickets)'
      : 'Your Ticket Analytics';

  return (
    <div className="bg-dark-secondary rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-gray-400 text-xs mt-1">
            Visual overview of tickets by source, status, and priority.
          </p>
        </div>
        <div className="bg-dark-bg px-4 py-2 rounded-lg">
          <p className="text-gray-400 text-xs">Total Tickets</p>
          <p className="text-xl font-semibold text-white">{totalTickets}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets by Source (Bar chart) */}
        <div className="bg-dark-bg rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Tickets by Source</h3>
          {bySource.length === 0 ? (
            <p className="text-gray-500 text-xs">No source data yet.</p>
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySource}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="source" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Tickets" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tickets by Status (Pie chart) */}
        <div className="bg-dark-bg rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Tickets by Status</h3>
          {byStatus.length === 0 ? (
            <p className="text-gray-500 text-xs">No status data yet.</p>
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={3}
                  >
                    {byStatus.map((entry, index) => (
                      <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tickets by Priority (Pie chart) */}
        <div className="bg-dark-bg rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Tickets by Priority</h3>
          {byPriority.length === 0 ? (
            <p className="text-gray-500 text-xs">No priority data yet.</p>
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byPriority}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={3}
                  >
                    {byPriority.map((entry, index) => (
                      <Cell key={entry.priority} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketAnalytics;


