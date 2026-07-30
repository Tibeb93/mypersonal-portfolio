import { motion } from 'framer-motion'
import useTheme from '../hooks/useTheme'

/**
 * Standardised section header used by every section.
 *
 * Props:
 *  label       — small pill label above the heading  e.g. "My Work"
 *  title       — main heading text (non-gradient part)
 *  highlight   — gradient word appended after title
 *  description — optional sub-text below heading
 *  center      — defaults true; set false for left-aligned sections
 *  className   — extra classes on the wrapper
 */
export default function SectionTitle({
  label,
  title,
  highlight,
  description,
  center = true,
  className = '',
}) {
  const { theme } = useTheme()
  const isLight   = theme === 'light'

  return (
    <motion.div
      className={`${center ? 'text-center' : ''} mb-16 ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* ── Label pill ── */}
      {label && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          text-xs font-semibold tracking-widest uppercase mb-4
          bg-violet-500/10 border border-violet-500/20 text-violet-400">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {label}
        </span>
      )}

      {/* ── Heading ── */}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight
        ${isLight ? 'text-slate-900' : 'text-white'}`}>
        {title}
        {highlight && (
          <>
            {' '}
            <span className="gradient-text">{highlight}</span>
          </>
        )}
      </h2>

      {/* ── Description ── */}
      {description && (
        <p className={`mt-4 text-base sm:text-lg max-w-2xl leading-relaxed
          ${center ? 'mx-auto' : ''}
          ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {description}
        </p>
      )}

      {/* ── Animated divider line ── */}
      <motion.div
        className={`mt-6 h-px max-w-xs
          bg-gradient-to-r from-transparent via-violet-500/50 to-transparent
          ${center ? 'mx-auto' : ''}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25 }}
      />
    </motion.div>
  )
}
