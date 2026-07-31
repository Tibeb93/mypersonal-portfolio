import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiLocationMarker, HiPhone, HiPaperAirplane, HiCheckCircle } from 'react-icons/hi'
import { FaGithub, FaTelegram, FaLinkedin } from 'react-icons/fa'
import toast from 'react-hot-toast'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import { fadeInLeft, fadeInRight, viewport } from '../utils/animations'
import { contactAPI } from '../services/api'
import useProfile from '../hooks/useProfile'
import useSettings from '../hooks/useSettings'

const ICON_MAP = { FaGithub, FaTelegram, FaLinkedin }

const FALLBACK_SOCIALS = [
  { Icon: FaGithub,   href: 'https://github.com/Tibeb93', label: 'GitHub',   cls: 'hover:text-white hover:border-white/30' },
  { Icon: FaTelegram, href: 'https://t.me/tibeb93',        label: 'Telegram', cls: 'hover:text-sky-400 hover:border-sky-400/30' },
  { Icon: FaLinkedin, href: 'https://linkedin.com',        label: 'LinkedIn', cls: 'hover:text-blue-400 hover:border-blue-400/30' },
]

const inputCls = `
  w-full px-4 py-3.5 rounded-xl text-sm
  bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500
  focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06]
  focus:ring-2 focus:ring-violet-500/20
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-300
`

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { profile }  = useProfile()
  const { settings } = useSettings()

  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded]   = useState(false)

  const email    = profile?.email    || settings?.contactEmail || 'gkiflemeskel@gmail.com'
  const location = profile?.location || settings?.contactAddress || 'Ethiopia, East Africa'
  const telegram = profile?.socials?.find((s) => s.platform === 'telegram')?.url || 'https://t.me/tibeb93'

  const socials = profile?.socials?.length
    ? profile.socials.map((s, i) => ({
        Icon:  ICON_MAP[s.icon] || FaGithub,
        href:  s.url,
        label: s.platform,
        cls:   FALLBACK_SOCIALS[i]?.cls || 'hover:text-white',
      }))
    : FALLBACK_SOCIALS

  const INFO = [
    { Icon: HiMail,           label: 'Email',    value: email,    href: `mailto:${email}`,  color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { Icon: HiLocationMarker, label: 'Location', value: location, href: null,               color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20' },
    { Icon: HiPhone,          label: 'Telegram', value: '@tibeb93',href: telegram,           color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  ]

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message is too short'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    try {
      await contactAPI.submit(form)
      setSucceeded(true)
      setForm(EMPTY)
      toast.success('Message sent successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="pt-24 pb-8">
      <div className="container-custom">
        <SectionTitle label="Get In Touch" title="Let's" highlight="Connect"
          description="Have a project in mind or just want to say hello? I'd love to hear from you." />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

          {/* ── Left: contact info ── */}
          <motion.div className="lg:col-span-2 space-y-6"
            variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Ready to build something <span className="gradient-text">amazing?</span>
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                I'm currently open to freelance projects, full-time opportunities, and interesting
                collaborations. Whether you have a question or just want to connect — my inbox is always open.
              </p>
            </div>

            <div className="space-y-3">
              {INFO.map(({ Icon, label, value, href, color, bg }) => (
                <motion.div key={label}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${bg} transition-all duration-200`}
                  whileHover={{ x: 4 }}>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">{label}</div>
                    {href ? (
                      <a href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm font-semibold text-white hover:text-violet-400 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-white">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">Find me on</p>
              <div className="flex gap-3">
                {socials.map(({ Icon, href, label, cls }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-11 h-11 glass rounded-xl flex items-center justify-center
                      text-slate-400 border border-white/8 transition-all duration-300 ${cls}`}
                    whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div className="lg:col-span-3"
            variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <div className="glass rounded-3xl border border-white/[0.06] p-6 sm:p-8">

              {succeeded ? (
                <motion.div className="flex flex-col items-center justify-center py-16 text-center"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}>
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30
                    flex items-center justify-center mb-4">
                    <HiCheckCircle size={38} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Delivered! 🎉</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Your message was sent successfully. I'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSucceeded(false)}
                    className="mt-6 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input id="name" name="name" type="text" required
                        placeholder="John Doe" value={form.name} onChange={handleChange}
                        className={`${inputCls} ${errors.name ? 'border-red-500/50' : ''}`}
                        disabled={submitting} />
                      {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input id="email" name="email" type="email" required
                        placeholder="you@example.com" value={form.email} onChange={handleChange}
                        className={`${inputCls} ${errors.email ? 'border-red-500/50' : ''}`}
                        disabled={submitting} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      Subject
                    </label>
                    <input id="subject" name="subject" type="text" required
                      placeholder="Project inquiry, collaboration..." value={form.subject} onChange={handleChange}
                      className={`${inputCls} ${errors.subject ? 'border-red-500/50' : ''}`}
                      disabled={submitting} />
                    {errors.subject && <p className="mt-1.5 text-xs text-red-400">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea id="message" name="message" required rows={5}
                      placeholder="Tell me about your project, idea, or just say hi..."
                      value={form.message} onChange={handleChange}
                      className={`${inputCls} resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                      disabled={submitting} />
                    {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
                  </div>

                  <Button type="submit" variant="primary" size="lg"
                    className="w-full justify-center" disabled={submitting}
                    icon={submitting
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <HiPaperAirplane size={16} className="-rotate-45" />
                    }>
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>

                  <p className="text-center text-xs text-slate-600 mt-4">
                    Replies within 24 hours · No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
