import { HiMenuAlt2, HiBell, HiExternalLink } from 'react-icons/hi'
import { useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore.js'

const TITLES = {
  '/dashboard':    'Dashboard',
  '/profile':      'Profile Manager',
  '/skills':       'Skills Manager',
  '/projects':     'Projects Manager',
  '/experience':   'Experience Manager',
  '/education':    'Education Manager',
  '/certificates': 'Certificates Manager',
  '/blog':         'Blog CMS',
  '/media':        'Media Library',
  '/contact':      'Contact Inbox',
  '/analytics':    'Analytics',
  '/settings':     'Website Settings',
  '/audit-log':    'Audit Log',
  '/account':      'Account Settings',
}

// Portfolio URL — use env var if set, otherwise the live deployed URL
const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL || 'https://mypersonal-portfolio-gm.vercel.app'

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user }     = useAuthStore()

  const base  = pathname.split('/')[1]
  const title = TITLES[`/${base}`] || TITLES[pathname] || 'Admin'

  return (
    <header className="h-16 bg-[#0F1525]/90 backdrop-blur-xl border-b border-white/[0.06]
      flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">

      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <HiMenuAlt2 size={20} />
        </button>

        <div>
          <h1 className="text-base font-bold text-white">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">

        {/* View Portfolio button — opens the public portfolio */}
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={`Opens ${PORTFOLIO_URL} — make sure the portfolio server is running`}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
            text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.06]
            hover:border-violet-500/30 transition-all duration-200"
        >
          <HiExternalLink size={14} /> View Portfolio
        </a>

        {/* Notifications (placeholder) */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400
            hover:text-white bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12]
            transition-all duration-200"
          aria-label="Notifications"
        >
          <HiBell size={16} />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </span>
        </div>
      </div>
    </header>
  )
}
