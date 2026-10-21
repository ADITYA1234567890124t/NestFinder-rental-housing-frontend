import { Link } from 'react-router-dom'
import {
  Building2,
  Calendar,
  MessageCircle,
  PlusCircle,
  Home,
  CreditCard,
} from 'lucide-react'

export default function OwnerDashboard() {
  const cards = [
    {
      title: 'My Properties',
      description: 'Manage all your listed properties',
      icon: Building2,
      path: '/owner/properties',
    },
    {
      title: 'Bookings',
      description: 'View tenant booking requests',
      icon: Calendar,
      path: '/owner/bookings',
    },
    {
      title: 'Messages',
      description: 'Chat with tenants',
      icon: MessageCircle,
      path: '/owner/messages',
    },
    {
      title: 'Payments',
      description: 'Track tenant rent payments and earnings',
      icon: CreditCard,
      path: '/owner/payments',
    },
    {
      title: 'Add Property',
      description: 'List a new rental property',
      icon: PlusCircle,
      path: '/owner/properties/add',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white">
            <Home className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              Owner Dashboard
            </h1>

            <p className="text-stone-500 mt-1">
              Manage your rental properties and bookings
            </p>
          </div>
        </div>
      </div>

      {/* Welcome card */}
      <div className="card p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
        <h2 className="text-lg font-semibold text-stone-900">
          Welcome Back 👋
        </h2>

        <p className="text-stone-500 mt-2">
          From here you can manage properties, bookings,
          earnings and tenant conversations.
        </p>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.title}
              to={card.path}
              className="group bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-stone-900 group-hover:text-primary-600 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-stone-500">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
