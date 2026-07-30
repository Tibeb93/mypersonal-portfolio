import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaReact, FaGithub, FaTelegram, FaLinkedin } from 'react-icons/fa'
import { HiArrowDown, HiDownload, HiEye } from 'react-icons/hi'
import Button from '../components/Button'
import { staggerContainer, staggerItem } from '../utils/animations'
import useProfile from '../hooks/useProfile'
import useTheme from '../hooks/useTheme'
import profileImageFallback from '../assets/profileImage.jpg'

const ICON_MAP = { FaGithub, FaTelegram, FaLinkedin }

const FALLBACK_SOCIALS = [
  { Icon: FaGithub,   href: 'https://github.com/Tibeb93',  label: 'GitHub'   },
  { Icon: FaTelegram, href: 'https://t.me/tibeb93',         label: 'Telegram' },
  { Icon: FaLinkedin, href: 'https://linkedin.com',         label: 'LinkedIn' },
]

// ── CV Preview Tooltip ────────────────────────────────────────────────────────
function CVPreviewTooltip({ resumeUrl, children }) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-56"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Pointer arrow */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3
              bg-[#1A2238] border-r border-b border-violet-500/20 rotate-45" />
            {/* Tooltip card — always dark regardless of theme */}
            <div className="bg-[#1A2238] border border-violet-500/20 rounded-2xl overflow-hidden
              shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="h-32 bg-gradient-to-br from-violet-900/50 via-[#0F1525] to-pink-900/30
                flex flex-col items-center justify-center gap-2 border-b border-white/[0.06]">
                <div className="w-10 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                  <span className="text-xs font-bold text-white/60">PDF</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Curriculum Vitae</span>
              </div>
              <div className="p-3 flex gap-2">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                    text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10
                    border border-white/10 transition-all duration-200">
                  <HiEye size={13} /> Preview
                </a>
                <a href={resumeUrl} download onClick={e => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                    text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600
                    hover:opacity-90 transition-all duration-200">
                  <HiDownload size={13} /> Download
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { profile } = useProfile()
  const { theme }   = useTheme()
  const isLight     = theme === 'light'
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const name      = profile?.name             || 'Gebremeskel Kiflemeskel'
  const title     = profile?.title            || 'Full Stack Web Developer'
  const shortBio  = profile?.shortBio         || 'CS student & Full Stack Developer from Ethiopia, building modern web experiences that scale.'
  const available = profile?.available        ?? true
  const availNote = profile?.availabilityNote || 'Available for opportunities'
  const photoSrc  = profile?.profileImage     || profileImageFallback
  const resumeUrl = profile?.resumeUrl        || '/Gebremeskel_Kiflemeskel_CV.pdf'

  const socials = profile?.socials?.length
    ? profile.socials.map(s => ({ Icon: ICON_MAP[s.icon] || FaGithub, href: s.url, label: s.platform }))
    : FALLBACK_SOCIALS

  const [firstName, ...rest] = name.split(' ')
  const lastName = rest.join(' ')

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(rgba(139,92,246,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.6) 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_70%)]" />

      <motion.div
        className="container-custom relative z-10 py-16 flex flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >

        {/* ── Availability badge ── */}
        {available && (
          <motion.div variants={staggerItem} className="mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold
              tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-500
              shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {availNote}
            </span>
          </motion.div>
        )}

        {/* ── Profile image + React badge ── */}
        <motion.div variants={staggerItem} className="mb-8">
          <div className="relative inline-block">
            {/* Glow ring */}
            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500
              blur-sm opacity-80 animate-pulse" />
            {/* Spinning orbit */}
            <div className="absolute -inset-[14px] rounded-full border border-dashed border-violet-500/30"
              style={{ animation: 'spin-slow 20s linear infinite' }} />
            {/* Photo */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden
              border-2 border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.35)]">
              <img src={photoSrc} alt={name} width={208} height={208}
                loading="eager" decoding="async" fetchpriority="high"
                className="w-full h-full object-cover object-top" />
            </div>
            {/* React icon badge — bottom-right of photo */}
            <motion.div
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl
                bg-gradient-to-br from-violet-600 to-pink-600
                flex items-center justify-center
                shadow-[0_0_16px_rgba(139,92,246,0.6)] border border-white/10"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              title="Built with React"
            >
              <FaReact size={18} color="#fff" />
            </motion.div>
          </div>
        </motion.div>

        {/* ── Name — NO "Hello World" ── */}
        <motion.h1
          variants={staggerItem}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
        >
          {/* gradient-text always visible in both themes */}
          <span className="gradient-text" style={{ textShadow: '0 0 40px rgba(139,92,246,0.25)' }}>
            {firstName}
          </span>
          {' '}
          {/* Last name adapts to theme */}
          <span className={isLight ? 'text-slate-800' : 'text-white'}>
            {lastName}
          </span>
        </motion.h1>

        {/* ── Title pill — theme-aware ── */}
        <motion.div variants={staggerItem} className="mb-5">
          <span className={`inline-block px-5 py-2 rounded-full border font-semibold text-base sm:text-lg tracking-wide
            ${isLight
              ? 'bg-violet-50 border-violet-200 text-violet-700'
              : 'glass border-violet-500/20 text-violet-300'
            }`}>
            {title}
          </span>
        </motion.div>

        {/* ── Short bio — theme-aware ── */}
        <motion.p
          variants={staggerItem}
          className={`text-sm sm:text-base lg:text-lg max-w-xl lg:max-w-2xl
            mx-auto leading-relaxed mb-10 px-2
            ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
        >
          {shortBio}
        </motion.p>

        {/* ── CTA buttons ── */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 w-full px-4 sm:px-0"
        >
          <Button variant="primary" size="lg" className="w-full xs:w-auto" onClick={() => go('contact')}>
            Connect With Me
          </Button>

          <Button variant="secondary" size="lg" className="w-full xs:w-auto" onClick={() => go('projects')}>
            View Projects
          </Button>

          {/* Download CV with preview tooltip */}
          <CVPreviewTooltip resumeUrl={resumeUrl}>
            <a
              href={resumeUrl}
              download
              className={`inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl
                transition-all duration-300 w-full xs:w-auto justify-center cursor-pointer
                ${isLight
                  ? 'bg-transparent text-slate-700 border border-slate-300 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50'
                  : 'bg-transparent text-slate-300 border border-white/15 hover:border-violet-500/40 hover:text-white hover:bg-violet-500/5'
                }`}
            >
              <HiDownload size={18} />
              Download CV
            </a>
          </CVPreviewTooltip>
        </motion.div>

        {/* ── Social links — theme-aware ── */}
        <motion.div
          variants={staggerItem}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-14"
        >
          {socials.map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center
                transition-all duration-300
                ${isLight
                  ? 'bg-white border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300 shadow-sm'
                  : 'glass border border-white/8 text-slate-400 hover:text-white hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                }`}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={17} />
            </motion.a>
          ))}
        </motion.div>

        {/* ── Scroll cue ── */}
        <motion.button
          variants={staggerItem}
          onClick={() => go('about')}
          className={`flex flex-col items-center gap-2 transition-colors
            ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
          aria-label="Scroll to about"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <HiArrowDown size={18} />
          </motion.div>
        </motion.button>

      </motion.div>
    </section>
  )
}
