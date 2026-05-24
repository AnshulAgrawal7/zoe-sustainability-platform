import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/about', label: 'About ZOE' },
  { to: '/projects', label: 'Projects' },
  { to: '/sdg-dashboard', label: 'SDGs' },
  { to: '/audiences', label: 'Who We Reach' },
  { to: '/participate', label: 'Participate' },
  { to: '/events', label: 'Events' },
  { to: '/transparency', label: 'Impact & Data' },
  { to: '/roadmap', label: 'Roadmap' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-green-700 text-lg hover:text-green-800 transition-colors"
          >
            <Leaf size={22} className="text-green-600" aria-hidden="true" />
            <span>ZOE Platform</span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA button */}
          <div className="hidden lg:block">
            <Link
              to="/participate"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Get Involved
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-gray-200 bg-white"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/participate"
              onClick={() => setMenuOpen(false)}
              className="block bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center mt-2"
            >
              Get Involved
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
