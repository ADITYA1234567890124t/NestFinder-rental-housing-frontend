import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-auto">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-semibold text-white">NestFinder</span>
            </div>
            <p className="text-sm">Find your perfect rental home across India.</p>
          </div>
          {[
            { title: 'Tenants', links: ['Browse Properties', 'Search', 'How it Works'] },
            { title: 'Owners',  links: ['List Property', 'Dashboard', 'Pricing'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-medium mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">{col.links.map(l => <li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-800 pt-6 text-sm text-center">
          © {new Date().getFullYear()} NestFinder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
