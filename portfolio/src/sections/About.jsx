import { motion } from 'framer-motion'
import { HiAcademicCap, HiLocationMarker, HiCode, HiHeart, HiDownload } from 'react-icons/hi'
import { FaGithub, FaTelegram, FaLinkedin } from 'react-icons/fa'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import Skeleton from '../components/Skeleton'
import { fadeInLeft, fadeInRight, viewport } from '../utils/animations'
import useProfile from '../hooks/useProfile'
import profileImageFallback from '../assets/profileImage.jpg'

const ICON_MAP = { FaGithub, FaTelegram, FaLinkedin }

const FALLBACK_SOCIALS = [
  { Icon: FaGithub,   href: 'https://github.com/Tibeb93', label: 'GitHub'   },
  { Icon: FaTelegram, href: 'https://t.me/tibeb93',        label: 'Telegram' },
  { Icon: FaLinkedin, href: 'https://linkedin.com',        label: 'LinkedIn' },
]

export default function About() {
  const { profile, isLoading } = useProfile()
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const name       = profile?.name       || 'Gebremeskel Kiflemeskel'
  const title      = profile?.title      || 'Full Stack Developer'
  const bio        = profile?.bio        || "I'm a passionate Full Stack Web Developer and Computer Science student based in Ethiopia. I specialize in building modern, performant web applications that solve real problems."
  const location   = profile?.location   || 'Ethiopia 🇪🇹'
  const photoSrc   = profile?.profileImage || profileImageFallback
  const resumeUrl  = profile?.resumeUrl    || '/Gebremeskel_Kiflemeskel_CV.pdf'
  const yearsExp   = profile?.yearsExperience ?? 2
  const projCount  = profile?.projectsCount   ?? 20

  const socials = profile?.socials?.length
    ? profile.socials.map((s) => ({ Icon: ICON_MAP[s.icon] || FaGithub, href: s.url, label: s.platform }))
    : FALLBACK_SOCIALS

  const HIGHLIGHTS = [
    { Icon: HiAcademicCap,    label: 'Education', value: 'Computer Science Student', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { Icon: HiLocationMarker, label: 'Location',  value: location,                   color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20' },
    { Icon: HiCode,           label: 'Focus',     value: title,                      color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { Icon: HiHeart,          label: 'Passion',   value: 'Clean Code & Great UX',    color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ]

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="Who I Am" title="About" highlight="Me"
          description="A passionate developer on a mission to build impactful digital experiences." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Visual side ── */}
          <motion.div className="flex justify-center lg:justify-start"
            variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <div className="relative w-72 sm:w-80">
              <div className="absolute -inset-4 bg-gradient-to-br from-violet-600/20 via-pink-600/10 to-orange-600/20 rounded-3xl blur-2xl" />

              <div className="relative glass rounded-3xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.8) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }} />

                {/* Photo */}
                <div className="relative w-full h-72 sm:h-80 overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full bg-white/5 animate-pulse" />
                  ) : (
                    <img
                      src={photoSrc}
                      alt={name}
                      width={320} height={320}
                      loading="lazy" decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-24
                    bg-gradient-to-t from-[#0F1525] via-[#0F1525]/60 to-transparent" />
                </div>

                {/* Name + role */}
                <div className="relative z-10 px-6 pb-6 -mt-6 text-center">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40 mx-auto" />
                      <Skeleton className="h-4 w-28 mx-auto" />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-white">{name.split(' ')[0]} K.</h3>
                      <p className="text-violet-400 text-sm font-medium mt-1 mb-4">{title}</p>
                    </>
                  )}
                  <div className="flex justify-center gap-3 mt-4">
                    {socials.map(({ Icon, href, label }) => (
                      <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                        aria-label={label}
                        className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400
                          hover:text-white border border-white/8 transition-all duration-200"
                        whileHover={{ y: -2, scale: 1.1 }}>
                        <Icon size={15} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat badges */}
              <motion.div
                className="absolute -bottom-4 -right-4 glass rounded-2xl border border-white/10 px-4 py-3 text-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="text-2xl font-black gradient-text">{yearsExp}+</div>
                <div className="text-xs text-slate-400 font-medium">Years Exp.</div>
              </motion.div>
              <motion.div
                className="absolute -top-4 -left-4 glass rounded-2xl border border-white/10 px-4 py-3 text-center"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
                <div className="text-2xl font-black gradient-text">{projCount}+</div>
                <div className="text-xs text-slate-400 font-medium">Projects</div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Text side ── */}
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Turning ideas into <span className="gradient-text">digital reality</span>
            </h3>

            {isLoading ? (
              <div className="mb-8"><Skeleton.Text lines={4} /></div>
            ) : (
              <div className="space-y-4 text-slate-400 leading-relaxed mb-8">
                {bio.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {HIGHLIGHTS.map(({ Icon, label, value, color, bg }) => (
                <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${bg}
                  transition-all duration-200 hover:scale-[1.02]`}>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">{label}</div>
                    <div className="text-sm text-white font-semibold">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="md" onClick={() => go('contact')}>Get In Touch</Button>
              <a
                href={resumeUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl
                  bg-transparent text-white border border-violet-500/50
                  hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-300"
              >
                <HiDownload size={16} /> Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
