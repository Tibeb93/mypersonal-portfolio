import { motion } from 'framer-motion'

const sizes = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2',
}

const variants = {
  primary: `
    relative overflow-hidden
    bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500
    text-white font-semibold
    shadow-[0_0_20px_rgba(139,92,246,0.35)]
    hover:shadow-[0_0_36px_rgba(139,92,246,0.5)]
    focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-transparent
  `,
  secondary: `
    bg-transparent text-white font-semibold
    border border-violet-500/50
    hover:border-violet-400 hover:bg-violet-500/10
    focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-transparent
  `,
  ghost: `
    bg-transparent text-slate-300 font-medium
    hover:text-white hover:bg-white/5
    focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2
    focus-visible:ring-offset-transparent
  `,
  danger: `
    bg-red-500/10 text-red-400 font-semibold
    border border-red-500/20
    hover:bg-red-500/20 hover:text-red-300
    focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-transparent
  `,
}

const motionProps = (disabled) => ({
  whileHover: disabled ? {} : { scale: 1.03, y: -1 },
  whileTap:   disabled ? {} : { scale: 0.97 },
  transition: { type: 'spring', stiffness: 420, damping: 18 },
})

export default function Button({
  variant  = 'primary',
  size     = 'md',
  children,
  className = '',
  icon,
  href,
  onClick,
  type     = 'button',
  disabled = false,
  download,
  ...rest
}) {
  const base = `
    inline-flex items-center justify-center rounded-xl cursor-pointer
    outline-none transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]}
    ${variants[variant] || variants.primary}
    ${className}
  `

  const inner = (
    <>
      {/* Shine overlay for primary variant */}
      {variant === 'primary' && (
        <span
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0
            opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />
      )}
      {icon && <span className="relative z-10 flex-shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={base}
        download={download}
        target={!download && href.startsWith('http') ? '_blank' : undefined}
        rel={!download && href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...motionProps(disabled)}
        {...rest}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
      aria-disabled={disabled}
      {...motionProps(disabled)}
      {...rest}
    >
      {inner}
    </motion.button>
  )
}
