import { motion } from 'framer-motion'
import { HiExternalLink, HiBadgeCheck } from 'react-icons/hi'
import SectionTitle from '../components/SectionTitle'
import Skeleton from '../components/Skeleton'
import { staggerContainer, staggerItem, viewport } from '../utils/animations'
import useCertificates from '../hooks/useCertificates'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const GRAD_COLORS = [
  'from-violet-600/20 to-purple-900/20 border-violet-500/20',
  'from-pink-600/20 to-rose-900/20 border-pink-500/20',
  'from-orange-600/20 to-amber-900/20 border-orange-500/20',
  'from-cyan-600/20 to-teal-900/20 border-cyan-500/20',
  'from-emerald-600/20 to-green-900/20 border-emerald-500/20',
  'from-blue-600/20 to-indigo-900/20 border-blue-500/20',
]

function CertCard({ cert, index }) {
  const grad = GRAD_COLORS[index % GRAD_COLORS.length]
  const expired = cert.expiryDate && !cert.noExpiry && new Date(cert.expiryDate) < new Date()

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass rounded-2xl border overflow-hidden group transition-all duration-300
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${grad}`}
    >
      {/* Certificate image / placeholder */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
        {cert.image ? (
          <img src={cert.image} alt={cert.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiBadgeCheck size={48} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1525] via-transparent to-transparent" />
        {expired && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold
            bg-red-500/20 text-red-400 border border-red-500/30">
            Expired
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-bold text-white leading-snug flex-1">{cert.name}</h3>
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
              aria-label="View credential"
              className="flex-shrink-0 w-7 h-7 glass rounded-lg flex items-center justify-center
                text-slate-400 hover:text-violet-400 border border-white/8 transition-colors">
              <HiExternalLink size={13} />
            </a>
          )}
        </div>

        <p className="text-violet-400 text-xs font-semibold mb-1">{cert.organization}</p>
        <p className="text-slate-500 text-xs mb-3">
          Issued {formatDate(cert.issueDate)}
          {cert.expiryDate && !cert.noExpiry && ` · Expires ${formatDate(cert.expiryDate)}`}
          {cert.noExpiry && ' · No Expiry'}
        </p>

        {cert.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cert.skills.slice(0, 4).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded text-xs text-slate-400
                bg-white/5 border border-white/8">{s}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Certificates() {
  const { certificates, isLoading } = useCertificates()

  // Don't render section if no certificates and not loading
  if (!isLoading && certificates.length === 0) return null

  return (
    <section id="certificates" className="section-padding">
      <div className="container-custom">
        <SectionTitle label="Credentials" title="Certifications &" highlight="Achievements"
          description="Professional certifications and achievements that validate my expertise." />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] overflow-hidden animate-pulse">
                <div className="h-40 bg-white/5" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          >
            {certificates.map((cert, i) => (
              <CertCard key={cert._id} cert={cert} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
