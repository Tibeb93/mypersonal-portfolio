import { motion } from 'framer-motion'
import { FaReact, FaNodeJs, FaGithub, FaTelegram, FaLinkedin } from 'react-icons/fa'
import { SiMongodb, SiJavascript, SiTailwindcss, SiPython } from 'react-icons/si'
import { HiArrowDown, HiDownload } from 'react-icons/hi'
import Button from '../components/Button'
import { staggerContainer, staggerItem } from '../utils/animations'
import useProfile from '../hooks/useProfile'
import profileImageFallback from '../assets/profileImage.jpg'

const FLOATERS = [
  { Icon: FaReact,       color: '#61DAFB', label: 'React',    cls: 'top-[18%] left-[6%]',    delay: 0,   dur: 5   },
  { Icon: FaNodeJs,      color: '#68A063', label: 'Node.js',  cls: 'top-[22%] right-[7%]',   delay: 1,   dur: 6   },
  { Icon: SiMongodb,     color: '#47A248', label: 'MongoDB',  cls: 'bottom-[28%] left-[5%]', delay: 2,   dur: 7   },
  { Icon: SiJavascript,  color: '#F7DF1E', label: 'JS',       cls: 'bottom-[20%] right-[6%]',delay: 0.5, dur: 5.5 },
  { Icon: SiTailwindcss, color: '#38BDF8', label: 'Tailwind', cls: 'top-[52%] left-[10%]',   delay: 1.5, dur: 6.5 },
  { Icon: SiPython,      color: '#3776AB', label: 'Python',   cls: 'top-[48%] right-[5%]',   delay: 2.5, dur: 7.5 },
]

const ICON_MAP = { FaGithub, FaTelegram, FaLinkedin }

const FALLBACK_SOCIALS = [
  { Icon: FaGithub,   href: 'https://github.com/Tibeb93',  label: 'GitHub'   },
  { Icon: FaTelegram, href: 'https://t.me/tibeb93',         label: 'Telegram' },
  { Icon: FaLinkedin, href: 'https://linkedin.com',         label: 'LinkedIn' },
]

export default function Hero() {
  const { profile } = useProfile()
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const name       = profile?.name       || 'Gebremeskel Kiflemeskel'
  const title      = profile?.title      || 'Full Stack Web Developer'
  const shortBio   = profile?.shortBio   || "Computer Science student and Full Stack Developer from Ethiopia building modern web experiences."
  const available  = profile?.available  ?? true
  const availNote  = profile?.availabilityNote || 'Available for opportunities'
  const photoSrc   = profile?.profileImage    || profileImageFallback
  const resumeUrl  = profile?.resumeUrl       || '/Gebremeskel_Kiflemeskel_CV.pdf'

  // Map API socials → icon components, fall back to static list
  const socials = profile?.socials?.length
    ? profile.socials.map((s) => ({
        Icon:  ICON_MAP[s.icon] || FaGithub,
        href:  s.url,
        label: s.platform,
      }))
    : FALLBACK_SOCIALS

  // Split name for styled display
  const [firstName, ...rest] = name.split(' ')
  const lastName = rest.join(' ')

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_70%)]" />

      {/* Floating tech icons — desktop only */}
      {FLOATERS.map(({ Icon, color, label, cls, delay, dur }) => (
        <motion.div
          key={label}
          className={`absolute hidden lg:flex items-center justify-center w-14 h-14 glass rounded-2xl ${cls}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.8, type: 'spring' }}
          style={{ animation: `float ${dur}s ease-in-out ${delay}s infinite` }}
          aria-label={label}
        >
          <Icon size={28} color={color} />
        </motion.div>
      ))}

      <motion.div
        className="container-custom relative z-10 py-16 flex flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Availability badge */}
        {available && (
          <motion.div variants={staggerItem} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
              tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {availNote}
            </span>
          </motion.div>
        )}

        {/* Profile image */}
        <motion.div variants={staggerItem} className="mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500
              blur-sm opacity-80 animate-pulse" />
            <div
              className="absolute -inset-[14px] rounded-full border border-dashed border-violet-500/30"
              style={{ animation: 'spin-slow 20s linear infinite' }}
            />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden
              border-2 border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.35)]">
              <img
                src={photoSrc}
                alt={name}
                width={208}
                height={208}
                loading="eager"
                decoding="async"
                fetchpriority="high"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl
                bg-gradient-to-br from-violet-600 to-pink-600
                flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.6)]
                border border-white/10"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaReact size={18} color="#fff" />
            </motion.div>
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={staggerItem}
          className="text-slate-400 text-sm sm:text-base font-mono mb-2 tracking-wide"
        >
          <span className="text-violet-400">{'>'}</span> Hello, World! I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={staggerItem}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4"
        >
          <span className="gradient-text" style={{ textShadow: '0 0 40px rgba(139,92,246,0.35)' }}>
            {firstName}
          </span>
          <br />
          <span className="text-white">{lastName}</span>
        </motion.h1>

        {/* Title pill */}
        <motion.div variants={staggerItem} className="mb-6">
          <span className="inline-block px-5 py-2 rounded-full glass border border-violet-500/20
            text-violet-300 font-semibold text-base sm:text-lg tracking-wide">
            {title}
          </span>
        </motion.div>

        {/* Short bio */}
        <motion.p
          variants={staggerItem}
          className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-xl lg:max-w-2xl
            mx-auto leading-relaxed mb-10 px-2"
        >
          {shortBio}
        </motion.p>

        {/* CTA buttons */}
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
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl
              bg-transparent text-slate-300 border border-white/15 hover:border-violet-500/40
              hover:text-white hover:bg-violet-500/5 transition-all duration-300 w-full xs:w-auto justify-center"
          >
            <HiDownload size={18} />
            Resume
          </a>
        </motion.div>

        {/* Social links */}
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
              className="w-10 h-10 sm:w-11 sm:h-11 glass rounded-xl flex items-center justify-center
                text-slate-400 hover:text-white hover:border-violet-500/40
                hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                border border-white/8 transition-all duration-300"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={17} />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          variants={staggerItem}
          onClick={() => go('services')}
          className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Scroll to services"
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
