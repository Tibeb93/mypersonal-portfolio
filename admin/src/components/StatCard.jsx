import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon: Icon, color = 'violet', trend, loading }) {
  const colors = {
    violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400',  glow: 'rgba(139,92,246,0.15)' },
    pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    text: 'text-pink-400',    glow: 'rgba(236,72,153,0.15)' },
    orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  glow: 'rgba(249,115,22,0.15)' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'rgba(16,185,129,0.15)' },
    cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    glow: 'rgba(6,182,212,0.15)'  },
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    glow: 'rgba(59,130,246,0.15)' },
  }
  const c = colors[color] || colors.violet

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 w-24 bg-white/5 rounded mb-3" />
        <div className="h-8 w-16 bg-white/5 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      className={`card p-5 border ${c.border} transition-all duration-300`}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
            <Icon size={18} className={c.text} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-black ${c.text}`}>{value ?? '—'}</p>
      {trend !== undefined && (
        <p className={`text-xs mt-1.5 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </p>
      )}
    </motion.div>
  )
}
