import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import Button from '../components/Button'
import ThemeToggle from '../components/ThemeToggle'
import useScrollSpy from '../hooks/useScrollSpy'

const LINKS = [
  { label: 'Home',     id: 'home'     },
  { label: 'About',    id: 'about'    },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills',   id: 'techstack'},
  { label: 'Blog',     id: 'blog'     },
  { label: 'Contact',  id: 'contact'  },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar({ theme, toggleTheme }) {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(LINKS.map(l => l.id))
  const isLight = theme === 'light'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
          ${scrolled
            ? isLight
              ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)] border-b border-black/5'
              : 'glass-dark shadow-[0_1px_0_rgba(255,255,255,0.05)]'
            : 'bg-transparent'
          }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="container-custom flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <motion.button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.03 }}
            aria-label="Go to top"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500
              flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <span className="text-white font-black text-sm">GK</span>
            </div>
            <span className={`hidden sm:block font-bold text-lg transition-colors duration-300
              ${isLight ? 'text-slate-800' : 'text-white'}`}>
              Gebre<span className="gradient-text">meskel</span>
            </span>
          </motion.button>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-1">
            {LINKS.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${active === id
                      ? isLight ? 'text-slate-900' : 'text-white'
                      : isLight
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  aria-current={active === id ? 'page' : undefined}
                >
                  {active === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-lg border
                        ${isLight
                          ? 'bg-violet-50 border-violet-200'
                          : 'bg-white/8 border-violet-500/20'
                        }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* ── Right side: theme toggle + CTA + hamburger ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme toggle — always visible */}
            <ThemeToggle theme={theme} toggle={toggleTheme} />

            {/* Connect CTA — desktop only */}
            <Button
              variant="primary"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => scrollTo('contact')}
            >
              Connect With Me
            </Button>

            {/* Hamburger — mobile only */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors
                ${isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                  : 'text-slate-300 hover:text-white hover:bg-white/8'
                }`}
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 backdrop-blur-sm
                ${isLight ? 'bg-slate-200/70' : 'bg-[#0B0F19]/80'}`}
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className={`absolute top-0 right-0 h-full w-72 flex flex-col pt-24 pb-8 px-6
                border-l transition-colors duration-300
                ${isLight
                  ? 'bg-white/95 border-black/8 shadow-xl'
                  : 'glass-dark border-white/8'
                }`}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ul className="flex flex-col gap-2">
                {LINKS.map(({ label, id }, i) => (
                  <motion.li key={id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <button
                      onClick={() => { scrollTo(id); setOpen(false) }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl
                        text-base font-medium transition-all duration-200
                        ${active === id
                          ? isLight
                            ? 'text-violet-700 bg-violet-50 border border-violet-200'
                            : 'text-white bg-violet-500/15 border border-violet-500/20'
                          : isLight
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {active === id && (
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                          ${isLight ? 'bg-violet-500' : 'bg-violet-400'}`} />
                      )}
                      {label}
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Bottom: theme toggle row + CTA */}
              <div className="mt-auto space-y-3">
                {/* Theme toggle row in drawer */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl
                  ${isLight ? 'bg-slate-100 border border-slate-200' : 'glass border-white/8'}`}>
                  <span className={`text-sm font-medium
                    ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <ThemeToggle theme={theme} toggle={toggleTheme} />
                </div>

                <Button
                  variant="primary" size="md" className="w-full justify-center"
                  onClick={() => { scrollTo('contact'); setOpen(false) }}
                >
                  Connect With Me
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
