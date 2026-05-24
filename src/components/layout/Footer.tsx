import { Link } from 'react-router-dom';
import { Leaf, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <Leaf size={20} className="text-green-400" aria-hidden="true" />
              <span>ZOE Platform</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Strategic Framework for Environmental Actions — Municipality of
              Northern Corfu.
            </p>
            <p className="text-xs text-amber-400 mt-3 border border-amber-600/40 rounded px-2 py-1 inline-block">
              Frontend Prototype — Dummy Data
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About ZOE' },
                { to: '/projects', label: 'Projects' },
                { to: '/sdg-dashboard', label: 'SDG Dashboard' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagement links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Engagement
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/participate', label: 'Participate' },
                { to: '/events', label: 'Events' },
                { to: '/transparency', label: 'Impact & Data' },
                { to: '/roadmap', label: 'Roadmap' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research context */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Research Context
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              This platform is a Design Science Research artifact developed as
              part of a university seminar in Information Systems.
            </p>
            <a
              href="https://github.com"
              className="inline-flex items-center gap-2 mt-3 text-sm text-gray-400 hover:text-white transition-colors"
              aria-label="View source on GitHub"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>
            © 2025 ZOE Environmental Programme — Municipality of Northern Corfu
          </p>
          <p>
            DSR Prototype · All data fictional · No personal data collected
          </p>
        </div>
      </div>
    </footer>
  );
}
