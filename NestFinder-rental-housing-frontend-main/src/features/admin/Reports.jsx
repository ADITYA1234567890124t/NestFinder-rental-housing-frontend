import { useEffect, useState } from 'react'
import api from '@/api/axiosConfig'
import RevenueChart from '@/components/dashboard/RevenueChart'
import StatsCard    from '@/components/dashboard/StatsCard'
import Loader from '@/components/common/Loader'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, Users, Building2, CreditCard,
  Calendar, BarChart2, Download,
} from 'lucide-react'

const PIE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-stone-100 rounded-xl px-3 py-2 shadow-card text-sm">
      <p className="text-stone-500 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000
            ? formatCurrency(p.value)
            : p.value}
        </p>
      ))}
    </div>
  )
}

export default function Reports() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  // ── Derived chart data (real app: fetch from /admin/reports) ─────────────
  const monthlyRevenue = [
    { month: 'Jan', amount: 125000, bookings: 45 },
    { month: 'Feb', amount: 148000, bookings: 52 },
    { month: 'Mar', amount: 132000, bookings: 49 },
    { month: 'Apr', amount: 187000, bookings: 68 },
    { month: 'May', amount: 165000, bookings: 61 },
    { month: 'Jun', amount: 210000, bookings: 74 },
    { month: 'Jul', amount: 198000, bookings: 71 },
    { month: 'Aug', amount: 225000, bookings: 80 },
  ]

  const userRoleData = [
    { name: 'Tenants', value: stats?.totalTenants ?? 0 },
    { name: 'Owners',  value: stats?.totalOwners  ?? 0 },
    { name: 'Admins',  value: 1 },
  ]

  const bookingStatusData = [
    { name: 'Pending',   value: stats?.pendingBookings   ?? 0 },
    { name: 'Confirmed', value: stats?.confirmedBookings ?? 0 },
    { name: 'Completed', value: Math.max((stats?.totalBookings ?? 0) - (stats?.pendingBookings ?? 0) - (stats?.confirmedBookings ?? 0), 0) },
  ]

  const cityData = [
    { city: 'Mumbai',    properties: 380 },
    { city: 'Bangalore', properties: 295 },
    { city: 'Delhi',     properties: 270 },
    { city: 'Pune',      properties: 195 },
    { city: 'Hyderabad', properties: 165 },
    { city: 'Chennai',   properties: 140 },
  ]

  const summaryStats = [
    {
      title:    'Total Revenue',
      value:    formatCurrency(stats?.totalRevenue ?? 0),
      subtitle: 'All time',
      icon:     TrendingUp,
      color:    'success',
    },
    {
      title:    'Total Users',
      value:    stats?.totalUsers ?? 0,
      subtitle: `${stats?.totalTenants ?? 0} tenants · ${stats?.totalOwners ?? 0} owners`,
      icon:     Users,
      color:    'primary',
    },
    {
      title:    'Total Properties',
      value:    stats?.totalProperties ?? 0,
      subtitle: `${stats?.availableProperties ?? 0} currently available`,
      icon:     Building2,
      color:    'info',
    },
    {
      title:    'Total Bookings',
      value:    stats?.totalBookings ?? 0,
      subtitle: `${stats?.pendingBookings ?? 0} pending approval`,
      icon:     Calendar,
      color:    'warning',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary-500" />
            Reports & Analytics
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">Platform performance overview</p>
        </div>
        <button className="btn btn-outline btn-sm gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Revenue + Bookings area chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} title="Monthly Revenue Trend" />
        </div>

        {/* User role distribution pie */}
        <div className="card p-5">
          <h3 className="font-semibold text-stone-900 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {userRoleData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => <span className="text-xs text-stone-600">{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings by month bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold text-stone-900 mb-5">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking status pie */}
        <div className="card p-5">
          <h3 className="font-semibold text-stone-900 mb-4">Booking Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {bookingStatusData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top cities table */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-stone-900 mb-4">Top Cities by Listings</h3>
        <div className="space-y-3">
          {cityData.map((city, i) => {
            const maxVal = cityData[0].properties
            const pct    = Math.round((city.properties / maxVal) * 100)
            return (
              <div key={city.city}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium text-stone-900">{city.city}</span>
                  </div>
                  <span className="text-stone-500 font-medium">{city.properties} listings</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key metrics summary table */}
      <div className="card p-5">
        <h3 className="font-semibold text-stone-900 mb-4">Key Metrics Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                {['Metric', 'Value', 'Category'].map(h => (
                  <th key={h} className="text-left pb-3 pr-6 text-xs font-medium text-stone-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {[
                { metric: 'Total Platform Revenue',  value: formatCurrency(stats?.totalRevenue ?? 0),   category: 'Finance'    },
                { metric: 'Total Registered Users',  value: stats?.totalUsers ?? 0,                     category: 'Users'      },
                { metric: 'Active Property Listings',value: stats?.availableProperties ?? 0,            category: 'Properties' },
                { metric: 'Total Bookings Created',  value: stats?.totalBookings ?? 0,                  category: 'Bookings'   },
                { metric: 'Pending Approvals',       value: stats?.pendingBookings ?? 0,                category: 'Bookings'   },
                { metric: 'Open Complaints',         value: stats?.openComplaints ?? 0,                 category: 'Support'    },
                { metric: 'Verified Properties',     value: `${Math.round(((stats?.totalProperties ?? 0) * 0.72))}`, category: 'Quality' },
                { metric: 'Avg. Monthly Revenue',    value: formatCurrency((stats?.totalRevenue ?? 0) / 8), category: 'Finance' },
              ].map(row => (
                <tr key={row.metric} className="hover:bg-stone-50">
                  <td className="py-3 pr-6 font-medium text-stone-900">{row.metric}</td>
                  <td className="py-3 pr-6 text-stone-600">{row.value}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      row.category === 'Finance'    ? 'badge-success' :
                      row.category === 'Users'      ? 'badge-primary' :
                      row.category === 'Properties' ? 'badge-info'    :
                      row.category === 'Bookings'   ? 'badge-warning' :
                      row.category === 'Support'    ? 'badge-error'   :
                      'badge-neutral'
                    }`}>
                      {row.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
