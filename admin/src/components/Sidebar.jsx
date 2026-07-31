import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiHome, HiUser, HiLightningBolt, HiViewGrid,
  HiBriefcase, HiAcademicCap, HiBadgeCheck,
  HiDocumentText, HiPhotograph, HiMail,
  HiCog, HiClipboardList, HiLogout, HiX,
  HiChartBar, HiInformationCircle,
} from 'react-icons/hi'
import useAuthStore from '../stores/authStore.js'
import { authAPI } from '../api/endpoints.js'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: HiHome,          to: '/dashboard'    },
  { label: 'Profile',      icon: HiUser,          to: '/profile'      },
  { label: 'About',        icon: HiInformationCircle, to: '/about'  },
  { label: 'Skills',       icon: HiLightningBolt, to: '/skills'       },
  { label: 'Projects',     icon: HiViewGrid,      to: '/projects'     },
  { label: 'Experience',   icon: HiBriefcase,     to: '/experience'   },
  { label: 'Education',    icon: HiAcademicCap,   to: '/education'    },
  { label: 'Certificates', icon: HiBadgeCheck,    to: '/certificates' },
  { label: 'Blog',         icon: HiDocumentText,  to: '/blog'         },
  { label: 'Media',        icon: HiPhotograph,    to: '/media'        },
  { label: 'Messages',     icon: HiMail,          to: '/contact'      },
  { label: 'Analytics',    icon: HiChartBar,      to: '/analytics'    },
  { label: 'Settings',     icon: HiCog,           to: '/settings'     },
  { label: 'Audit Log',    icon: HiClipboardList, to: '/audit-log'    },
]

export default function Sidebar({ open, onClose }) {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authAPI.logout() } catch (_) {}
    clearAuth()
    toast.success('Logged out')
    navigate('/login')
  }

  const content = (
    <div className="flex flex-col h-full bg-[#0F1525] border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500 flex items-center justify-center">
            <span className="text-white font-black text-xs">GK</span>
          </div>
          <span className="font-bold text-white text-sm">Admin<span className="gradient-text"> CMS</span></span>
        </div>
        {/* Close button — mobile only */}
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
          <HiX size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-violet-500/15 text-white border border-violet-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-violet-400' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role || 'admin'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <HiLogout size={17} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed top-0 left-0 h-screen z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed top-0 left-0 h-screen w-64 z-50 lg:hidden"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
