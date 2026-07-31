import { motion } from 'framer-motion'
import { FaGithub, FaTelegram, FaLinkedin } from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'
import useProfile from '../hooks/useProfile'
import useSettings from '../hooks/useSettings'

const ICON_MAP = { FaGithub, FaTelegram, FaLinkedin }

const NAV = [
  { label: 'Home',         id: 'home'         },
  { label: 'About',        id: 'about'        },
  { label: 'Services',     id: 'services'     },
  { label: 'Projects',     id: 'projects'     },
  { label: 'Tech Stack',   id: 'techstack'    },
  { label: 'Timeline',     id: 'timeline'     },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Blog',         id: 'blog'         },
  { label: 'Contact',      id: 'contact'      },
]

const FALLBACK_SOCIALS = [
  { Icon: FaGithub,   href: 'https://github.com/Tibeb93', label: 'GitHub'   },
  { Icon: FaTelegram, href: 'https://t.me/tibeb93',        label: 'Telegram' },
  { Icon: FaLinkedin, href: 'https://linkedin.com',        label: 'LinkedIn' },
]

export default function Footer() {
  const { profile }  = useProfile()
  const { settings } = useSettings()

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const name      = profile?.name  || 'Gebremeskel Kiflemeskel'
  const firstName = name.split(' ')[0]
  const email     = profile?.email || settings?.contactEmail || 'gkiflemeskel@gmail.com'
  const location  = profile?.location || 'Ethiopia 🇪🇹'
  const available = profile?.available ?? true
  const footerTxt = settings?.footerText || 'Full Stack Web Developer crafting modern, performant digital experiences from Ethiopia.'
  const copyright = settings?.copyright  || `© ${new Date().getFullYear()} ${name}`

  const socials = profile?.socials?.length
    ? profile.socials.map((s) => ({ Icon: ICON_MAP[s.icon] || FaGithub, href: s.url, label: s.platform }))
    : FALLBACK_SOCIALS

  // Filter NAV — only show sections that exist in DOM
  const visibleNav = NAV.filter((n) => ['home','about','services','projects','contact'].includes(n.id))
  const extraNav   = NAV.filter((n) => !visibleNav.includes(n) && ['techstack','timeline','certificates','blog'].includes(n.id))

  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-6">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500
                flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <span className="text-white font-black text-sm">GK</span>
              </div>
              <span className="font-bold text-white text-lg">
                {firstName}<span className="gradient-text">meskel</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">{footerTxt}</p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-500
                    hover:text-white hover:border-violet-500/30 border border-white/8 transition-all duration-200"
                  whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation — two columns */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Navigation</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[...visibleNav, ...extraNav].map(({ label, id }) => (
                  <li key={id} className="list-none">
                    <button onClick={() => go(id)}
                      className="text-slate-500 hover:text-white text-sm transition-colors duration-200
                        flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300" />
                      {label}
                    </button>
                  </li>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Get In Touch</h3>
            <div className="space-y-2.5 text-sm">
              <p className="text-slate-500">
                <span className="text-slate-400">Email: </span>
                <a href={`mailto:${email}`} className="hover:text-violet-400 transition-colors">{email}</a>
              </p>
              <p className="text-slate-500">
                <span className="text-slate-400">Location: </span>{location}
              </p>
              <p className="text-slate-500">
                <span className="text-slate-400">Status: </span>
                {available ? (
                  <span className="text-emerald-400 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Available for work
                  </span>
                ) : (
                  <span className="text-slate-500">Not available</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.05]">
          <p className="text-slate-600 text-sm">
            {copyright}
          </p>
          <p className="text-slate-600 text-xs font-mono">React + Vite + Tailwind + Framer Motion</p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-500
              hover:text-white hover:border-violet-500/30 border border-white/8 transition-all duration-200"
            whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.95 }} aria-label="Back to top">
            <HiArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
