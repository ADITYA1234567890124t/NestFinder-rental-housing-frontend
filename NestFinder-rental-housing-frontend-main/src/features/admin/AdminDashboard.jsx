import { useEffect, useState } from 'react'
import api from '@/api/axiosConfig'

import StatsCard from '@/components/dashboard/StatsCard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import Loader from '@/components/common/Loader'

import {
  Users,
  Building2,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react'

import { formatCurrency } from '@/utils/formatCurrency'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((response) => {
        setStats(response.data?.data ?? response.data ?? {})
        setError('')
      })
      .catch((error) => {
        console.error('Dashboard API Error:', error)
        setStats({})
        setError('Unable to load the latest dashboard data.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <Loader />

  // Mock monthly revenue data
  const chartData = [
    { month: 'Jan', amount: 42000 },
    { month: 'Feb', amount: 58000 },
    { month: 'Mar', amount: 51000 },
    { month: 'Apr', amount: 74000 },
    { month: 'May', amount: 68000 },
    { month: 'Jun', amount: 89000 },
  ]

  const recentProperties = Array.isArray(stats?.recentProperties)
    ? stats.recentProperties
    : []

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Total Properties',
      value: stats?.totalProperties ?? 0,
      icon: Building2,
      color: 'info',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      icon: Calendar,
      color: 'warning',
    },
    {
      title: 'Open Complaints',
      value: stats?.openComplaints ?? 0,
      icon: AlertCircle,
      color: 'danger',
    },
    {
      title: 'Pending Bookings',
      value: stats?.pendingBookings ?? 0,
      icon: Clock,
      color: 'warning',
    },
    {
      title: 'Confirmed Bookings',
      value: stats?.confirmedBookings ?? 0,
      icon: CheckCircle2,
      color: 'success',
    },
    {
      title: 'Total Tenants',
      value: stats?.totalTenants ?? 0,
      icon: Users,
      color: 'info',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: 'success',
      subtitle: 'All time',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-stone-900">
          Admin Dashboard
        </h1>

        <p className="text-stone-500 text-sm mt-0.5">
          Platform overview and analytics
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts + Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart
            data={chartData}
            title="Monthly Revenue"
          />
        </div>

        {/* Platform Health */}
        <div className="card p-5">
          <h3 className="font-semibold text-stone-900 mb-4">
            Platform Health
          </h3>

          <div className="space-y-4">
            {[
              {
                label: 'Available Properties',
                value: stats?.availableProperties ?? 0,
                color: 'bg-emerald-400',
              },
              {
                label: 'Active Owners',
                value: stats?.totalOwners ?? 0,
                color: 'bg-primary-400',
              },
              {
                label: 'Active Tenants',
                value: stats?.totalTenants ?? 0,
                color: 'bg-blue-400',
              },
              {
                label: 'Resolved Complaints',
                value: Math.max(
                  (stats?.totalComplaints ?? 0) -
                    (stats?.openComplaints ?? 0),
                  0
                ),
                color: 'bg-amber-400',
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-500">
                    {item.label}
                  </span>

                  <span className="font-medium text-stone-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{
                      width: `${Math.min(item.value, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      {recentProperties.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-stone-900 mb-4">
            Recent Property Listings
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left">
                  {[
                    'Title',
                    'City',
                    'BHK',
                    'Rent',
                    'Status',
                  ].map((header) => (
                    <th
                      key={header}
                      className="pb-3 pr-4 font-medium text-stone-500 text-xs uppercase tracking-wide"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-50">
                {recentProperties.map((property) => (
                  <tr key={property.id ?? property.title}>
                    <td className="py-3 pr-4 font-medium text-stone-900 truncate max-w-[180px]">
                      {property.title}
                    </td>

                    <td className="py-3 pr-4 text-stone-500">
                      {property.city}
                    </td>

                    <td className="py-3 pr-4 text-stone-500">
                      {property.bhk} BHK
                    </td>

                    <td className="py-3 pr-4 font-semibold text-primary-600">
                      {formatCurrency(property.monthlyRent)}
                    </td>

                    <td className="py-3">
                      <span
                        className={`badge ${
                          property.verified
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}
                      >
                        {property.verified
                          ? 'Verified'
                          : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
