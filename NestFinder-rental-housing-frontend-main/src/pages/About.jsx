import { Home, Users, Building2, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="py-16">
      <div className="page-container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">About NestFinder</h1>
          <p className="text-stone-500 text-lg">India's most trusted rental housing platform connecting tenants and property owners.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Home,      title: '10,000+ Properties',  desc: 'Verified listings across 100+ Indian cities' },
            { icon: Users,     title: '50,000+ Happy Tenants', desc: 'Trust and satisfaction guaranteed' },
            { icon: Building2, title: '5,000+ Owners',       desc: 'Reliable property owners on our platform' },
            { icon: Shield,    title: '100% Verified',       desc: 'Every listing verified by our team' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 flex gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary-500" />
              </div>
              <div><h3 className="font-semibold text-stone-900">{title}</h3><p className="text-stone-500 text-sm mt-1">{desc}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/register" className="btn btn-primary btn-lg">Join NestFinder Today</Link>
        </div>
      </div>
    </div>
  )
}
