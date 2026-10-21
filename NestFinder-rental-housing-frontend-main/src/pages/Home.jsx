import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProperties } from '@/redux/slices/propertySlice'
import PropertyGrid   from '@/components/property/PropertyGrid'

import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon, Shield, MessageCircle, Star, ArrowRight, MapPin } from 'lucide-react'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, loading } = useSelector(s => s.property)

  useEffect(() => { dispatch(fetchProperties({ page: 0, size: 6 })) }, [dispatch])

  const handleSearch = (q) => navigate(`/search?q=${q}`)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="page-container relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-6">
            <Star className="w-4 h-4 text-primary-400" /> Trusted by 10,000+ renters
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
            Find Your Perfect<br />
            <span className="text-primary-400">Rental Home</span>
          </h1>
          <p className="text-stone-300 text-lg max-w-xl mx-auto mb-10">
            Discover verified properties across India. Connect with owners directly, book visits, and pay rent — all in one place.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-stone-400">
            {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map(c => (
              <button key={c} onClick={() => handleSearch(c)} className="flex items-center gap-1 hover:text-white transition-colors">
                <MapPin className="w-3.5 h-3.5" />{c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-stone-100 py-10">
        <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ n:'10,000+', l:'Active Listings' },{ n:'50,000+', l:'Happy Tenants' },{ n:'5,000+', l:'Verified Owners' },{ n:'100+', l:'Cities Covered' }].map(s => (
            <div key={s.l}>
              <p className="text-3xl font-display font-bold text-primary-500">{s.n}</p>
              <p className="text-stone-500 text-sm mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary-500 text-sm font-medium mb-1">Latest Listings</p>
              <h2 className="section-title">Featured Properties</h2>
            </div>
            <Link to="/properties" className="btn btn-outline btn-sm gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <PropertyGrid properties={list} loading={loading} cols={3} />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-stone-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">How NestFinder Works</h2>
            <p className="text-stone-500 mt-3">Find your home in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: HomeIcon,       title: 'Browse & Search', desc: 'Explore thousands of verified properties filtered by city, BHK, budget and more.', step: '01' },
              { icon: MessageCircle, title: 'Connect & Visit',  desc: 'Chat directly with owners and schedule property visits at your convenience.',    step: '02' },
              { icon: Shield,        title: 'Book & Move In',   desc: 'Book your preferred home, pay rent securely, and move in with confidence.',       step: '03' },
            ].map(({ icon: Icon, title, desc, step }) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <span className="text-5xl font-display font-bold text-stone-100 absolute">{step}</span>
                <h3 className="font-semibold text-stone-900 text-lg mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-500">
        <div className="page-container text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-primary-100 mb-8 max-w-md mx-auto">Join thousands of property owners who earn steady income through NestFinder.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg">Get Started Free</Link>
            <Link to="/about"    className="btn border-2 border-white/40 text-white hover:bg-white/10 btn-lg">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
