import { useState } from 'react'
import { NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Policy', path: '/policy' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  function linkStyle({ isActive }) {
    return `rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
        ? 'bg-emerald-50 text-emerald-800'
        : 'text-slate-600 hover:bg-slate-100'
      }`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex h-20 items-center justify-between gap-4">
          <NavLink
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
            aria-label="Amanah home"
          >
            <img
              src="/logo1.png"
              alt=""
              className="h-13 w-13 rounded-full object-contain"
            />

            <span className="text-3xl font-bold text-emerald-900">
              Amanah
            </span>
          </NavLink>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={linkStyle}
              >
                {link.name}
              </NavLink>
            ))}

            <NavLink
              to="/become-a-member"
              className="btn ml-3 border-emerald-800 bg-emerald-800 text-white hover:bg-emerald-900"
            >
              Become a Member
            </NavLink>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-square lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div
            id="mobile-menu"
            className="flex flex-col gap-1 border-t border-slate-100 py-4 lg:hidden"
          >
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={closeMenu}
                className={linkStyle}
              >
                {link.name}
              </NavLink>
            ))}

            <Link to="/become-a-member">
              Become a Member
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}